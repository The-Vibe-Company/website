import type { Metrics, PageResult } from './checks';
import { PAGES } from './config';

export type Sample = { metrics: Metrics; preloads: string[] };
export const PROD = 'https://thevibecompany.co';
export function previewOrigin(raw: string): string | undefined {
  try {
    const url = new URL(raw);
    if (url.protocol === 'https:' && url.hostname.endsWith('.vercel.app') && !url.username && !url.password && !url.port) return url.origin;
  } catch { /* Missing or malformed deployment target is neutral. */ }
}
export function bypassHeaders(requestUrl: string, origin: string, secret?: string): Record<string, string> {
  return secret && new URL(requestUrl).origin === origin ? { 'x-vercel-protection-bypass': secret } : {};
}
export function readMetrics(lhr: { categories?: { performance?: { score: number | null } }; audits?: Record<string, { numericValue?: number }>; runtimeError?: unknown }): Metrics | undefined {
  if (lhr.runtimeError || lhr.categories?.performance?.score == null) return;
  const result = {
    perf: lhr.categories.performance.score * 100,
    lcp: lhr.audits?.['largest-contentful-paint']?.numericValue,
    tbt: lhr.audits?.['total-blocking-time']?.numericValue,
    cls: lhr.audits?.['cumulative-layout-shift']?.numericValue,
  };
  if (Object.values(result).some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0) || result.perf > 100) return;
  return result as Metrics;
}

// One attempt per side per round keeps runs alternating even when a side fails.
// A fourth round retries missing samples without skewing medians with extra successes.
export async function collectPages(preview: string, sample: (url: string, preview: boolean) => Promise<Sample | undefined>, paths = PAGES): Promise<PageResult[]> {
  const pages: PageResult[] = [];
  for (const path of paths) {
    const page: PageResult = { path, prod: [], preview: [], preloads: [] };
    for (let round = 0; round < 4 && (page.prod.length < 3 || page.preview.length < 3); round++) {
      for (const side of ['prod', 'preview'] as const) {
        // Probe both sides in retry rounds to preserve alternation; retain only first 3 successes.
        const result = await sample(`${side === 'prod' ? PROD : preview}${path}`, side === 'preview').catch(() => undefined);
        if (result && page[side].length < 3) page[side].push(result.metrics);
        if (result && side === 'preview') page.preloads = [...new Set([...page.preloads, ...result.preloads])];
      }
    }
    pages.push(page);
  }
  return pages;
}

export async function sampleInChild(url: string, preview: boolean): Promise<Sample | undefined> {
  const child = Bun.spawn([process.execPath, import.meta.dir + '/sample.ts', url, preview ? 'preview' : 'prod'], {
    stdout: 'pipe', stderr: 'ignore',
    // No secret in arguments, reports or Lighthouse settings. Only the preview child receives it.
    env: { ...process.env, VERCEL_AUTOMATION_BYPASS_SECRET: preview ? process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? '' : '' },
  });
  const timeout = setTimeout(() => child.kill('SIGTERM'), 110_000);
  try {
    const [output, code] = await Promise.all([new Response(child.stdout).text(), child.exited]);
    return code === 0 ? JSON.parse(output) as Sample : undefined;
  } catch { return; } finally { clearTimeout(timeout); }
}
