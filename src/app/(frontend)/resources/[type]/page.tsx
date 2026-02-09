import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TypeListingClient } from '@/components/resources/TypeListingClient';
import { resourcesTheme } from '@/lib/resources-theme';
import { CONTENT_TYPES, getContentTypeConfig, getNavContentTypes } from '@/lib/content-types';
import { getDomains } from '@/lib/taxonomy';

export async function generateStaticParams() {
  return CONTENT_TYPES.filter((ct) => ct.showInNav).map((ct) => ({
    type: ct.slug,
  }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const contentType = getContentTypeConfig(type);
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

  const contentType = getContentTypeConfig(type);
  if (!contentType) {
    notFound();
  }

  const [allDomains, payload] = await Promise.all([
    getDomains(),
    getPayload({ config }),
  ]);

  const content = await payload.find({
    collection: 'content',
    where: {
      status: { equals: 'published' },
      type: { equals: contentType.slug },
    },
    sort: '-publishedAt',
    limit: 200,
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

  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.slug}`,
    slug: ct.slug,
  }));

  const domainOptions = allDomains.map((d) => ({
    slug: d.slug,
    shortLabel: d.shortLabel,
    color: d.color,
    colorDark: d.colorDark,
    id: d.id,
  }));

  return (
    <main className="pt-14">
      {/* Header */}
      <section className={`${resourcesTheme.section.padding} pt-20 pb-8 border-b border-res-border mb-8`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Resources / {contentType.pluralLabel}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
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
        items={JSON.parse(JSON.stringify(content.docs))}
        domains={domainOptions}
        typeNavLinks={typeNavLinks}
      />
    </main>
  );
}
