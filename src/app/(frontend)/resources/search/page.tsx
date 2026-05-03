import type { Metadata } from 'next';
import Link from 'next/link';
import type React from 'react';
import { redirect } from 'next/navigation';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { SkillCard } from '@/components/resources/SkillCard';
import { searchContent } from '@/lib/content-source';
import { resourcesTheme } from '@/lib/resources-theme';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search | The Vibe Company',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  if (!q) redirect('/resources');

  const results = searchContent(q).slice(0, 50);
  const skillResults = results.filter((item) => item.type === 'skill');
  const articleResults = results.filter((item) => item.type !== 'skill');

  return (
    <main className="pt-12 pb-12">
      <section className={`${resourcesTheme.section.padding} pt-2 pb-8 border-b border-res-border mb-8`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Search Results
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            &ldquo;{q}&rdquo;
          </h1>
          <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
            Found {results.length} result{results.length === 1 ? '' : 's'}.
          </p>
        </div>
      </section>

      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {results.length > 0 ? (
          <div className="space-y-14">
            {skillResults.length > 0 && (
              <SearchSection title="Skills" count={skillResults.length}>
                <ContentGrid columns={3}>
                  {skillResults.map((item) => (
                    <SkillCard
                      key={item.id}
                      title={item.title}
                      summary={item.summary}
                      slug={item.slug}
                      publishedAt={item.publishedAt ?? undefined}
                      language={item.language}
                      topics={item.topics}
                      complexity={item.complexity}
                      skill={item.skill}
                    />
                  ))}
                </ContentGrid>
              </SearchSection>
            )}

            {articleResults.length > 0 && (
              <SearchSection title="Articles" count={articleResults.length}>
                <div className="space-y-6">
                  {articleResults.map((item) => (
                    <ContentCard
                      key={item.id}
                      title={item.title}
                      summary={item.summary}
                      type={item.type}
                      slug={item.slug}
                      publishedAt={item.publishedAt ?? undefined}
                      language={item.language}
                      featuredImage={item.featuredImage}
                    />
                  ))}
                </div>
              </SearchSection>
            )}
          </div>
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

function SearchSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-6 flex items-baseline gap-3 border-b border-res-border pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-res-text">{title}</h2>
        <span className="text-[11px] font-mono uppercase tracking-widest text-res-text-muted">
          {count} {count === 1 ? 'result' : 'results'}
        </span>
      </header>
      {children}
    </section>
  );
}
