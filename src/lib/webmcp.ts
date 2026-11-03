/** Browser-only, optional WebMCP integration. No content is fetched until execution. */
export type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: true };
  execute: (input: Record<string, unknown>, client?: { signal?: AbortSignal }) => Promise<unknown>;
};

type ModelContext = {
  registerTool: (tool: WebMcpTool, options: { signal: AbortSignal }) => void | Promise<unknown>;
};

type ModelContextHost = { modelContext?: ModelContext };
const localeSchema = { type: "string", enum: ["fr", "en"], description: "Article language (defaults to the page language)." };

export function registerWebMcpTools(documentHost: ModelContextHost, navigatorHost: ModelContextHost, pageLocale: string) {
  const context = documentHost.modelContext ?? navigatorHost.modelContext;
  if (typeof context?.registerTool !== "function") return () => {};
  const controller = new AbortController();
  const locale = (input: Record<string, unknown>) => {
    const value = input.locale ?? (pageLocale === "fr" ? "fr" : "en");
    if (value !== "fr" && value !== "en") throw new Error("Invalid locale");
    return value;
  };
  const signal = (client?: { signal?: AbortSignal }) => client?.signal
    ? AbortSignal.any([controller.signal, client.signal]) : controller.signal;
  async function callTool(name: string, args: Record<string, unknown>, client?: { signal?: AbortSignal }) {
    const response = await fetch("/mcp", {
      method: "POST", credentials: "omit", signal: signal(client),
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error(`Public content unavailable (${response.status})`);
    const payload = await response.json();
    if (payload.error || payload.result?.isError || !payload.result?.structuredContent) throw new Error("Public content unavailable");
    return payload.result.structuredContent;
  }
  const tools: WebMcpTool[] = [
    {
      name: "list_articles",
      description: "List public The Vibe Company articles with canonical URLs, optionally filtered by locale. Read-only; no account required.",
      inputSchema: { type: "object", properties: { locale: localeSchema }, additionalProperties: false },
      annotations: { readOnlyHint: true },
      async execute(input, client) {
        return callTool("list_articles", { language: locale(input), limit: 50 }, client);
      },
    },
    {
      name: "read_article",
      description: "Read a public The Vibe Company article as Markdown using a slug from list_articles. Selects its canonical translation when available.",
      inputSchema: { type: "object", properties: {
        slug: { type: "string", pattern: "^[a-z0-9][a-z0-9-]{0,199}$", maxLength: 200 }, locale: localeSchema,
      }, required: ["slug"], additionalProperties: false },
      annotations: { readOnlyHint: true },
      async execute(input, client) {
        if (typeof input.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,199}$/.test(input.slug)) throw new Error("Invalid article slug");
        // Resolve canonical translations on the server, avoiding cross-origin
        // Markdown redirects from localhost or a deployment preview.
        return callTool("read_article", { slug: input.slug, locale: locale(input) }, client);
      },
    },
    {
      name: "get_booking_link",
      description: "Return The Vibe Company's public booking link. Does not make a booking, navigate, or contact anyone.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      async execute() { return { url: "https://cal.com/stangirard/thevibecompany" }; },
    },
  ];
  for (const tool of tools) {
    // An unsupported/disabled experimental API must never break the page.
    try { void Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {}); }
    catch { /* API unavailable or tool already registered by the browser. */ }
  }
  return () => controller.abort();
}
