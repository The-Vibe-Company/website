import type { Metadata } from 'next';
import Image from 'next/image';
import { Link, permanentRedirect } from "@/i18n/navigation";
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BrandSquare } from '@/components/BrandSquare';
import { JsonLd } from '@/components/JsonLd';
import { KeepReading } from '@/components/resources/KeepReading';
import { TranslationSwitch } from '@/components/resources/TranslationSwitch';
import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { CONTENT_TYPES, getContentTypeByUrlSlug, getUrlSlugForDbType } from '@/lib/content-types';
import {
  contentPath,
  toPlainText,
  getCanonicalContentForLanguage,
  getContentByType,
  getContentItem,
  getContentTranslations,
  getRelatedContent,
} from '@/lib/content-source';
import type { ContentLanguage } from '@/lib/content-source';
import { extractCoverImage, normalizeMarkdownBody } from '@/lib/markdown';
import { estimateReadingTime } from '@/lib/reading-time';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';
import { contentAlternates, localizedUrl, openGraphLocale, SITE_NAME, SITE_URL } from '@/lib/site';
import { articleFaqPageSchema, articleSchema, breadcrumbList } from '@/lib/structured-data';
import { getCoverImageDimensions, getOgImageDimensions } from '@/lib/og-image-dimensions';

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

const page = resourcesTheme.page;

function socialImageUrl(item: { ogImage?: { url: string } | null; featuredImage?: { url: string } | null }) {
  const image = item.ogImage ?? item.featuredImage;
  return image?.url ? new URL(image.url, SITE_URL).toString() : undefined;
}

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
  const imageUrl = socialImageUrl(item);
  const socialImageSourceUrl = item.ogImage?.sourceUrl;
  const socialImageDimensions = getOgImageDimensions(socialImageSourceUrl);
  const socialTitle = item.title;
  const socialDescription = item.seoDescription ?? toPlainText(item.summary);

  // When an article declares its own SEO title, use it as an absolute <title>
  // so the layout's `%s | The Vibe Company` template does not append the brand
  // a second time (the SEO title already includes it). H1 and social titles
  // keep using `item.title`.
  const htmlTitle = item.seoTitle ? { absolute: item.seoTitle } : item.title;

  return {
    title: htmlTitle,
    description: socialDescription,
    alternates: contentAlternates(item.language, canonicalPath, versions),
    openGraph: {
      type: 'article',
      locale: openGraphLocale(item.language),
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: socialTitle,
      description: socialDescription,
      publishedTime: item.publishedAt,
      tags: item.topics,
      images: imageUrl
        ? [
            {
              url: imageUrl,
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
      images: imageUrl ? [imageUrl] : undefined,
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

  // One article, one URL per language. Reaching an article under the other
  // language's prefix (what the global FR/EN switch does, since it only swaps
  // the prefix) lands here. A translated article sends the reader on to the
  // version they asked for; an article published in one language only sends
  // them to its own URL, so the other prefix never serves a duplicate.
  const language: ContentLanguage = locale === 'en' ? 'en' : 'fr';
  const target = getCanonicalContentForLanguage(contentType.slug, slug, language) ?? item;
  if (target.slug !== item.slug || target.language !== locale) {
    permanentRedirect({ href: contentPath(target), locale: target.language });
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
  const coverDimensions = getCoverImageDimensions(cover?.sourceUrl);
  const { body: bodyWithoutCover, caption: coverCaption } = cover?.sourceUrl
    ? extractCoverImage(item.body, cover.sourceUrl)
    : { body: item.body, caption: undefined };
  const body = normalizeMarkdownBody(bodyWithoutCover);
  const readingTime = estimateReadingTime(item.body);
  const isVictorStory = item.series === 'victor-story';
  const isFocus = item.focus === true;
  const isTool = item.tool === true;
  const categoryLabel = isVictorStory ? "Victor's Story" : 'Article';

  // Structured data describes the canonical version, in its own language.
  const canonicalUrl = localizedUrl(item.language, contentPath(item));
  const tFooter = await getTranslations({ locale: item.language, namespace: 'footer' });
  const breadcrumb = breadcrumbList([
    { name: tFooter('home'), url: localizedUrl(item.language) },
    { name: tFooter('resources'), url: localizedUrl(item.language, '/resources') },
    { name: item.title, url: canonicalUrl },
  ]);
  const article = articleSchema({
    url: canonicalUrl,
    title: item.title,
    summary: item.seoDescription ?? toPlainText(item.summary),
    publishedAt: item.publishedAt,
    language: item.language,
    imageUrl: socialImageUrl(item),
    series: item.series,
  });
  const faq = articleFaqPageSchema(item.body);

  // Category, then the Focus / Tools markers: the kicker over the title.
  const kicker = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <span className={page.heroKicker}>
        <BrandSquare />
        {categoryLabel}
      </span>
      {isFocus && <span className={page.tag}>{t('focus')}</span>}
      {isTool && <span className={page.tag}>{t('tools')}</span>}
    </div>
  );
  const metaLabel = 'font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground';
  const metaValue = 'text-sm font-mono text-foreground';

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1} className="bg-res-bg">
        <article lang={item.language}>
          {/* 1 — On the ink: the title and its summary, in the orange light. */}
          <header className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-96 -right-48 h-[900px] w-[1100px]"
              style={{ background: page.bloom }}
            />
            <div className={`relative ${page.container} pb-14 pt-10 md:pb-20 lg:pb-24 lg:pt-14`}>
              <Link href="/resources" className={page.link}>
                <span aria-hidden="true">&larr;</span>
                {t('back')}
              </Link>

              <div className="mt-10 lg:mt-14">{kicker}</div>

              <h1 className="m-0 mt-6 max-w-[20ch] text-[clamp(2.25rem,5.4vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.045em] text-foreground text-balance lg:mt-8">
                {item.title}
              </h1>
              {item.summary ? (
                <p
                  className={`${page.heroLede} mt-8 md:mt-10`}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                />
              ) : null}

              {/* Phones: the essentials in one line (the sidebar holds them
                  on wide screens). */}
              <div className="mt-8 flex flex-wrap items-center gap-3 lg:hidden">
                {item.publishedAt && (
                  <span className="text-xs font-mono text-soft-foreground">
                    {formatDate(item.publishedAt, locale)}
                  </span>
                )}
                <span className="text-muted-foreground" aria-hidden="true">&bull;</span>
                {readingTime > 0 && (
                  <span className="text-xs font-mono text-soft-foreground">{readingTime} min</span>
                )}
                <span className="text-muted-foreground" aria-hidden="true">&bull;</span>
                <TranslationSwitch
                  language={item.language}
                  translations={translations}
                  variant="inline"
                />
              </div>
            </div>
          </header>

          {/* 2 — The reading, ink on warm paper, in a comfortable measure. */}
          <div data-surface="paper">
            <div className={`${page.container} pb-16 pt-12 md:pb-20 md:pt-16`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

                {/* Left Sidebar: Metadata */}
                <aside className="lg:col-span-3 hidden lg:block">
                  <div className="sticky top-32 flex flex-col gap-6 border-t border-border pt-6">
                    {item.publishedAt && (
                      <div className="flex flex-col gap-1.5">
                        <span className={metaLabel}>{t('published')}</span>
                        <span className={metaValue}>
                          {formatDate(item.publishedAt, locale)}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <span className={metaLabel}>{t('language')}</span>
                      <TranslationSwitch
                        language={item.language}
                        translations={translations}
                        variant="sidebar"
                      />
                    </div>

                    {item.complexity && !isVictorStory && (
                      <div className="flex flex-col gap-1.5">
                        <span className={metaLabel}>{t('complexity')}</span>
                        <span className={metaValue}>
                          {complexityLabels[item.complexity] || item.complexity}
                        </span>
                      </div>
                    )}

                    {readingTime > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className={metaLabel}>{t('readTime')}</span>
                        <span className={metaValue}>{readingTime} min</span>
                      </div>
                    )}

                    {item.topics?.length ? (
                      <div className="flex flex-col gap-2.5 border-t border-border pt-6">
                        <span className={metaLabel}>
                          {t('topics')}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.topics.map((topic) => (
                            <span
                              key={topic}
                              className="border border-border bg-card px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-soft-foreground"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </aside>

                {/* Main Content */}
                <div className="min-w-0 lg:col-span-7 lg:col-start-5">
                  {cover?.url && (
                    <figure className="m-0 mb-10 md:mb-14">
                      {/* The cover is the LCP element on mobile: served through the
                          Next image optimizer (AVIF/WebP at the rendered width),
                          preloaded with high priority, never lazy. `sizes` follows
                          the article column: full width minus the section padding,
                          then 7 of 12 columns (gap-12) from lg. */}
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? item.title}
                        width={coverDimensions.width}
                        height={coverDimensions.height}
                        sizes="(min-width: 1024px) calc(58.33vw - 132px), (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
                        preload
                        fetchPriority="high"
                        className="w-full h-auto border border-border"
                      />
                      {coverCaption ? (
                        <figcaption className="mt-3 text-xs font-mono text-muted-foreground">
                          {coverCaption}
                        </figcaption>
                      ) : null}
                    </figure>
                  )}

                  <div className="prose-vibe prose-vibe-warm max-w-none">
                    {body.trim().length > 0 ? (
                      <MarkdownRenderer content={body} className="prose-vibe prose-vibe-warm" trackingLocation="article_body" />
                    ) : (
                      <div className="py-16 text-center border border-border bg-card">
                        <p className={page.mono}>
                          {t('contentComingSoon')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar: ToC Placeholder / Empty for now to create whitespace */}
                <div className="hidden lg:block lg:col-span-2">
                  {/* Future: Table of Contents */}
                </div>

              </div>
            </div>
          </div>
        </article>

        {/* Related content, still on paper. */}
        <div data-surface="paper">
          <KeepReading items={related} />
        </div>
      </main>
    </>
  );
}
