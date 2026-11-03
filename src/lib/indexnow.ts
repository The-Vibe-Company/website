// Public ownership proof, not a credential. Keep public/<key>.txt in sync.
export const INDEXNOW_KEY = "d0665c0d926365762e882af2ac4e79a0";
export const INDEXNOW_ORIGIN = "https://www.thevibecompany.co";
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const TIMEOUT_MS = 8_000;

export type SitemapEntry = { url: string; alternates: string[] };
type Environment = Record<string, string | undefined>;
export type IndexNowFetch = (url: string, options?: RequestInit) => Promise<Response>;

export function isIndexNowProduction(env: Environment): boolean {
  return env.VERCEL_ENV === "production" && env.VERCEL_GIT_COMMIT_REF === "main";
}

export function isIndexNowUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return value.startsWith(`${INDEXNOW_ORIGIN}/`) && url.origin === INDEXNOW_ORIGIN &&
      !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

function xmlText(value: string): string {
  return value.trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code: string) =>
      String.fromCodePoint(code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

// Read only <loc> inside <url>/<sitemap>, never hreflang links as entries.
// No XML entities are fetched or expanded. Supports default/prefixed namespaces.
export function parseIndexNowSitemap(xml: string) {
  const clean = xml.replace(/<!--[\s\S]*?-->/g, "");
  const index = /<(?:[\w.-]+:)?sitemapindex\b/.test(clean);
  if (!index && !/<(?:[\w.-]+:)?urlset\b/.test(clean)) throw new Error("Invalid sitemap XML");
  const tag = index ? "sitemap" : "url";
  const blocks = clean.matchAll(new RegExp(`<(?:[\\w.-]+:)?${tag}\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?${tag}>`, "g"));
  const entries: SitemapEntry[] = [];
  for (const [, block] of blocks) {
    const loc = block.match(/<(?:[\w.-]+:)?loc\b[^>]*>([\s\S]*?)<\/(?:[\w.-]+:)?loc>/);
    if (!loc) continue;
    const url = xmlText(loc[1]);
    if (!isIndexNowUrl(url)) continue;
    const alternates = [...block.matchAll(/\bhref\s*=\s*["']([^"']+)["']/g)]
      .map((match) => xmlText(match[1])).filter(isIndexNowUrl);
    entries.push({ url, alternates });
  }
  return { index, entries };
}

export async function readIndexNowSitemap(fetcher: IndexNowFetch = fetch): Promise<SitemapEntry[]> {
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  async function visit(url: string, depth: number) {
    if (seen.has(url)) return;
    if (!isIndexNowUrl(url) || depth > 5 || seen.size >= 100) throw new Error("Sitemap traversal limit");
    seen.add(url);
    const response = await fetcher(url, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: "error" });
    if (!response.ok) throw new Error(`Sitemap HTTP ${response.status}`);
    const parsed = parseIndexNowSitemap(await response.text());
    if (parsed.index) {
      for (const entry of parsed.entries) await visit(entry.url, depth + 1);
    } else entries.push(...parsed.entries);
  }
  await visit(`${INDEXNOW_ORIGIN}/sitemap.xml`, 0);
  return entries;
}

export function selectIndexNowUrls(
  entries: SitemapEntry[], changedFiles: string[] | null, contentSlugs: Record<string, string> = {},
): string[] {
  const all = new Set(entries.map((entry) => entry.url).filter(isIndexNowUrl));
  // No baseline (first production run), or shared page/data/asset changes:
  // conservatively notify every canonical. Ignore tests and IndexNow tooling.
  const sharedChange = changedFiles?.some((file) =>
    !/\.(test|spec)\.[cm]?[jt]sx?$/.test(file) && file !== "src/lib/indexnow.ts" &&
    (/^(src|messages)\//.test(file) || /^public\/(images|projects)\//.test(file) || file === "next.config.ts"));
  if (changedFiles === null || sharedChange) return [...all].sort();
  const suffixes = changedFiles.flatMap((file) => {
    const match = file.match(/^content\/(articles|skills)\/([^/]+)\.md$/);
    return match ? [`/resources/${match[1]}/${contentSlugs[file] || match[2]}`] : [];
  });
  const selected = new Set<string>();
  for (const entry of entries) {
    if (!all.has(entry.url)) continue;
    if (suffixes.some((suffix) => new URL(entry.url).pathname.endsWith(suffix))) {
      selected.add(entry.url);
      for (const alternate of entry.alternates) if (all.has(alternate)) selected.add(alternate);
    }
  }
  // Cards and resource lists also change when content is edited/deleted.
  if (suffixes.length) {
    for (const locale of ["fr", "en"]) {
      const hub = `${INDEXNOW_ORIGIN}/${locale}/resources`;
      if (all.has(hub)) selected.add(hub);
    }
  }
  return [...selected].filter((url) => all.has(url)).sort();
}

export function indexNowPayloads(urls: string[]) {
  const unique = [...new Set(urls.filter(isIndexNowUrl))].sort();
  const payloads = [];
  for (let i = 0; i < unique.length; i += 10_000) {
    payloads.push({
      host: "www.thevibecompany.co",
      key: INDEXNOW_KEY,
      keyLocation: `${INDEXNOW_ORIGIN}${INDEXNOW_KEY_PATH}`,
      urlList: unique.slice(i, i + 10_000),
    });
  }
  return payloads;
}

// Repeating a payload is safe; URLs are unique and deterministically ordered.
// All network failures are best effort. Never fail a deployment or CI check.
export async function submitIndexNow(
  urls: string[],
  { env = process.env, dryRun = false, fetcher = fetch, log = console.log }:
  { env?: Environment; dryRun?: boolean; fetcher?: IndexNowFetch; log?: (message: string) => void } = {},
): Promise<void> {
  if (!dryRun && !isIndexNowProduction(env)) {
    log("IndexNow: skipped (not production)");
    return;
  }
  const payloads = indexNowPayloads(urls);
  if (!payloads.length) { log("IndexNow: skipped (no changed URLs)"); return; }
  if (dryRun) {
    for (const payload of payloads) log(`IndexNow: dry-run (no POST)\n${JSON.stringify(payload, null, 2)}`);
    return;
  }
  try {
    // Ensure the proof is already live at the canonical host, without redirects.
    const proof = await fetcher(`${INDEXNOW_ORIGIN}${INDEXNOW_KEY_PATH}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS), redirect: "error",
    });
    if (!proof.ok || !(proof.headers.get("content-type") ?? "").startsWith("text/plain") ||
      await proof.text() !== INDEXNOW_KEY) throw new Error("Production key file is not live");
    for (const payload of payloads) {
      const response = await fetcher(INDEXNOW_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(TIMEOUT_MS), redirect: "error",
      });
      log(`IndexNow: HTTP ${response.status} (${payload.urlList.length} URLs)${response.ok ? "" : " — ignored (best effort)"}`);
    }
  } catch (error) {
    log(`IndexNow: submission failed (ignored): ${error instanceof Error ? error.message : String(error)}`);
  }
}
