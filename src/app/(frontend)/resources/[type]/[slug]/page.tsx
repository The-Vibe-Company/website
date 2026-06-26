import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { KeepReading } from '@/components/resources/KeepReading';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { CONTENT_TYPES, getContentTypeByUrlSlug, getUrlSlugForDbType } from '@/lib/content-types';
import { getContentByType, getContentItem, getRelatedContent } from '@/lib/content-source';
import { extractCoverImage, normalizeMarkdownBody } from '@/lib/markdown';
import { estimateReadingTime } from '@/lib/reading-time';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';
import { getTypeLabel } from '@/lib/taxonomy-utils';
import { SITE_NAME, SITE_URL } from '@/lib/site';
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

export const dynamicParams = true;

const complexityLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const contentType = getContentTypeByUrlSlug(type);
  if (!contentType) return { title: 'Not Found' };

  const item = await getContent(contentType.slug, slug);
  if (!item) return { title: 'Not Found' };

  const canonicalPath = `/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
  const socialImage = item.ogImage ?? item.featuredImage;
  const socialImageUrl = socialImage?.url ? new URL(socialImage.url, SITE_URL).toString() : undefined;
  const socialImageSourceUrl = item.ogImage?.sourceUrl;
  const socialImageDimensions = getOgImageDimensions(socialImageSourceUrl);
  const socialTitle = item.title;
  const socialDescription = item.summary;

  return {
    title: `${item.title} | ${SITE_NAME}`,
    description: item.summary,
    alternates: {
      canonical: canonicalUrl,
    },
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
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const contentType = getContentTypeByUrlSlug(type);
  if (!contentType || contentType.slug === 'skill') notFound();

  const item = await getContent(contentType.slug, slug);
  if (!item) notFound();

  const related = await getRelated(contentType.slug, slug);

  const cover = item.featuredImage;
  const { body: bodyWithoutCover, caption: coverCaption } = cover?.sourceUrl
    ? extractCoverImage(item.body, cover.sourceUrl)
    : { body: item.body, caption: undefined };
  const body = normalizeMarkdownBody(bodyWithoutCover);
  const readingTime = estimateReadingTime(item.body);
  const typeLabel = getTypeLabel(item.type);
  const isVictorStory = item.series === 'victor-story';
  const categoryLabel = isVictorStory ? "Victor's Story" : 'Article';

  return (
    <>
      <ReadingProgress />
      <main className="pt-12 pb-24 min-h-screen bg-res-bg">
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
                  {typeLabel || type}
                </Link>

                <span
                  className={`inline-flex items-center gap-2 self-start rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${
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

                <div className="w-8 h-px bg-res-border" />

                <div className="flex flex-col gap-4">
                  {item.publishedAt && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Published</span>
                      <span className="text-sm font-mono text-res-text-muted">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Language</span>
                    <LanguageFlag language={item.language} variant="sidebar" />
                  </div>

                  {item.complexity && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Complexity</span>
                      <span className="text-sm font-mono text-res-text-muted">
                        {complexityLabels[item.complexity] || item.complexity}
                      </span>
                    </div>
                  )}

                  {readingTime > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">Read Time</span>
                      <span className="text-sm font-mono text-res-text-muted">{readingTime} min</span>
                    </div>
                  )}
                </div>

                {item.topics?.length ? (
                  <>
                    <div className="w-8 h-px bg-res-border" />
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                        Topics
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
            <article className="lg:col-span-7 lg:col-start-5">
              {/* Mobile Header elements */}
              <div className="lg:hidden mb-8 flex flex-col gap-4">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted"
                >
                  &larr; {typeLabel || type}
                </Link>
                <span
                  className={`inline-flex items-center gap-2 self-start rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${
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
                <div className="flex flex-wrap items-center gap-3">
                  {item.publishedAt && (
                    <span className="text-xs font-mono text-res-text-muted">
                      {formatDate(item.publishedAt)}
                    </span>
                  )}
                  <span className="text-res-text-muted/30">&bull;</span>
                  {readingTime > 0 && (
                    <span className="text-xs font-mono text-res-text-muted">{readingTime} min</span>
                  )}
                  <span className="text-res-text-muted/30">&bull;</span>
                  <LanguageFlag language={item.language} variant="inline" />
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
                  <MarkdownRenderer content={body} className="prose-vibe prose-vibe-warm" />
                ) : (
                  <div className="py-16 text-center border border-dashed border-res-border rounded-lg">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                      Content coming soon
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
