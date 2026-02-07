import type { Metadata } from 'next';
import type { SerializedEditorState } from 'lexical';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ContentCard } from '@/components/resources/ContentCard';
import { DomainBadge } from '@/components/resources/DomainBadge';
import { RichTextRenderer } from '@/components/resources/RichTextRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { estimateReadingTime } from '@/lib/reading-time';
import { resourcesTheme, typeLabels as sharedTypeLabels } from '@/lib/resources-theme';

export const dynamic = 'force-dynamic';

const typeLabels: Record<string, string> = {
  ...sharedTypeLabels,
  daily: 'Daily Learning',
};

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'content',
    where: {
      slug: { equals: slug },
      type: { equals: type },
      status: { equals: 'published' },
    },
    limit: 1,
  });

  const item = result.docs[0];
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
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'content',
    where: {
      slug: { equals: slug },
      type: { equals: type },
      status: { equals: 'published' },
    },
    limit: 1,
  });

  const item = result.docs[0];
  if (!item) notFound();

  const related = await payload.find({
    collection: 'content',
    where: {
      status: { equals: 'published' },
      type: { equals: item.type },
      id: { not_equals: item.id },
    },
    sort: '-publishedAt',
    limit: 3,
  });

  const bodyType = getBodyType(item.body);
  const readingTime = estimateReadingTime(item.body);
  const domains = (item.domain as string[] | undefined) ?? [];
  const tools = item.tools as
    | Array<{ id: string; name: string }>
    | undefined;

  return (
    <>
      <ReadingProgress />
      <main className="pt-14">
        {/* Back nav */}
        <div className={`${resourcesTheme.section.padding} pt-8`}>
          <Link
            href={`/resources/${type}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text hover:border-res-text-muted/50 transition-colors"
          >
            &larr; Back to {typeLabels[type] || type}
          </Link>
        </div>

        {/* Article */}
        <article className={`${resourcesTheme.section.padding} pt-12 pb-24`}>
          {/* Header */}
          <header className="max-w-3xl mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className={`${resourcesTheme.badge.type} bg-res-text text-res-surface`}>
                {typeLabels[item.type] || item.type}
              </span>
              {item.complexity && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                  {complexityLabels[item.complexity] || item.complexity}
                </span>
              )}
              {item.publishedAt && (
                <span className="text-[11px] font-mono text-res-text-muted">
                  {formatDate(item.publishedAt)}
                </span>
              )}
              {readingTime > 0 && (
                <span className="text-[11px] font-mono text-res-text-muted">
                  {readingTime} min read
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[1.05] text-res-text">
              {item.title}
            </h1>

            <p className="text-xl text-res-text-muted leading-relaxed">
              {item.summary}
            </p>

            {(domains.length > 0 || (tools && tools.length > 0)) && (
              <div className="flex flex-wrap gap-2 mt-8">
                {domains.map((d) => (
                  <DomainBadge key={d} domain={d} variant="default" />
                ))}
                {tools?.map((t) => (
                  <span
                    key={t.id}
                    className="px-2.5 py-1 rounded-full border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text-muted"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Divider */}
          <div className="border-t border-res-border max-w-3xl mb-12" />

          {/* Body content */}
          <div className="max-w-[65ch]">
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
              <div className="py-16 text-center max-w-3xl">
                <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                  Content coming soon
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Related content */}
        {related.docs.length > 0 && (
          <section className={`${resourcesTheme.section.padding} pb-32`}>
            <div className="flex items-end mb-8 border-b border-res-border pb-4">
              <span className={resourcesTheme.section.header}>
                <span className={resourcesTheme.section.headerIndicator} />
                Related
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.docs.map((r) => (
                <ContentCard
                  key={r.id}
                  title={r.title}
                  summary={r.summary}
                  type={r.type}
                  slug={r.slug}
                  domain={r.domain as string[] | undefined}
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
