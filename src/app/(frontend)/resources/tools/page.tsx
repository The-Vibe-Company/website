import type { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ToolCard } from '@/components/resources/ToolCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { TypeNav } from '@/components/resources/TypeNav';
import { CategoryFilter } from '@/components/resources/CategoryFilter';
import { resourcesTheme } from '@/lib/resources-theme';
import { getNavContentTypes } from '@/lib/content-types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tools | Vibe Learning',
  description:
    'Every tool we use to ship AI-native software.',
};

export default async function ToolsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const payload = await getPayload({ config });

  const tools = await payload.find({
    collection: 'tools',
    where: {
      status: { equals: 'published' },
      ...(category ? { category: { contains: category } } : {}),
    },
    sort: 'name',
    limit: 100,
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

      {/* Navigation + Filter */}
      <section className={`${resourcesTheme.section.padding} mb-12 space-y-6`}>
        <TypeNav types={typeNavLinks} />
        <CategoryFilter />
      </section>

      {/* Tools Grid */}
      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {tools.docs.length > 0 ? (
          <ContentGrid columns={3}>
            {tools.docs.map((tool) => {
              const logo = tool.logo as
                | { url: string; alt?: string }
                | null
                | undefined;

              return (
                <ToolCard
                  key={tool.id}
                  name={tool.name}
                  slug={tool.slug}
                  description={tool.description}
                  logo={logo}
                  category={tool.category as string[] | null}
                  domain={tool.domain}
                  pricing={tool.pricing as string | null}
                  rating={tool.rating as number | null}
                  costPerMonth={tool.costPerMonth as number | null}
                  licensesCount={tool.licensesCount as number | null}
                  leverageScore={tool.leverageScore as number | null}
                />
              );
            })}
          </ContentGrid>
        ) : (
          <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
            <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              No tools yet
            </p>
            <p className="text-sm text-res-text-muted mt-2">
              Content is on its way. Check back soon.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
