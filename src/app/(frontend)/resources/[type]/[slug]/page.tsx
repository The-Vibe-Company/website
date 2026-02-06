import type { Metadata } from 'next';
import type { SerializedEditorState } from 'lexical';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TopNav } from '@/components/TopNav';
import { ContentCard } from '@/components/resources/ContentCard';
import { RichTextRenderer } from '@/components/resources/RichTextRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { estimateReadingTime } from '@/lib/reading-time';

export const dynamic = 'force-dynamic';

const typeLabels: Record<string, string> = {
  daily: 'Daily Learning',
  tutorial: 'Tutorial',
  article: 'Article',
  'tool-focus': 'Tool Focus',
  'concept-focus': 'Concept Focus',
};

const domainLabels: Record<string, string> = {
  dev: 'Development',
  design: 'Design',
  ops: 'Operations',
  business: 'Business',
  'ai-automation': 'AI & Automation',
  marketing: 'Marketing',
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
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'content',
    where: { slug: { equals: slug } },
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
      <TopNav />
      <main className="min-h-screen pt-20">
        {/* Back nav */}
        <div className="px-6 md:px-12 lg:px-24 pt-8">
          <Link
            href={`/resources/${type}`}
            className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to {typeLabels[type] || type}
          </Link>
        </div>

        {/* Article */}
        <article className="px-6 md:px-12 lg:px-24 pt-16 pb-24">
          {/* Header */}
          <header className="max-w-3xl mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-2 py-0.5 bg-foreground text-background text-[10px] font-mono uppercase tracking-widest">
                {typeLabels[item.type] || item.type}
              </span>
              {item.complexity && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
                  {complexityLabels[item.complexity] || item.complexity}
                </span>
              )}
              {item.publishedAt && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  {formatDate(item.publishedAt)}
                </span>
              )}
              {readingTime > 0 && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  {readingTime} min read
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[1.05]">
              {item.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {item.summary}
            </p>

            {(domains.length > 0 || (tools && tools.length > 0)) && (
              <div className="flex flex-wrap gap-2 mt-8">
                {domains.map((d) => (
                  <span
                    key={d}
                    className="px-2.5 py-1 border border-foreground/15 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                  >
                    {domainLabels[d] || d}
                  </span>
                ))}
                {tools?.map((t) => (
                  <span
                    key={t.id}
                    className="px-2.5 py-1 border border-foreground/15 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Divider */}
          <div className="border-t border-foreground/15 max-w-3xl mb-12" />

          {/* Body content */}
          <div className="max-w-[65ch]">
            {bodyType === 'lexical' ? (
              <RichTextRenderer
                data={item.body as unknown as SerializedEditorState}
                className="prose-vibe"
              />
            ) : bodyType === 'text' ? (
              <div className="prose-vibe whitespace-pre-wrap">
                <p>{String(item.body)}</p>
              </div>
            ) : (
              <div className="py-16 text-center max-w-3xl">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Content coming soon
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Related content */}
        {related.docs.length > 0 && (
          <section className="px-6 md:px-12 lg:px-24 pb-32">
            <div className="flex items-end mb-8 border-b border-foreground pb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground" />
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
