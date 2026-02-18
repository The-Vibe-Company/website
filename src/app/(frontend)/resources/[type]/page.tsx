import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TypeListingClient } from '@/components/resources/TypeListingClient';
import { resourcesTheme } from '@/lib/resources-theme';
import { CONTENT_TYPES, getContentTypeByUrlSlug, getNavContentTypes } from '@/lib/content-types';
import { RESOURCE_ICONS } from '@/lib/resource-icons';

export async function generateStaticParams() {
  return CONTENT_TYPES.filter((ct) => ct.showInNav).map((ct) => ({
    type: ct.urlSlug,
  }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const contentType = getContentTypeByUrlSlug(type);
  if (!contentType) return { title: 'Not Found' };
  return {
    title: `${contentType.pluralLabel} | Vibe Learning`,
    description: contentType.description || '',
  };
}

export default async function TypeListingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const contentType = getContentTypeByUrlSlug(type);
  if (!contentType) {
    notFound();
  }

  const payload = await getPayload({ config });

  // Fetch items from the appropriate collection
  const isToolsType = contentType.collection === 'tools';
  const contentSelect = {
    title: true,
    summary: true,
    type: true,
    slug: true,
    domain: true,
    publishedAt: true,
    featuredImage: true,
    ...(contentType.slug === 'daily' ? { body: true } : {}),
  } as { [k: string]: true };

  const [items, allContent, toolsCount] = await Promise.all([
    isToolsType
      ? payload.find({
          collection: 'tools',
          where: { status: { equals: 'published' } },
          sort: 'name',
          limit: 200,
          depth: 0,
          select: {
            name: true,
            slug: true,
            description: true,
            logo: true,
            category: true,
            domain: true,
            pricing: true,
            rating: true,
            costPerMonth: true,
            licensesCount: true,
            leverageScore: true,
          } as { [k: string]: true },
        })
      : payload.find({
          collection: 'content',
          where: {
            status: { equals: 'published' },
            type: { equals: contentType.slug },
          },
          sort: '-publishedAt',
          limit: 200,
          depth: 1,
          select: contentSelect,
        }),
    // Lightweight query to get counts for all content types (for TypeNav visibility)
    payload.find({
      collection: 'content',
      where: { status: { equals: 'published' } },
      limit: 0,
      pagination: false,
      depth: 0,
      select: { type: true } as { [k: string]: true },
    }),
    // Get tools count for TypeNav
    payload.count({
      collection: 'tools',
      where: { status: { equals: 'published' } },
    }),
  ]);

  // Compute per-type counts (DB slugs)
  const counts: Record<string, number> = {};
  for (const item of allContent.docs) {
    const t = item.type as string;
    counts[t] = (counts[t] || 0) + 1;
  }
  counts['tools'] = toolsCount.totalDocs;

  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.urlSlug}`,
    slug: ct.slug,
  }));

  // Normalize tool items to match ContentItem shape expected by TypeListingClient
  const normalizedItems = isToolsType
    ? items.docs.map((tool) => ({
        id: tool.id,
        title: (tool as unknown as { name: string }).name,
        summary: (tool as unknown as { description: string }).description,
        type: 'tools',
        slug: tool.slug as string,
        domain: tool.domain,
        publishedAt: null,
        // Tool-specific fields
        logo: (tool as Record<string, unknown>).logo,
        category: (tool as Record<string, unknown>).category,
        pricing: (tool as Record<string, unknown>).pricing,
        rating: (tool as Record<string, unknown>).rating,
        costPerMonth: (tool as Record<string, unknown>).costPerMonth,
        licensesCount: (tool as Record<string, unknown>).licensesCount,
        leverageScore: (tool as Record<string, unknown>).leverageScore,
      }))
    : items.docs;

  const HeaderIcon = RESOURCE_ICONS[contentType.slug];

  return (
    <main className="pt-14">
      {/* Header */}
      <section className={`${resourcesTheme.section.padding} pt-6 pb-6 border-b border-res-border mb-3`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Resources / {contentType.pluralLabel}
          </span>
          <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            {HeaderIcon && <HeaderIcon size={36} strokeWidth={1.5} className="shrink-0" />}
            {contentType.pluralLabel}
          </h1>
          {contentType.description && (
            <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
              {contentType.description}
            </p>
          )}
        </div>
      </section>

      <TypeListingClient
        contentType={contentType}
        items={JSON.parse(JSON.stringify(normalizedItems))}
        typeNavLinks={typeNavLinks}
        counts={counts}
      />
    </main>
  );
}
