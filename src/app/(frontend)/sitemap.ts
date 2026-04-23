import type { MetadataRoute } from "next";
import { getAllContent, getContentByType } from "@/lib/content-source";
import { getNavContentTypes, getUrlSlugForDbType } from "@/lib/content-types";
import { absoluteUrl, INDEXABLE_STATIC_ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const allContent = getAllContent();
  const latestContentDate = allContent[0]?.publishedAt
    ? new Date(allContent[0].publishedAt)
    : now;

  const staticRoutes = INDEXABLE_STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.path.startsWith("/resources")
      ? latestContentDate
      : now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const contentTypeRoutes = getNavContentTypes().map((contentType) => {
    const latestTypeContent = getContentByType(contentType.slug)[0]?.publishedAt;

    return {
      url: absoluteUrl(`/resources/${contentType.urlSlug}`),
      lastModified: latestTypeContent ? new Date(latestTypeContent) : latestContentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  const contentRoutes = allContent.map((item) => ({
    url: absoluteUrl(`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`),
    lastModified: new Date(item.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...contentTypeRoutes,
    ...contentRoutes,
  ];
}
