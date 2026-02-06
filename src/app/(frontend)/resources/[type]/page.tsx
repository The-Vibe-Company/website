import type { Metadata } from 'next';
import type { Where } from 'payload';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TopNav } from '@/components/TopNav';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { DailyCard } from '@/components/resources/DailyCard';
import { FilterBar } from '@/components/resources/FilterBar';
import { TypeNav } from '@/components/resources/TypeNav';

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
    title: 'Daily Learnings',
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
    title: 'Tool Focus',
    description: 'Focused breakdowns of the tools we use every day.',
  },
  'concept-focus': {
    title: 'Concept Focus',
    description: 'Explorations of key concepts in AI-native development.',
  },
};

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

  return (
    <>
      <TopNav />
      <main className="min-h-screen pt-20">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-24 pt-32 pb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground block mb-4">
            Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-[0.95]">
            {cfg.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            {cfg.description}
          </p>
        </section>

        {/* Navigation + Filter */}
        <section className="px-6 md:px-12 lg:px-24 mb-12 space-y-6">
          <TypeNav />
          <FilterBar />
        </section>

        {/* Content */}
        <section className="px-6 md:px-12 lg:px-24 pb-32">
          {content.docs.length > 0 ? (
            isDailyType ? (
              <div>
                {content.docs.map((item) => (
                  <DailyCard
                    key={item.id}
                    title={item.title}
                    summary={item.summary}
                    slug={item.slug}
                    publishedAt={item.publishedAt ?? undefined}
                  />
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
            <div className="border border-foreground/10 p-12 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                No {cfg.title.toLowerCase()} yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Content is on its way. Check back soon.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
