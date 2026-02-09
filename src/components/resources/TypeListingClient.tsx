'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { DailyCard } from '@/components/resources/DailyCard';
import { DailyDateGroup } from '@/components/resources/DailyDateGroup';
import { FilterBar } from '@/components/resources/FilterBar';
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
}

interface DomainOption {
  slug: string;
  shortLabel: string;
  color: string;
  colorDark?: string | null;
  id: string | number;
}

interface TypeListingClientProps {
  contentType: ContentTypeConfig;
  items: ContentItem[];
  domains: DomainOption[];
}

function TypeListingInner({ contentType, items, domains }: TypeListingClientProps) {
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

  const domainOptions = domains.map((d) => ({
    slug: d.slug,
    shortLabel: d.shortLabel,
    color: d.color,
    colorDark: d.colorDark,
  }));

  return (
    <>
      <section className={`${resourcesTheme.section.padding} pt-8 mb-12`}>
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
