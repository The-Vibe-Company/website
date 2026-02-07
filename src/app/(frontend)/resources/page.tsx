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
import { resourcesTheme, typeLabels } from '@/lib/resources-theme';

export const dynamic = 'force-dynamic';

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

export default async function ResourcesPage() {
  const payload = await getPayload({ config });

  const [allContent, dailies, typeCounts] = await Promise.all([
    payload.find({
      collection: 'content',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
    }),
    payload.find({
      collection: 'content',
      where: {
        status: { equals: 'published' },
        type: { equals: 'daily' },
      },
      sort: '-publishedAt',
      limit: 10,
    }),
    Promise.all([
      payload.count({ collection: 'content', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'content', where: { status: { equals: 'published' }, type: { equals: 'daily' } } }),
      payload.count({ collection: 'content', where: { status: { equals: 'published' }, type: { equals: 'tutorial' } } }),
      payload.count({ collection: 'content', where: { status: { equals: 'published' }, type: { equals: 'article' } } }),
    ]),
  ]);

  const [totalCount, dailyCount, tutorialCount, articleCount] = typeCounts;
  const stats = [
    { label: 'total', count: totalCount.totalDocs },
    { label: 'dailies', count: dailyCount.totalDocs },
    { label: 'tutorials', count: tutorialCount.totalDocs },
    { label: 'articles', count: articleCount.totalDocs },
  ];

  const counts: Record<string, number> = {
    all: totalCount.totalDocs,
    daily: dailyCount.totalDocs,
    tutorial: tutorialCount.totalDocs,
    article: articleCount.totalDocs,
  };

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
        <TypeNav counts={counts} />
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
                domain={featuredItem.domain as string[] | undefined}
                publishedAt={featuredItem.publishedAt ?? undefined}
              />
            </div>

            <div>
              <span className={resourcesTheme.section.header}>
                <span className={resourcesTheme.section.headerIndicator} />
                Latest
              </span>
              <div className="mt-2">
                {latestItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/resources/${item.type}/${item.slug}`}
                    className="group block py-4 border-b border-res-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                        {typeLabels[item.type] || item.type}
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
                ))}
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
      <section className={`${resourcesTheme.section.padding} pb-20`}>
        <div className="flex justify-between items-end mb-8 border-b border-res-border pb-4">
          <span className={resourcesTheme.section.header}>
            <span className={resourcesTheme.section.headerIndicator} />
            Daily Log
          </span>
          <Link
            href="/resources/daily"
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
            Daily learnings will appear here once published.
          </p>
        )}
      </section>

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
