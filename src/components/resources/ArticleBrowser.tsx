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

/** How many entries each section shows in the combined view before linking to the full list. */
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
 * One entry: a glazed cover, the title, two lines of summary and a meta row.
 * The whole entry is a click target, but the language switch inside it needs
 * to stay its own link. So the entry is a plain container and the title link
 * spans it through an overlay pseudo-element, which keeps the markup free of
 * nested anchors; the switch sits above that overlay. The cover is decorative:
 * the title next to it names the link. The compact entry (smaller cover, no
 * summary) is the one the secondary Victor's Story preview uses.
 */
function ArticleEntry({
  item,
  hidden = false,
  compact = false,
}: {
  item: ArticleCardItem;
  hidden?: boolean;
  compact?: boolean;
}) {
  const t = useTranslations('resources');
  const locale = useLocale();
  return (
    <article
      hidden={hidden}
      className={cn(
        'entry clay-quiet lift group relative',
        compact && 'entry-compact',
        hidden && 'hidden',
        'has-[h3_a:focus-visible]:outline-2 has-[h3_a:focus-visible]:outline-offset-3 has-[h3_a:focus-visible]:outline-ink',
      )}
    >
      <span className="thumb rim">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes={compact ? '64px' : '128px'}
            className="object-cover"
          />
        ) : (
          <span className="block h-full w-full bg-well" aria-hidden="true" />
        )}
      </span>
      <div className="entry-body">
        <h3 className="max-md:line-clamp-3">
          {/* An article lives under its own language's prefix only, whatever
              the listing is browsed in, so the card links straight there. */}
          <Link
            href={`/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`}
            locale={item.language}
            className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-[''] group-hover:underline group-hover:decoration-rim group-hover:decoration-2 group-hover:underline-offset-[3px]"
          >
            {item.title}
          </Link>
        </h3>
        {!compact && item.summary ? (
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

interface SectionProps {
  name: string;
  count: number;
  /** A secondary section gets a quieter header and a denser grid of compact entries. */
  secondary?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

function Section({ name, count, secondary = false, children, footer }: SectionProps) {
  return (
    <div>
      {secondary ? (
        <>
          <div className="flex items-center gap-3 px-1 pb-3">
            <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em] text-muted">{name}</h2>
            <span className="chip ml-auto">{count}</span>
          </div>
          <span aria-hidden="true" className="groove mb-[18px]" />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 px-1 pb-4">
            <span className="dot" aria-hidden="true" />
            <h2 className="display d-xs m-0">{name}</h2>
            <span className="chip ml-auto">{count}</span>
          </div>
          <div
            aria-hidden="true"
            className="mb-[18px] h-0.5 rounded-sm bg-[linear-gradient(90deg,var(--ink),#3a3a3c)]"
          />
        </>
      )}
      <div className={cn('entries', secondary ? 'md:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2')}>
        {children}
      </div>
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

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'articles', label: t('articles') },
    { key: 'victor', label: t('victorStory') },
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

        {/* Articles lead at full width; Victor's Story follows as a quieter
            section of compact entries. */}
        <div className="flex flex-col gap-[52px] md:gap-16">
          {showOthers && (
            <Section
              name={t('articles')}
              count={others.length}
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
                  compact={!single}
                  hidden={filter === 'all' && index >= VICTOR_PREVIEW_LIMIT}
                />
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
