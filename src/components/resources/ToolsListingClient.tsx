'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ToolCard } from '@/components/resources/ToolCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { CategoryFilter } from '@/components/resources/CategoryFilter';
import { resourcesTheme } from '@/lib/resources-theme';

interface ToolItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: { url: string; alt?: string } | null;
  category?: string[] | null;
  domain?: unknown;
  pricing?: string | null;
  rating?: number | null;
  costPerMonth?: number | null;
  licensesCount?: number | null;
  leverageScore?: number | null;
}

interface ToolsListingClientProps {
  items: ToolItem[];
}

function ToolsListingInner({ items }: ToolsListingClientProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const filteredTools = activeCategory
    ? items.filter((tool) => tool.category?.includes(activeCategory))
    : items;

  return (
    <>
      <section className={`${resourcesTheme.section.padding} mb-12`}>
        <CategoryFilter />
      </section>

      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {filteredTools.length > 0 ? (
          <ContentGrid columns={3}>
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                slug={tool.slug}
                description={tool.description}
                logo={tool.logo}
                category={tool.category}
                domain={tool.domain}
                pricing={tool.pricing}
                rating={tool.rating}
                costPerMonth={tool.costPerMonth}
                licensesCount={tool.licensesCount}
                leverageScore={tool.leverageScore}
              />
            ))}
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
    </>
  );
}

export function ToolsListingClient(props: ToolsListingClientProps) {
  return (
    <Suspense fallback={null}>
      <ToolsListingInner {...props} />
    </Suspense>
  );
}
