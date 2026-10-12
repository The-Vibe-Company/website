import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content-source";
import { getUrlSlugForDbType } from "@/lib/content-types";
import { PROJECT_SLUGS } from "@/lib/projects";
import {
  INDEXABLE_SPLIT_PATH_ROUTES,
  INDEXABLE_STATIC_ROUTES,
  localizedUrl,
  monolingualAlternates,
  splitPath,
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
      languages: {
        fr: localizedUrl("fr", path),
        en: localizedUrl("en", path),
      },
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
      languages: {
        fr: localizedUrl("fr", paths.fr),
        en: localizedUrl("en", paths.en),
      },
    },
    ...extra,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const allContent = getAllContent();
  const latestContentDate = allContent[0]?.publishedAt
    ? new Date(allContent[0].publishedAt)
    : now;

  const staticRoutes = INDEXABLE_STATIC_ROUTES.flatMap((route) =>
    entries(route.path, {
      lastModified: route.path.startsWith("/resources") ? latestContentDate : now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  const splitPathRoutes = INDEXABLE_SPLIT_PATH_ROUTES.flatMap((route) =>
    splitEntries(route.paths, {
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  // `/resources/[type]` routes redirect to the resources hub, so only emit
  // the hub and actual content detail pages as indexable sitemap entries.
  const contentRoutes = allContent.map((item) => {
    const path = `/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`;
    const publication = monolingualAlternates(item.language, path);

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
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // Case studies intentionally remain absent until client publication approval.
  return [
    ...staticRoutes,
    ...splitPathRoutes,
    ...portfolioRoutes,
    ...contentRoutes,
  ];
}
