'use client';

import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { useLocale } from 'next-intl';
import { resourcesTheme } from '@/lib/resources-theme';
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
    // An entry lives under its own language's prefix only, so link straight there.
    <Link
      href={`/resources/${getUrlSlugForDbType(typeSlug)}/${slug}`}
      locale={language}
      className="group block h-full"
    >
      <article className={`h-full flex flex-col lg:flex-row overflow-hidden ${resourcesTheme.card.base}`}>
        {image && (
          <div className="shrink-0 relative overflow-hidden w-full aspect-[4/3] border-b border-border lg:w-72 lg:border-b-0 lg:border-r">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 280px"
              className="object-cover object-center"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0 p-6 md:p-7">
          <div className="flex items-center justify-between gap-2 mb-5 border-b border-border pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {typeLabel || typeSlug}
            </span>
            {language && <LanguageFlag language={language} variant="card" />}
          </div>

          <h3 className="m-0 mb-3 text-[22px] font-bold tracking-[-0.03em] text-foreground leading-[1.1] group-hover:underline decoration-1 underline-offset-4 md:text-2xl">
            {title}
          </h3>

          <p
            className="m-0 text-[15px] text-muted-foreground leading-[1.6] line-clamp-3 mb-6 flex-1"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary ?? '') }}
          />

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            {publishedAt && (
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                {formatDate(publishedAt, locale)}
              </span>
            )}
            <span aria-hidden="true" className="text-brand">
              &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
