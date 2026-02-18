import { AllResourcesSplitView } from "@/components/resources/AllResourcesSplitView";
import { getNavContentTypes } from "@/lib/content-types";
import { RESOURCE_ICONS } from "@/lib/resource-icons";
import { resourcesTheme } from "@/lib/resources-theme";
import config from "@payload-config";
import type { Metadata } from "next";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Resources | Vibe Learning",
  description:
    "Daily learnings, tutorials, and raw build logs. Everything we know about shipping with AI.",
};

export default async function ResourcesPage() {
  const payload = await getPayload({ config });

  const [dailyContent, nonDailyContent, allContent, toolsCount] = await Promise.all([
    payload.find({
      collection: "content",
      where: {
        status: { equals: "published" },
        type: { equals: "daily" },
      },
      sort: "-publishedAt",
      limit: 200,
      depth: 0,
      select: {
        title: true,
        summary: true,
        body: true,
        publishedAt: true,
      } as { [k: string]: true },
    }),
    payload.find({
      collection: "content",
      where: {
        status: { equals: "published" },
        type: { not_equals: "daily" },
      },
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
    payload.find({
      collection: "content",
      where: { status: { equals: "published" } },
      limit: 0,
      pagination: false,
      depth: 0,
      select: { type: true } as { [k: string]: true },
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

  const counts: Record<string, number> = {};
  for (const item of allContent.docs) {
    const t = item.type as string;
    counts[t] = (counts[t] || 0) + 1;
  }
  counts["tools"] = toolsCount.totalDocs;

  return (
    <main className="pt-12 pb-12">
      {/* Header — matches [type]/page.tsx structure */}
      <section
        className={`${resourcesTheme.section.padding} pt-2 pb-8 border-b border-res-border mb-8`}
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

      <AllResourcesSplitView
        dailyItems={JSON.parse(JSON.stringify(dailyContent.docs))}
        resourceItems={JSON.parse(JSON.stringify(nonDailyContent.docs))}
        typeNavLinks={typeNavLinks}
        counts={counts}
      />
    </main>
  );
}
