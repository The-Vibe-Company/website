import Image from 'next/image';
import Link from 'next/link';
import { resourcesTheme } from '@/lib/resources-theme';
import { getTypeSlug, getTypeLabel } from '@/lib/taxonomy-utils';
import { getUrlSlugForDbType } from '@/lib/content-types';
import { renderInlineMarkdown } from '@/lib/inline-markdown';

interface ContentCardProps {
  title: string;
  summary?: string | null;
  type: unknown;
  slug: string;
  publishedAt?: string;
  featuredImage?: { url: string; alt?: string; sizes?: { card?: { url: string } } } | string | number | null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
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
  featuredImage,
}: ContentCardProps) {
  const typeSlug = getTypeSlug(type);
  const typeLabel = getTypeLabel(type);
  const image = getImageUrl(featuredImage);

  return (
    <Link href={`/resources/${getUrlSlugForDbType(typeSlug)}/${slug}`} className="group block h-full">
      <article className={`h-full flex flex-col lg:flex-row overflow-hidden ${resourcesTheme.card.base} ${resourcesTheme.card.hover}`}>
        {image && (
          <div className="shrink-0 relative overflow-hidden w-full aspect-[4/3] lg:w-72 lg:aspect-[4/3]">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 280px"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-res-border/50 pb-4">
            <span className={resourcesTheme.badge.type}>
              {typeLabel || typeSlug}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tighter mb-3 text-res-text leading-[1.1] group-hover:underline decoration-1 underline-offset-4">
            {title}
          </h3>

          <p
            className="text-sm text-res-text-muted leading-relaxed line-clamp-3 mb-6 flex-1"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary ?? '') }}
          />

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-res-border/50">
            {publishedAt && (
              <span className="text-[10px] font-mono text-res-text-muted uppercase tracking-widest">
                {formatDate(publishedAt)}
              </span>
            )}
            <span className="text-res-text-muted group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
