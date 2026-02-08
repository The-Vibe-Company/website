import type { Metadata } from 'next';
import type { SerializedEditorState } from 'lexical';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ContentCard } from '@/components/resources/ContentCard';
import { DomainBadge } from '@/components/resources/DomainBadge';
import { RichTextRenderer } from '@/components/resources/RichTextRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { estimateReadingTime } from '@/lib/reading-time';
import { resourcesTheme } from '@/lib/resources-theme';
import { getContentTypeConfig } from '@/lib/content-types';
import { getTypeLabel, normalizeDomains } from '@/lib/taxonomy';

export const revalidate = 60;

const complexityLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getBodyType(body: unknown): 'lexical' | 'text' | 'empty' {
  if (!body) return 'empty';
  if (typeof body === 'string' && body.trim().length > 0) return 'text';
  if (typeof body === 'object') {
    const root = (body as { root?: { children?: unknown[] } }).root;
    if (root?.children && root.children.length > 0) return 'lexical';
  }
  return 'empty';
}

/**
 * Cached content fetch — shared between generateMetadata and the page component
 * so the DB is only hit once per render.
 */
const getContent = cache(async (typeSlug: string, slug: string) => {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'content',
    where: {
      slug: { equals: slug },
      type: { equals: typeSlug },
      status: { equals: 'published' },
    },
    limit: 1,
  });
  return result.docs[0] ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const contentType = getContentTypeConfig(type);
  if (!contentType) return { title: 'Not Found' };

  const item = await getContent(type, slug);
  if (!item) return { title: 'Not Found' };

  return {
    title: `${item.title} | Vibe Learning`,
    description: item.summary,
  };
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const contentType = getContentTypeConfig(type);
  if (!contentType) notFound();

  const item = await getContent(type, slug);
  if (!item) notFound();

  const payload = await getPayload({ config });
  const related = await payload.find({
    collection: 'content',
    where: {
      status: { equals: 'published' },
      type: { equals: contentType.slug },
      id: { not_equals: item.id },
    },
    sort: '-publishedAt',
    limit: 3,
    select: {
      title: true,
      summary: true,
      type: true,
      slug: true,
      domain: true,
      publishedAt: true,
    } as { [k: string]: true },
  });

  const bodyType = getBodyType(item.body);
  const readingTime = estimateReadingTime(item.body);
  const domains = normalizeDomains(item.domain);
  const typeLabel = getTypeLabel(item.type);
  const tools = item.tools as
    | Array<{ id: string; name: string }>
    | undefined;

  return (
    <>
      <ReadingProgress />
      <main className="pt-24 min-h-screen bg-res-bg">
        <div className={`${resourcesTheme.section.padding} pb-24`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

            {/* Left Sidebar: Metadata */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-8">
                <Link
                  href={`/resources/${type}`}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
                  {typeLabel || type}
                </Link>

                <div className="w-8 h-px bg-res-border" />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Published</span>
                    <span className="text-sm font-mono text-res-text-muted">
                      {item.publishedAt ? formatDate(item.publishedAt) : 'Draft'}
                    </span>
                  </div>

                  {item.complexity && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Complexity</span>
                      <span className="text-sm font-mono text-res-text-muted">
                        {complexityLabels[item.complexity] || item.complexity}
                      </span>
                    </div>
                  )}

                  {readingTime > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Read Time</span>
                      <span className="text-sm font-mono text-res-text-muted">{readingTime} min</span>
                    </div>
                  )}
                </div>

                <div className="w-8 h-px bg-res-border" />

                {(domains.length > 0 || (tools && tools.length > 0)) && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Topics</span>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((d) => (
                        <DomainBadge key={d.id} domain={d} variant="chip" />
                      ))}
                      {tools?.map((t) => (
                        <span
                          key={t.id}
                          className="px-1.5 py-0.5 border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text-muted"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-7 lg:col-start-5">
              {/* Mobile Header elements */}
              <div className="lg:hidden mb-8 flex flex-col gap-4">
                <Link
                  href={`/resources/${type}`}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted"
                >
                  &larr; {typeLabel || type}
                </Link>
                <div className="flex flex-wrap gap-3">
                  {item.publishedAt && (
                    <span className="text-xs font-mono text-res-text-muted">
                      {formatDate(item.publishedAt)}
                    </span>
                  )}
                  <span className="text-res-text-muted/30">&bull;</span>
                  {readingTime > 0 && (
                    <span className="text-xs font-mono text-res-text-muted">{readingTime} min</span>
                  )}
                </div>
              </div>

              <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 leading-[0.95] text-res-text">
                  {item.title}
                </h1>
                <p className="text-base md:text-xl text-res-text-muted leading-relaxed">
                  {item.summary}
                </p>
              </header>

              <div className="w-full h-px bg-res-border mb-8 md:mb-12" />

              <div className="prose-vibe prose-vibe-warm max-w-none">
                {bodyType === 'lexical' ? (
                  <RichTextRenderer
                    data={item.body as unknown as SerializedEditorState}
                    className="prose-vibe prose-vibe-warm"
                  />
                ) : bodyType === 'text' ? (
                  <div className="prose-vibe prose-vibe-warm whitespace-pre-wrap">
                    <p>{String(item.body)}</p>
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-res-border rounded-lg">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                      Content coming soon
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Right Sidebar: ToC Placeholder / Empty for now to create whitespace */}
            <div className="hidden lg:block lg:col-span-2">
              {/* Future: Table of Contents */}
            </div>

          </div>
        </div>

        {/* Related content */}
        {related.docs.length > 0 && (
          <section className={`${resourcesTheme.section.padding} py-24 border-t border-res-border`}>
            <div className="flex items-end mb-12">
              <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                Keep Reading
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.docs.map((r) => (
                <ContentCard
                  key={r.id}
                  title={r.title}
                  summary={r.summary}
                  type={r.type}
                  slug={r.slug}
                  domain={r.domain}
                  publishedAt={r.publishedAt ?? undefined}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
