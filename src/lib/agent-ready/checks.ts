import type { Check, CheckId, CategoryId } from "./types";
import type { Resource } from "./safe-fetch";
import { botAllowed, parseRobots } from "./robots";
export type Load = (path: string, headers?: Record<string, string>) => Promise<Resource | null>;
export const BOTS = {
  GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)",
  "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot)",
  ClaudeBot: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://anthropic.com/claudebot)",
  "Claude-SearchBot": "Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +https://anthropic.com/claude-searchbot)",
  PerplexityBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  "Google-Extended": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
};
// Google-Extended is a robots product token, not a separate HTTP crawler UA.
// https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended
const result = (id: CheckId, category: CategoryId, weight: number, pass: boolean, details: string): Check =>
  ({ id, category, weight, status: pass ? "pass" : "fail", details: details.slice(0, 1000) });
const text = (r: Resource | null) => !r?.truncated && r?.status === 200 && /^text\/(plain|markdown)/i.test(r.headers["content-type"] ?? "");
const evidence = (r: Resource | null) => r ? `HTTP ${r.status} ${r.url}${r.truncated ? " — response too large (truncated)" : ""}` : "Unavailable or scan deadline exceeded";

// RFC 9309 https://www.rfc-editor.org/rfc/rfc9309
export function robotsTxt(r: Resource | null) {
  return result("robots_txt", "discoverability", 3, !!text(r) && parseRobots(r!.body).length > 0, evidence(r));
}
// Sitemaps protocol https://www.sitemaps.org/protocol.html
export async function sitemap(load: Load, robots: Resource | null) {
  const declared = robots?.body.match(/^[ \t]*Sitemap:[ \t]*(https?:\/\/\S+)/im)?.[1];
  const r = await load(declared ?? "/sitemap.xml");
  return result("sitemap", "discoverability", 3, r?.status === 200 &&
    /(?:xml)/i.test(r.headers["content-type"] ?? "") && /<(?:\w+:)?(?:urlset|sitemapindex)\b/i.test(r.body), evidence(r));
}
// RFC 8288 https://www.rfc-editor.org/rfc/rfc8288
export function linkHeaders(r: Resource | null) {
  const header = r?.headers.link ?? "";
  return result("link_headers", "discoverability", 1, /<[^>]+>\s*;[^,]*\brel\s*=\s*(?:"[^"]*\b(?:describedby|service-desc|api-catalog|alternate)\b[^"]*"|(?:describedby|service-desc|api-catalog|alternate)\b)/i.test(header), header || "No discovery Link relation");
}
// https://llmstxt.org/
export async function llmsTxt(load: Load) {
  const r = await load("/llms.txt");
  return result("llms_txt", "discoverability", 2, !!text(r) && /^# /m.test(r!.body.trimStart().split("\n")[0]), evidence(r));
}
// RFC 9110 negotiation and RFC 7763 https://www.rfc-editor.org/rfc/rfc9110#section-12
// https://www.rfc-editor.org/rfc/rfc7763
export async function markdownNegotiation(load: Load) {
  const r = await load("/", { accept: "text/markdown" });
  return result("markdown_negotiation", "content", 2, r?.status === 200 && /^text\/markdown\b/i.test(r.headers["content-type"] ?? ""), evidence(r));
}
// HTML semantics https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements
function htmlTextMetrics(html: string) {
  const lower = html.toLowerCase();
  let position = 0;
  let inH1 = false;
  let heading = "";
  let content = "";
  // Single forward pass. Unclosed adversarial tags must not induce regex
  // backtracking over the entire response for each opening angle bracket.
  while (position < html.length) {
    const next = html.indexOf("<", position);
    const endText = next < 0 ? html.length : next;
    const value = html.slice(position, endText);
    content += value + " ";
    if (inH1) heading += value;
    if (next < 0) break;
    if (html.startsWith("<!--", next)) {
      const end = html.indexOf("-->", next + 4);
      position = end < 0 ? html.length : end + 3;
      continue;
    }
    const end = html.indexOf(">", next + 1);
    if (end < 0) break;
    const tag = lower.slice(next + 1, end).trim().split(/\s/, 1)[0];
    position = end + 1;
    if (["script", "style", "noscript", "template", "head"].includes(tag)) {
      const close = lower.indexOf("</" + tag, position);
      const closeEnd = close < 0 ? -1 : html.indexOf(">", close);
      position = closeEnd < 0 ? html.length : closeEnd + 1;
    } else if (tag === "h1") inH1 = true;
    else if (tag === "/h1") inH1 = false;
  }
  const visible = (value: string) => value.replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, " ").replace(/\s+/g, " ").trim();
  const length = visible(content).length;
  return { length, hasHeading: !!visible(heading) };
}
export function rawHtmlContent(r: Resource | null) {
  const { length, hasHeading } = htmlTextMetrics(r?.body ?? "");
  return result("raw_html_content", "content", 4, r?.status === 200 && /text\/html/i.test(r.headers["content-type"] ?? "") && hasHeading && length >= 200, `Visible text: ${length} characters; nonempty h1: ${hasHeading}${r?.truncated ? "; partial HTML (truncated)" : ""}`);
}
// RFC 9309 https://www.rfc-editor.org/rfc/rfc9309
// https://platform.openai.com/docs/bots
// https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
// https://docs.perplexity.ai/guides/bots
// https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
export function robotsAiRules(r: Resource | null) {
  const groups = parseRobots(r?.body ?? "");
  const states = Object.keys(BOTS).map((bot) => ({ bot, ...botAllowed(groups, bot) }));
  return result("robots_ai_rules", "ai_bots", 3, !!text(r) && states.every((s) => s.covered && s.allowed),
    (r?.truncated ? "response too large; " : "") + states.map((s) => `${s.bot}: ${!s.covered ? "not addressed" : s.allowed ? "allowed" : "blocked"}`).join("; "));
}
// https://contentsignals.org/ https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/
export function contentSignal(r: Resource | null) {
  return result("content_signal", "ai_bots", 1, !!text(r) && /^[ \t]*Content-Signal:[ \t]*\S+/im.test(r!.body), (r?.truncated ? "response too large; " : "") + "Content-Signal directive " + (/^[ \t]*Content-Signal:[ \t]*\S+/im.test(r?.body ?? "") ? "present" : "absent"));
}
// Cloudflare documents cf-mitigated: challenge as the reliable response signal:
// https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/
function isChallenge(r: Resource | null): boolean {
  if (!r) return false;
  if (r.headers["cf-mitigated"]?.trim().toLowerCase() === "challenge") return true;
  const body = r.body;
  // Interstitial-specific markers, not passive /scripts/jsd/ detection scripts
  // or marketing copy that merely mentions CAPTCHA.
  const interstitial = /\b_?cf_chl_opt\b|\/cdn-cgi\/challenge-platform\/h\/|<title\b[^>]*>\s*(?:Just a moment(?:\.\.\.|…)?|Attention Required!\s*\|\s*Cloudflare)\s*<\/title\s*>|\bid\s*=\s*["']challenge-form["']|captcha-delivery\.com|_pxCaptcha\b|\bpx-captcha\b|_Incapsula_Resource|\/akam\/\d+\/\w+\/\w+\/\w+/i.test(body);
  if (interstitial) return true;
  const widget = /<(?:div|iframe|form)\b[^>]*\b(?:class|id|src)\s*=\s*["'][^"']*\b(?:cf-turnstile|g-recaptcha|h-captcha)\b/i.test(body);
  if (widget && htmlTextMetrics(body).length < 500) return true;
  // Error status plus challenge markup can identify older challenge responses.
  return [403, 429, 503].includes(r.status) && /\bcf-chl-[\w-]+|<(?:script|iframe)\b[^>]*\/challenge-platform\/h\//i.test(body);
}
// Vendor UAs above; HTTP semantics https://www.rfc-editor.org/rfc/rfc9110
export async function aiBotAccess(load: Load) {
  const states = await Promise.all(Object.entries(BOTS).map(async ([bot, ua]) => {
    const r = await load("/", { "user-agent": ua });
    const challenge = isChallenge(r);
    return { bot, pass: r?.status === 200 && !challenge, detail: `${bot}: ${r?.status ?? "unavailable"}${challenge ? " challenge" : ""}` };
  }));
  return result("ai_bot_access", "ai_bots", 4, states.every((s) => s.pass), states.map((s) => s.detail).join("; ") + "; Google-Extended uses Googlebot UA (no dedicated UA)");
}
async function jsonDiscovery(load: Load, id: CheckId, paths: string[], mime = "application/json") {
  const responses = await Promise.all(paths.map((p) => load(p)));
  const valid = responses.find((r) => {
    if (r?.truncated || r?.status !== 200 || !(r.headers["content-type"] ?? "").toLowerCase().split(";")[0].trim().endsWith(mime)) return false;
    try { const value: unknown = JSON.parse(r.body); return !!value && typeof value === "object" && !Array.isArray(value); } catch { return false; }
  });
  return result(id, "protocols", 1, !!valid, valid ? evidence(valid) : responses.map(evidence).join("; "));
}
// Proposed MCP discovery, not a conformance assertion:
// https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649
export const mcpServerCard = (load: Load) => jsonDiscovery(load, "mcp_server_card", ["/.well-known/mcp", "/.well-known/mcp.json", "/.well-known/mcp/server-card.json"]);
// https://a2a-protocol.org/latest/specification/
export const a2aAgentCard = (load: Load) => jsonDiscovery(load, "a2a_agent_card", ["/.well-known/agent.json", "/.well-known/agent-card.json"]);
// https://agentskills.io/ https://github.com/cloudflare/agent-skills-discovery-rfc
export const agentSkills = (load: Load) => jsonDiscovery(load, "agent_skills", ["/.well-known/agent-skills/index.json", "/.well-known/skills/index.json"]);
// RFC 8414 https://www.rfc-editor.org/rfc/rfc8414
// https://openid.net/specs/openid-connect-discovery-1_0.html
export const oauthDiscovery = (load: Load) => jsonDiscovery(load, "oauth_discovery", ["/.well-known/oauth-authorization-server", "/.well-known/openid-configuration"]);
// RFC 9728 https://www.rfc-editor.org/rfc/rfc9728
export const oauthProtectedResource = (load: Load) => jsonDiscovery(load, "oauth_protected_resource", ["/.well-known/oauth-protected-resource"]);
// RFC 9727 https://www.rfc-editor.org/rfc/rfc9727
export const apiCatalog = (load: Load) => jsonDiscovery(load, "api_catalog", ["/.well-known/api-catalog"], "application/linkset+json");
// https://docs.x402.org/ Detection only; never attempts payment.
export async function x402(load: Load, home: Resource | null): Promise<Check> {
  const candidates = [home, ...await Promise.all(["/x402", "/api", "/pay"].map((p) => load(p)))];
  const found = candidates.find((r) => r && (r.headers["x402"] || (r.status === 402 &&
    (r.headers["payment-required"] || r.headers["payment-requirements"] || /"x402Version"\s*:/.test(r.body)))));
  return { id: "x402", category: "commerce", weight: 0, informative: true, status: found ? "pass" : "na", details: found ? evidence(found) : "No x402 payment requirement detected" };
}
