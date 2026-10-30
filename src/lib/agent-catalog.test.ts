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
