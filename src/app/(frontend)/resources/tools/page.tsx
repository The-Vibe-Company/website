import type { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TypeNav } from '@/components/resources/TypeNav';
import { ToolsListingClient } from '@/components/resources/ToolsListingClient';
import { resourcesTheme } from '@/lib/resources-theme';
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
      <section className={`${resourcesTheme.section.padding} pt-20 pb-8 border-b border-res-border mb-8`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            Resources / Tools
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            Tools
          </h1>
          <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
            Every tool we use to ship AI-native software.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className={`${resourcesTheme.section.padding} mb-12 space-y-6`}>
        <TypeNav types={typeNavLinks} />
      </section>

      <ToolsListingClient items={JSON.parse(JSON.stringify(tools.docs))} />
    </main>
  );
}
