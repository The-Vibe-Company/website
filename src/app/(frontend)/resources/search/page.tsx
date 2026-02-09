import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { resourcesTheme } from '@/lib/resources-theme';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search | Vibe Learning',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  if (!q) redirect('/resources');

  const payload = await getPayload({ config });
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
    depth: 0,
    select: {
      title: true,
      summary: true,
      type: true,
      slug: true,
      domain: true,
      publishedAt: true,
    } as { [k: string]: true },
  });

  return (
    <main className="pt-14">
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
