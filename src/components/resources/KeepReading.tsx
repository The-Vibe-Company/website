import Link from 'next/link';

import { LanguageFlag } from '@/components/resources/LanguageFlag';
import type { ContentEntry } from '@/lib/content-source';
import { getUrlSlugForDbType } from '@/lib/content-types';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';

function formatShortDate(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function hrefFor(item: ContentEntry): string {
  return `/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`;
}

/**
 * "Keep Reading" — editorial layout: one featured "Next" article with a large
 * cover and summary, followed by up to two compact cards. Covers keep their
 * full aspect ratio (never cropped tight) so the illustrations read well.
 */
export function KeepReading({ items }: { items: ContentEntry[] }) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <section className={`${resourcesTheme.section.padding} py-24 border-t border-res-border`}>
      <div className="mb-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
          Keep Reading
        </span>
      </div>

      <Link href={hrefFor(featured)} className="group block">
        <article className="flex flex-col md:flex-row overflow-hidden rounded-lg border border-res-border bg-res-surface transition-colors hover:border-res-text/35">
          {featured.featuredImage?.url && (
            <div className="md:w-[44%] shrink-0 overflow-hidden aspect-[16/10] md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.featuredImage.url}
                alt={featured.featuredImage.alt ?? featured.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                decoding="async"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center p-7 md:p-9">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-orange-600">
                Next
              </span>
              <LanguageFlag language={featured.language} variant="inline" />
            </div>
            <h3 className="mb-3 text-2xl md:text-3xl font-bold tracking-tighter leading-tight text-res-text group-hover:underline decoration-1 underline-offset-4">
              {featured.title}
            </h3>
            {featured.summary ? (
              <p
                className="mb-5 max-w-xl text-sm md:text-base text-res-text-muted leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(featured.summary) }}
              />
            ) : null}
            <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-res-text-muted transition-colors group-hover:text-res-text">
              Read article
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
        </article>
      </Link>

      {secondary.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondary.map((r) => (
            <Link
              key={r.id}
              href={hrefFor(r)}
              className="group flex gap-4 rounded-lg border border-res-border bg-res-surface p-4 transition-colors hover:border-res-text/35"
            >
              {r.featuredImage?.url && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.featuredImage.url}
                    alt={r.featuredImage.alt ?? r.title}
                    className="h-full w-full object-cover"
                    decoding="async"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 text-sm font-bold tracking-tight leading-snug text-res-text line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                  {r.title}
                </h4>
                {r.summary ? (
                  <p
                    className="mb-2 text-xs text-res-text-muted leading-snug line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(r.summary) }}
                  />
                ) : null}
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                  <LanguageFlag language={r.language} variant="inline" />
                  {r.publishedAt && <span>{formatShortDate(r.publishedAt)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
