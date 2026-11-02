import ts from 'typescript';

export type Finding = { level: 'blocking' | 'warning'; check: string; message: string };
export type Asset = { path: string; bytes: number };
export type Metrics = { perf: number; lcp: number; tbt: number; cls: number };
export type PageResult = { path: string; prod: Metrics[]; preview: Metrics[]; preloads: string[] };
export { PAGES } from './config';
export const MARKER = '<!-- tvc-performance-guardrails -->';

export function checkAssets(assets: Asset[]): Finding[] {
  return assets.flatMap(({ path, bytes }) => {
    const findings: Finding[] = [];
    const svg = /\.svg$/i.test(path);
    const raster = /\.(png|jpe?g|webp|avif|gif|ico|bmp|tiff?)$/i.test(path);
    if ((svg && bytes > 50 * 1024) || (raster && bytes > 200 * 1024)) {
      findings.push({ level: 'blocking', check: 'asset-size', message: `${path}: ${bytes} bytes exceeds ${svg ? 50 : 200} KiB.` });
    }
    if (/\.(png|jpe?g)$/i.test(path) && bytes > 100 * 1024) {
      findings.push({ level: 'warning', check: 'asset-format', message: `${path}: consider WebP/AVIF (>100 KiB).` });
    }
    return findings;
  });
}

export function checkLeftovers(paths: string[], pr: { title: string; body?: string | null; labels: string[] }): Finding[] {
  const findings: Finding[] = paths.filter(p => /^screenshots\//i.test(p)).map(path => ({
    level: 'blocking', check: 'leftovers', message: `${path}: screenshots/ must not ship. Use .context/ for review captures.`,
  }));
  for (const [field, value] of Object.entries({ title: pr.title, body: pr.body ?? '', labels: pr.labels.join('\n') })) {
    if (/do\s+not\s+merge/i.test(value)) findings.push({ level: 'blocking', check: 'leftovers', message: `PR ${field} contains the merge-stop phrase.` });
  }
  return findings;
}

export function median(values: number[]): number {
  if (!values.length || values.some(v => !Number.isFinite(v))) throw new Error('Invalid sample');
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
export function medians(samples: Metrics[]): Metrics {
  return Object.fromEntries(['perf', 'lcp', 'tbt', 'cls'].map(k => [k, median(samples.map(s => s[k as keyof Metrics]))])) as Metrics;
}
export function checkPage(page: PageResult, regressionsBlocking = false): Finding[] {
  const findings: Finding[] = [];
  // CLS can be evaluated even when production is unavailable, but never from <3 preview samples.
  if (page.preview.length >= 3 && medians(page.preview).cls > 0.05) findings.push({
    level: 'blocking', check: 'cls', message: `${page.path}: median preview CLS ${medians(page.preview).cls.toFixed(3)} > 0.05.`,
  });
  if (page.prod.length < 3 || page.preview.length < 3) findings.push({
    level: 'warning', check: 'lighthouse', message: `${page.path}: incomplete measurements (${page.prod.length} prod / ${page.preview.length} preview); comparison neutral.`,
  });
  else {
    const prod = medians(page.prod), preview = medians(page.preview);
    const level = regressionsBlocking ? 'blocking' : 'warning';
    if (preview.lcp > prod.lcp * 1.2 && preview.lcp - prod.lcp > 300) findings.push({ level, check: 'lcp', message: `${page.path}: LCP regression >20% AND >300 ms.` });
    if (preview.tbt - prod.tbt > 100) findings.push({ level, check: 'tbt', message: `${page.path}: TBT regression >100 ms.` });
  }
  if (page.preloads.length) findings.push({ level: 'warning', check: 'head-preloads', message: `${page.path}: preview head image preloads (${page.preloads.length}): ${page.preloads.join(', ')}.` });
  return findings;
}

function attrText(attr: ts.JsxAttribute): string | undefined {
  const init = attr.initializer;
  if (!init) return 'true';
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression) {
    if (ts.isStringLiteral(init.expression)) return init.expression.text;
    if (init.expression.kind === ts.SyntaxKind.TrueKeyword) return 'true';
    if (init.expression.kind === ts.SyntaxKind.FalseKeyword) return 'false';
  }
}
function attributes(node: ts.Node): ts.JsxAttributes | undefined {
  if (ts.isJsxElement(node)) return node.openingElement.attributes;
  if (ts.isJsxSelfClosingElement(node)) return node.attributes;
}
export function inspectSource(path: string, source: string): { count: number; findings: Finding[]; imports: string[] } {
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  let count = 0;
  const findings: Finding[] = [], imports: string[] = [];
  function visit(node: ts.Node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      if (!(ts.isImportDeclaration(node) && node.importClause?.isTypeOnly)) imports.push(node.moduleSpecifier.text);
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(tree);
      const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
      const high = attrs.some(a => ['priority', 'preload'].includes(a.name.getText(tree)) && attrText(a) !== 'false');
      const eager = attrs.some(a => a.name.getText(tree) === 'loading' && attrText(a) === 'eager');
      const fetchHigh = attrs.some(a => a.name.getText(tree) === 'fetchPriority' && attrText(a) === 'high');
      if ((tag === 'img' || /(?:^|\.)Image$/.test(tag)) && (high || eager || fetchHigh)) {
        count++;
        let list = false, hidden = false;
        for (let parent: ts.Node | undefined = node; parent; parent = parent.parent) {
          if (ts.isCallExpression(parent) && ts.isPropertyAccessExpression(parent.expression) && ['map', 'flatMap'].includes(parent.expression.name.text)) list = true;
          if (ts.isArrayLiteralExpression(parent)) list = true;
          const parentAttrs = attributes(parent);
          if (parentAttrs) for (const prop of parentAttrs.properties.filter(ts.isJsxAttribute)) {
            const name = prop.name.getText(tree), value = prop.initializer?.getText(tree) ?? '';
            if (name === 'hidden' && attrText(prop) !== 'false') hidden = true;
            if (name === 'className' && /(?:^|[\s'"`])(?:hidden|sr-only|(?:max-)?(?:sm|md):hidden)(?=[\s'"`}]|$)/.test(value)) hidden = true;
            if (name === 'style' && /display\s*:\s*['"]none['"]/.test(value)) hidden = true;
          }
        }
        const line = tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1;
        if (list || hidden) findings.push({ level: 'warning', check: 'image-priority', message: `${path}:${line}: eager/priority image${list ? ' in a list' : ''}${hidden ? ' hidden on mobile' : ''}. Review React 19 image preloading.` });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return { count, findings, imports };
}

// Follow local runtime imports so a page budget includes shared hero/layout components.
// This is a conservative source heuristic, not a JSX execution engine.
export function lintPriority(sources: Record<string, string>, changed: string[], max = 2): Finding[] {
  const parsed = new Map(Object.entries(sources).map(([path, text]) => [path, inspectSource(path, text)]));
  function resolve(from: string, spec: string): string | undefined {
    if (!spec.startsWith('.') && !spec.startsWith('@/')) return;
    const raw = spec.startsWith('@/') ? `src/${spec.slice(2)}` : `${from.slice(0, from.lastIndexOf('/'))}/${spec}`;
    const parts: string[] = [];
    for (const part of raw.split('/')) { if (part === '..') parts.pop(); else if (part !== '.') parts.push(part); }
    const base = parts.join('/');
    return [base, `${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`].find(p => parsed.has(p));
  }
  const findings: Finding[] = [], emitted = new Set<string>();
  for (const [path, data] of parsed) if (changed.includes(path)) for (const f of data.findings) { findings.push(f); emitted.add(f.message); }
  for (const page of parsed.keys()) {
    if (!/^src\/app\/.*\/page\.[jt]sx?$/.test(page)) continue;
    const visited = new Set<string>();
    function walk(path: string) {
      if (visited.has(path)) return;
      visited.add(path);
      for (const spec of parsed.get(path)?.imports ?? []) { const file = resolve(path, spec); if (file) walk(file); }
    }
    walk(page);
    let directory = page.slice(0, page.lastIndexOf('/'));
    while (directory.startsWith('src/app')) {
      for (const suffix of ['tsx', 'ts', 'jsx', 'js']) if (parsed.has(`${directory}/layout.${suffix}`)) walk(`${directory}/layout.${suffix}`);
      directory = directory.slice(0, directory.lastIndexOf('/'));
    }
    if (![...visited].some(file => changed.includes(file))) continue;
    const count = [...visited].reduce((sum, file) => sum + (parsed.get(file)?.count ?? 0), 0);
    if (count > max) findings.push({ level: 'warning', check: 'image-priority', message: `${page}: ${count} eager/priority images across imports (budget ${max}).` });
    for (const file of visited) for (const f of parsed.get(file)?.findings ?? []) if (!emitted.has(f.message)) { findings.push(f); emitted.add(f.message); }
  }
  return findings;
}

const clean = (value: string) => value.replace(/[<>|\r\n`]/g, ' ').replace(/@/g, '＠').slice(0, 300);
export function renderTable(pages: PageResult[]): string {
  const rows = pages.map(page => {
    const prod = page.prod.length >= 3 ? medians(page.prod) : undefined;
    const preview = page.preview.length >= 3 ? medians(page.preview) : undefined;
    const cell = (key: keyof Metrics, digits = 0) => {
      const p = prod?.[key], v = preview?.[key];
      return `${p === undefined ? '—' : p.toFixed(digits)} → ${v === undefined ? '—' : v.toFixed(digits)}${p !== undefined && v !== undefined ? ` (${v - p >= 0 ? '+' : ''}${(v - p).toFixed(digits)})` : ''}`;
    };
    return `| ${page.path} | ${page.prod.length}/${page.preview.length} | ${cell('perf', 1)} | ${cell('lcp')} | ${cell('tbt')} | ${cell('cls', 3)} |`;
  });
  return `| Page | Runs prod/preview | Perf prod → preview (Δ) | LCP ms (Δ) | TBT ms (Δ) | CLS (Δ) |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}`;
}
export function renderReport(report: { sha: string; preview?: string; findings: Finding[]; pages: PageResult[] }): string {
  return `${MARKER}\n### Performance guardrails\n\nSHA: \`${clean(report.sha)}\`\nPreview: ${clean(report.preview ?? 'unavailable')}\n\nMobile, cold browser per run, alternating prod/preview in one job, ≥3 successful runs each; median per metric.\n\n${renderTable(report.pages)}\n\n${report.findings.length ? report.findings.slice(0, 80).map(f => `- **${f.level.toUpperCase()}** [${clean(f.check)}] ${clean(f.message)}`).join('\n') : '- All measured budgets and diff checks passed.'}\n\nBlocking: changed raster >200 KiB, SVG >50 KiB, screenshots/, merge-stop phrase, preview median CLS >0.05. LCP (>20% AND >300 ms) / TBT (>100 ms) regressions warn unless PERF_REGRESSION_BLOCKING=true. Priority lint and head preloads warn. Missing measurements/infrastructure are neutral.\n`;
}
