import { buildLlmsTxt } from "@/lib/llms";
import { contentPath, getCanonicalContentForLanguage, getContentItem } from "@/lib/content-source";
import { localizedUrl } from "@/lib/site";
import { AGENT_LINK_HEADER } from "@/lib/agent-discovery";

// Markdown has its own cache entry; HTML pages retain their existing SSG/ISR.
export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    Link: AGENT_LINK_HEADER,
  };
  if (path.length === 0 || (path.length === 1 && ["fr", "en"].includes(path[0]))) {
    return new Response(buildLlmsTxt(), { headers });
  }

  const [locale, resources, type, slug] = path;
  if (path.length !== 4 || (locale !== "fr" && locale !== "en") ||
      resources !== "resources" || type !== "articles") {
    return new Response("Not found\n", { status: 404, headers });
  }
  const item = getContentItem("article", slug);
  if (!item) return new Response("Not found\n", { status: 404, headers });

  // Match the HTML page's translation/canonical redirects exactly.
  const target = getCanonicalContentForLanguage("article", slug, locale) ?? item;
  if (target.slug !== item.slug || target.language !== locale) {
    return new Response(null, {
      status: 308,
      headers: { ...headers, Location: localizedUrl(target.language, contentPath(target)) },
    });
  }
  const canonical = localizedUrl(item.language, contentPath(item));
  const body = `# ${item.title}\n\n${item.summary}\n\nSource: ${canonical}\nLanguage: ${item.language}\nPublished: ${item.publishedAt}\n\n${item.body}\n`;
  return new Response(body, { headers: { ...headers, "Content-Location": canonical } });
}
