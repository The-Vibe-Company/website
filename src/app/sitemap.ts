import type { MetadataRoute } from "next";
import { getAllContent, getContentByType } from "@/lib/content-source";
import { getNavContentTypes, getUrlSlugForDbType } from "@/lib/content-types";
import { absoluteUrl, INDEXABLE_STATIC_ROUTES } from "@/lib/site";

type Extra = Omit<MetadataRoute.Sitemap[number], "url" | "alternates">;

// Every page lives under a language prefix now (/fr/... and /en/...). Emit the
// French URL as the canonical one and declare both languages as alternates.
function entry(path: string, extra: Extra): MetadataRoute.Sitemap[number] {
  const p = path === "/" ? "" : path;
  return {
    url: absoluteUrl(`/fr${p}`),
    alternates: {
      languages: {
        fr: absoluteUrl(`/fr${p}`),
        en: absoluteUrl(`/en${p}`),
      },
    },
    ...extra,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const allContent = getAllContent();
  const latestContentDate = allContent[0]?.publishedAt
    ? new Date(allContent[0].publishedAt)
    : now;

  const staticRoutes = INDEXABLE_STATIC_ROUTES.map((route) =>
    entry(route.path, {
      lastModified: route.path.startsWith("/resources") ? latestContentDate : now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  const contentTypeRoutes = getNavContentTypes().map((contentType) => {
    const latestTypeContent = getContentByType(contentType.slug)[0]?.publishedAt;
    return entry(`/resources/${contentType.urlSlug}`, {
      lastModified: latestTypeContent ? new Date(latestTypeContent) : latestContentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
  });

  const contentRoutes = allContent.map((item) =>
    entry(`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`, {
      lastModified: new Date(item.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticRoutes, ...contentTypeRoutes, ...contentRoutes];
}
