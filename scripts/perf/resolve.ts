import { appendFile, readFile } from 'node:fs/promises';
import { isPreview, selectPull, successfulPreview } from './deployment';

const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH!, 'utf8'));
const repository = process.env.GITHUB_REPOSITORY!;
const headers = { authorization: `Bearer ${process.env.GH_TOKEN}`, accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
async function api(path: string) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, { headers, signal: AbortSignal.timeout(15_000) });
      if (response.ok) return await response.json();
      if (response.status < 500) return;
    } catch { /* Fixed generic warning below; never log request details. */ }
  }
}
async function output(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) await appendFile(process.env.GITHUB_OUTPUT!, `${key}=${value}\n`);
}
try {
  const sha = event.pull_request?.head.sha ?? event.deployment?.sha;
  const candidates = event.pull_request ? [event.pull_request] : await api(`commits/${sha}/pulls?per_page=100`);
  const candidate = selectPull(candidates ?? [], sha, event.pull_request?.head.repo?.full_name ?? repository);
  if (!candidate) { console.log('::warning::No current same-repository PR for deployment SHA; neutral.'); process.exit(0); }
  const pr = await api(`pulls/${candidate.number}`);
  if (!pr || pr.state !== 'open' || pr.head.sha !== sha) { console.log('::warning::PR changed or unavailable; neutral.'); process.exit(0); }
  let preview = '';
  if (event.deployment && isPreview(event.deployment)) preview = successfulPreview([event.deployment_status]) ?? '';
  else if (event.pull_request) {
    // Bootstrap on PRs also verifies the new workflow before it has landed on main.
    // The deployment_status event remains the durable trigger for redeploys.
    const attempts = ['opened', 'synchronize', 'reopened'].includes(event.action) ? 20 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const deployments = await api(`deployments?sha=${sha}&per_page=100`);
      if (!deployments) break;
      for (const deployment of deployments.filter(isPreview)) {
        preview = successfulPreview(await api(`deployments/${deployment.id}/statuses?per_page=1`) ?? []) ?? '';
        if (preview) break;
      }
      if (preview) break;
      if (attempt < attempts - 1) await Bun.sleep(15_000);
    }
  }
  // PR metadata is conveyed as an artifact, never interpolated into shell code.
  await Bun.write('.context/perf-pr.json', JSON.stringify({ title: pr.title, body: pr.body, labels: pr.labels.map((label: { name: string }) => label.name) }));
  await output({ pr: String(pr.number), sha, base: pr.base.sha, preview });
} catch { console.log('::warning::GitHub/deployment discovery unavailable; neutral.'); }
