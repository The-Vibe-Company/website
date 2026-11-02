import { describe, expect, test } from 'bun:test';
import { checkAssets, checkLeftovers, checkPage, inspectSource, lintPriority, median, renderReport, type Metrics, type PageResult } from './checks';
import { bypassHeaders, collectPages, previewOrigin, readMetrics } from './lighthouse';
import { isPreview, selectPull, successfulPreview } from './deployment';

const metrics: Metrics = { perf: 90, lcp: 2000, tbt: 100, cls: 0.02 };
const samples = (change: Partial<Metrics> = {}) => Array.from({ length: 3 }, () => ({ ...metrics, ...change }));
const page = (change: Partial<Metrics> = {}): PageResult => ({ path: '/fr', prod: samples(), preview: samples(change), preloads: [] });

describe('diff asset fixtures (metadata, no large binary)', () => {
  test('raster/SVG boundaries are blocking strictly above the budget', () => {
    for (const path of ['logo.png', 'a.JPG', 'a.webp', 'a.avif', 'a.gif', 'a.ico', 'a.bmp', 'a.tiff']) {
      expect(checkAssets([{ path, bytes: 200 * 1024 }]).some(f => f.level === 'blocking')).toBe(false);
      expect(checkAssets([{ path, bytes: 200 * 1024 + 1 }]).some(f => f.level === 'blocking')).toBe(true);
    }
    expect(checkAssets([{ path: 'logo.svg', bytes: 50 * 1024 }])).toEqual([]);
    expect(checkAssets([{ path: 'logo.svg', bytes: 50 * 1024 + 1 }])[0].level).toBe('blocking');
  });
  test('Granite regression blocks and recommends modern formats', () => {
    expect(checkAssets([{ path: 'public/granite-favicon.png', bytes: 519 * 1024 }]).map(f => f.level)).toEqual(['blocking', 'warning']);
    expect(checkAssets([{ path: 'a.jpeg', bytes: 101 * 1024 }])[0].level).toBe('warning');
    expect(checkAssets([{ path: 'a.png', bytes: 100 * 1024 }])).toEqual([]);
    expect(checkAssets([{ path: 'a.ts', bytes: 900 * 1024 }])).toEqual([]);
  });
});

describe('leftover fixtures', () => {
  test('screenshots paths block, context captures do not', () => {
    expect(checkLeftovers(['screenshots/pr-303/hero.png', '.context/hero.png'], { title: 'THE-2183', labels: [] })).toHaveLength(1);
  });
  test('merge stop phrase blocks in each metadata field, case insensitive', () => {
    for (const pr of [
      { title: 'do not merge: test', body: '', labels: [] },
      { title: 'THE-2183', body: 'DO NOT MERGE', labels: [] },
      { title: 'THE-2183', body: null, labels: ['Do Not Merge'] },
    ]) expect(checkLeftovers([], pr)[0].level).toBe('blocking');
    expect(checkLeftovers([], { title: 'THE-2183', labels: ['draft'] })).toEqual([]);
  });
});

describe('median performance budgets', () => {
  test('median suppresses an outlier and does not mutate data', () => {
    const values = [2000, 9000, 2100];
    expect(median(values)).toBe(2100);
    expect(values).toEqual([2000, 9000, 2100]);
    expect(median([3, 1, 2, 4])).toBe(2.5);
    expect(() => median([])).toThrow();
    expect(() => median([NaN])).toThrow();
  });
  test('FitText CLS regression blocks regardless of flag and prod availability', () => {
    expect(checkPage(page({ cls: 0.05 }))).toEqual([]);
    expect(checkPage(page({ cls: 0.051 }))[0].level).toBe('blocking');
    const p = page({ cls: 0.2 }); p.prod = [];
    expect(checkPage(p).some(f => f.check === 'cls' && f.level === 'blocking')).toBe(true);
    p.preview.pop();
    expect(checkPage(p).every(f => f.level === 'warning')).toBe(true);
  });
  test('LCP requires both percentage and absolute thresholds, TBT is strict', () => {
    expect(checkPage(page({ lcp: 2400, tbt: 200 }))).toEqual([]);
    expect(checkPage(page({ lcp: 2401, tbt: 201 })).map(f => f.level)).toEqual(['warning', 'warning']);
    expect(checkPage(page({ lcp: 2401, tbt: 201 }), true).map(f => f.level)).toEqual(['blocking', 'blocking']);
    const low = page({ lcp: 1200 }); low.prod = samples({ lcp: 900 });
    expect(checkPage(low)).toEqual([]);
    const high = page({ lcp: 5200 }); high.prod = samples({ lcp: 5000 });
    expect(checkPage(high)).toEqual([]);
  });
  test('invalid/incomplete LH results never become budget failures', () => {
    expect(readMetrics({ runtimeError: { code: 'ERRORED_DOCUMENT_REQUEST' } })).toBeUndefined();
    expect(readMetrics({ categories: { performance: { score: null } } })).toBeUndefined();
    expect(readMetrics({ categories: { performance: { score: 0.9 } }, audits: { 'largest-contentful-paint': { numericValue: NaN } } })).toBeUndefined();
    const p = page(); p.prod = []; p.preview = [];
    expect(checkPage(p).every(f => f.level === 'warning')).toBe(true);
  });
  test('head preloads are visible warnings', () => {
    const p = page(); p.preloads = ['/logo.svg'];
    expect(checkPage(p)[0]).toMatchObject({ check: 'head-preloads', level: 'warning' });
  });
});

describe('alternation and network failures', () => {
  test('3 successful samples each, serial P/V order, no parallel runs', async () => {
    const calls: string[] = [];
    const pages = await collectPages('https://preview.vercel.app', async (url, preview) => {
      calls.push(preview ? 'V' : 'P');
      return { metrics, preloads: preview ? ['/logo.svg'] : [] };
    }, ['/fr']);
    expect(calls.join('')).toBe('PVPVPV');
    expect(pages[0].prod).toHaveLength(3);
    expect(pages[0].preview).toHaveLength(3);
    expect(pages[0].preloads).toEqual(['/logo.svg']);
  });
  test('bounded retry stays alternating and discards surplus successes', async () => {
    const calls: boolean[] = [];
    const pages = await collectPages('https://preview.vercel.app', async (_url, preview) => {
      calls.push(preview);
      if (calls.length === 2) throw new Error('quota');
      return { metrics, preloads: [] };
    }, ['/fr']);
    expect(calls).toEqual([false, true, false, true, false, true, false, true]);
    expect(pages[0].preview).toHaveLength(3);
    expect(pages[0].prod).toHaveLength(3);
  });
  test('persistent network failures produce only warnings', async () => {
    const pages = await collectPages('https://preview.vercel.app', async () => { throw new Error('timeout'); }, ['/fr']);
    expect(checkPage(pages[0])).toHaveLength(1);
    expect(checkPage(pages[0])[0].level).toBe('warning');
  });
});

describe('priority source fixtures', () => {
  test('React 19 eager logos in map and hidden mobile wrapper are flagged', () => {
    const result = inspectSource('Clients.tsx', 'const Clients = () => <section className="hidden md:flex">{logos.map(l => <img src={l} loading="eager" fetchPriority="low" />)}</section>');
    expect(result.count).toBe(1);
    expect(result.findings[0].message).toContain('in a list hidden on mobile');
  });
  test('counts each image once, supports booleans/strings, ignores comments/lazy/false', () => {
    const result = inspectSource('x.tsx', `// <Image priority />
      const x = <><Image priority={false}/><Image preload={true} fetchPriority="high"/><img loading={'eager'} /><img loading="lazy"/><Image priority={condition}/></>`);
    expect(result.count).toBe(3);
  });
  test('flags hidden attribute, CSS and array literals', () => {
    for (const source of ['<div hidden><Image priority /></div>', '<div style={{display:"none"}}><Image preload /></div>', '<>{[<Image priority />]}</>']) {
      expect(inspectSource('x.tsx', `const x = ${source}`).findings).toHaveLength(1);
    }
  });
  test('page budget follows shared imports and layouts, only affected routes warn', () => {
    const sources = {
      'src/app/[locale]/page.tsx': 'import { Hero } from "@/components/Hero"; const Page = () => <Hero/>;',
      'src/app/[locale]/layout.tsx': 'const Layout = () => <Image priority />;',
      'src/components/Hero.tsx': 'import "./Hero"; const Hero = () => <><Image priority/><img loading="eager"/></>;',
      'src/app/other/page.tsx': 'const P = () => <Image priority/>;',
    };
    const findings = lintPriority(sources, ['src/components/Hero.tsx']);
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain('3 eager/priority');
    expect(findings[0].message).toContain('src/app/[locale]/page.tsx');
    expect(lintPriority(sources, ['unrelated.md'])).toEqual([]);
  });
});

describe('deployment identity and secret boundaries', () => {
  test('only current open SHA is linked; merged/stale/fork deployments ignored', () => {
    const pr = { number: 42, state: 'open', head: { sha: 'abc', repo: { full_name: 'org/repo' } } };
    expect(selectPull([pr], 'abc', 'org/repo')).toBe(pr);
    expect(selectPull([pr], 'old', 'org/repo')).toBeUndefined();
    expect(selectPull([{ ...pr, state: 'closed' }], 'abc', 'org/repo')).toBeUndefined();
    expect(selectPull([pr], 'abc', 'fork/repo')).toBeUndefined();
  });
  test('only genuine successful Preview deployments, never Production or stale success', () => {
    expect(isPreview({ environment: 'Preview', creator: { login: 'vercel[bot]' } })).toBe(true);
    expect(isPreview({ environment: 'Production', creator: { login: 'vercel[bot]' } })).toBe(false);
    expect(isPreview({ environment: 'Preview', creator: { login: 'user' } })).toBe(false);
    expect(successfulPreview([{ state: 'success', environment_url: 'https://app-test.vercel.app/fr' }])).toBe('https://app-test.vercel.app');
    expect(successfulPreview([{ state: 'failure' }, { state: 'success', environment_url: 'https://test.vercel.app' }])).toBeUndefined();
  });
  test('rejects non-Vercel URL, credentials, ports; bypass never sent to prod/third parties', () => {
    for (const raw of ['http://test.vercel.app', 'https://vercel.app.attacker.com', 'https://a:b@test.vercel.app', 'https://test.vercel.app:1234', 'garbage']) expect(previewOrigin(raw)).toBeUndefined();
    const fixtureToken = 'fixture-value';
    expect(bypassHeaders('https://test.vercel.app/fr', 'https://test.vercel.app', fixtureToken)).toEqual({ 'x-vercel-protection-bypass': fixtureToken });
    expect(bypassHeaders('https://thevibecompany.co/fr', 'https://test.vercel.app', fixtureToken)).toEqual({});
    expect(bypassHeaders('https://cdn.example.com/a', 'https://test.vercel.app', fixtureToken)).toEqual({});
    expect(bypassHeaders('https://test.vercel.app/fr', 'https://test.vercel.app')).toEqual({});
  });
});

test('sticky markdown includes medians/deltas, neutral cells and escaped findings', () => {
  const p = page(); p.preview[2] = { ...metrics, lcp: 9000 };
  const result = renderReport({ sha: 'abc', preview: 'https://test.vercel.app', pages: [p, { ...page(), path: '/en', prod: [], preview: [] }], findings: [{ level: 'warning', check: 'image', message: '<script>@user|test' }] });
  expect(result).toContain('<!-- tvc-performance-guardrails -->');
  expect(result).toContain('2000 → 2000 (+0)');
  expect(result).toContain('— → —');
  expect(result).not.toContain('<script>');
  expect(result).not.toContain('@user');
});
