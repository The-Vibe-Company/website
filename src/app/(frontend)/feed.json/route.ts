import { getContentByType, type ContentEntry } from "@/lib/content-source";
import { getUrlSlugForDbType } from "@/lib/content-types";
import { extractCoverImage, normalizeMarkdownBody, renderMarkdown } from "@/lib/markdown";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

interface JsonFeedItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  content_html: string;
  date_published: string;
  image?: string;
  language: string;
  _thevibe: {
    section: "victors-story" | "articles";
  };
}

/** JSON Feed summaries are plain text: strip inline markdown and YAML escapes. */
function toPlainTextSummary(value: string): string {
  return value
    .replace(/\\"/g, '"')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Converts a frontmatter date (usually YYYY-MM-DD) to full ISO 8601. */
function toIsoDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00Z`;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

/**
 * Feed readers have no JS, so the interactive audio widget is useless there.
 * Downgrade `::audio{...}` directives to a plain markdown link before rendering.
 */
function replaceAudioDirectives(markdown: string): string {
  return markdown.replace(/^::audio\{(.+)\}\s*$/gm, (match, attrs: string) => {
    const src = attrs.match(/src="([^"]*)"/)?.[1];
    const title = attrs.match(/title="([^"]*)"/)?.[1];
    if (!src || !title) return "";
    return `[${title} (audio)](${src})`;
  });
}

/** Rewrites root-relative src/href attributes to absolute URLs for feed consumers. */
function absolutizeHtmlUrls(html: string): string {
  return html.replace(/(src|href)="\/(?!\/)/g, (_match, attr: string) => {
    return `${attr}="${absoluteUrl("/")}`;
  });
}

function renderFeedContentHtml(item: ContentEntry): string {
  // Mirror the article page: the cover is dropped from the body (it is exposed
  // separately in the `image` field) and the rest renders with the same engine.
  const { body: bodyWithoutCover } = item.featuredImage?.sourceUrl
    ? extractCoverImage(item.body, item.featuredImage.sourceUrl)
    : { body: item.body };
  const markdown = replaceAudioDirectives(normalizeMarkdownBody(bodyWithoutCover));

  return absolutizeHtmlUrls(renderMarkdown(markdown));
}

function toFeedItem(item: ContentEntry): JsonFeedItem {
  const url = absoluteUrl(`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`);
  const socialImage = item.ogImage ?? item.featuredImage;

  return {
    id: url,
    url,
    title: item.title,
    summary: toPlainTextSummary(item.summary),
    content_html: renderFeedContentHtml(item),
    date_published: toIsoDate(item.publishedAt),
    ...(socialImage?.url ? { image: absoluteUrl(socialImage.url) } : {}),
    language: item.language,
    _thevibe: {
      section: item.series === "victor-story" ? "victors-story" : "articles",
    },
  };
}

function buildFeed() {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    home_page_url: absoluteUrl("/resources"),
    feed_url: absoluteUrl("/feed.json"),
    language: "fr",
    items: getContentByType("article").map(toFeedItem),
  };
}

export function GET() {
  return new Response(JSON.stringify(buildFeed(), null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
