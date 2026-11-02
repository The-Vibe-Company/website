import { previewOrigin } from './lighthouse';
export type Pull = { number: number; state: string; head: { sha: string; repo: { full_name: string } | null } };
export function selectPull(pulls: Pull[], sha: string, repository: string): Pull | undefined {
  return pulls.find(pr => pr.state === 'open' && pr.head.sha === sha && pr.head.repo?.full_name === repository);
}
export function isPreview(deployment: { environment: string; creator?: { login: string } | null }): boolean {
  return deployment.environment.toLowerCase() === 'preview' && deployment.creator?.login === 'vercel[bot]';
}
export function successfulPreview(statuses: { state: string; environment_url?: string; target_url?: string }[]): string | undefined {
  // A failed/inactive latest status must not resurrect an old successful URL.
  const status = statuses[0];
  return status?.state === 'success' ? previewOrigin(status.environment_url || status.target_url || '') : undefined;
}
