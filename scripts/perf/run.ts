import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { checkLeftovers, checkPage, lintPriority, PAGES, renderReport, renderTable, type Finding, type PageResult } from './checks';
import { changedPaths, changedAssets, sourceFiles } from './git';
import { collectPages, previewOrigin, sampleInChild } from './lighthouse';

const onlyLighthouse = process.argv.includes('--lighthouse');
const onlyStatic = process.argv.includes('--static');
const prior = onlyLighthouse ? JSON.parse(await readFile('.context/perf/report.json', 'utf8')) : undefined;
const findings: Finding[] = prior?.findings ?? [];
let staticComplete = prior?.staticComplete ?? false;
let pages: PageResult[] = PAGES.map(path => ({ path, prod: [], preview: [], preloads: [] }));
const sha = process.env.HEAD_SHA ?? '';
const preview = previewOrigin(process.env.PREVIEW_URL ?? '');
if (!onlyLighthouse) try {
  const paths = changedPaths(process.env.BASE_SHA ?? '', sha);
  findings.push(...changedAssets(paths, sha));
  const pr = JSON.parse(await readFile('.context/perf-pr.json', 'utf8'));
  findings.push(...checkLeftovers(paths, pr));
  if (paths.some(path => /^src\/.*\.[jt]sx?$/.test(path))) findings.push(...lintPriority(sourceFiles(sha), paths));
  staticComplete = true;
} catch {
  findings.push({ level: 'warning', check: 'diff', message: 'Diff checks unavailable (Git/source/metadata); neutral, see job status.' });
}
// Persist known blockers before starting any potentially failing network work.
async function save() {
  const report = { sha, preview, findings, pages, staticComplete, table: renderTable(pages) };
  await mkdir('.context/perf', { recursive: true });
  await writeFile('.context/perf/report.json', JSON.stringify(report));
  await writeFile('.context/perf/comment.md', renderReport(report));
}
await save();
if (onlyStatic) process.exit(0);
if (preview) {
  if (!process.env.VERCEL_AUTOMATION_BYPASS_SECRET) findings.push({ level: 'warning', check: 'preview-auth', message: 'VERCEL_AUTOMATION_BYPASS_SECRET unavailable; public previews can be measured, protected previews remain neutral.' });
  pages = await collectPages(preview, sampleInChild);
} else findings.push({ level: 'warning', check: 'preview', message: 'Successful Vercel Preview not found for this PR head SHA; Lighthouse neutral.' });
for (const page of pages) findings.push(...checkPage(page, process.env.PERF_REGRESSION_BLOCKING === 'true'));
await save();
// Budget failures are decided by the publishing job, independently of infrastructure failures.
console.log(`Guardrails: ${findings.filter(f => f.level === 'blocking').length} blocking, ${findings.filter(f => f.level === 'warning').length} warnings.`);
