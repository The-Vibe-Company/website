import type { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ResourcesHeader } from '@/components/resources/ResourcesHeader';
import { ToolsListingClient } from '@/components/resources/ToolsListingClient';
import { getNavContentTypes } from '@/lib/content-types';

export const metadata: Metadata = {
  title: 'Tools | Vibe Learning',
  description:
    'Every tool we use to ship AI-native software.',
};

export default async function ToolsListingPage() {
  const payload = await getPayload({ config });

  const tools = await payload.find({
    collection: 'tools',
    where: {
      status: { equals: 'published' },
    },
    sort: 'name',
    limit: 100,
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
  });

  // Build TypeNav links from static config
  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.slug}`,
    slug: ct.slug,
  }));

  return (
    <main className="pt-14">
      {/* Header */}
      <ResourcesHeader
        subtitle="Every tool we use to ship AI-native software."
        typeNavLinks={typeNavLinks}
      />

      <ToolsListingClient items={JSON.parse(JSON.stringify(tools.docs))} />
    </main>
  );
}
