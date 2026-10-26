import type { Metadata } from 'next';
import { Link, permanentRedirect } from "@/i18n/navigation";
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/JsonLd';
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
import { resourcesTheme } from '@/lib/resources-theme';
import { contentAlternates, localizedUrl, openGraphLocale, SITE_NAME, SITE_URL } from '@/lib/site';
import { articleSchema, breadcrumbList, extractMarkdownFaq, faqPageSchema } from '@/lib/structured-data';
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
  const socialDescription = item.summary;

  // When an article declares its own SEO title, use it as an absolute <title>
  // so the layout's `%s | The Vibe Company` template does not append the brand
  // a second time (the SEO title already includes it). H1 and social titles
  // keep using `item.title`.
  const htmlTitle = item.seoTitle ? { absolute: item.seoTitle } : item.title;

  return {
    title: htmlTitle,
    description: item.summary,
    alternates: contentAlternates(item.language, canonicalPath, versions),
    robots: locale === item.language ? undefined : { index: false, follow: true },
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
    summary: item.summary,
    publishedAt: item.publishedAt,
    language: item.language,
    imageUrl: socialImageUrl(item),
    series: item.series,
  });
  const faq = faqPageSchema(extractMarkdownFaq(item.body));

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1} className="pt-12 pb-24 min-h-screen bg-res-bg">
        <div className={`${resourcesTheme.section.padding} pb-24`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

            {/* Left Sidebar: Metadata */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-8">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
                  {t('back')}
                </Link>

                <div className="flex flex-col items-start gap-2 self-start">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${
                      isVictorStory
                        ? 'border-orange-500/40 bg-orange-500/10 text-orange-600'
                        : 'border-res-border text-res-text-muted'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isVictorStory ? 'bg-orange-500' : 'bg-res-text-muted'}`}
                      aria-hidden="true"
                    />
                    {categoryLabel}
                  </span>
                  {isFocus && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-res-text/30 bg-res-text/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-res-text">
                      <span className="w-1.5 h-1.5 rounded-full bg-res-text" aria-hidden="true" />
                      {t('focus')}
                    </span>
                  )}
                  {isTool && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-res-text/30 bg-res-text/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-res-text">
                      <span className="w-1.5 h-1.5 rounded-full bg-res-text" aria-hidden="true" />
                      {t('tools')}
                    </span>
                  )}
                </div>

                <div className="w-8 h-px bg-res-border" />

                <div className="flex flex-col gap-4">
                  {item.publishedAt && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">{t('published')}</span>
                      <span className="text-sm font-mono text-res-text-muted">
                        {formatDate(item.publishedAt, locale)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">{t('language')}</span>
                    <TranslationSwitch
                      language={item.language}
                      translations={translations}
                      variant="sidebar"
                    />
                  </div>

                  {item.complexity && !isVictorStory && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">{t('complexity')}</span>
                      <span className="text-sm font-mono text-res-text-muted">
                        {complexityLabels[item.complexity] || item.complexity}
                      </span>
                    </div>
                  )}

                  {readingTime > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">{t('readTime')}</span>
                      <span className="text-sm font-mono text-res-text-muted">{readingTime} min</span>
                    </div>
                  )}
                </div>

                {item.topics?.length ? (
                  <>
                    <div className="w-8 h-px bg-res-border" />
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                        {t('topics')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-1.5 py-0.5 border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text-muted"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </aside>

            {/* Main Content */}
            <article lang={item.language} className="lg:col-span-7 lg:col-start-5">
              {/* Mobile Header elements */}
              <div className="lg:hidden mb-8 flex flex-col gap-4">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted"
                >
                  &larr; {t('back')}
                </Link>
                <div className="flex flex-col items-start gap-2 self-start">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${
                      isVictorStory
                        ? 'border-orange-500/40 bg-orange-500/10 text-orange-600'
                        : 'border-res-border text-res-text-muted'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isVictorStory ? 'bg-orange-500' : 'bg-res-text-muted'}`}
                      aria-hidden="true"
                    />
                    {categoryLabel}
                  </span>
                  {isFocus && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-res-text/30 bg-res-text/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-res-text">
                      <span className="w-1.5 h-1.5 rounded-full bg-res-text" aria-hidden="true" />
                      {t('focus')}
                    </span>
                  )}
                  {isTool && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-res-text/30 bg-res-text/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-res-text">
                      <span className="w-1.5 h-1.5 rounded-full bg-res-text" aria-hidden="true" />
                      {t('tools')}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {item.publishedAt && (
                    <span className="text-xs font-mono text-res-text-muted">
                      {formatDate(item.publishedAt, locale)}
                    </span>
                  )}
                  <span className="text-res-text-muted/30">&bull;</span>
                  {readingTime > 0 && (
                    <span className="text-xs font-mono text-res-text-muted">{readingTime} min</span>
                  )}
                  <span className="text-res-text-muted/30">&bull;</span>
                  <TranslationSwitch
                    language={item.language}
                    translations={translations}
                    variant="inline"
                  />
                </div>
              </div>

              <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 leading-[0.95] text-res-text">
                  {item.title}
                </h1>
                {item.summary ? (
                  <p
                    className="text-base md:text-xl text-res-text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                  />
                ) : null}
              </header>

              <div className="w-full h-px bg-res-border mb-8 md:mb-12" />

              {cover?.url && (
                <figure className="mb-8 md:mb-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover.url}
                    alt={cover.alt ?? item.title}
                    className="w-full h-auto rounded-lg border border-res-border"
                    decoding="async"
                  />
                  {coverCaption ? (
                    <figcaption className="mt-3 text-xs font-mono text-res-text-muted">
                      {coverCaption}
                    </figcaption>
                  ) : null}
                </figure>
              )}

              <div className="prose-vibe prose-vibe-warm max-w-none">
                {body.trim().length > 0 ? (
                  <MarkdownRenderer content={body} className="prose-vibe prose-vibe-warm" trackingLocation="article_body" />
                ) : (
                  <div className="py-16 text-center border border-dashed border-res-border rounded-lg">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                      {t('contentComingSoon')}
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Right Sidebar: ToC Placeholder / Empty for now to create whitespace */}
            <div className="hidden lg:block lg:col-span-2">
              {/* Future: Table of Contents */}
            </div>

          </div>
        </div>

        {/* Related content */}
        <KeepReading items={related} />
      </main>
    </>
  );
}
