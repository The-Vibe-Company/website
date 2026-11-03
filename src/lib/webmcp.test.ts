import { afterEach, describe, expect, mock, test } from "bun:test";
import { registerWebMcpTools, type WebMcpTool } from "./webmcp";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

function setup(host: "document" | "navigator" = "document", pageLocale = "en") {
  const tools: WebMcpTool[] = [];
  const signals: AbortSignal[] = [];
  const context = { registerTool(tool: WebMcpTool, options: { signal: AbortSignal }) {
    tools.push(tool); signals.push(options.signal);
  } };
  const cleanup = registerWebMcpTools(host === "document" ? { modelContext: context } : {}, { modelContext: context }, pageLocale);
  return { tools, signals, cleanup };
}

// These tests exercise public transport, experimental API lifecycle and failure handling.
describe("optional browser tools", () => {
  test("absent API is a no-op; document takes precedence and navigator is supported", () => {
    expect(() => registerWebMcpTools({}, {}, "en")()).not.toThrow();
    for (const host of ["document", "navigator"] as const) {
      const { tools, signals, cleanup } = setup(host);
      expect(tools.map((tool) => tool.name)).toEqual(["list_articles", "read_article", "get_booking_link"]);
      expect(tools.every((tool) => tool.annotations.readOnlyHint)).toBe(true);
      expect(signals.every((signal) => !signal.aborted)).toBe(true);
      cleanup();
      expect(signals.every((signal) => signal.aborted)).toBe(true);
    }
    const fallback = mock(() => {});
    registerWebMcpTools({ modelContext: { registerTool() {} } }, { modelContext: { registerTool: fallback } }, "en")();
    expect(fallback).not.toHaveBeenCalled();
  });

  test("failed experimental registrations do not break the page", async () => {
    expect(() => registerWebMcpTools({ modelContext: { registerTool() { throw new Error("Unavailable"); } } }, {}, "en")()).not.toThrow();
    const cleanup = registerWebMcpTools({ modelContext: { registerTool() { return Promise.reject(new Error("Disabled")); } } }, {}, "en");
    await Promise.resolve();
    cleanup();
  });

  test("list fetches public MCP only on execution, omits credentials and propagates cancellation", async () => {
    const fetchMock = mock(async () => Response.json({ result: { structuredContent: { articles: [], total: 0 } } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { tools, cleanup } = setup("document", "fr");
    expect(fetchMock).not.toHaveBeenCalled();
    const agent = new AbortController();
    expect(await tools[0].execute({}, { signal: agent.signal })).toEqual({ articles: [], total: 0 });
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/mcp");
    expect(options.credentials).toBe("omit");
    expect(JSON.parse(options.body as string).params.arguments).toEqual({ language: "fr", limit: 50 });
    agent.abort();
    expect(options.signal?.aborted).toBe(true);
    cleanup();
  });

  test("read uses same-origin MCP with locale and validates slugs before fetching", async () => {
    const fetchMock = mock(async () => Response.json({ result: { structuredContent: { markdown: "# Public article" } } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { tools, cleanup } = setup();
    expect(await tools[1].execute({ slug: "public-article", locale: "fr" })).toEqual({ markdown: "# Public article" });
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/mcp");
    expect(JSON.parse(options.body as string).params).toEqual({ name: "read_article", arguments: { slug: "public-article", locale: "fr" } });
    expect(options.credentials).toBe("omit");
    expect(options.headers).toEqual({ "Content-Type": "application/json", Accept: "application/json, text/event-stream" });
    cleanup();
    expect(options.signal?.aborted).toBe(true);
    for (const slug of ["../private", "https://example.com", "article?token=x", ""]) {
      await expect(tools[1].execute({ slug })).rejects.toThrow("Invalid article slug");
    }
    await expect(tools[1].execute({ slug: "public-article", locale: "de" })).rejects.toThrow("Invalid locale");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("tools surface unavailable resources and never return HTML as article content", async () => {
    const { tools, cleanup } = setup();
    globalThis.fetch = mock(async () => new Response("Not found", { status: 404 })) as unknown as typeof fetch;
    await expect(tools[0].execute({})).rejects.toThrow("Public content unavailable (404)");
    await expect(tools[1].execute({ slug: "missing" })).rejects.toThrow("Public content unavailable");
    globalThis.fetch = mock(async () => new Response("<html>fallback</html>", { headers: { "Content-Type": "text/html" } })) as unknown as typeof fetch;
    await expect(tools[1].execute({ slug: "missing" })).rejects.toThrow("Public content unavailable");
    globalThis.fetch = mock(async () => Response.json({ result: { isError: true } })) as unknown as typeof fetch;
    await expect(tools[0].execute({})).rejects.toThrow("Public content unavailable");
    cleanup();
  });

  test("booking returns the exact public link without network requests or navigation", async () => {
    const fetchMock = mock(async () => new Response());
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { tools, cleanup } = setup();
    expect(await tools[2].execute({})).toEqual({ url: "https://cal.com/stangirard/thevibecompany" });
    expect(fetchMock).not.toHaveBeenCalled();
    cleanup();
  });
});
