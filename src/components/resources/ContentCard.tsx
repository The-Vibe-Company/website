'use client';

import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { useLocale } from 'next-intl';
import { Chip } from '@/components/kit';
import { getTypeSlug, getTypeLabel } from '@/lib/taxonomy-utils';
import { getUrlSlugForDbType } from '@/lib/content-types';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import type { ContentLanguage } from '@/lib/content-source';

interface ContentCardProps {
  title: string;
  summary?: string | null;
  type: unknown;
  slug: string;
  publishedAt?: string;
  language?: ContentLanguage;
  featuredImage?: { url: string; alt?: string; sizes?: { card?: { url: string } } } | string | number | null;
}

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getImageUrl(featuredImage: ContentCardProps['featuredImage']): { url: string; alt: string } | null {
  if (!featuredImage || typeof featuredImage === 'string' || typeof featuredImage === 'number') return null;
  const url = featuredImage.sizes?.card?.url || featuredImage.url;
  if (!url) return null;
  return { url, alt: featuredImage.alt || '' };
}

/**
 * A result or listing row, same shape as the entries on /resources: glazed
 * cover, title, summary, meta line. The title is the link (its overlay spans
 * the row), so the link is named by the title alone.
 */
export function ContentCard({
  title,
  summary,
  type,
  slug,
  publishedAt,
  language,
  featuredImage,
}: ContentCardProps) {
  const locale = useLocale();
  const typeSlug = getTypeSlug(type);
  const typeLabel = getTypeLabel(type);
  const image = getImageUrl(featuredImage);

  return (
    <article className="entry clay-quiet lift group relative has-[h3_a:focus-visible]:outline-2 has-[h3_a:focus-visible]:outline-offset-3 has-[h3_a:focus-visible]:outline-ink">
      <span className="thumb rim">
        {image ? (
          <Image src={image.url} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <span className="block h-full w-full bg-well" aria-hidden="true" />
        )}
      </span>
      <div className="entry-body">
        <h3 className="max-md:line-clamp-3">
          <Link
            href={`/resources/${getUrlSlugForDbType(typeSlug)}/${slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-[''] group-hover:underline group-hover:decoration-rim group-hover:decoration-2 group-hover:underline-offset-[3px]"
          >
            {title}
          </Link>
        </h3>
        {summary ? (
          <p dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary) }} />
        ) : null}
        <div className="meta flex-wrap gap-y-1.5">
          <Chip>{typeLabel || typeSlug}</Chip>
          {language && <LanguageFlag language={language} variant="card" />}
          {publishedAt && (
            <time dateTime={publishedAt} className="whitespace-nowrap">
              {formatDate(publishedAt, locale)}
            </time>
          )}
        </div>
      </div>
    </article>
  );
}
