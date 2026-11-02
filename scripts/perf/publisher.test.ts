import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { checkPage, renderTable, type PageResult } from './checks';

const workflow = Bun.YAML.parse(readFileSync(`${import.meta.dir}/../../.github/workflows/performance.yml`, 'utf8')) as {
  jobs: { report: { steps: { uses?: string; with?: { script: string } }[] } };
};
const code = workflow.jobs.report.steps.find(step => step.uses?.includes('github-script'))!.with!.script;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const sha = 'a'.repeat(40);
const page: PageResult = { path: '/fr', prod: Array.from({ length: 3 }, () => ({ perf: 90, lcp: 2000, tbt: 100, cls: 0 })), preview: Array.from({ length: 3 }, () => ({ perf: 90, lcp: 2000, tbt: 100, cls: 0.1 })), preloads: [] };
const pages = ['/fr', '/en', '/article', '/case'].map(path => ({ ...page, path }));
const report = { sha, staticComplete: true, pages, table: renderTable(pages), findings: pages.flatMap(p => checkPage(p)) };

type Input = { report?: object; comments?: { id: number; user: { login: string }; body: string }[]; title?: string; body?: string; labels?: string[]; currentSha?: string; apiFailure?: boolean };
async function publish(input: Input = {}) {
  const calls = { created: [] as string[], updated: [] as string[], conclusions: [] as string[], failures: [] as string[], warnings: [] as string[] };
  const oldSha = process.env.HEAD_SHA, oldPr = process.env.PR_NUMBER;
  process.env.HEAD_SHA = sha; process.env.PR_NUMBER = '42';
  const github = {
    rest: {
      pulls: { get: async () => { if (input.apiFailure) throw new Error('quota'); return { data: { head: { sha: input.currentSha ?? sha }, state: 'open', title: input.title ?? 'THE-2183', body: input.body ?? '', labels: (input.labels ?? []).map(name => ({ name })) } }; } },
      issues: {
        listComments: () => {},
        createComment: async ({ body }: { body: string }) => { calls.created.push(body); },
        updateComment: async ({ body }: { body: string }) => { calls.updated.push(body); },
      },
      checks: { create: async ({ conclusion }: { conclusion: string }) => { calls.conclusions.push(conclusion); } },
    },
    paginate: async () => input.comments ?? [],
  };
  const core = { warning: (s: string) => calls.warnings.push(s), notice: () => {}, setFailed: (s: string) => calls.failures.push(s) };
  const requireFixture = () => ({ readFileSync: () => { if (!input.report) throw new Error('missing artifact'); return JSON.stringify(input.report); } });
  try {
    await new AsyncFunction('require', 'github', 'context', 'core', code)(requireFixture, github, { repo: { owner: 'org', repo: 'repo' }, serverUrl: 'https://github.com', runId: '123' }, core);
  } finally {
    if (oldSha === undefined) delete process.env.HEAD_SHA; else process.env.HEAD_SHA = oldSha;
    if (oldPr === undefined) delete process.env.PR_NUMBER; else process.env.PR_NUMBER = oldPr;
  }
  return calls;
}

test('publisher posts one sticky and binds blocking check to head metrics', async () => {
  const calls = await publish({ report });
  expect(calls.created).toHaveLength(1);
  expect(calls.updated).toHaveLength(0);
  expect(calls.conclusions).toEqual(['failure']);
  expect(calls.failures).toHaveLength(1);
  expect(calls.created[0]).toContain('0.000 → 0.100 (+0.100)');
});
test('publisher updates existing bot comment, ignoring user marker spoofing', async () => {
  const calls = await publish({ report, comments: [
    { id: 1, user: { login: 'user' }, body: '<!-- tvc-performance-guardrails -->' },
    { id: 2, user: { login: 'github-actions[bot]' }, body: '<!-- tvc-performance-guardrails -->' },
  ] });
  expect(calls.created).toHaveLength(0);
  expect(calls.updated).toHaveLength(1);
});
test('publisher preserves same-SHA measured blockers through missing measurements', async () => {
  const first = await publish({ report });
  const calls = await publish({ comments: [{ id: 2, user: { login: 'github-actions[bot]' }, body: first.created[0] }] });
  expect(calls.updated[0]).toContain('Preserved measurements');
  expect(calls.updated[0]).toContain('0.000 → 0.100 (+0.100)');
  expect(calls.conclusions).toEqual(['failure']);
});
test('publisher rereads merge-stop metadata and clears stale metadata findings', async () => {
  const r = { ...report, findings: [{ level: 'blocking', check: 'leftovers', message: 'PR title contains the merge-stop phrase.' }] };
  const cleared = await publish({ report: r });
  expect(cleared.conclusions).toEqual(['success']);
  for (const input of [{ title: 'DO NOT MERGE' }, { body: 'do not merge' }, { labels: ['Do Not Merge'] }]) {
    const calls = await publish({ report: r, ...input });
    expect(calls.conclusions).toEqual(['failure']);
  }
});
test('publisher ignores stale SHAs and infrastructure never fails budget gate', async () => {
  const stale = await publish({ report, currentSha: 'b'.repeat(40) });
  expect(stale.created).toHaveLength(0);
  expect(stale.conclusions).toHaveLength(0);
  const missing = await publish();
  expect(missing.conclusions).toEqual(['neutral']);
  expect(missing.failures).toHaveLength(0);
  const quota = await publish({ apiFailure: true });
  expect(quota.failures).toHaveLength(0);
  expect(quota.warnings).toHaveLength(1);
});

test('publisher retains confirmed CLS even when earlier production measurements failed', async () => {
  const partialPages = pages.map(p => ({ ...p, prod: [] }));
  const partial = { sha, pages: partialPages, table: renderTable(partialPages), findings: partialPages.flatMap(p => checkPage(p)) };
  const first = await publish({ report: partial });
  expect(first.conclusions).toEqual(['failure']);
  const retry = await publish({ comments: [{ id: 2, user: { login: 'github-actions[bot]' }, body: first.created[0] }] });
  expect(retry.conclusions).toEqual(['failure']);
  expect(retry.updated[0]).toContain('— → 0.100');
});

test('publisher retains confirmed asset or screenshot blocker when a later static run is unavailable', async () => {
  for (const finding of [
    {level:'blocking', check:'asset-size', message:'logo.png exceeds 200 KiB.'},
    {level:'blocking', check:'leftovers', message:'screenshots/pr-123.png must not ship.'},
  ]) {
    const first = await publish({ report: {...report, findings:[finding]} });
    const retry = await publish({ comments:[{id:2,user:{login:'github-actions[bot]'},body:first.created[0]}] });
    expect(retry.conclusions).toEqual(['failure']);
    expect(retry.updated[0]).toContain(finding.message);
  }
});

test('warning-heavy reports persist blockers before bounded warning state', async () => {
  const warnings = Array.from({length:100}, (_,i) => ({level:'warning', check:'image-priority', message:`source warning ${i}`}));
  const first = await publish({report:{...report, findings:[...warnings, ...report.findings]}});
  const retry = await publish({comments:[{id:2,user:{login:'github-actions[bot]'},body:first.created[0]}]});
  expect(retry.conclusions).toEqual(['failure']);
});

test('publisher always shows the per-page table when an earlier run had no report', async () => {
  const first = await publish();
  const emptyPages = pages.map(p => ({...p, prod:[], preview:[]}));
  const current = {...report, pages:emptyPages, findings:[], table:renderTable(emptyPages)};
  const next = await publish({report:current, comments:[{id:2,user:{login:'github-actions[bot]'},body:first.created[0]}]});
  expect(next.updated[0]).toContain('| /fr | 0/0 |');
  expect(next.updated[0]).not.toContain('Measurements unavailable.');
});
