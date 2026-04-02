import { AllResourcesSplitView } from "@/components/resources/AllResourcesSplitView";
import { getNavContentTypes } from "@/lib/content-types";
import { getContentByType, getContentCounts } from "@/lib/content-source";
import { RESOURCE_ICONS } from "@/lib/resource-icons";
import { resourcesTheme } from "@/lib/resources-theme";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Vibe Learning",
  description:
    "Learnings and articles from The Vibe Company.",
};

export default async function ResourcesPage() {
  const dailyContent = getContentByType("daily");
  const nonDailyContent = getContentByType("article");
  const counts = getContentCounts();

  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.urlSlug}`,
    slug: ct.slug,
  }));

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
            Learnings for quick notes. Articles for the longer version.
          </p>
        </div>
      </section>

      <AllResourcesSplitView
        dailyItems={JSON.parse(JSON.stringify(dailyContent))}
        resourceItems={JSON.parse(JSON.stringify(nonDailyContent))}
        typeNavLinks={typeNavLinks}
        counts={counts}
      />
    </main>
  );
}
