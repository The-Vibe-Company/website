import type { Metadata } from 'next';
import { permanentRedirect } from "@/i18n/navigation";
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BackLink } from '@/components/BackLink';
import { KeepReading } from '@/components/resources/KeepReading';
import { TranslationSwitch } from '@/components/resources/TranslationSwitch';
import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { CONTENT_TYPES, getContentTypeByUrlSlug, getUrlSlugForDbType } from '@/lib/content-types';
import {
  contentPath,
  getContentByType,
  getContentForLanguage,
  getContentItem,
  getContentTranslations,
  getRelatedContent,
} from '@/lib/content-source';
import type { ContentLanguage } from '@/lib/content-source';
import { extractCoverImage, normalizeMarkdownBody } from '@/lib/markdown';
import { estimateReadingTime } from '@/lib/reading-time';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { contentAlternates, localizedUrl, SITE_NAME, SITE_URL } from '@/lib/site';
import { getOgImageDimensions } from '@/lib/og-image-dimensions';

export async function generateStaticParams() {
  return getAllStaticParams();
}

function getAllStaticParams() {
  return CONTENT_TYPES
    .filter((contentType) => contentType.slug !== 'skill')
    .flatMap((contentType) =>
      getContentByType(contentType.slug).map((doc) => ({
        type: getUrlSlugForDbType(doc.type),
        slug: doc.slug,
      })),
    );
}

const getContent = cache(async (typeSlug: string, slug: string) => {
  return getContentItem(typeSlug, slug)
});

/**
 * Cached content fetch — shared between generateMetadata and the page component
 * so the content index is only read once per render.
 */
const getRelated = cache(async (typeSlug: string, slug: string) => {
  return getRelatedContent(typeSlug, slug, 3)
});

/** Every language version of this article, as links the switch can render. */
const getTranslationLinks = cache(async (typeSlug: string, slug: string) => {
  const versions = getContentTranslations(typeSlug, slug);
  return versions.map((version) => ({
    language: version.language,
    path: contentPath(version),
  }));
});

export const dynamicParams = true;

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, type, slug } = await params;
  setRequestLocale(locale);
  const contentType = getContentTypeByUrlSlug(type);
  if (!contentType) return { title: 'Not Found' };

  const item = await getContent(contentType.slug, slug);
  if (!item) return { title: 'Not Found' };

  const canonicalPath = contentPath(item);
  const canonicalUrl = localizedUrl(item.language, canonicalPath);
  const versions = await getTranslationLinks(contentType.slug, slug);
  const socialImage = item.ogImage ?? item.featuredImage;
  const socialImageUrl = socialImage?.url ? new URL(socialImage.url, SITE_URL).toString() : undefined;
  const socialImageSourceUrl = item.ogImage?.sourceUrl;
  const socialImageDimensions = getOgImageDimensions(socialImageSourceUrl);
  const socialTitle = item.title;
  const socialDescription = item.summary;

  return {
    title: item.title,
    description: item.summary,
    alternates: contentAlternates(item.language, canonicalPath, versions),
    robots: locale === item.language ? undefined : { index: false, follow: true },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: socialTitle,
      description: socialDescription,
      publishedTime: item.publishedAt,
      tags: item.topics,
      images: socialImageUrl
        ? [
            {
              url: socialImageUrl,
              ...(socialImageDimensions ?? {}),
              alt: socialImage?.alt ?? socialTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}) {
  const { locale, type, slug } = await params;
  setRequestLocale(locale);
  const contentType = getContentTypeByUrlSlug(type);
  if (!contentType || contentType.slug === 'skill') notFound();

  const item = await getContent(contentType.slug, slug);
  if (!item) notFound();

  // One article, one URL per language. Reaching a translated article under the
  // other language's prefix (what the global FR/EN switch does, since it only
  // swaps the prefix) lands here, so send the reader on to the version they
  // actually asked for. An article with no translation is served as-is.
  const language: ContentLanguage = locale === 'en' ? 'en' : 'fr';
  const translated = getContentForLanguage(contentType.slug, slug, language);
  if (translated) {
    permanentRedirect({ href: contentPath(translated), locale });
  }

  const related = await getRelated(contentType.slug, slug);
  const translations = (await getTranslationLinks(contentType.slug, slug)).map((version) => ({
    language: version.language,
    href: version.path,
  }));
  const t = await getTranslations('resources');
  const complexityLabels: Record<string, string> = {
    beginner: t('beginner'),
    intermediate: t('intermediate'),
    advanced: t('advanced'),
  };

  const cover = item.featuredImage;
  const { body: bodyWithoutCover, caption: coverCaption } = cover?.sourceUrl
    ? extractCoverImage(item.body, cover.sourceUrl)
    : { body: item.body, caption: undefined };
  const body = normalizeMarkdownBody(bodyWithoutCover);
  const readingTime = estimateReadingTime(item.body);
  const isVictorStory = item.series === 'victor-story';
  const isFocus = item.focus === true;
  const isTool = item.tool === true;
  const categoryLabel = isVictorStory ? "Victor's Story" : 'Article';

  const hasTranslation = translations.some((version) => version.language !== item.language);
  const [titleHead, titleTail] = splitTitle(item.title);

  return (
    <>
      <ReadingProgress />
      <main id="main-content" tabIndex={-1} className="pb-24">
        <article lang={item.language}>
          {/* The page's one main piece: title, summary, cover and the article's own data. */}
          <header className="pt-3.5 md:pt-[22px]">
            <div className="wrap">
              <div className="clay rim rim-warm rounded-[28px] px-[18px] pb-6 pt-2.5 [--rim-angle:125deg] md:rounded-slab md:px-12 md:pb-10 md:pt-5">
                <div className="flex flex-wrap items-center justify-between gap-x-4">
                  <BackLink href="/resources" label={t('back')} />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip">
                      <span className={`dot${isVictorStory ? ' dot-rim' : ''}`} aria-hidden="true" />
                      {categoryLabel}
                    </span>
                    {isFocus && (
                      <span className="chip">
                        <span className="dot" aria-hidden="true" />
                        {t('focus')}
                      </span>
                    )}
                    {isTool && (
                      <span className="chip">
                        <span className="dot" aria-hidden="true" />
                        {t('tools')}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`mt-2 grid items-start gap-6 md:mt-5 ${
                    cover?.url ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,.96fr)] lg:gap-14' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <h1 className="display m-0 text-4xl leading-none md:text-5xl lg:text-[56px] lg:leading-[0.98]">
                      {titleTail ? (
                        <>
                          {titleHead} <span className="bisque block">{titleTail}</span>
                        </>
                      ) : (
                        titleHead
                      )}
                    </h1>
                    {item.summary ? (
                      <p
                        className="lede mt-[18px] lg:mt-[26px]"
                        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                      />
                    ) : null}
                    {hasTranslation && (
                      <div className="mt-6">
                        <TranslationSwitch
                          language={item.language}
                          translations={translations}
                          variant="inline"
                          className="[&>*]:min-h-10"
                        />
                      </div>
                    )}
                  </div>

                  {cover?.url && (
                    <figure className="m-0 p-2 max-md:order-first">
                      <div className="rim relative aspect-[3/2] overflow-hidden rounded-[18px] outline outline-[7px] outline-[#e9eae9] [--rim-angle:135deg] md:rounded-3xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cover.url}
                          alt={cover.alt ?? item.title}
                          width={1536}
                          height={1024}
                          className="h-full w-full object-cover"
                          decoding="async"
                        />
                      </div>
                      {coverCaption ? (
                        <figcaption className="mt-5 text-xs font-mono text-muted-foreground">
                          {coverCaption}
                        </figcaption>
                      ) : null}
                    </figure>
                  )}
                </div>

                {/* The article's own data, engraved under the title. */}
                <hr className="groove mt-6 md:mt-9" />
                <dl className="m-0 mt-5 grid grid-cols-2 items-start gap-x-4 gap-y-5 lg:flex lg:flex-wrap lg:gap-y-5 [&>div]:min-w-0 lg:[&>div]:border-l lg:[&>div]:border-ink/10 lg:[&>div]:px-6 lg:[&>div]:shadow-[-1px_0_0_rgba(255,255,255,0.9)] lg:[&>div:first-child]:border-l-0 lg:[&>div:first-child]:pl-0 lg:[&>div:first-child]:shadow-none">
                  {item.publishedAt && (
                    <div className="col-span-2">
                      <dt className={specLabel}>{t('published')}</dt>
                      <dd className={specValue}>
                        <time dateTime={item.publishedAt} className="lg:whitespace-nowrap">
                          {formatDate(item.publishedAt, locale)}
                        </time>
                      </dd>
                    </div>
                  )}
                  {!hasTranslation && (
                    <div>
                      <dt className={specLabel}>{t('language')}</dt>
                      <dd className={specValue}>
                        <TranslationSwitch
                          language={item.language}
                          translations={translations}
                          variant="inline"
                        />
                      </dd>
                    </div>
                  )}
                  {item.complexity && !isVictorStory && (
                    <div>
                      <dt className={specLabel}>{t('complexity')}</dt>
                      <dd className={specValue}>{complexityLabels[item.complexity] || item.complexity}</dd>
                    </div>
                  )}
                  {readingTime > 0 && (
                    <div>
                      <dt className={specLabel}>{t('readTime')}</dt>
                      <dd className={specValue}>{readingTime} min</dd>
                    </div>
                  )}
                  {item.topics?.length ? (
                    <div className="col-span-2 lg:min-w-0 lg:flex-1">
                      <dt className={specLabel}>{t('topics')}</dt>
                      <dd className={specValue}>
                        {item.topics.map((topic) => (
                          <span key={topic} className="chip">
                            {topic}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
          </header>

          {/* The text: one calm column. */}
          <div className="pt-14 md:pt-[88px]">
            <div className="wrap">
              {body.trim().length > 0 ? (
                <MarkdownRenderer
                  content={body}
                  className="prose-vibe mx-auto"
                  trackingLocation="article_body"
                />
              ) : (
                <div className="state mx-auto max-w-[60ch]">
                  <p className="state-title">{t('contentComingSoon')}</p>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related content */}
        <KeepReading items={related} />
      </main>
    </>
  );
}

/**
 * « Titre : sous-titre » is set on two lines, the second in grey clay, like the
 * titles elsewhere. A title with no colon stays whole.
 */
const specLabel =
  'block whitespace-nowrap font-mono text-xs font-medium uppercase leading-none tracking-[0.14em] text-muted-foreground';
const specValue = 'm-0 mt-2.5 flex min-h-7 flex-wrap items-center gap-2 text-base font-semibold';

function splitTitle(title: string): [string, string | null] {
  const match = title.match(/^(.{4,64}?[:：])\s+(.+)$/s);
  return match ? [match[1], match[2]] : [title, null];
}
