import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TypeListingClient } from '@/components/resources/TypeListingClient';
import { resourcesTheme } from '@/lib/resources-theme';
import { CONTENT_TYPES, getContentTypeByUrlSlug, getNavContentTypes } from '@/lib/content-types';
import { getContentByType, getContentCounts } from '@/lib/content-source';
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

  const items = getContentByType(contentType.slug);
  const counts = getContentCounts();

  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.urlSlug}`,
    slug: ct.slug,
  }));

  const HeaderIcon = RESOURCE_ICONS[contentType.slug];

  return (
    <main className="pt-12 pb-12">
      {/* Header */}
      <section className={`${resourcesTheme.section.padding} pt-2 pb-8 border-b border-res-border mb-8`}>
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
        items={JSON.parse(JSON.stringify(items))}
        typeNavLinks={typeNavLinks}
        counts={counts}
      />
    </main>
  );
}
