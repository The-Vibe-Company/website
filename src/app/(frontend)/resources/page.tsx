import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TopNav } from '@/components/TopNav';
import { FeaturedCard } from '@/components/resources/FeaturedCard';
import { DailyCard } from '@/components/resources/DailyCard';
import { TypeNav } from '@/components/resources/TypeNav';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources | Vibe Learning',
  description:
    'Daily learnings, tutorials, and raw build logs. Everything we know about shipping with AI.',
};

const typeLabels: Record<string, string> = {
  daily: 'Daily',
  tutorial: 'Tutorial',
  article: 'Article',
  'tool-focus': 'Tool Focus',
  'concept-focus': 'Concept Focus',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default async function ResourcesPage() {
  const payload = await getPayload({ config });

  const [allContent, dailies] = await Promise.all([
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
      limit: 7,
    }),
  ]);

  const featuredItem = allContent.docs[0];
  const latestItems = allContent.docs.slice(1, 5);

  return (
    <>
      <TopNav />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 pt-32 pb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground block mb-4">
            Resources
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[0.95]">
            Vibe Learning
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            Daily learnings, tutorials, and raw build logs. Everything we know
            about shipping with AI.
          </p>
        </section>

        {/* Type Navigation */}
        <section className="px-6 md:px-12 lg:px-24 mb-16">
          <TypeNav />
        </section>

        {/* Featured + Latest */}
        <section className="px-6 md:px-12 lg:px-24 pb-24">
          {featuredItem ? (
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Featured article */}
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

              {/* Latest sidebar */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Latest
                </span>
                <div className="mt-6">
                  {latestItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/resources/${item.type}/${item.slug}`}
                      className="group block py-4 border-b border-foreground/8"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
                          {typeLabels[item.type] || item.type}
                        </span>
                        {item.publishedAt && (
                          <>
                            <span className="text-muted-foreground/20">
                              &middot;
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/50">
                              {formatDate(item.publishedAt)}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold tracking-tight group-hover:text-muted-foreground transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-foreground/10 p-12 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                No content yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                We&apos;re learning so fast that our docs can&apos;t keep up.
                Check back tomorrow.
              </p>
            </div>
          )}
        </section>

        {/* Daily Log */}
        <section className="px-6 md:px-12 lg:px-24 pb-32">
          <div className="flex justify-between items-end mb-8 border-b border-foreground pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground" />
              Daily Log
            </span>
            <Link
              href="/resources/daily"
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          {dailies.docs.length > 0 ? (
            <div>
              {dailies.docs.map((item) => (
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
            <p className="text-sm text-muted-foreground py-4">
              Daily learnings will appear here once published.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
