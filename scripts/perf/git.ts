import { execFileSync } from 'node:child_process';
import { checkAssets } from './checks';

export function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 30_000 });
}
export function changedPaths(base: string, head: string): string[] {
  if (![base, head].every(ref => /^[a-f\d]{40}$/i.test(ref))) throw new Error('Expected full commit SHAs');
  // Treat renames as add/delete so the new blob is checked. Deletions can clean leftovers.
  return git('diff', '--no-renames', '--name-only', '-z', '--diff-filter=ACMT', `${base}...${head}`, '--').split('\0').filter(Boolean);
}
export function changedAssets(paths: string[], head: string) {
  return checkAssets(paths.filter(path => /\.(svg|png|jpe?g|webp|avif|gif|ico|bmp|tiff?)$/i.test(path)).map(path => ({
    path, bytes: Number(git('cat-file', '-s', `${head}:${path}`).trim()),
  })));
}
export function sourceFiles(head: string): Record<string, string> {
  return Object.fromEntries(git('ls-tree', '-r', '--name-only', '-z', head, '--', 'src').split('\0')
    .filter(path => /\.[jt]sx?$/.test(path)).map(path => [path, git('show', `${head}:${path}`)]));
}
