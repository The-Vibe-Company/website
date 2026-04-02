import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content-source";
import { getUrlSlugForDbType } from "@/lib/content-types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thevibecompany.com";
  const contentRoutes = getAllContent().map((item) => ({
    url: `${baseUrl}/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/learnings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...contentRoutes,
  ];
}
