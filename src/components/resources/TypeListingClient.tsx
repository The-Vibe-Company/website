'use client';

import { Suspense } from 'react';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { DailyLearningFeed } from '@/components/resources/DailyLearningFeed';
import { ToolCard } from '@/components/resources/ToolCard';
import { TypeNav } from '@/components/resources/TypeNav';
import { resourcesTheme } from '@/lib/resources-theme';
import type { ContentTypeConfig } from '@/lib/content-types';

interface ContentItem {
  id: string;
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: unknown;
  publishedAt?: string | null;
  body?: unknown;
  featuredImage?: { url: string; alt?: string; sizes?: { card?: { url: string } } } | string | number | null;
  // Tool-specific fields
  logo?: { url: string; alt?: string } | null;
  category?: string[] | null;
  pricing?: string | null;
  rating?: number | null;
  costPerMonth?: number | null;
  licensesCount?: number | null;
  leverageScore?: number | null;
}

interface TypeNavLink {
  label: string;
  href: string;
  slug: string;
}

interface TypeListingClientProps {
  contentType: ContentTypeConfig;
  items: ContentItem[];
  typeNavLinks: TypeNavLink[];
  counts?: Record<string, number>;
}

function TypeListingInner({ contentType, items, typeNavLinks, counts }: TypeListingClientProps) {
  const isTimeline = contentType.renderStyle === 'timeline';
  const isTools = contentType.collection === 'tools';
  const isArticles = contentType.slug === 'article';

  return (
    <>
      <section className={`${resourcesTheme.section.padding} mb-6`}>
        <TypeNav types={typeNavLinks} counts={counts} />
      </section>

      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {items.length > 0 ? (
          isTimeline ? (
            <DailyLearningFeed
              items={items}
              titleClassName="text-3xl md:text-4xl font-bold tracking-tight text-res-text leading-[1.05]"
              itemClassName="py-8 border-b border-res-border/70 last:border-b-0"
            />
          ) : isTools ? (
            <ContentGrid columns={3}>
              {items.map((item) => (
                <ToolCard
                  key={item.id}
                  name={item.title}
                  slug={item.slug}
                  description={item.summary}
                  logo={item.logo}
                  category={item.category}
                  domain={item.domain}
                  pricing={item.pricing}
                  rating={item.rating}
                  costPerMonth={item.costPerMonth}
                  licensesCount={item.licensesCount}
                  leverageScore={item.leverageScore}
                />
              ))}
            </ContentGrid>
          ) : isArticles ? (
            <div className="space-y-8">
              {items.map((item) => (
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
            <ContentGrid columns={2}>
              {items.map((item) => (
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
            </ContentGrid>
          )
        ) : (
          <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
            <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              No {contentType.pluralLabel.toLowerCase()} yet
            </p>
            <p className="text-sm text-res-text-muted mt-2">
              Content is on its way. Check back soon.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export function TypeListingClient(props: TypeListingClientProps) {
  return (
    <Suspense fallback={null}>
      <TypeListingInner {...props} />
    </Suspense>
  );
}
