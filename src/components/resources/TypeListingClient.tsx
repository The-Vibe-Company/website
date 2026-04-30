'use client';

import { Suspense } from 'react';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { SkillCard } from '@/components/resources/SkillCard';
import { TypeNav } from '@/components/resources/TypeNav';
import { resourcesTheme } from '@/lib/resources-theme';
import type { ContentTypeConfig } from '@/lib/content-types';
import type { ContentLanguage, SkillMeta } from '@/lib/content-source';

interface ContentItem {
  id: string;
  title: string;
  summary?: string | null;
  type: string;
  slug: string;
  publishedAt?: string | null;
  body?: string | null;
  language?: ContentLanguage;
  complexity?: string;
  topics?: string[];
  featuredImage?: { url: string; alt?: string; sizes?: { card?: { url: string } } } | string | number | null;
  skill?: SkillMeta | null;
}

interface TypeNavLink {
  label: string;
  href: string;
  slug: string;
}

interface TypeListingClientProps {
  contentType: ContentTypeConfig;
  items: ContentItem[];
  typeNavLinks: TypeNavLink[];
  counts?: Record<string, number>;
}

function TypeListingInner({ contentType, items, typeNavLinks, counts }: TypeListingClientProps) {
  const isList = contentType.renderStyle === 'list';
  const isGrid = contentType.renderStyle === 'grid';
  const isSkillType = contentType.slug === 'skill';

  return (
    <>
      <section className={`${resourcesTheme.section.padding} mb-6`}>
        <TypeNav types={typeNavLinks} counts={counts} />
      </section>

      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {items.length > 0 ? (
          isList ? (
            <div className="space-y-8">
              {items.map((item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  type={item.type}
                  slug={item.slug}
                  publishedAt={item.publishedAt ?? undefined}
                  language={item.language}
                  featuredImage={item.featuredImage}
                />
              ))}
            </div>
          ) : isGrid && isSkillType ? (
            <ContentGrid columns={3}>
              {items.map((item) => (
                <SkillCard
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  slug={item.slug}
                  publishedAt={item.publishedAt ?? undefined}
                  language={item.language}
                  topics={item.topics}
                  complexity={item.complexity}
                  skill={item.skill ?? undefined}
                  body={item.body}
                />
              ))}
            </ContentGrid>
          ) : (
            <ContentGrid columns={2}>
              {items.map((item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  type={item.type}
                  slug={item.slug}
                  publishedAt={item.publishedAt ?? undefined}
                  language={item.language}
                  featuredImage={item.featuredImage}
                />
              ))}
            </ContentGrid>
          )
        ) : (
          <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
            <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              No {contentType.pluralLabel.toLowerCase()} yet
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

export function TypeListingClient(props: TypeListingClientProps) {
  return (
    <Suspense fallback={null}>
      <TypeListingInner {...props} />
    </Suspense>
  );
}
