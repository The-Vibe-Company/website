import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const action = Bun.YAML.parse(readFileSync(join(import.meta.dir, "action.yml"), "utf8")) as {
  runs: { steps: Array<{ name: string; id?: string; if?: string; uses?: string; run?: string; "continue-on-error"?: boolean; with?: Record<string, string> }> };
};
const steps = action.runs.steps;

for (const successAt of [1, 2, 3, 4]) {
  test(`setup succeeds at attempt ${successAt} (4 = fallback)`, () => {
    const outcomes: Record<string, string> = {};
    const executed: string[] = [];
    let attempt = 0;
    for (const step of steps) {
      if (step.if) {
        const match = step.if.match(/^steps\.(\w+)\.outcome == 'failure'$/)!;
        expect(match).not.toBeNull();
        if (outcomes[match[1]] !== "failure") continue;
      }
      executed.push(step.name);
      if (step.uses) {
        expect(step.uses).toBe("oven-sh/setup-bun@v2");
        expect(step["continue-on-error"]).toBe(true);
        expect(step.with?.["no-cache"]).toBeUndefined();
        expect(step.with?.["bun-version"]).toBe("${{ steps.version.outputs.version }}");
        outcomes[step.id!] = ++attempt === successAt ? "success" : "failure";
      }
    }
    expect(attempt).toBe(Math.min(successAt, 3));
    expect(executed.includes("Install Bun from npm registry")).toBe(successAt === 4);
    expect(executed.at(-1)).toBe("Verify Bun");
    expect(executed.filter(n => n.startsWith("Back off")).length).toBe(Math.min(successAt - 1, 2));
  });
}

function fixture(fn: (dir: string, env: Record<string, string>) => void) {
  const dir = mkdtempSync(join(tmpdir(), "bun-resilience-"));
  const env = { ...process.env, RUNNER_TEMP: dir, GITHUB_ENV: join(dir, "env"), GITHUB_PATH: join(dir, "path"), GITHUB_OUTPUT: join(dir, "output") } as Record<string, string>;
  try { fn(dir, env); } finally { rmSync(dir, { recursive: true, force: true }); }
}
function run(name: string, cwd: string, env: Record<string, string>) {
  return Bun.spawnSync(["bash", "-e", "-o", "pipefail", "-c", steps.find(s => s.name === name)!.run!], { cwd, env });
}

test("version resolution honors exact pins and defaults to latest", () => fixture((dir, env) => {
  for (const [packageManager, expected] of [[undefined, "latest"], ["bun@1.3.3", "1.3.3"], ["bun@1.3.3+sha512.abc", "1.3.3"], ["bun@1.4.0-canary.1", "1.4.0-canary.1"]]) {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ packageManager }));
    writeFileSync(env.GITHUB_OUTPUT, "");
    expect(run("Resolve Bun version", dir, env).exitCode).toBe(0);
    expect(readFileSync(env.GITHUB_OUTPUT, "utf8").trim()).toBe("version=" + expected);
  }
  writeFileSync(join(dir, "package.json"), JSON.stringify({ packageManager: "bun@^1.3.3" }));
  expect(run("Resolve Bun version", dir, env).exitCode).not.toBe(0);
}));

test("fallback exports PATH, uses requested npm version, and propagates failures", () => fixture((dir, env) => {
  const bin = join(dir, "mocks");
  mkdirSync(bin);
  const npm = join(bin, "npm");
  writeFileSync(npm, '#!/bin/bash\nprintf "%s\\n" "$@" > "$RUNNER_TEMP/npm-args"\nmkdir -p "$BUN_INSTALL/bin"\nprintf "#!/bin/bash\\necho 1.3.3\\n" > "$BUN_INSTALL/bin/bun"\nchmod +x "$BUN_INSTALL/bin/bun"\n');
  chmodSync(npm, 0o755);
  env.PATH = bin + ":" + env.PATH;
  env.BUN_VERSION = "1.3.3";
  expect(run("Install Bun from npm registry", dir, env).exitCode).toBe(0);
  expect(readFileSync(join(dir, "npm-args"), "utf8")).toContain("bun@1.3.3");
  expect(readFileSync(env.GITHUB_PATH, "utf8").trim()).toBe(join(dir, "bun-fallback/bin"));
  expect(readFileSync(env.GITHUB_ENV, "utf8")).toContain("BUN_INSTALL=" + join(dir, "bun-fallback"));
  env.PATH = join(dir, "bun-fallback/bin") + ":" + env.PATH;
  expect(run("Verify Bun", dir, env).exitCode).toBe(0);
  env.BUN_VERSION = "1.2.0";
  expect(run("Verify Bun", dir, env).exitCode).not.toBe(0);
  env.BUN_VERSION = "latest";
  expect(run("Verify Bun", dir, env).exitCode).toBe(0);
  writeFileSync(npm, "#!/bin/bash\nexit 42\n");
  expect(run("Install Bun from npm registry", dir, env).exitCode).toBe(42);
}));

test("every workflow uses the shared setup after checkout", async () => {
  let callers = 0;
  const root = join(import.meta.dir, "../../workflows");
  for await (const file of new Bun.Glob("*.yml").scan(root)) {
    const source = readFileSync(join(root, file), "utf8");
    if (file !== "performance.yml") expect(source).not.toContain("oven-sh/setup-bun@v2");
    const workflow = Bun.YAML.parse(source) as { jobs: Record<string, { steps?: Array<{ uses?: string }> }> };
    for (const job of Object.values(workflow.jobs)) {
      const setupIndex = job.steps?.findIndex(step => step.uses === "./.github/actions/setup-bun-resilient") ?? -1;
      if (setupIndex < 0) continue;
      callers++;
      expect(job.steps!.slice(0, setupIndex).some(step => step.uses?.startsWith("actions/checkout@"))).toBe(true);
    }
  }
  expect(callers).toBe(6);
});


test("performance bootstrap keeps trusted checkout and sets up Bun without a local action", () => {
  const source = readFileSync(join(import.meta.dir, "../../workflows/performance.yml"), "utf8");
  const workflow = Bun.YAML.parse(source) as { jobs: Record<string, { steps: Array<{ uses?: string; if?: string; with?: Record<string, unknown> }> }> };
  for (const jobName of ["resolve", "measure"]) {
    const steps = workflow.jobs[jobName].steps;
    const checkout = steps.find(s => s.uses === "actions/checkout@v4")!;
    expect(checkout.with?.ref).toBe("${{ github.event_name == 'deployment_status' && github.event.repository.default_branch || github.sha }}");
    expect(checkout.with?.["persist-credentials"]).toBe(false);
    const bootstrap = steps.find(s => s.uses === "oven-sh/setup-bun@v2")!;
    const resilient = steps.find(s => s.uses === "./.github/actions/setup-bun-resilient")!;
    expect(bootstrap.if).toBe("hashFiles('.github/actions/setup-bun-resilient/action.yml') == ''");
    expect(bootstrap.with?.["bun-version"]).toBe("latest");
    expect(resilient.if).toBe("hashFiles('.github/actions/setup-bun-resilient/action.yml') != ''");
    expect(steps.indexOf(checkout)).toBeLessThan(steps.indexOf(bootstrap));
    expect(steps.indexOf(checkout)).toBeLessThan(steps.indexOf(resilient));
  }
});


test("CI explicitly runs the action tests excluded from default discovery", () => {
  const workflow = Bun.YAML.parse(readFileSync(join(import.meta.dir, "../../workflows/ci.yml"), "utf8")) as { jobs: { build: { steps: Array<{ run?: string }> } } };
  expect(workflow.jobs.build.steps.some(step => step.run === "bun test ./.github/actions/setup-bun-resilient/action.test.ts")).toBe(true);
});
