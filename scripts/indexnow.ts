import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parseFrontmatter } from "../src/lib/parse-frontmatter";
import {
  isIndexNowProduction, readIndexNowSitemap, selectIndexNowUrls, submitIndexNow,
} from "../src/lib/indexnow";

type Deployment = { id: number; sha: string; environment: string; created_at: string };

function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", timeout: 10_000 }).trim();
}

async function previousProductionSha(current: Deployment): Promise<string | null> {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository || !process.env.GH_TOKEN) throw new Error("Missing GitHub deployment context");
  async function api(path: string) {
    const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, {
      headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8_000), redirect: "error",
    });
    if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
    return response.json();
  }
  // Include inactive deployments: Vercel/GitHub can mark an older success inactive.
  // Compare the last live commit, not HEAD^ (several commits may ship together).
  const deployments: Deployment[] = await api("deployments?environment=Production&per_page=100");
  for (const deployment of deployments) {
    if (deployment.id === current.id || deployment.created_at >= current.created_at) continue;
    const statuses: { state: string }[] = await api(`deployments/${deployment.id}/statuses?per_page=100`);
    if (statuses.some(({ state }) => state === "success")) return deployment.sha;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  if (!dryRun && !isIndexNowProduction(process.env)) {
    console.log("IndexNow: skipped (not production)");
    return;
  }
  if (args.some((arg) => !["--all", "--deployment", "--dry-run"].includes(arg)) ||
    args.includes("--all") === args.includes("--deployment")) throw new Error("Use --all or --deployment [--dry-run]");
  let changedFiles: string[] | null = null;
  if (args.includes("--deployment")) {
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH ?? "", "utf8"));
    const deployment: Deployment = event.deployment;
    if (event.deployment_status?.state !== "success" || deployment.environment !== "Production" ||
      process.env.GITHUB_EVENT_NAME !== "deployment_status") {
      console.log("IndexNow: skipped (not a successful production deployment)");
      return;
    }
    if (!/^[a-f0-9]{40}$/.test(deployment.sha)) throw new Error("Invalid deployment SHA");
    // Vercel uses a SHA as deployment.ref in this repository. Prove main ancestry.
    git("merge-base", "--is-ancestor", deployment.sha, "origin/main");
    if (git("rev-parse", "HEAD") !== deployment.sha) throw new Error("Checkout does not match deployment");
    const previous = await previousProductionSha(deployment);
    if (previous) {
      if (!/^[a-f0-9]{40}$/.test(previous)) throw new Error("Invalid previous deployment SHA");
      try {
        changedFiles = git("diff", "--name-only", "--no-renames", "-z", previous, deployment.sha)
          .split("\0").filter(Boolean);
        console.log(`IndexNow: diff ${previous}..${deployment.sha} (${changedFiles.length} files)`);
      } catch {
        console.log("IndexNow: baseline unavailable in Git; selecting all canonical URLs");
      }
    } else console.log("IndexNow: no previous production baseline; selecting all canonical URLs");
  }
  const entries = await readIndexNowSitemap();
  // Match content-source.ts: frontmatter slug overrides the filename.
  const contentSlugs: Record<string, string> = {};
  for (const file of changedFiles ?? []) {
    if (!/^content\/(articles|skills)\/[^/]+\.md$/.test(file) || !existsSync(file)) continue;
    const { data } = parseFrontmatter(readFileSync(file, "utf8"));
    if (typeof data.slug === "string") contentSlugs[file] = data.slug;
  }
  const urls = selectIndexNowUrls(entries, changedFiles, contentSlugs);
  console.log(`IndexNow: selected ${urls.length} canonical URLs`);
  await submitIndexNow(urls, { dryRun });
}

// Deliberately resolve with exit 0 on API, sitemap, Git or configuration errors.
main().catch((error) => console.log(`IndexNow: failed (ignored): ${error instanceof Error ? error.message : String(error)}`));
