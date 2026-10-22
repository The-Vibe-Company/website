import type { Metadata } from 'next';
import type React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { ButtonLink, Kicker } from '@/components/kit';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { SkillCard } from '@/components/resources/SkillCard';
import { searchContent } from '@/lib/content-source';
import type { ContentEntry } from '@/lib/content-source';
import { localizedAlternates, localizedSocialMetadata } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });
  const title = t('searchTitle');
  const description = t('subtitle');
  return {
    title,
    description,
    alternates: localizedAlternates(locale, '/resources/search'),
    ...localizedSocialMetadata({
      locale,
      path: '/resources/search',
      title,
      description,
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

/**
 * Best match first: a title that holds the query, then a summary, then the
 * body; inside a tier the language being browsed comes before the other one.
 * The sort is stable, so the date order of the source stays the tiebreaker.
 */
function rankResults(results: ContentEntry[], query: string, locale: string): ContentEntry[] {
  const needle = query.trim().toLowerCase();
  const tier = (item: ContentEntry) =>
    item.title.toLowerCase().includes(needle) ? 0 : item.summary.toLowerCase().includes(needle) ? 1 : 2;
  const sameLanguage = (item: ContentEntry) => (item.language === locale ? 0 : 1);
  return results
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        tier(a.item) - tier(b.item) ||
        sameLanguage(a.item) - sameLanguage(b.item) ||
        a.index - b.index,
    )
    .map(({ item }) => item);
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { q } = await searchParams;
  const query = q ?? '';
  if (!query) redirect({ href: '/resources', locale });

  const t = await getTranslations({ locale, namespace: 'resources' });
  const results = rankResults(searchContent(query), query, locale).slice(0, 50);
  const skillResults = results.filter((item) => item.type === 'skill');
  const articleResults = results.filter((item) => item.type !== 'skill');

  return (
    <main id="main-content" tabIndex={-1} className="pb-24 md:pb-[120px]">
      <section className="pt-12 md:pt-[76px]">
        <div className="wrap">
          <Kicker>{t('searchResults')}</Kicker>
          <h1 className="display d-sm mt-5 break-words">
            &ldquo;{query}&rdquo;
          </h1>
          <p className="lede mt-6">{t('foundResults', { count: results.length })}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          {results.length > 0 ? (
            <div className="grid gap-14 md:gap-16">
              {skillResults.length > 0 && (
                <SearchSection title={t('skillsSection')} countLabel={t('resultCount', { count: skillResults.length })}>
                  <ContentGrid columns={3}>
                    {skillResults.map((item) => (
                      <SkillCard
                        key={item.id}
                        title={item.title}
                        summary={item.summary}
                        slug={item.slug}
                        publishedAt={item.publishedAt ?? undefined}
                        language={item.language}
                        topics={item.topics}
                        complexity={item.complexity}
                        skill={item.skill}
                      />
                    ))}
                  </ContentGrid>
                </SearchSection>
              )}

              {articleResults.length > 0 && (
                <SearchSection title={t('articles')} countLabel={t('resultCount', { count: articleResults.length })}>
                  <div className="entries lg:grid-cols-2">
                    {articleResults.map((item) => (
                      <ContentCard
                        key={item.id}
                        title={item.title}
                        summary={item.summary}
                        type={item.type}
                        slug={item.slug}
                        publishedAt={item.publishedAt ?? undefined}
                        language={item.language}
                        featuredImage={item.featuredImage}
                      />
                    ))}
                  </div>
                </SearchSection>
              )}
            </div>
          ) : (
            <div className="state">
              <Kicker>{t('noResults')}</Kicker>
              <p className="state-title">{t('tryAdjusting')}</p>
              <ButtonLink href="/resources" variant="clay" size="sm" arrow className="mt-2">
                {t('clearSearch')}
              </ButtonLink>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SearchSection({
  title,
  countLabel,
  children,
}: {
  title: string;
  countLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="display d-xs m-0">{title}</h2>
        <span className="chip">{countLabel}</span>
      </header>
      <hr className="groove mb-5" />
      {children}
    </section>
  );
}
