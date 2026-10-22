import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SectionTitle } from '@/components/kit';
import { ArticleBrowser, type ArticleCardItem } from '@/components/resources/ArticleBrowser';
import { ResourcesHomeSearch } from '@/components/resources/ResourcesHomeSearch';
import {
  contentPath,
  getContentByTypeForLanguage,
  getContentTranslations,
} from '@/lib/content-source';
import type { ContentEntry, ContentLanguage } from '@/lib/content-source';
import { PRIORITY_ARTICLES } from '@/lib/priority-articles';
import { localizedAlternates, localizedSocialMetadata } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });
  const title = t('kicker');
  const description = t('subtitle');
  return {
    title,
    description,
    alternates: localizedAlternates(locale, '/resources'),
    ...localizedSocialMetadata({
      locale,
      path: '/resources',
      title,
      description,
    }),
  };
}

const VICTOR_SERIES = 'victor-story';

function toCard(item: ContentEntry): ArticleCardItem {
  // Only translated articles carry the pair; the rest keep a single flag.
  const versions = getContentTranslations(item.type, item.slug);
  const translations =
    versions.length > 1
      ? versions.map((version) => ({
          language: version.language,
          href: contentPath(version),
        }))
      : undefined;

  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    type: item.type,
    slug: item.slug,
    publishedAt: item.publishedAt ?? undefined,
    language: item.language,
    translations,
    seriesDay: item.seriesDay,
    focus: item.focus,
    tool: item.tool,
    image: item.featuredImage?.url
      ? { url: item.featuredImage.url, alt: item.featuredImage.alt ?? item.title }
      : null,
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'resources' });
  // Articles come back sorted by publishedAt desc, so both columns stay in
  // chronological order (newest first), after the pinned priority articles.
  // The D-day badge comes from seriesDay. A translated article is
  // represented once, by its version in the language being browsed.
  const language: ContentLanguage = locale === 'en' ? 'en' : 'fr';
  const articles = getContentByTypeForLanguage('article', language);
  const victorStory = articles.filter((a) => a.series === VICTOR_SERIES).map(toCard);
  const prioritySlugs: readonly string[] = PRIORITY_ARTICLES[language].map(({ slug }) => slug);
  const priorityRank = (slug: string) => {
    const index = prioritySlugs.indexOf(slug);
    return index === -1 ? prioritySlugs.length : index;
  };
  const others = articles
    .filter((a) => a.series !== VICTOR_SERIES)
    .sort((a, b) => priorityRank(a.slug) - priorityRank(b.slug))
    .map((item) => ({ ...toCard(item), priority: prioritySlugs.includes(item.slug) }));
  const articleCount = articles.length;

  return (
    <main id="main-content" tabIndex={-1} className="pb-24 md:pb-[120px]">
      <section className="pt-12 md:pt-[76px]">
        <div className="wrap">
          <SectionTitle
            as="h1"
            size="lg"
            kicker={
              <>
                {t('kicker')} <span className="bisque">/</span> {articleCount}{' '}
                {articleCount === 1 ? 'article' : 'articles'}
              </>
            }
            line1={t('title')}
          >
            <p>{t('subtitle')}</p>
          </SectionTitle>
          <ArticleBrowser
            victorStory={victorStory}
            others={others}
            searchSlot={<ResourcesHomeSearch key="search" />}
          />
        </div>
      </section>
    </main>
  );
}
