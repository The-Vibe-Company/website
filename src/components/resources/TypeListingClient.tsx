'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { DailyCard } from '@/components/resources/DailyCard';
import { DailyDateGroup } from '@/components/resources/DailyDateGroup';
import { FilterBar } from '@/components/resources/FilterBar';
import { ToolCard } from '@/components/resources/ToolCard';
import { TypeNav } from '@/components/resources/TypeNav';
import { resourcesTheme } from '@/lib/resources-theme';
import type { ContentTypeConfig } from '@/lib/content-types';

function getDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

interface ContentItem {
  id: string;
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: unknown;
  publishedAt?: string | null;
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

interface DomainOption {
  slug: string;
  shortLabel: string;
  color: string;
  colorDark?: string | null;
  id: string | number;
}

interface TypeNavLink {
  label: string;
  href: string;
  slug: string;
}

interface TypeListingClientProps {
  contentType: ContentTypeConfig;
  items: ContentItem[];
  domains: DomainOption[];
  typeNavLinks: TypeNavLink[];
  counts?: Record<string, number>;
}

function TypeListingInner({ contentType, items, domains, typeNavLinks, counts }: TypeListingClientProps) {
  const searchParams = useSearchParams();
  const activeDomain = searchParams.get('domain') || '';

  // Filter items client-side by domain
  const filteredItems = activeDomain
    ? items.filter((item) => {
        const domainOption = domains.find((d) => d.slug === activeDomain);
        if (!domainOption) return true;
        const itemDomains = Array.isArray(item.domain) ? item.domain : [];
        const domainId = String(domainOption.id);
        return itemDomains.some((d: unknown) => {
          if (typeof d === 'string' || typeof d === 'number') return String(d) === domainId;
          if (typeof d === 'object' && d !== null && 'id' in d) return String((d as { id: string | number }).id) === domainId;
          return false;
        });
      })
    : items;

  const isTimeline = contentType.renderStyle === 'timeline';
  const isTools = contentType.collection === 'tools';

  const dailyGroups = isTimeline
    ? (() => {
        const groups: Map<string, typeof filteredItems> = new Map();
        for (const item of filteredItems) {
          const label = item.publishedAt ? getDateLabel(item.publishedAt) : 'Undated';
          if (!groups.has(label)) groups.set(label, []);
          groups.get(label)!.push(item);
        }
        return groups;
      })()
    : null;

  // Filter domains to only those referenced by current items
  const usedDomainIds = new Set<string>();
  for (const item of items) {
    const itemDomains = Array.isArray(item.domain) ? item.domain : [];
    for (const d of itemDomains) {
      if (typeof d === 'string' || typeof d === 'number') usedDomainIds.add(String(d));
      else if (typeof d === 'object' && d !== null && 'id' in d) usedDomainIds.add(String((d as { id: string | number }).id));
    }
  }

  const filteredDomains = domains.filter((d) => usedDomainIds.has(String(d.id)));

  const domainOptions = filteredDomains.map((d) => ({
    slug: d.slug,
    shortLabel: d.shortLabel,
    color: d.color,
    colorDark: d.colorDark,
  }));

  return (
    <>
      <section className={`${resourcesTheme.section.padding} mb-12 space-y-6`}>
        <TypeNav types={typeNavLinks} counts={counts} />
        <FilterBar domains={domainOptions} />
      </section>

      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {filteredItems.length > 0 ? (
          isTimeline && dailyGroups ? (
            <div>
              {Array.from(dailyGroups).map(([dateLabel, groupItems]) => (
                <DailyDateGroup key={dateLabel} label={dateLabel}>
                  {groupItems.map((item) => (
                    <DailyCard
                      key={item.id}
                      title={item.title}
                      summary={item.summary}
                      slug={item.slug}
                      publishedAt={item.publishedAt ?? undefined}
                    />
                  ))}
                </DailyDateGroup>
              ))}
            </div>
          ) : isTools ? (
            <ContentGrid columns={3}>
              {filteredItems.map((item) => (
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
          ) : (
            <ContentGrid columns={2}>
              {filteredItems.map((item) => (
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
