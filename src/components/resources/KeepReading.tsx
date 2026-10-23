import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from 'next-intl/server';

import { Arrow, Groove, Kicker } from '@/components/kit';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import { contentPath, getContentForLanguage, type ContentEntry, type ContentLanguage } from '@/lib/content-source';
import { renderInlineMarkdown } from '@/lib/inline-markdown';

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
 * "Keep Reading": one next piece with a glazed cover, then up to two quieter
 * rows (no cards, a groove between them). Covers keep their 3:2 shape.
 */
export async function KeepReading({ items }: { items: ContentEntry[] }) {
  if (items.length === 0) return null;

  const t = await getTranslations('resources');
  const locale = await getLocale();
  const [featured, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <section className="pt-20 md:pt-28" aria-labelledby="keep-reading-title">
      <div className="wrap">
        <Kicker as="h2" className="text-ink">
          <span id="keep-reading-title">{t('keepReading')}</span>
        </Kicker>

        <Link
          {...linkFor(featured, locale)}
          className="clay-quiet lift group mt-[22px] grid cursor-pointer items-center gap-1.5 rounded-[22px] p-2 md:rounded-plate md:p-3 lg:grid-cols-[minmax(0,43%)_minmax(0,1fr)] lg:gap-10"
        >
          {featured.featuredImage?.url && (
            <span className="rim relative block aspect-[3/2] overflow-hidden rounded-2xl [--rim-angle:135deg] md:rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.featuredImage.url}
                alt=""
                className="h-full w-full object-cover"
                decoding="async"
              />
            </span>
          )}
          <span className="flex min-w-0 flex-col items-start px-3 pb-2.5 pt-4 lg:py-3.5 lg:pl-0 lg:pr-8">
            <span className="flex items-center gap-3">
              <span className="chip chip-dark">{t('next')}</span>
              <LanguageFlag language={featured.language} variant="inline" />
            </span>
            <span className="display mt-3.5 block text-[26px] leading-[1.04] tracking-[-0.03em] decoration-rim decoration-2 underline-offset-[5px] group-hover:underline md:text-[32px] lg:mt-[18px]">
              {featured.title}
            </span>
            {featured.summary ? (
              <span
                className="mt-4 block max-w-[54ch] text-[15.5px] leading-[1.55] text-muted-foreground line-clamp-3 md:text-base"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(featured.summary) }}
              />
            ) : null}
            <span className="link-rim mt-4">
              <span className="t">{t('readArticle')}</span>
              <Arrow />
            </span>
          </span>
        </Link>

        {secondary.length > 0 && (
          <ul className="mt-3.5 grid list-none grid-cols-1 gap-x-12 p-0 md:grid-cols-2">
            {secondary.map((r) => (
              <li key={r.id} className="min-w-0">
                <Groove />
                <Link
                  {...linkFor(r, locale)}
                  className="group grid cursor-pointer grid-cols-[92px_minmax(0,1fr)] items-start gap-3.5 py-[18px] md:grid-cols-[104px_minmax(0,1fr)] md:gap-[18px] md:pb-[22px] md:pt-5"
                >
                  {r.featuredImage?.url ? (
                    <span className="thumb rim !h-[72px] md:!h-[78px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.featuredImage.url} alt="" decoding="async" />
                    </span>
                  ) : (
                    <span className="thumb well !h-[72px] md:!h-[78px]" aria-hidden="true" />
                  )}
                  <span className="flex min-w-0 flex-col">
                    <h3 className="clamp-2 text-base font-semibold leading-[1.28] tracking-[-0.012em] decoration-rim decoration-2 underline-offset-[3px] group-hover:underline md:text-[17px]">
                      {r.title}
                    </h3>
                    {r.summary ? (
                      <span
                        className="clamp-2 mt-1.5 text-sm leading-[1.45] text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(r.summary) }}
                      />
                    ) : null}
                    <span className="meta pt-3">
                      <LanguageFlag language={r.language} variant="inline" />
                      {r.publishedAt && (
                        <time dateTime={r.publishedAt}>{formatShortDate(r.publishedAt, locale)}</time>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
