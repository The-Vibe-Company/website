'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { resourcesTheme } from '@/lib/resources-theme';
import { getUrlSlugForDbType } from '@/lib/content-types';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import {
  TranslationSwitch,
  type TranslationLink,
} from '@/components/resources/TranslationSwitch';
import type { ContentLanguage } from '@/lib/content-source';

export interface ArticleCardItem {
  id: string;
  title: string;
  summary: string;
  type: string;
  slug: string;
  publishedAt?: string;
  language?: ContentLanguage;
  /** Every language version, when the article was translated. */
  translations?: TranslationLink[];
  seriesDay?: number;
  focus?: boolean;
  tool?: boolean;
  image: { url: string; alt: string } | null;
}

type Filter = 'all' | 'victor' | 'articles';

/** How many cards each section shows in the combined view before linking to the full list. */
const ARTICLES_PREVIEW_LIMIT = 6;
const VICTOR_PREVIEW_LIMIT = 3;

function formatDate(dateString: string | undefined, locale: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * The whole card is a click target, but the language switch inside it needs to
 * stay its own link. So the card is a plain container and the title link spans
 * it through an overlay pseudo-element, which keeps the markup free of nested
 * anchors; the switch sits above that overlay.
 */
function ArticleCard({
  item,
  hidden = false,
  compact = false,
}: {
  item: ArticleCardItem;
  hidden?: boolean;
  /** Smaller card without summary, used for the secondary Victor's Story preview. */
  compact?: boolean;
}) {
  const t = useTranslations('resources');
  const locale = useLocale();
  return (
    <article
      hidden={hidden}
      className={`group relative ${hidden ? 'hidden' : 'flex'} ${compact ? 'min-h-[84px]' : 'h-[132px]'} gap-3 p-3 rounded-md ${resourcesTheme.card.base}`}
    >
      <div className={`relative ${compact ? 'w-12 h-12' : 'w-16 h-16'} shrink-0 overflow-hidden rounded`}>
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes={compact ? '48px' : '64px'}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-res-bg-secondary border border-res-border" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-sm font-bold tracking-tight text-res-text leading-tight mb-1 line-clamp-2">
          <Link
            href={`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`}
            className="after:absolute after:inset-0 after:content-[''] group-hover:underline decoration-1 underline-offset-2"
          >
            {item.title}
          </Link>
        </h3>
        {!compact && item.summary ? (
          <p
            className="text-xs text-res-text-muted leading-snug line-clamp-2"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
          />
        ) : null}
        <div className="mt-auto flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
          {item.seriesDay != null && (
            <span className="inline-flex items-center rounded border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 text-orange-600 tracking-wider">
              D{item.seriesDay}
            </span>
          )}
          {item.focus && (
            <span className="inline-flex items-center rounded border border-res-text/30 bg-res-text/5 px-1.5 py-0.5 text-res-text tracking-wider">
              {t('focus')}
            </span>
          )}
          {item.tool && (
            <span className="inline-flex items-center rounded border border-res-text/30 bg-res-text/5 px-1.5 py-0.5 text-res-text tracking-wider">
              {t('tools')}
            </span>
          )}
          {item.language && (
            <TranslationSwitch
              language={item.language}
              translations={item.translations}
              variant="inline"
              className="relative z-10"
            />
          )}
          {item.publishedAt && <span className="whitespace-nowrap">{formatDate(item.publishedAt, locale)}</span>}
        </div>
      </div>
    </article>
  );
}

interface SectionProps {
  name: string;
  count: number;
  /** Secondary sections get a quieter header and a denser grid of compact cards. */
  secondary?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

function Section({ name, count, secondary = false, children, footer }: SectionProps) {
  const cardsClass = secondary
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
    : 'grid grid-cols-1 lg:grid-cols-2 gap-3';

  return (
    <div>
      <div
        className={`flex items-center justify-between mb-4 ${
          secondary ? 'pb-2 border-b border-res-border' : 'pb-2.5 border-b-2 border-res-text'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {!secondary && <span className="w-1.5 h-1.5 rounded-full bg-res-text" aria-hidden="true" />}
          <h2
            className={
              secondary
                ? 'text-sm font-semibold tracking-tight text-res-text-muted'
                : 'text-lg md:text-xl font-bold tracking-tight text-res-text'
            }
          >
            {name}
          </h2>
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
  const t = useTranslations('resources');
  const tA11y = useTranslations('accessibility');

  const showVictor = filter !== 'articles' && victorStory.length > 0;
  const showOthers = filter !== 'victor' && others.length > 0;
  const single = filter !== 'all';

  const hiddenVictor = filter === 'all' ? Math.max(0, victorStory.length - VICTOR_PREVIEW_LIMIT) : 0;

  const hiddenOthers = filter === 'all' ? Math.max(0, others.length - ARTICLES_PREVIEW_LIMIT) : 0;

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'articles', label: t('articles') },
    { key: 'victor', label: t('victorStory') },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        {searchSlot}
        <div
          className="flex gap-1 self-start rounded-md border border-res-border bg-res-bg-secondary p-1"
          role="tablist"
          aria-label={tA11y('filterArticles')}
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
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                  active ? 'bg-res-text text-res-surface' : 'text-res-text-muted hover:text-res-text'
                }`}
              >
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
          className="group mb-6 inline-flex cursor-pointer items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
          {t('back')}
        </button>
      )}

      {/* Articles lead; Victor's Story follows as a quieter, compact section. */}
      <div className="flex flex-col gap-12 md:gap-16">
        {showOthers && (
          <Section
            name={t('articles')}
            count={others.length}
            footer={
              hiddenOthers > 0 ? (
                <button
                  type="button"
                  onClick={() => setFilter('articles')}
                  className="col-span-full flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-res-border px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-res-text-muted transition-colors hover:border-res-text-muted hover:text-res-text"
                >
                  {t('viewAllArticles', { count: others.length })} &rarr;
                </button>
              ) : null
            }
          >
            {others.map((item, index) => (
              <ArticleCard key={item.id} item={item} hidden={filter === 'all' && index >= ARTICLES_PREVIEW_LIMIT} />
            ))}
          </Section>
        )}

        {showVictor && (
          <Section
            name={t('victorStory')}
            count={victorStory.length}
            secondary={!single}
            footer={
              hiddenVictor > 0 ? (
                <button
                  type="button"
                  onClick={() => setFilter('victor')}
                  className="col-span-full flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-res-border px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-res-text-muted transition-colors hover:border-res-text-muted hover:text-res-text"
                >
                  {t('viewAllVictor', { count: victorStory.length })} &rarr;
                </button>
              ) : null
            }
          >
            {victorStory.map((item, index) => (
              <ArticleCard
                key={item.id}
                item={item}
                compact={!single}
                hidden={filter === 'all' && index >= VICTOR_PREVIEW_LIMIT}
              />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
