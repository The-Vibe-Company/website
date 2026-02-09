import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ResourcesHeader } from '@/components/resources/ResourcesHeader';
import { TypeListingClient } from '@/components/resources/TypeListingClient';
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
      <ResourcesHeader
        subtitle={contentType.description}
        typeNavLinks={typeNavLinks}
      />

      <TypeListingClient
        contentType={contentType}
        items={JSON.parse(JSON.stringify(content.docs))}
        domains={domainOptions}
      />
    </main>
  );
}
