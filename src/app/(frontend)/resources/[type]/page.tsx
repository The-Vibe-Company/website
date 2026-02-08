import type { Metadata } from 'next';
import type { Where } from 'payload';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { DailyCard } from '@/components/resources/DailyCard';
import { DailyDateGroup } from '@/components/resources/DailyDateGroup';
import { FilterBar } from '@/components/resources/FilterBar';
import { TypeNav } from '@/components/resources/TypeNav';
import { resourcesTheme } from '@/lib/resources-theme';
import { getContentTypeConfig, getNavContentTypes } from '@/lib/content-types';
import { getDomains, getDomainBySlug } from '@/lib/taxonomy';

export const revalidate = 60;

function getDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const contentType = getContentTypeConfig(type);
  if (!contentType) return { title: 'Not Found' };
  return {
    title: `${contentType.pluralLabel} | Vibe Learning`,
    description: contentType.description || '',
  };
}

export default async function TypeListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ domain?: string }>;
}) {
  const { type } = await params;
  const { domain } = await searchParams;

  const contentType = getContentTypeConfig(type);
  if (!contentType) {
    notFound();
  }

  const [allDomains, payload] = await Promise.all([
    getDomains(),
    getPayload({ config }),
  ]);

  const where: Where = {
    status: { equals: 'published' },
    type: { equals: contentType.slug },
  };

  // Domain filter: look up domain by slug
  if (domain) {
    const domainDoc = await getDomainBySlug(domain);
    if (domainDoc) {
      where['domain'] = { contains: domainDoc.id };
    }
  }

  const content = await payload.find({
    collection: 'content',
    where,
    sort: '-publishedAt',
    limit: 50,
  });

  const isTimeline = contentType.renderStyle === 'timeline';

  // Group dailies by date
  const dailyGroups = isTimeline
    ? (() => {
      const groups: Map<string, typeof content.docs> = new Map();
      for (const item of content.docs) {
        const label = item.publishedAt ? getDateLabel(item.publishedAt) : 'Undated';
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label)!.push(item);
      }
      return groups;
    })()
    : null;

  // Build TypeNav links from static config
  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.slug}`,
    slug: ct.slug,
  }));

  // Build FilterBar domain options
  const domainOptions = allDomains.map((d) => ({
    slug: d.slug,
    shortLabel: d.shortLabel,
    color: d.color,
    colorDark: d.colorDark,
  }));

  return (
    <main className="pt-14">
      {/* Header */}
      <section className={`${resourcesTheme.section.padding} pt-20 pb-8 border-b border-res-border mb-8`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Resources / {contentType.pluralLabel}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            {contentType.pluralLabel}
          </h1>
          {contentType.description && (
            <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
              {contentType.description}
            </p>
          )}
        </div>
      </section>

      {/* Navigation + Filter */}
      <section className={`${resourcesTheme.section.padding} mb-12 space-y-6`}>
        <TypeNav types={typeNavLinks} />
        <FilterBar domains={domainOptions} />
      </section>

      {/* Content */}
      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {content.docs.length > 0 ? (
          isTimeline && dailyGroups ? (
            <div>
              {Array.from(dailyGroups).map(([dateLabel, items]) => (
                <DailyDateGroup key={dateLabel} label={dateLabel}>
                  {items.map((item) => (
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
              {content.docs.map((item) => (
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
    </main>
  );
}
