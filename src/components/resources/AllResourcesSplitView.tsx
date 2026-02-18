'use client';

import { ContentCard } from '@/components/resources/ContentCard';
import { DailyLearningFeed } from '@/components/resources/DailyLearningFeed';
import { TypeNav } from '@/components/resources/TypeNav';
import { resourcesTheme } from '@/lib/resources-theme';

interface DailyLearningItem {
  id: string;
  title: string;
  summary?: string | null;
  body?: unknown;
  publishedAt?: string | null;
}

interface ResourceItem {
  id: string;
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: unknown;
  publishedAt?: string | null;
  featuredImage?: { url: string; alt?: string; sizes?: { card?: { url: string } } } | string | number | null;
}

interface AllResourcesSplitViewProps {
  dailyItems: DailyLearningItem[];
  resourceItems: ResourceItem[];
  typeNavLinks: TypeNavLink[];
  counts?: Record<string, number>;
}

interface TypeNavLink {
  label: string;
  href: string;
  slug: string;
}

export function AllResourcesSplitView({
  dailyItems,
  resourceItems,
  typeNavLinks,
  counts,
}: AllResourcesSplitViewProps) {
  return (
    <>
      <section className={`${resourcesTheme.section.padding} mb-6`}>
        <TypeNav types={typeNavLinks} counts={counts} />
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <section className="lg:col-span-8">
            {resourceItems.length > 0 ? (
              <div className="space-y-8">
                {resourceItems.map((item) => (
                  <ContentCard
                    key={item.id}
                    title={item.title}
                    summary={item.summary}
                    type={item.type}
                    slug={item.slug}
                    domain={item.domain}
                    publishedAt={item.publishedAt ?? undefined}
                    featuredImage={item.featuredImage}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-sm text-res-text-muted">
                No other resources yet.
              </div>
            )}
          </section>

          <aside className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-res-border/70">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted">
              Daily Learning Feed
            </p>

            <div className="mt-4 max-h-[45vh] lg:max-h-[calc(100vh-15rem)] overflow-y-auto pr-2">
              <DailyLearningFeed
                items={dailyItems}
                titleClassName="text-xl font-bold tracking-tight text-res-text leading-tight"
                itemClassName="py-5 border-b border-res-border/70 last:border-b-0"
                emptyClassName="py-6 text-sm text-res-text-muted"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
