import { contentPath, getCanonicalContentForLanguage, getContentItem, getContentByType } from "@/lib/content-source";
import { localizedUrl } from "@/lib/site";

export const AGENT_SERVER_INFO = { name: "co.thevibecompany/public-content", version: "1.0.0" };
export const MCP_PROTOCOL_VERSIONS = ["2025-06-18"];
export const PUBLIC_BOOKING_URL = "https://cal.com/stangirard/thevibecompany";

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
export const PUBLIC_TOOLS = [
  {
    name: "list_articles",
    description: "List or search TVC's public articles, with canonical URLs. No private content.",
    inputSchema: { type: "object", properties: {
      query: { type: "string", maxLength: 500 },
      language: { type: "string", enum: ["fr", "en"] },
      limit: { type: "integer", minimum: 1, maximum: 50 },
      offset: { type: "integer", minimum: 0 },
    }, additionalProperties: false },
    annotations,
  },
  {
    name: "read_article",
    description: "Read a public TVC article as Markdown, using a slug from list_articles. Optionally select its canonical translation by locale.",
    inputSchema: { type: "object", properties: { slug: { type: "string", minLength: 1, maxLength: 200 }, locale: { type: "string", enum: ["fr", "en"] } }, required: ["slug"], additionalProperties: false },
    annotations,
  },
  {
    name: "get_booking_link",
    description: "Return TVC's public Cal.com link. Does not create a booking or contact anyone.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations,
  },
];

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Operates exclusively on the same checked-in public content used by the site. */
export function callPublicTool(name: string, value: unknown = {}) {
  if (!object(value)) throw new Error("Arguments must be an object");
  const allowed = name === "list_articles" ? ["query", "language", "limit", "offset"] : name === "read_article" ? ["slug", "locale"] : [];
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error("Unknown argument");
  if (name === "get_booking_link") return { url: PUBLIC_BOOKING_URL };
  if (name === "list_articles") {
    const { query = "", language, limit = 20, offset = 0 } = value;
    if (typeof query !== "string" || query.length > 500 ||
        (language !== undefined && language !== "fr" && language !== "en") ||
        typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 50 ||
        typeof offset !== "number" || !Number.isSafeInteger(offset) || offset < 0) {
      throw new Error("Invalid query, language, limit or offset");
    }
    const matches = getContentByType("article").filter((item) =>
      (!language || item.language === language) &&
      `${item.title}\n${item.summary}\n${item.body}`.toLowerCase().includes(query.toLowerCase()),
    );
    return {
      articles: matches.slice(offset, offset + limit).map((item) => ({
        slug: item.slug, title: item.title, summary: item.summary, language: item.language,
        publishedAt: item.publishedAt, url: localizedUrl(item.language, contentPath(item)),
      })),
      total: matches.length,
      nextOffset: offset + limit < matches.length ? offset + limit : null,
    };
  }
  if (name === "read_article") {
    if (typeof value.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,199}$/.test(value.slug)) throw new Error("Invalid article slug");
    if (value.locale !== undefined && value.locale !== "fr" && value.locale !== "en") throw new Error("Invalid locale");
    const item = value.locale
      ? getCanonicalContentForLanguage("article", value.slug, value.locale)
      : getContentItem("article", value.slug);
    if (!item) throw new Error("Public article not found");
    return {
      slug: item.slug, title: item.title, language: item.language,
      url: localizedUrl(item.language, contentPath(item)),
      markdown: `# ${item.title}\n\n${item.summary}\n\n${item.body}\n`,
    };
  }
  throw new Error("Unknown tool");
}
