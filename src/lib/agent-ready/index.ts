import { normalizeUrl, safeFetch, type Resource } from "./safe-fetch";
import * as checks from "./checks";
import { categories, score } from "./scoring";
import type { Report } from "./types";
export type * from "./types";

export async function scanSite(input: string): Promise<Report> {
  const started = Date.now();
  const origin = normalizeUrl(input).origin;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 23000);
  let active = 0;
  const waiting: (() => void)[] = [];
  const resources = new Map<string, Promise<Resource | null>>();
  const load: checks.Load = (path, headers = {}) => {
    const url = new URL(path, origin).href;
    const key = JSON.stringify([url, headers]);
    if (!resources.has(key)) resources.set(key, (async () => {
      if (active >= 16) await new Promise<void>((resolve) => waiting.push(resolve));
      active++;
      try {
        if (controller.signal.aborted) return null;
        return await safeFetch(url, { headers, signal: controller.signal });
      } catch { return null; }
      finally { active--; waiting.shift()?.(); }
    })());
    return resources.get(key)!;
  };
  try {
    const homePromise = load("/");
    const robotsPromise = load("/robots.txt");
    const independent = Promise.all([
      checks.llmsTxt(load), checks.markdownNegotiation(load), checks.aiBotAccess(load),
      checks.mcpServerCard(load), checks.a2aAgentCard(load), checks.agentSkills(load),
      checks.oauthDiscovery(load), checks.oauthProtectedResource(load), checks.apiCatalog(load),
    ]);
    const [home, robots] = await Promise.all([homePromise, robotsPromise]);
    const all = [
      checks.robotsTxt(robots), checks.linkHeaders(home), checks.rawHtmlContent(home),
      checks.robotsAiRules(robots), checks.contentSignal(robots),
      ...await independent,
      ...await Promise.all([checks.sitemap(load, robots), checks.x402(load, home)]),
    ];
    return { url: origin, finalUrl: home?.url ?? origin, scannedAt: new Date(started).toISOString(),
      durationMs: Date.now() - started, score: score(all), categories: categories(all) };
  } finally { clearTimeout(timer); }
}
