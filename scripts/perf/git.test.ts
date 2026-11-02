import { expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, renameSync, unlinkSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Tiny real Git fixture tests diff semantics without ever creating an oversized binary.
test('diff assets inspect destination blobs, additions and modifications only', () => {
  const root = mkdtempSync(join(tmpdir(), 'perf-diff-'));
  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  try {
    git('init', '--quiet'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'user.name', 'Fixture');
    writeFileSync(join(root, 'unchanged.png'), 'old asset');
    writeFileSync(join(root, 'deleted.jpg'), 'delete me');
    writeFileSync(join(root, 'renamed.svg'), '<svg/>');
    git('add', '.'); git('commit', '-qm', 'fixture base');
    const base = git('rev-parse', 'HEAD');
    renameSync(join(root, 'renamed.svg'), join(root, 'new name\n.svg'));
    unlinkSync(join(root, 'deleted.jpg'));
    mkdirSync(join(root, 'screenshots'));
    writeFileSync(join(root, 'screenshots/pr-123.png'), 'tiny capture fixture');
    writeFileSync(join(root, 'added.webp'), 'tiny webp fixture');
    git('add', '.'); git('commit', '-qm', 'fixture changes');
    const head = git('rev-parse', 'HEAD');
    const modulePath = join(import.meta.dir, 'git.ts');
    const script = `import {changedPaths,changedAssets} from ${JSON.stringify(modulePath)}; const paths=changedPaths(${JSON.stringify(base)},${JSON.stringify(head)}); console.log(JSON.stringify({paths,findings:changedAssets(paths,${JSON.stringify(head)})}));`;
    const result = JSON.parse(execFileSync(process.execPath, ['-e', script], { cwd: root, encoding: 'utf8' }));
    expect(result.paths.sort()).toEqual(['added.webp', 'new name\n.svg', 'screenshots/pr-123.png']);
    expect(result.findings).toEqual([]);
    mkdirSync(join(root, '.context'));
    writeFileSync(join(root, '.context/perf-pr.json'), JSON.stringify({ title: 'THE-2183', body: '', labels: [] }));
    execFileSync(process.execPath, [join(import.meta.dir, 'run.ts'), '--static'], {
      cwd: root, env: { ...process.env, BASE_SHA: base, HEAD_SHA: head }, stdio: 'pipe',
    });
    const staticReport = JSON.parse(readFileSync(join(root, '.context/perf/report.json'), 'utf8'));
    expect(staticReport.sha).toBe(head);
    expect(staticReport.findings).toContainEqual({ level: 'blocking', check: 'leftovers', message: 'screenshots/pr-123.png: screenshots/ must not ship. Use .context/ for review captures.' });
    expect(staticReport.table).toContain('/fr');
    const bad = `import {changedPaths} from ${JSON.stringify(modulePath)}; changedPaths('--help',${JSON.stringify(head)});`;
    expect(() => execFileSync(process.execPath, ['-e', bad], { cwd: root, stdio: 'ignore' })).toThrow();
  } finally { rmSync(root, { recursive: true, force: true }); }
});
