import type { MetadataRoute } from "next";
import { CUSTOMER_SLUGS, getCustomer } from "@/lib/customers";
import {
  contentPath,
  getAllContent,
  getContentTranslations,
} from "@/lib/content-source";
import { PROJECT_SLUGS } from "@/lib/projects";
import {
  CASE_STUDIES_INDEX_LASTMOD,
  customerLastmod,
  HOME_LASTMOD,
  lastmodDate,
  PORTFOLIO_INDEX_LASTMOD,
  projectLastmod,
  splitPathLastmod,
} from "@/lib/sitemap-lastmod";
import {
  contentAlternates,
  INDEXABLE_SPLIT_PATH_ROUTES,
  INDEXABLE_STATIC_ROUTES,
  localizedLanguages,
  localizedUrl,
  splitPath,
  splitPathLanguages,
  type SplitPaths,
} from "@/lib/site";

type Extra = Omit<MetadataRoute.Sitemap[number], "url" | "alternates">;

const LOCALES = ["fr", "en"] as const;

// Each localized canonical gets its own sitemap entry. Both entries carry the
// same self-inclusive hreflang set, as required for reciprocal alternates.
function entries(path: string, extra: Extra): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: localizedUrl(locale, path),
    alternates: {
      languages: localizedLanguages(path),
    },
    ...extra,
  }));
}

// Same as `entries`, for a page whose URL segment is translated: each language
// gets its own canonical, and both carry the same self-inclusive hreflang set.
function splitEntries(paths: SplitPaths, extra: Extra): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: localizedUrl(locale, splitPath(paths, locale)),
    alternates: {
      languages: splitPathLanguages(paths),
    },
    ...extra,
  }));
}

// `lastModified` for a static route not driven by its own content source.
function staticLastmod(path: string, latestContentDate: Date): Date {
  if (path.startsWith("/resources")) return latestContentDate;
  if (path === "/") return lastmodDate(HOME_LASTMOD);
  if (path === "/portfolio") return lastmodDate(PORTFOLIO_INDEX_LASTMOD);
  throw new Error(`sitemap: no lastmod for static route "${path}"`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const allContent = getAllContent();
  const latestContentDate = allContent[0]?.publishedAt
    ? new Date(allContent[0].publishedAt)
    : lastmodDate(HOME_LASTMOD);

  const staticRoutes = INDEXABLE_STATIC_ROUTES.flatMap((route) =>
    entries(route.path, {
      lastModified: staticLastmod(route.path, latestContentDate),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  const splitPathRoutes = INDEXABLE_SPLIT_PATH_ROUTES.flatMap((route) =>
    splitEntries(route.paths, {
      lastModified: splitPathLastmod(route.paths.fr),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  // `/resources/[type]` routes redirect to the resources hub, so only emit
  // the hub and actual content detail pages as indexable sitemap entries.
  const contentRoutes = allContent.map((item) => {
    // A translated article keeps one entry per language version, each canonical
    // on its own URL and declaring the other through hreflang.
    const versions = getContentTranslations(item.type, item.slug).map((version) => ({
      language: version.language,
      path: contentPath(version),
    }));
    const publication = contentAlternates(item.language, contentPath(item), versions);

    return {
      url: publication.canonical,
      alternates: { languages: publication.languages },
      lastModified: new Date(item.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const portfolioRoutes = PROJECT_SLUGS.flatMap((slug) =>
    entries(`/portfolio/${slug}`, {
      lastModified: projectLastmod(slug),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // Case studies use the route's customer source and FR/EN-only alternates.
  const caseStudyRoutes = [
    ...entries("/case-studies", {
      lastModified: lastmodDate(CASE_STUDIES_INDEX_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...CUSTOMER_SLUGS.flatMap((slug) =>
      entries(`/case-studies/${slug}`, {
        lastModified: customerLastmod(slug),
        changeFrequency: "monthly",
        priority: 0.7,
      }).filter((_, index) => getCustomer(slug, LOCALES[index]))
    ),
  ];

  return [
    ...staticRoutes,
    ...splitPathRoutes,
    ...portfolioRoutes,
    ...contentRoutes,
    ...caseStudyRoutes,
  ];
}
