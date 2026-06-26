import type { Metadata } from 'next';

import { ArticleBrowser, type ArticleCardItem } from '@/components/resources/ArticleBrowser';
import { ResourcesHomeSearch } from '@/components/resources/ResourcesHomeSearch';
import { getContentByType } from '@/lib/content-source';
import type { ContentEntry } from '@/lib/content-source';
import { resourcesTheme } from '@/lib/resources-theme';

export const metadata: Metadata = {
  title: 'Resources | The Vibe Company',
  description:
    'Articles and essays from The Vibe Company: an AI journey told from the inside, plus the team’s notes on agents, tooling, and the way we work.',
};

const VICTOR_SERIES = 'victor-story';

function toCard(item: ContentEntry): ArticleCardItem {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    type: item.type,
    slug: item.slug,
    publishedAt: item.publishedAt ?? undefined,
    language: item.language,
    seriesDay: item.seriesDay,
    image: item.featuredImage?.url
      ? { url: item.featuredImage.url, alt: item.featuredImage.alt ?? item.title }
      : null,
  };
}

export default async function ResourcesPage() {
  // Articles come from getContentByType already sorted by publishedAt desc, so
  // both columns stay in chronological order (newest first). A freshly added
  // article naturally lands at the top; its D-day badge comes from seriesDay.
  const articles = getContentByType('article');
  const victorStory = articles.filter((a) => a.series === VICTOR_SERIES).map(toCard);
  const others = articles.filter((a) => a.series !== VICTOR_SERIES).map(toCard);
  const articleCount = articles.length;

  return (
    <main className="pb-20 bg-res-bg">
      <section
        className={`${resourcesTheme.section.padding} pt-10 md:pt-16 pb-10 md:pb-12 border-b border-res-border`}
      >
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-res-text-muted block mb-4">
            Resources / {articleCount} {articleCount === 1 ? 'article' : 'articles'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.92] text-res-text mb-5">
            Articles &amp; essays.
          </h1>
          <p className="text-base md:text-lg text-res-text-muted leading-relaxed max-w-2xl">
            What we&apos;re learning and building with AI at The Vibe Company, plus Victor&apos;s
            Story along the way.
          </p>
        </div>
      </section>

      <section className={`${resourcesTheme.section.padding} pt-10`}>
        <ArticleBrowser
          victorStory={victorStory}
          others={others}
          searchSlot={<ResourcesHomeSearch />}
        />
      </section>
    </main>
  );
}
