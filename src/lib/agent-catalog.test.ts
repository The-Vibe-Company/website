import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { GET } from "@/app/.well-known/api-catalog/route";
import { AGENT_SERVER_INFO, MCP_PROTOCOL_VERSIONS } from "@/lib/public-agent-tools";

test("api-catalog serves a JSON linkset pointing to the public discovery resources", async () => {
  const response = GET();
  expect(response.headers.get("content-type")).toBe("application/linkset+json");
  const { linkset } = await response.json();
  expect(linkset).toHaveLength(1);
  const context = linkset[0];
  expect(new URL(context.anchor).protocol).toBe("https:");
  expect(context.describedby[0].href).toEndWith("/llms.txt");
  expect(context.sitemap[0].href).toEndWith("/sitemap.xml");
  expect(context["service-desc"][0].href).toEndWith("/.well-known/agent-skills/index.json");
});

test("all published MCP cards advertise the live server identity and supported protocol", () => {
  for (const path of ["public/.well-known/mcp.json", "public/.well-known/mcp/server-card.json", "public/mcp/server-card"]) {
    const card = JSON.parse(readFileSync(path, "utf8"));
    expect(card.name).toBe(AGENT_SERVER_INFO.name);
    expect(card.version).toBe(AGENT_SERVER_INFO.version);
    expect(card.remotes[0].type).toBe("streamable-http");
    expect(card.remotes[0].supportedProtocolVersions).toEqual(MCP_PROTOCOL_VERSIONS);
    expect(new URL(card.remotes[0].url).pathname).toBe("/mcp");
  }
});

test("A2A discovery interfaces match the implemented protocol and endpoint", () => {
  const card = JSON.parse(readFileSync("public/.well-known/agent-card.json", "utf8"));
  expect(card.supportedInterfaces).toEqual([{
    url: card.url, protocolBinding: card.preferredTransport, protocolVersion: card.protocolVersion,
  }]);
  expect(card.protocolVersion).toBe("0.3.0");
});

test("ARD catalog identifies the host and every public capability with resolvable artifacts", () => {
  const catalog = JSON.parse(readFileSync("public/.well-known/ai-catalog.json", "utf8"));
  expect(catalog.specVersion).toBe("1.0");
  expect(catalog.host).toEqual({ displayName: "The Vibe Company", identifier: "did:web:www.thevibecompany.co" });
  expect(catalog.entries).toHaveLength(3);
  expect(new Set(catalog.entries.map((entry: { identifier: string }) => entry.identifier)).size).toBe(3);
  expect(catalog.entries.map((entry: { url: string }) => new URL(entry.url).pathname).sort()).toEqual([
    "/.well-known/agent-card.json", "/.well-known/agent-skills/index.json", "/.well-known/mcp/server-card.json",
  ]);
  for (const entry of catalog.entries) {
    expect(entry.identifier).toMatch(/^urn:air:www\.thevibecompany\.co:[a-z0-9-]+:[a-z0-9-]+$/);
    expect(entry.displayName.length).toBeGreaterThan(0);
    expect(entry.type).toMatch(/^application\/[a-z0-9.+-]+$/);
    expect(Number("url" in entry) + Number("data" in entry)).toBe(1);
    expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
    expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    expect(new URL(entry.url).origin).toBe("https://www.thevibecompany.co");
    expect(JSON.parse(readFileSync(`public${new URL(entry.url).pathname}`, "utf8"))).toBeTruthy();
  }
  expect(catalog.entries[1].type).toBe("application/a2a-agent-card+json");
});

test("Poppy is website-only and auth.md documents anonymous access without a fictitious issuer", () => {
  const poppy = JSON.parse(readFileSync("public/.well-known/poppy.json", "utf8"));
  expect(poppy).toEqual({ protocol_version: "0.1", organization: { name: "The Vibe Company", domain: "thevibecompany.co" }, web: {} });
  const auth = readFileSync("public/auth.md", "utf8");
  expect(auth).toMatch(/^# .*auth\.md$/m);
  expect(auth).toContain("Audience: AI agents");
  expect(auth).toContain("Registration/provisioning endpoint: none required");
  expect(auth).toContain("Anonymous/no-auth public access only");
  expect(auth).toContain("Do not send credentials");
  expect(auth).not.toMatch(/agent_auth|register_uri|authorization_endpoint|token_endpoint/);
});
