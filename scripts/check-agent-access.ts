import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.AGENT_CHECK_URL ?? `http://localhost:${process.env.CONDUCTOR_PORT ?? process.env.PORT ?? 4200}`;
const directory = await mkdtemp(join(tmpdir(), "tvc-agent-check-"));
let sequence = 0;

async function curl(path: string, headers: string[] = [], body?: unknown) {
  const file = join(directory, String(sequence++));
  const args = ["curl", "--silent", "--show-error", "--max-time", "60", "--dump-header", file];
  for (const header of headers) args.push("--header", header);
  if (body !== undefined) args.push("--data", JSON.stringify(body));
  args.push(`${base}${path}`);
  const result = Bun.spawnSync(args);
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  const rawHeaders = await readFile(file, "utf8");
  const status = Number(rawHeaders.match(/^HTTP\/\S+ (\d+)/m)?.[1]);
  const responseHeaders = new Headers();
  for (const line of rawHeaders.split("\r\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) responseHeaders.append(line.slice(0, separator), line.slice(separator + 1).trim());
  }
  return { status, headers: responseHeaders, body: result.stdout.toString() };
}

function check(ok: boolean, message: string): asserts ok {
  if (!ok) throw new Error(message);
  console.log(`[ok] ${message}`);
}

try {
  const robots = await curl("/robots.txt");
  check(robots.status === 200 && robots.body.includes("Sitemap:"), "robots.txt 200 with sitemap");
  for (const agent of ["*", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"]) {
    const block = robots.body.split("\n\n").find((block) => block.startsWith(`User-agent: ${agent}\n`));
    check(Boolean(block?.includes("Allow: /") && block.includes("Content-Signal: search=yes, ai-input=yes, ai-train=yes")), `robots policy for ${agent}`);
  }
  check(robots.body.includes("Agentmap: https://www.thevibecompany.co/.well-known/ai-catalog.json"), "robots advertises ARD Agentmap");
  const llms = await curl("/llms.txt");
  check(llms.status === 200 && llms.body.startsWith("# "), "llms.txt 200 Markdown source");
  for (const path of ["/", "/fr", "/en", "/fr/resources/articles/je-mappelle-victor"]) {
    const html = await curl(path, ["Accept: text/html"]);
    const md = await curl(path, ["Accept: text/markdown"]);
    check(html.status === (path === "/" ? 307 : 200), `${path} preserves HTML status`);
    if (path !== "/") check(html.headers.get("content-type")?.includes("text/html") === true, `${path} HTML content type`);
    if (path !== "/") check(/<link[^>]+rel="ai-catalog"[^>]+href="\/.well-known\/ai-catalog.json"/.test(html.body), `${path} HTML advertises ARD catalog`);
    for (const response of [html, md]) {
      check(response.headers.get("vary")?.toLowerCase().split(/,\s*/).includes("accept") === true, `${path} Vary includes Accept`);
      check(["describedby", "sitemap", "service-desc"].every((rel) => response.headers.get("link")?.includes(`rel="${rel}"`)), `${path} discovery Link headers`);
    }
    check(md.status === 200 && md.headers.get("content-type") === "text/markdown; charset=utf-8" && md.body.startsWith("# "), `${path} negotiates Markdown 200`);
    if (!path.includes("articles")) check(md.body === llms.body, `${path} Markdown matches llms.txt`);
  }
  const redirect = await curl("/en/resources/articles/je-mappelle-victor", ["Accept: text/markdown"]);
  check(redirect.status === 308 && redirect.headers.get("location")?.endsWith("/fr/resources/articles/je-mappelle-victor") === true, "Markdown keeps canonical language redirects");
  const index = await curl("/.well-known/agent-skills/index.json");
  check(index.status === 200 && index.headers.get("content-type")?.includes("application/json") === true, "skills index 200 JSON");
  const discovery = JSON.parse(index.body);
  check(discovery.$schema === "https://schemas.agentskills.io/discovery/0.2.0/schema.json", "skills discovery schema 0.2.0");
  for (const skill of discovery.skills) {
    const artifact = await curl(skill.url);
    check(artifact.status === 200 && artifact.headers.get("content-type")?.includes("text/markdown") === true, `${skill.name} served as Markdown`);
    check(skill.digest === `sha256:${createHash("sha256").update(artifact.body).digest("hex")}`, `${skill.name} served SHA-256 matches index`);
  }
  for (const path of ["/.well-known/mcp/server-card.json", "/mcp/server-card", "/.well-known/agent-card.json", "/.well-known/ai-catalog.json"]) {
    const response = await curl(path);
    check(response.status === 200 && Boolean(JSON.parse(response.body)), `${path} 200 valid JSON`);
  }
  const ard = await curl("/.well-known/ai-catalog.json");
  check(ard.headers.get("content-type")?.includes("application/json") === true && ard.headers.get("access-control-allow-origin") === "*", "ARD is JSON with public CORS");
  const manifest = JSON.parse(ard.body);
  check(manifest.host.displayName === "The Vibe Company" && manifest.entries.length === 3, "ARD identifies host and three public capabilities");
  for (const entry of manifest.entries) {
    const target = await curl(new URL(entry.url).pathname);
    check(target.status === 200 && Boolean(JSON.parse(target.body)), `ARD target ${new URL(entry.url).pathname} returns 200 JSON`);
  }
  const poppy = await curl("/.well-known/poppy.json");
  const protocol = JSON.parse(poppy.body);
  check(poppy.status === 200 && poppy.headers.get("content-type")?.includes("application/json") === true && protocol.protocol_version === "0.1" && protocol.organization.domain === "thevibecompany.co" && !protocol.auth && !protocol.agent && !protocol.apis, "Poppy serves website-only JSON without OAuth claims");
  for (const path of ["/.well-known/oauth-authorization-server", "/.well-known/openid-configuration", "/.well-known/oauth-protected-resource"]) {
    check((await curl(path)).status === 404, `${path} remains 404 (no authorization server)`);
  }
  const catalog = await curl("/.well-known/api-catalog");
  check(catalog.status === 200 && catalog.headers.get("content-type") === "application/linkset+json" && JSON.parse(catalog.body).linkset.length > 0, "api-catalog 200 application/linkset+json");
  const auth = await curl("/auth.md");
  check(auth.status === 200 && auth.body.includes("authentication: none"), "auth.md declares public access");
  check(/^# .*auth\.md$/m.test(auth.body) && auth.body.includes("Audience: AI agents") && auth.body.includes("Registration/provisioning endpoint: none required") && auth.body.includes("Anonymous/no-auth public access only") && auth.body.includes("Do not send credentials"), "auth.md describes registration, methods and credentials honestly");
  const mcpHeaders = ["Content-Type: application/json", "Accept: application/json, text/event-stream"];
  const initialize = await curl("/mcp", mcpHeaders, { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "curl-smoke", version: "1" } } });
  check(initialize.status === 200 && JSON.parse(initialize.body).result.protocolVersion === "2025-06-18", "MCP initialize succeeds");
  const list = await curl("/mcp", mcpHeaders, { jsonrpc: "2.0", id: 2, method: "tools/list" });
  check(JSON.parse(list.body).result.tools.length === 3, "MCP lists three public read-only tools");
  const booking = await curl("/mcp", mcpHeaders, { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_booking_link", arguments: {} } });
  check(JSON.parse(booking.body).result.structuredContent.url === "https://cal.com/stangirard/thevibecompany", "MCP returns exact booking URL");
  const a2a = await curl("/a2a", ["Content-Type: application/json"], { jsonrpc: "2.0", id: 4, method: "message/send", params: { message: { role: "user", messageId: "smoke", parts: [{ kind: "data", data: { name: "get_booking_link" } }] } } });
  check(a2a.status === 200 && JSON.parse(a2a.body).result.kind === "message", "A2A returns immediate read-only Message");
} finally {
  await rm(directory, { recursive: true, force: true });
}
