import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SectionTitle } from '@/components/kit';
import { JsonLd } from '@/components/JsonLd';
import { ArticleBrowser, type ArticleCardItem } from '@/components/resources/ArticleBrowser';
import { ResourcesHomeSearch } from '@/components/resources/ResourcesHomeSearch';
import {
  contentPath,
  getContentByTypeForLanguage,
  getContentTranslations,
} from '@/lib/content-source';
import type { ContentEntry, ContentLanguage } from '@/lib/content-source';
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from '@/lib/site';
import { breadcrumbList, collectionPageSchema } from '@/lib/structured-data';

const RESOURCES_ITEM_LIST_CAP = 15;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });
  const title = t('metaTitle');
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
  // Articles come back sorted by publishedAt desc, so both sections stay in
  // chronological order (newest first). The D-day badge comes from seriesDay. A translated article is
  // represented once, by its version in the language being browsed.
  const language: ContentLanguage = locale === 'en' ? 'en' : 'fr';
  const articles = getContentByTypeForLanguage('article', language);
  const victorStory = articles.filter((a) => a.series === VICTOR_SERIES).map(toCard);
  const others = articles.filter((a) => a.series !== VICTOR_SERIES).map(toCard);
  const articleCount = articles.length;
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const hubUrl = localizedUrl(locale, '/resources');
  const collectionItems = articles.slice(0, RESOURCES_ITEM_LIST_CAP).map((article) => ({
    name: article.title,
    url: localizedUrl(locale, contentPath(article)),
  }));

  return (
    <main id="main-content" tabIndex={-1} className="pb-24 md:pb-[120px]">
      <JsonLd
        data={collectionPageSchema({
          url: hubUrl,
          name: t('metaTitle'),
          description: t('subtitle'),
          language,
          items: collectionItems,
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: tFooter('home'), url: localizedUrl(locale) },
          { name: tFooter('resources'), url: hubUrl },
        ])}
      />
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
