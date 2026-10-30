import { describe, expect, test } from "bun:test";
import { getContentByType } from "@/lib/content-source";
import { GET, OPTIONS, POST } from "./route";

const rpc = (body: unknown, headers: Record<string, string> = {}) => POST(new Request("https://www.thevibecompany.co/mcp", {
  method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers },
  body: JSON.stringify(body),
}));
const call = (name: string, args: unknown = {}) => rpc({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name, arguments: args } });

describe("public read-only MCP", () => {
  test("initialize, notification and ping support stateless clients", async () => {
    const init = await rpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: {
      protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" },
    } });
    expect((await init.json()).result.protocolVersion).toBe("2025-06-18");
    expect(init.headers.get("mcp-session-id")).toBeNull();
    expect((await rpc({ jsonrpc: "2.0", method: "notifications/initialized" })).status).toBe(202);
    expect((await (await rpc({ jsonrpc: "2.0", id: 2, method: "ping" })).json()).result).toEqual({});
  });

  test("tool discovery advertises only read-only operations", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" })).json();
    expect(result.tools.map((tool: { name: string }) => tool.name)).toEqual(["list_articles", "read_article", "get_booking_link"]);
    expect(result.tools.every((tool: { annotations: { readOnlyHint: boolean } }) => tool.annotations.readOnlyHint)).toBe(true);
  });

  test("listing paginates public content and reading returns actual Markdown", async () => {
    const list = (await (await call("list_articles", { language: "fr", limit: 1 })).json()).result.structuredContent;
    expect(list.articles).toHaveLength(1);
    expect(list.articles[0].language).toBe("fr");
    expect(list.nextOffset).toBe(1);
    const item = getContentByType("article").find((item) => item.slug === list.articles[0].slug)!;
    const read = (await (await call("read_article", { slug: item.slug })).json()).result;
    expect(read.isError).toBe(false);
    expect(read.structuredContent.markdown).toContain(item.body);
    expect((await (await call("get_booking_link")).json()).result.structuredContent.url).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test("bad input cannot traverse files, fetch URLs, read skills or execute writes", async () => {
    for (const args of [{ slug: "../../.env.local" }, { slug: "https://example.com" }, { slug: "does-not-exist" }, { slug: "example", path: ".env" }]) {
      expect((await (await call("read_article", args)).json()).result.isError).toBe(true);
    }
    for (const args of [{ limit: 5000 }, { offset: -1 }, { query: [] }, { language: "de" }]) {
      expect((await (await call("list_articles", args)).json()).result.isError).toBe(true);
    }
    expect((await (await call("create_booking")).json()).error.code).toBe(-32602);
    expect((await (await rpc({ jsonrpc: "2.0", id: 1, method: "write" })).json()).error.code).toBe(-32601);
  });

  test("validates origin, versions, media types, envelope and actual body size", async () => {
    const body = { jsonrpc: "2.0", id: 1, method: "ping" };
    expect((await rpc(body, { origin: "https://attacker.example" })).status).toBe(403);
    expect((await rpc(body, { origin: "https://www.thevibecompany.co" })).status).toBe(200);
    expect((await rpc(body, { "mcp-protocol-version": "unsupported" })).status).toBe(400);
    expect((await rpc(body, { Accept: "text/html" })).status).toBe(406);
    expect((await rpc(body, { "Content-Type": "text/plain" })).status).toBe(415);
    expect((await rpc([body])).status).toBe(400);
    expect((await rpc({ ...body, params: "invalid" })).status).toBe(400);
    expect((await rpc({ ...body, params: { text: "x".repeat(17000) } })).status).toBe(413);
    expect(GET(new Request("https://www.thevibecompany.co/mcp")).status).toBe(405);
    expect(OPTIONS(new Request("https://www.thevibecompany.co/mcp")).status).toBe(204);
  });
});
