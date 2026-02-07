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

export const dynamic = 'force-dynamic';

const validTypes = [
  'daily',
  'tutorial',
  'article',
  'tool-focus',
  'concept-focus',
] as const;
type ContentType = (typeof validTypes)[number];

const typeConfig: Record<
  ContentType,
  { title: string; description: string }
> = {
  daily: {
    title: 'Learnings',
    description:
      'Quick daily insights and discoveries from the build trenches.',
  },
  tutorial: {
    title: 'Tutorials',
    description: 'Step-by-step guides to ship faster with AI-native tools.',
  },
  article: {
    title: 'Articles',
    description:
      'Deep dives into the tools, patterns, and philosophies of vibe coding.',
  },
  'tool-focus': {
    title: 'Focus',
    description: 'Focused breakdowns of the tools we use every day.',
  },
  'concept-focus': {
    title: 'Concept Focus',
    description: 'Explorations of key concepts in AI-native development.',
  },
};

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
  const cfg = typeConfig[type as ContentType];
  if (!cfg) return { title: 'Not Found' };
  return {
    title: `${cfg.title} | Vibe Learning`,
    description: cfg.description,
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

  if (!validTypes.includes(type as ContentType)) {
    notFound();
  }

  const cfg = typeConfig[type as ContentType];
  const payload = await getPayload({ config });

  const where: Where = {
    status: { equals: 'published' },
    type: { equals: type },
    ...(domain ? { domain: { contains: domain } } : {}),
  };

  const content = await payload.find({
    collection: 'content',
    where,
    sort: '-publishedAt',
    limit: 50,
  });

  const isDailyType = type === 'daily';

  // Group dailies by date
  const dailyGroups = isDailyType
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

  return (
    <main className="pt-14">
      {/* Header */}
      <section className={`${resourcesTheme.section.padding} pt-20 pb-8 border-b border-res-border mb-8`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Resources / {cfg.title}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            {cfg.title}
          </h1>
          <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
            {cfg.description}
          </p>
        </div>
      </section>

      {/* Navigation + Filter */}
      <section className={`${resourcesTheme.section.padding} mb-12 space-y-6`}>
        <TypeNav />
        <FilterBar />
      </section>

      {/* Content */}
      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {content.docs.length > 0 ? (
          isDailyType && dailyGroups ? (
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
                  domain={item.domain as string[] | undefined}
                  publishedAt={item.publishedAt ?? undefined}
                />
              ))}
            </ContentGrid>
          )
        ) : (
          <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
            <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              No {cfg.title.toLowerCase()} yet
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
