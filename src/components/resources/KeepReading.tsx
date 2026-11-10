import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from 'next-intl/server';

import { BrandSquare } from '@/components/BrandSquare';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import { contentPath, getContentForLanguage, type ContentEntry, type ContentLanguage } from '@/lib/content-source';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { getCoverImageDimensions } from '@/lib/og-image-dimensions';
import { resourcesTheme } from '@/lib/resources-theme';

function formatShortDate(dateString: string | undefined, locale: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function linkFor(item: ContentEntry, locale: string) {
  const target = getContentForLanguage(item.type, item.slug, locale as ContentLanguage) ?? item;
  return { href: contentPath(target), locale: target.language };
}

/**
 * "Keep Reading" — editorial layout: one featured "Next" article with a large
 * cover and summary, followed by up to two compact cards. Covers keep their
 * full aspect ratio (never cropped tight) so the illustrations read well.
 */
export async function KeepReading({ items }: { items: ContentEntry[] }) {
  if (items.length === 0) return null;

  const t = await getTranslations('resources');
  const locale = await getLocale();
  const [featured, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <section className={resourcesTheme.section.padding}>
      {/* The rule stops at the gutters, like every other rule on the site. */}
      <div className="border-t border-border py-16 md:py-24">
        <div className="mb-10 md:mb-12">
          <span className={resourcesTheme.page.mono}>
            <BrandSquare />
            {t('keepReading')}
          </span>
        </div>

        <Link {...linkFor(featured, locale)} className="group block">
          <article className="flex flex-col md:flex-row overflow-hidden border border-border bg-card transition-colors hover:border-border-strong">
            {featured.featuredImage?.url && (
              <div className="md:w-[44%] shrink-0 overflow-hidden aspect-[16/10] md:aspect-auto border-b border-border md:border-b-0 md:border-r">
                {/* Below the fold: lazy, and sized to the card so it never
                    competes with the article cover (the LCP). */}
                <Image
                  src={featured.featuredImage.url}
                  alt={featured.featuredImage.alt ?? featured.title}
                  {...getCoverImageDimensions(featured.featuredImage.sourceUrl)}
                  sizes="(min-width: 768px) 44vw, calc(100vw - 48px)"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {/* The next read hangs under its lamp, like the landing's
                highlighted cards. */}
            <div className="lamp-card relative flex flex-1 flex-col justify-center p-7 pt-10 md:p-10">
              <span aria-hidden="true" className={resourcesTheme.page.lamp} />
              <div className="relative mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  <BrandSquare />
                  {t('next')}
                </span>
                <LanguageFlag language={featured.language} variant="inline" />
              </div>
              <h3 className="relative m-0 mb-4 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold tracking-[-0.035em] leading-[1.05] text-foreground group-hover:underline decoration-1 underline-offset-4">
                {featured.title}
              </h3>
              {featured.summary ? (
                <p
                  className="relative m-0 mb-6 max-w-xl text-[15px] md:text-base text-muted-foreground leading-[1.6] line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(featured.summary) }}
                />
              ) : null}
              <span className="relative inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                {t('readArticle')}
                <span aria-hidden="true" className="text-brand">&rarr;</span>
              </span>
            </div>
          </article>
        </Link>

        {secondary.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondary.map((r) => (
              <Link
                key={r.id}
                {...linkFor(r, locale)}
                className="group flex gap-4 border border-border bg-card p-4 transition-colors hover:border-border-strong md:gap-5 md:p-5"
              >
                {r.featuredImage?.url && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-border">
                    <Image
                      src={r.featuredImage.url}
                      alt={r.featuredImage.alt ?? r.title}
                      {...getCoverImageDimensions(r.featuredImage.sourceUrl)}
                      sizes="80px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="m-0 mb-1.5 text-[16px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground line-clamp-2 group-hover:underline decoration-1 underline-offset-[3px]">
                    {r.title}
                  </h4>
                  {r.summary ? (
                    <p
                      className="m-0 mb-2.5 text-[13px] text-muted-foreground leading-[1.5] line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(r.summary) }}
                    />
                  ) : null}
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    <LanguageFlag language={r.language} variant="inline" />
                    {r.publishedAt && <span>{formatShortDate(r.publishedAt, locale)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
