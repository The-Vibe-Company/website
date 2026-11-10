'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { resourcesTheme } from '@/lib/resources-theme';
import { getUrlSlugForDbType } from '@/lib/content-types';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { BrandSquare } from '@/components/BrandSquare';
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
      className={`group relative ${hidden ? 'hidden' : 'flex'} ${compact ? 'min-h-[96px] gap-4 p-4' : 'min-h-[152px] gap-4 p-4 md:gap-5 md:p-5'} ${resourcesTheme.card.base}`}
    >
      <div
        className={`relative ${compact ? 'h-14 w-14' : 'h-20 w-20 md:h-24 md:w-24'} shrink-0 overflow-hidden border border-border bg-background`}
      >
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes={compact ? '56px' : '(min-width: 768px) 96px, 80px'}
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3
          className={`m-0 font-bold leading-[1.15] tracking-[-0.02em] text-foreground line-clamp-2 ${
            compact ? 'text-[15px]' : 'text-[16px] md:text-[18px]'
          }`}
        >
          {/* An article lives under its own language's prefix only, whatever
              the listing is browsed in, so the card links straight there. */}
          <Link
            href={`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`}
            locale={item.language}
            className="after:absolute after:inset-0 after:content-[''] group-hover:underline decoration-1 underline-offset-[3px]"
          >
            {item.title}
          </Link>
        </h3>
        {!compact && item.summary ? (
          <p
            className="m-0 mt-2 text-[13px] leading-[1.5] text-muted-foreground line-clamp-2 md:text-sm"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
          />
        ) : null}
        <div
          className={`mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 ${compact ? 'pt-2.5' : 'pt-3'} font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground`}
        >
          {item.seriesDay != null && (
            <span className="inline-flex items-center font-semibold text-foreground">
              <BrandSquare />D{item.seriesDay}
            </span>
          )}
          {item.focus && <span className={TAG}>{t('focus')}</span>}
          {item.tool && <span className={TAG}>{t('tools')}</span>}
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

/** Focus / Tools markers on a card: a hairline tag in the band's ink. */
const TAG =
  'inline-flex items-center border border-border-strong px-1.5 py-0.5 leading-none tracking-[0.14em] text-foreground';

/** "See all N …": a full-width hairline row, the arrow in the accent. */
const SEE_ALL =
  'col-span-full flex w-full cursor-pointer items-center justify-center gap-2 border border-border px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground transition-colors hover:border-border-strong hover:bg-card hover:text-foreground';

interface SectionProps {
  name: string;
  count: number;
  /** Secondary sections get a quieter header and a denser grid of compact cards. */
  secondary?: boolean;
  /** The series hangs under a lamp, like the landing's highlighted cards. */
  lamp?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

function Section({ name, count, secondary = false, lamp = false, children, footer }: SectionProps) {
  const cardsClass = secondary
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
    : 'grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4';

  const header = (
    <div
      className={`relative flex items-end justify-between gap-4 border-b border-border ${
        secondary ? 'mb-5 pb-4' : 'mb-6 pb-5 md:mb-8'
      }`}
    >
      <h2
        className={
          secondary
            ? 'm-0 text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1] tracking-[-0.035em] text-foreground'
            : resourcesTheme.page.h2
        }
      >
        {name}
      </h2>
      <span className={`${resourcesTheme.page.mono} shrink-0 pb-1`}>{count}</span>
    </div>
  );

  const cards = (
    <div className={`relative ${cardsClass}`}>
      {children}
      {footer}
    </div>
  );

  if (lamp) {
    return (
      <div className="lamp-card relative overflow-hidden border border-border p-4 pt-8 md:p-8 md:pt-10">
        <span aria-hidden="true" className={resourcesTheme.page.lamp} />
        {header}
        {cards}
      </div>
    );
  }

  return (
    <div>
      {header}
      {cards}
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
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-16">
        {/* The slot is created by the server page and arrives here as a
            lazy Flight element. Rendered as one of several siblings, React
            treats it as an un-keyed list item and warns; as the only child of
            its own wrapper it is a single child and needs no key. */}
        {searchSlot ? <div className="w-full sm:max-w-xl sm:flex-1">{searchSlot}</div> : null}
        <div
          className="flex gap-1 self-start border border-border bg-card p-1 sm:self-auto"
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
                className={`inline-flex min-h-9 cursor-pointer items-center rounded-[2px] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
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
          className="mb-8 inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">&larr;</span>
          {t('back')}
        </button>
      )}

      {/* Articles lead; Victor's Story follows under its lamp, compact. */}
      <div className="flex flex-col gap-16 md:gap-24">
        {showOthers && (
          <Section
            name={t('articles')}
            count={others.length}
            footer={
              hiddenOthers > 0 ? (
                <button type="button" onClick={() => setFilter('articles')} className={SEE_ALL}>
                  {t('viewAllArticles', { count: others.length })}{' '}
                  <span aria-hidden="true" className="text-brand">&rarr;</span>
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
            lamp
            footer={
              hiddenVictor > 0 ? (
                <button type="button" onClick={() => setFilter('victor')} className={SEE_ALL}>
                  {t('viewAllVictor', { count: victorStory.length })}{' '}
                  <span aria-hidden="true" className="text-brand">&rarr;</span>
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
