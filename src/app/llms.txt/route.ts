import fr from "../../../messages/fr.json";
import en from "../../../messages/en.json";
import { getCustomers } from "@/lib/customers";
import { getAllContent } from "@/lib/content-source";
import { getNavContentTypes, getUrlSlugForDbType } from "@/lib/content-types";
import {
  absoluteUrl,
  INDEXABLE_SPLIT_PATH_ROUTES,
  INDEXABLE_STATIC_ROUTES,
  localizedUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  splitPath,
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

// Reuse the exact message fields consumed by each French page's metadata.
// English core entries retain their existing labels and descriptions.
const frenchCoreMetadata: Record<string, { title: string; description: string }> = {
  "/": { title: fr.meta.homeTitle, description: fr.meta.description },
  "/portfolio": { title: fr.portfolio.metaTitle, description: fr.portfolio.metaDescription },
  "/resources": { title: fr.resources.metaTitle, description: fr.resources.subtitle },
  "/a-propos": { title: fr.about.metaTitle, description: fr.about.metaDescription },
  "/agence-ia-paris": { title: fr.agencyParis.metaTitle, description: fr.agencyParis.metaDescription },
  "/agents-ia-securite-produit": { title: fr.hardening.metaTitle, description: fr.hardening.metaDescription },
  "/agents-ia-production": { title: fr.agentsProduction.metaTitle, description: fr.agentsProduction.metaDescription },
  "/ia-sante-hds": { title: fr.healthcareAi.metaTitle, description: fr.healthcareAi.metaDescription },
  "/ia-medias": { title: fr.mediaAi.metaTitle, description: fr.mediaAi.metaDescription },
};

function buildLlmsTxt(): string {
  const content = getAllContent();

  const localizedSections = (["fr", "en"] as const).map((locale) => {
    const corePages = [
      ...INDEXABLE_STATIC_ROUTES,
      ...INDEXABLE_SPLIT_PATH_ROUTES.map((route) => ({
        ...route,
        path: splitPath(route.paths, locale),
      })),
    ].map((route) => {
      const metadata = locale === "fr" ? frenchCoreMetadata[route.path] : route;
      return routeListItem(
        metadata.title,
        localizedUrl(locale, route.path),
        metadata.description,
      );
    });

    const messages = locale === "fr" ? fr : en;
    const caseStudies = [
      `### ${locale === "fr" ? "Cas clients" : "Case studies"}`,
      routeListItem(
        messages.caseStudiesPage.back,
        localizedUrl(locale, "/case-studies"),
        messages.caseStudiesPage.metaDescription,
      ),
      ...getCustomers(locale).map((customer) =>
        routeListItem(
          `${customer.client} · ${messages.caseStudiesPage.back}`,
          localizedUrl(locale, `/case-studies/${customer.slug}`),
          customer.metaDescription,
        ),
      ),
    ].join("\n\n");

    const contentSections = getNavContentTypes()
      .map((contentType) => {
        const items = content.filter(
          (item) => item.type === contentType.slug && item.language === locale,
        );

        if (items.length === 0) return null;

        const links = items.map((item) =>
          routeListItem(
            item.title,
            localizedUrl(
              locale,
              `/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`,
            ),
            item.summary,
          ),
        );

        return [
          `### ${contentType.pluralLabel}`,
          contentType.description,
          "",
          ...links,
        ].join("\n");
      })
      .filter((section): section is string => Boolean(section));

    return [
      `## ${locale === "fr" ? "French" : "English"} canonical URLs`,
      "### Core Pages",
      ...corePages,
      caseStudies,
      ...contentSections,
    ].join("\n\n");
  });

  return [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    "The Vibe Company is an AI-native agency focused on shipping products, internal tools, agent workflows, and practical public writing about building with AI.",
    `Use the canonical URLs below when citing the site. The XML sitemap is available at ${absoluteUrl("/sitemap.xml")}.`,
    ...localizedSections,
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
