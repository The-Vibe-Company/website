'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Arrow, Chip } from '@/components/kit';
import { cn } from '@/lib/design-system';
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

/** How many entries each column shows in the combined view before linking to the full list. */
const ARTICLES_PREVIEW_LIMIT = 6;
const VICTOR_PREVIEW_LIMIT = 6;

function formatDate(dateString: string | undefined, locale: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * One entry: a glazed cover, the title, two lines of summary and a meta row.
 * The whole entry is a click target, but the language switch inside it needs
 * to stay its own link. So the entry is a plain container and the title link
 * spans it through an overlay pseudo-element, which keeps the markup free of
 * nested anchors; the switch sits above that overlay. The cover is decorative:
 * the title next to it names the link.
 */
function ArticleEntry({ item, hidden = false }: { item: ArticleCardItem; hidden?: boolean }) {
  const t = useTranslations('resources');
  const locale = useLocale();
  return (
    <article
      hidden={hidden}
      className={cn(
        'entry clay-quiet lift group relative',
        hidden && 'hidden',
        'has-[h3_a:focus-visible]:outline-2 has-[h3_a:focus-visible]:outline-offset-3 has-[h3_a:focus-visible]:outline-ink',
      )}
    >
      <span className="thumb rim">
        {item.image ? (
          <Image src={item.image.url} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <span className="block h-full w-full bg-well" aria-hidden="true" />
        )}
      </span>
      <div className="entry-body">
        <h3 className="max-md:line-clamp-3">
          <Link
            href={`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-[''] group-hover:underline group-hover:decoration-rim group-hover:decoration-2 group-hover:underline-offset-[3px]"
          >
            {item.title}
          </Link>
        </h3>
        {item.summary ? (
          <p dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }} />
        ) : null}
        <div className="meta flex-wrap gap-y-1.5 max-md:gap-x-1.5 max-md:[&_.chip]:px-2">
          {item.seriesDay != null && <Chip dark>D{item.seriesDay}</Chip>}
          {item.focus && <Chip>{t('focus')}</Chip>}
          {item.tool && <Chip>{t('tools')}</Chip>}
          {item.language && (
            <TranslationSwitch
              language={item.language}
              translations={item.translations}
              variant="card"
              className="relative z-10"
            />
          )}
          {item.publishedAt && (
            <time dateTime={item.publishedAt} className="whitespace-nowrap">
              {formatDate(item.publishedAt, locale)}
            </time>
          )}
        </div>
      </div>
    </article>
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
  const lit = accent === 'victor';

  return (
    <div>
      <div className="flex items-center gap-3 px-1 pb-4">
        <span className={cn('dot', lit && 'dot-rim')} aria-hidden="true" />
        <h2 className="display d-xs m-0">{name}</h2>
        <span className="chip ml-auto">{count}</span>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'mb-[18px] h-0.5 rounded-sm',
          lit
            ? 'bg-[linear-gradient(90deg,var(--ink)_0_30%,var(--rim)_80%,var(--rim-hot))]'
            : 'bg-[linear-gradient(90deg,var(--ink),#3a3a3c)]',
        )}
      />
      <div className={cn('entries', layout === 'grid' && 'lg:grid-cols-2')}>{children}</div>
      {footer}
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

  const tabs: { key: Filter; label: string; dot?: boolean }[] = [
    { key: 'all', label: t('all') },
    { key: 'articles', label: t('articles') },
    { key: 'victor', label: t('victorStory'), dot: true },
  ];

  return (
    <div>
      <div className="clay mt-8 flex flex-col gap-2 rounded-plate p-2 md:mt-14 md:flex-row md:items-center md:justify-between md:gap-4 md:rounded-full md:p-2.5">
        {searchSlot}
        <div className="seg" role="group" aria-label={tA11y('filterArticles')}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className="max-md:flex-1 max-md:gap-1.5 max-md:px-3"
            >
              {tab.dot && <span className="dot dot-rim" aria-hidden="true" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 md:mt-[52px]">
        {single && (
          <button type="button" onClick={() => setFilter('all')} className="back mb-4">
            <Arrow direction="left" />
            {t('back')}
          </button>
        )}

        <div className={single ? '' : 'grid grid-cols-1 items-start gap-[52px] md:grid-cols-2 md:gap-9'}>
          {showOthers && (
            <Column
              name={t('articles')}
              count={others.length}
              accent="articles"
              layout={single ? 'grid' : 'list'}
              footer={
                hiddenOthers > 0 ? (
                  <button
                    type="button"
                    onClick={() => setFilter('articles')}
                    className="btn btn-clay btn-wide mt-4"
                  >
                    <span className="truncate">{t('viewAllArticles', { count: others.length })}</span>
                    <Arrow />
                  </button>
                ) : null
              }
            >
              {others.map((item, index) => (
                <ArticleEntry
                  key={item.id}
                  item={item}
                  hidden={filter === 'all' && index >= ARTICLES_PREVIEW_LIMIT}
                />
              ))}
            </Column>
          )}

          {showVictor && (
            <Column
              name={t('victorStory')}
              count={victorStory.length}
              accent="victor"
              layout={single ? 'grid' : 'list'}
              footer={
                hiddenVictor > 0 ? (
                  <button
                    type="button"
                    onClick={() => setFilter('victor')}
                    className="btn btn-clay btn-wide mt-4"
                  >
                    <span className="truncate">{t('viewAllVictor', { count: victorStory.length })}</span>
                    <Arrow />
                  </button>
                ) : null
              }
            >
              {victorStory.map((item, index) => (
                <ArticleEntry
                  key={item.id}
                  item={item}
                  hidden={filter === 'all' && index >= VICTOR_PREVIEW_LIMIT}
                />
              ))}
            </Column>
          )}
        </div>
      </div>
    </div>
  );
}
