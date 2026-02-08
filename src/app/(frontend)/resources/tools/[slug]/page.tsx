import type { Metadata } from 'next';
import type { SerializedEditorState } from 'lexical';
import Image from 'next/image';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ContentCard } from '@/components/resources/ContentCard';
import { DomainBadge } from '@/components/resources/DomainBadge';
import { LeverageBar } from '@/components/resources/LeverageBar';
import { PricingBadge } from '@/components/resources/PricingBadge';
import { ToolCard } from '@/components/resources/ToolCard';
import { RichTextRenderer } from '@/components/resources/RichTextRenderer';
import { resourcesTheme, categoryLabels } from '@/lib/resources-theme';
import { normalizeDomains } from '@/lib/taxonomy';

export const revalidate = 60;

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
 * Cached tool fetch — shared between generateMetadata and page component
 * so the DB is only hit once per render.
 */
const getTool = cache(async (slug: string) => {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'tools',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  });
  return result.docs[0] ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) return { title: 'Not Found' };

  return {
    title: `${tool.name} | Our Stack | Vibe Learning`,
    description: tool.description,
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) notFound();

  const payload = await getPayload({ config });

  // Content that references this tool
  const relatedContent = await payload.find({
    collection: 'content',
    where: {
      status: { equals: 'published' },
      tools: { contains: tool.id },
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

  const logo = tool.logo as { url: string; alt?: string } | null | undefined;
  const domains = normalizeDomains(tool.domain);
  const categories = (tool.category as string[] | undefined) ?? [];
  const pros = (tool.pros as string[] | undefined) ?? [];
  const cons = (tool.cons as string[] | undefined) ?? [];
  const relatedTools = (tool.relatedTools ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    logo?: { url: string; alt?: string } | null;
    category?: string[] | null;
    domain?: unknown;
    pricing?: string | null;
    rating?: number | null;
  }>;
  const bodyType = getBodyType(tool.body);
  const firstDomainColor = domains[0]?.color ?? null;

  return (
    <main className="pt-24 min-h-screen bg-res-bg">
      <div className={`${resourcesTheme.section.padding} pb-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          {/* Left Sidebar: Metadata */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-32 flex flex-col gap-8">
              <Link
                href="/resources/tools"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-200">
                  &larr;
                </span>
                Tools
              </Link>

              <div className="w-8 h-px bg-res-border" />

              {/* Info */}
              <div className="flex flex-col gap-4">
                {tool.website && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                      Website
                    </span>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-res-text-muted hover:text-res-text transition-colors truncate"
                    >
                      {tool.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </div>
                )}

                {categories.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                      Category
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((c) => (
                        <span
                          key={c}
                          className="text-sm font-mono text-res-text-muted"
                        >
                          {categoryLabels[c] || c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-8 h-px bg-res-border" />

              {/* Pricing & Cost */}
              <div className="flex flex-col gap-4">
                {tool.pricing && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                      Pricing
                    </span>
                    <PricingBadge pricing={tool.pricing} />
                  </div>
                )}

                {(tool.costPerMonth as number) > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                      Cost
                    </span>
                    <span className="text-sm font-mono text-res-text">
                      €{(tool.costPerMonth as number).toFixed(0)}/mo
                    </span>
                  </div>
                )}

                {(tool.licensesCount as number) > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                      Licenses
                    </span>
                    <span className="text-sm font-mono text-res-text">
                      {tool.licensesCount as number}
                    </span>
                  </div>
                )}
              </div>

              {/* Leverage */}
              {(tool.leverageScore as number) > 0 && (
                <>
                  <div className="w-8 h-px bg-res-border" />
                  <LeverageBar
                    score={tool.leverageScore as number}
                    color={firstDomainColor}
                  />
                </>
              )}

              {/* Domains */}
              {domains.length > 0 && (
                <>
                  <div className="w-8 h-px bg-res-border" />
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                      Domains
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((d) => (
                        <DomainBadge key={d.id} domain={d} variant="chip" />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-7 lg:col-start-5">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8 flex flex-col gap-4">
              <Link
                href="/resources/tools"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted"
              >
                &larr; Tools
              </Link>
              <div className="flex flex-wrap gap-3 items-center">
                {tool.pricing && <PricingBadge pricing={tool.pricing} />}
                {(tool.costPerMonth as number) > 0 && (
                  <span className="text-xs font-mono text-res-text-muted">
                    €{(tool.costPerMonth as number).toFixed(0)}/mo
                  </span>
                )}
                {tool.rating != null && (tool.rating as number) > 0 && (
                  <span className="text-xs font-mono text-res-text-muted flex items-center gap-1">
                    <span className="text-amber-500">&#9733;</span>
                    {(tool.rating as number).toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Tool Header */}
            <header className="mb-8 md:mb-12">
              <div className="flex items-start gap-4 mb-4">
                {logo?.url && (
                  <div className="w-16 h-16 rounded-xl bg-res-bg-secondary border border-res-border flex items-center justify-center overflow-hidden shrink-0">
                    <Image
                      src={logo.url}
                      alt={tool.name}
                      width={64}
                      height={64}
                      sizes="64px"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[0.95] text-res-text">
                    {tool.name}
                  </h1>
                  {tool.rating != null && (tool.rating as number) > 0 && (
                    <div className="hidden lg:flex items-center gap-1 mt-2 text-sm font-mono text-res-text-muted">
                      <span className="text-amber-500">&#9733;</span>
                      {(tool.rating as number).toFixed(1)} / 5
                    </div>
                  )}
                </div>
              </div>
              <p className="text-base md:text-xl text-res-text-muted leading-relaxed">
                {tool.description}
              </p>
            </header>

            <div className="w-full h-px bg-res-border mb-8 md:mb-12" />

            {/* Rich Text Body */}
            <div className="prose-vibe prose-vibe-warm max-w-none">
              {bodyType === 'lexical' ? (
                <RichTextRenderer
                  data={tool.body as unknown as SerializedEditorState}
                  className="prose-vibe prose-vibe-warm"
                />
              ) : bodyType === 'text' ? (
                <div className="prose-vibe prose-vibe-warm whitespace-pre-wrap">
                  <p>{String(tool.body)}</p>
                </div>
              ) : null}
            </div>

            {/* Pros & Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <div className="mt-12">
                <h2 className="text-xl font-bold tracking-tighter text-res-text mb-6">
                  Points forts / Points faibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {pros.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {pros.map((pro, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 shrink-0 mt-0.5">
                            &#10003;
                          </span>
                          <span className="text-sm text-res-text leading-relaxed">
                            {pro}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {cons.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {cons.map((con, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-rose-500 shrink-0 mt-0.5">
                            &#10007;
                          </span>
                          <span className="text-sm text-res-text leading-relaxed">
                            {con}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verdict */}
            {tool.verdict && (
              <div className="mt-12">
                <h2 className="text-xl font-bold tracking-tighter text-res-text mb-4">
                  Verdict
                </h2>
                <blockquote
                  className="border-l-2 pl-6 py-2 text-base text-res-text-muted leading-relaxed italic"
                  style={
                    firstDomainColor
                      ? { borderColor: firstDomainColor }
                      : undefined
                  }
                >
                  {tool.verdict}
                </blockquote>
              </div>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="mt-16 pt-12 border-t border-res-border">
                <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted block mb-8">
                  Related Tools
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedTools.slice(0, 4).map((rt) => (
                    <ToolCard
                      key={rt.id}
                      name={rt.name}
                      slug={rt.slug}
                      description={rt.description}
                      logo={rt.logo}
                      category={rt.category}
                      domain={rt.domain}
                      pricing={rt.pricing}
                      rating={rt.rating}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-2">
            {/* Future: Quick links, external resources */}
          </div>
        </div>
      </div>

      {/* Related Content */}
      {relatedContent.docs.length > 0 && (
        <section
          className={`${resourcesTheme.section.padding} py-24 border-t border-res-border`}
        >
          <div className="flex items-end mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              Content about {tool.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedContent.docs.map((r) => (
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
  );
}
