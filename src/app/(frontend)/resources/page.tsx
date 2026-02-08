import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ResourcesHubHero } from '@/components/resources/ResourcesHubHero';
import { FeaturedCard } from '@/components/resources/FeaturedCard';
import { DailyCard } from '@/components/resources/DailyCard';
import { DailyDateGroup } from '@/components/resources/DailyDateGroup';
import { TypeNav } from '@/components/resources/TypeNav';
import { ConceptCloud } from '@/components/resources/ConceptCloud';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { resourcesTheme } from '@/lib/resources-theme';
import { getAllContentTypeConfigs, getNavContentTypes } from '@/lib/content-types';
import { getTypeSlug, getTypeLabel } from '@/lib/taxonomy';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Resources | Vibe Learning',
  description:
    'Daily learnings, tutorials, and raw build logs. Everything we know about shipping with AI.',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupByDate(items: any[]) {
  const groups: Map<string, typeof items> = new Map();
  for (const item of items) {
    const label = item.publishedAt ? getDateLabel(item.publishedAt) : 'Undated';
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }
  return groups;
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const payload = await getPayload({ config });

  // Fields needed for listing cards — excludes heavy body/aiMetadata/source.
  // Cast avoids Payload's return-type narrowing which would make fields `unknown`.
  const listingSelect = {
    title: true,
    summary: true,
    type: true,
    slug: true,
    domain: true,
    publishedAt: true,
  } as { [k: string]: true };

  // Handle Search View
  if (q) {
    const results = await payload.find({
      collection: 'content',
      where: {
        and: [
          { status: { equals: 'published' } },
          {
            or: [
              { title: { contains: q } },
              { summary: { contains: q } },
            ],
          },
        ],
      },
      sort: '-publishedAt',
      limit: 50,
      select: listingSelect,
    });

    return (
      <main className="pt-14">
        {/* Search Header */}
        <section className={`${resourcesTheme.section.padding} pt-20 pb-8 border-b border-res-border mb-8`}>
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
              Search Results
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
              &ldquo;{q}&rdquo;
            </h1>
            <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
              Found {results.totalDocs} result{results.totalDocs === 1 ? '' : 's'}.
            </p>
          </div>
        </section>

        {/* Results */}
        <section className={`${resourcesTheme.section.padding} pb-32`}>
          {results.docs.length > 0 ? (
            <ContentGrid columns={3}>
              {results.docs.map((item) => (
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
          ) : (
            <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
              <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                No results found
              </p>
              <p className="text-sm text-res-text-muted mt-2">
                Try adjusting your search terms.
              </p>
              <Link href="/resources" className="inline-block mt-8 text-xs font-mono uppercase tracking-widest text-res-text border-b border-res-text pb-1 hover:text-res-text-muted hover:border-res-text-muted transition-colors">
                Clear Search
              </Link>
            </div>
          )}
        </section>
      </main>
    );
  }

  // Static content types — no DB queries
  const allContentTypes = getAllContentTypeConfigs();
  const navContentTypes = getNavContentTypes();
  const timelineType = allContentTypes.find((ct) => ct.renderStyle === 'timeline');

  // Build TypeNav links
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.slug}`,
    slug: ct.slug,
  }));

  // Fetch content + counts in a single parallel batch
  const contentSelectWithConcepts = {
    ...listingSelect,
    concepts: true,
  } as { [k: string]: true };

  const dailySelect = {
    title: true,
    summary: true,
    slug: true,
    publishedAt: true,
  } as { [k: string]: true };

  const [allContent, dailies, ...typeCounts] = await Promise.all([
    payload.find({
      collection: 'content',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
      select: contentSelectWithConcepts,
    }),
    timelineType
      ? payload.find({
          collection: 'content',
          where: {
            status: { equals: 'published' },
            type: { equals: timelineType.slug },
          },
          sort: '-publishedAt',
          limit: 10,
          select: dailySelect,
        })
      : Promise.resolve({ docs: [], totalDocs: 0 }),
    ...allContentTypes.map(async (ct) => {
      const result = await payload.count({
        collection: 'content',
        where: { status: { equals: 'published' }, type: { equals: ct.slug } },
      });
      return { slug: ct.slug, count: result.totalDocs };
    }),
  ]);

  const totalCount = typeCounts.reduce((sum, tc) => sum + tc.count, 0);
  const counts: Record<string, number> = { all: totalCount };
  for (const tc of typeCounts) {
    counts[tc.slug] = tc.count;
  }

  const stats = [
    { label: 'total', count: totalCount },
    ...typeCounts.map((tc) => ({ label: tc.slug, count: tc.count })),
  ];

  const featuredItem = allContent.docs[0];
  const latestItems = allContent.docs.slice(1, 5);

  const allConcepts = allContent.docs
    .flatMap((doc) => (doc.concepts as string[] | undefined) ?? [])
    .filter((v, i, a) => a.indexOf(v) === i);

  const dailyGroups = groupByDate(dailies.docs);

  return (
    <main className="pt-14">
      {/* Hero */}
      <section className={resourcesTheme.section.padding}>
        <ResourcesHubHero stats={stats} />
      </section>

      {/* Type Navigation */}
      <section className={`${resourcesTheme.section.padding} mb-12`}>
        <TypeNav types={typeNavLinks} counts={counts} />
      </section>

      {/* Featured + Latest */}
      <section className={`${resourcesTheme.section.padding} pb-20`}>
        {featuredItem ? (
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <FeaturedCard
                title={featuredItem.title}
                summary={featuredItem.summary}
                type={featuredItem.type}
                slug={featuredItem.slug}
                domain={featuredItem.domain}
                publishedAt={featuredItem.publishedAt ?? undefined}
              />
            </div>

            <div>
              <span className={resourcesTheme.section.header}>
                <span className={resourcesTheme.section.headerIndicator} />
                Latest
              </span>
              <div className="mt-2">
                {latestItems.map((item) => {
                  const typeSlug = getTypeSlug(item.type);
                  const typeLabel = getTypeLabel(item.type);
                  return (
                    <Link
                      key={item.id}
                      href={`/resources/${typeSlug}/${item.slug}`}
                      className="group block py-4 border-b border-res-border/50"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                          {typeLabel || typeSlug}
                        </span>
                        {item.publishedAt && (
                          <>
                            <span className="text-res-text-muted/20">&middot;</span>
                            <span className="text-[10px] font-mono text-res-text-muted/50">
                              {formatDate(item.publishedAt)}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold tracking-tight text-res-text group-hover:text-res-text-muted transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
            <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              No content yet
            </p>
            <p className="text-sm text-res-text-muted mt-2">
              We&apos;re learning so fast that our docs can&apos;t keep up.
              Check back tomorrow.
            </p>
          </div>
        )}
      </section>

      {/* Daily Log */}
      {timelineType && (
        <section className={`${resourcesTheme.section.padding} pb-20`}>
          <div className="flex justify-between items-end mb-8 border-b border-res-border pb-4">
            <span className={resourcesTheme.section.header}>
              <span className={resourcesTheme.section.headerIndicator} />
              {timelineType.pluralLabel}
            </span>
            <Link
              href={`/resources/${timelineType.slug}`}
              className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          {dailies.docs.length > 0 ? (
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
            <p className="text-sm text-res-text-muted py-4">
              {timelineType.pluralLabel} will appear here once published.
            </p>
          )}
        </section>
      )}

      {/* Explore Concepts */}
      {allConcepts.length > 0 && (
        <section className={`${resourcesTheme.section.padding} pb-32`}>
          <span className={resourcesTheme.section.header}>
            <span className={resourcesTheme.section.headerIndicator} />
            Explore Concepts
          </span>
          <ConceptCloud concepts={allConcepts} />
        </section>
      )}
    </main>
  );
}
