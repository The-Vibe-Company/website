import { getAllContent } from "@/lib/content-source";
import { getNavContentTypes, getUrlSlugForDbType } from "@/lib/content-types";
import {
  absoluteUrl,
  INDEXABLE_STATIC_ROUTES,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";

export const dynamic = "force-static";

function cleanMarkdownText(value: string): string {
  return value
    .replace(/\*\*/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeLinkText(value: string): string {
  return value.replace(/[[\]]/g, "\\$&");
}

function routeListItem(title: string, url: string, description?: string): string {
  const suffix = description ? `: ${cleanMarkdownText(description)}` : "";
  return `- [${escapeLinkText(title)}](${url})${suffix}`;
}

function buildLlmsTxt(): string {
  const content = getAllContent();

  const corePages = INDEXABLE_STATIC_ROUTES.map((route) =>
    routeListItem(route.title, absoluteUrl(route.path), route.description),
  );

  const contentSections = getNavContentTypes()
    .map((contentType) => {
      const items = content.filter((item) => item.type === contentType.slug);

      if (items.length === 0) return null;

      const links = items.map((item) =>
        routeListItem(
          item.title,
          absoluteUrl(
            `/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`,
          ),
          item.summary,
        ),
      );

      return [
        `## ${contentType.pluralLabel}`,
        contentType.description,
        "",
        ...links,
      ].join("\n");
    })
    .filter((section): section is string => Boolean(section));

  return [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    "The Vibe Company is an AI-native agency focused on shipping products, internal tools, agent workflows, and practical public writing about building with AI.",
    `Use the canonical URLs below when citing the site. The XML sitemap is available at ${absoluteUrl("/sitemap.xml")}.`,
    "## Core Pages",
    ...corePages,
    ...contentSections,
  ].join("\n\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
