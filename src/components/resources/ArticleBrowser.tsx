'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { resourcesTheme } from '@/lib/resources-theme';
import { getUrlSlugForDbType } from '@/lib/content-types';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import type { ContentLanguage } from '@/lib/content-source';

export interface ArticleCardItem {
  id: string;
  title: string;
  summary: string;
  type: string;
  slug: string;
  publishedAt?: string;
  language?: ContentLanguage;
  seriesDay?: number;
  focus?: boolean;
  image: { url: string; alt: string } | null;
}

type Filter = 'all' | 'victor' | 'articles';

/** How many "Articles" to show in the combined view before linking to the full list. */
const ARTICLES_PREVIEW_LIMIT = 6;

const VICTOR_LABEL = "Victor's Story";
const ARTICLES_LABEL = 'Articles';

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ArticleCard({ item }: { item: ArticleCardItem }) {
  return (
    <Link
      href={`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`}
      className={`group flex gap-3 p-3 rounded-md ${resourcesTheme.card.base}`}
    >
      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-res-bg-secondary border border-res-border" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold tracking-tight text-res-text leading-tight mb-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
          {item.title}
        </h3>
        {item.summary ? (
          <p
            className="text-xs text-res-text-muted leading-snug mb-2 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
          />
        ) : null}
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
          {item.seriesDay != null && (
            <span className="inline-flex items-center rounded border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 text-orange-600 tracking-wider">
              D{item.seriesDay}
            </span>
          )}
          {item.focus && (
            <span className="inline-flex items-center rounded border border-res-text/30 bg-res-text/5 px-1.5 py-0.5 text-res-text tracking-wider">
              Focus
            </span>
          )}
          {item.language && <LanguageFlag language={item.language} variant="inline" />}
          {item.publishedAt && <span>{formatDate(item.publishedAt)}</span>}
        </div>
      </div>
    </Link>
  );
}

interface ColumnProps {
  name: string;
  count: number;
  accent: 'victor' | 'articles';
  layout?: 'list' | 'grid';
  children: ReactNode;
  footer?: ReactNode;
}

function Column({ name, count, accent, layout = 'list', children, footer }: ColumnProps) {
  const borderClass = accent === 'victor' ? 'border-orange-500' : 'border-res-text';
  const dotClass = accent === 'victor' ? 'bg-orange-500' : 'bg-res-text';
  const cardsClass =
    layout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-3' : 'flex flex-col gap-3';

  return (
    <div>
      <div className={`flex items-center justify-between pb-2.5 mb-4 border-b-2 ${borderClass}`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-res-text">{name}</h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">{count}</span>
      </div>
      <div className={cardsClass}>
        {children}
        {footer}
      </div>
    </div>
  );
}

interface ArticleBrowserProps {
  victorStory: ArticleCardItem[];
  others: ArticleCardItem[];
  searchSlot?: ReactNode;
}

export function ArticleBrowser({ victorStory, others, searchSlot }: ArticleBrowserProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const showVictor = filter !== 'articles' && victorStory.length > 0;
  const showOthers = filter !== 'victor' && others.length > 0;
  const single = filter !== 'all';

  const visibleOthers = filter === 'all' ? others.slice(0, ARTICLES_PREVIEW_LIMIT) : others;
  const hiddenOthers = others.length - visibleOthers.length;

  const tabs: { key: Filter; label: string; dot?: boolean }[] = [
    { key: 'all', label: 'All' },
    { key: 'victor', label: VICTOR_LABEL, dot: true },
    { key: 'articles', label: ARTICLES_LABEL },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        {searchSlot}
        <div
          className="flex gap-1 self-start rounded-md border border-res-border bg-res-bg-secondary p-1"
          role="tablist"
          aria-label="Filter articles"
        >
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                  active ? 'bg-res-text text-res-surface' : 'text-res-text-muted hover:text-res-text'
                }`}
              >
                {tab.dot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {single && (
        <button
          type="button"
          onClick={() => setFilter('all')}
          className="group mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
          Resources
        </button>
      )}

      <div className={single ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start'}>
        {showVictor && (
          <Column
            name={VICTOR_LABEL}
            count={victorStory.length}
            accent="victor"
            layout={single ? 'grid' : 'list'}
          >
            {victorStory.map((item) => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </Column>
        )}

        {showOthers && (
          <Column
            name={ARTICLES_LABEL}
            count={others.length}
            accent="articles"
            layout={single ? 'grid' : 'list'}
            footer={
              hiddenOthers > 0 ? (
                <button
                  type="button"
                  onClick={() => setFilter('articles')}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-res-border px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-res-text-muted transition-colors hover:border-res-text-muted hover:text-res-text"
                >
                  View all {others.length} articles &rarr;
                </button>
              ) : null
            }
          >
            {visibleOthers.map((item) => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </Column>
        )}
      </div>
    </div>
  );
}
