import { TypeListingClient } from "@/components/resources/TypeListingClient";
import type { ContentTypeConfig } from "@/lib/content-types";
import { getNavContentTypes } from "@/lib/content-types";
import { RESOURCE_ICONS } from "@/lib/resource-icons";
import { resourcesTheme } from "@/lib/resources-theme";
import { getDomains } from "@/lib/taxonomy";
import config from "@payload-config";
import type { Metadata } from "next";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Resources | Vibe Learning",
  description:
    "Daily learnings, tutorials, and raw build logs. Everything we know about shipping with AI.",
};

/** Synthetic content type config for the "All" view */
const ALL_CONTENT_TYPE: ContentTypeConfig = {
  slug: "all",
  urlSlug: "all",
  collection: "content",
  name: "All Resources",
  singularLabel: "Resource",
  pluralLabel: "All Resources",
  description: "Everything we know about shipping with AI.",
  renderStyle: "grid",
  prependDateToSlug: false,
  sortOrder: 0,
  showInNav: false,
};

export default async function ResourcesPage() {
  const [allDomains, payload] = await Promise.all([
    getDomains(),
    getPayload({ config }),
  ]);

  const [content, toolsCount] = await Promise.all([
    payload.find({
      collection: "content",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 200,
      depth: 1,
      select: {
        title: true,
        summary: true,
        type: true,
        slug: true,
        domain: true,
        publishedAt: true,
        featuredImage: true,
      } as { [k: string]: true },
    }),
    payload.count({
      collection: "tools",
      where: { status: { equals: "published" } },
    }),
  ]);

  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.urlSlug}`,
    slug: ct.slug,
  }));

  // Compute per-type counts from fetched items
  const counts: Record<string, number> = {};
  for (const item of content.docs) {
    const t = item.type as string;
    counts[t] = (counts[t] || 0) + 1;
  }
  counts["tools"] = toolsCount.totalDocs;

  const domainOptions = allDomains.map((d) => ({
    slug: d.slug,
    shortLabel: d.shortLabel,
    color: d.color,
    colorDark: d.colorDark,
    id: d.id,
  }));

  return (
    <main className="pt-14">
      {/* Header — matches [type]/page.tsx structure */}
      <section
        className={`${resourcesTheme.section.padding} pt-20 pb-8 border-b border-res-border mb-8`}
      >
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Resources
          </span>
          <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            {RESOURCE_ICONS.all && (
              <RESOURCE_ICONS.all
                size={36}
                strokeWidth={1.5}
                className="shrink-0"
              />
            )}
            All Resources
          </h1>
          <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
            Everything we know about shipping with AI.
          </p>
        </div>
      </section>

      <TypeListingClient
        contentType={ALL_CONTENT_TYPE}
        items={JSON.parse(JSON.stringify(content.docs))}
        domains={domainOptions}
        typeNavLinks={typeNavLinks}
        counts={counts}
      />
    </main>
  );
}
