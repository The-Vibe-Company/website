import type { Metadata } from 'next';
import { Link } from "@/i18n/navigation";
import type React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { BrandSquare } from '@/components/BrandSquare';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { SkillCard } from '@/components/resources/SkillCard';
import { searchContent } from '@/lib/content-source';
import { resourcesTheme } from '@/lib/resources-theme';
import { localizedAlternates, localizedSocialMetadata } from '@/lib/site';

export const dynamic = 'force-dynamic';

const page = resourcesTheme.page;

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
  const results = searchContent(query).slice(0, 50);
  const skillResults = results.filter((item) => item.type === 'skill');
  const articleResults = results.filter((item) => item.type !== 'skill');

  return (
    <main id="main-content" tabIndex={-1} className="bg-res-bg">
      {/* 1 — On the ink: what was searched, in the orange light. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-96 -right-48 h-[900px] w-[1100px]"
          style={{ background: page.bloom }}
        />
        <div className={`relative ${page.container} pb-14 pt-12 md:pb-20 lg:pt-[72px]`}>
          <span className={page.heroKicker}>
            <BrandSquare />
            {t('searchResults')}
          </span>
          <h1 className="m-0 mt-8 max-w-[18ch] break-words text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-10">
            &ldquo;{query}&rdquo;
          </h1>
          <p className={`${page.heroLede} mt-8 md:mt-10`}>
            {t('foundResults', { count: results.length })}
          </p>
        </div>
      </section>

      {/* 2 — The results on warm paper. */}
      <div data-surface="paper">
        <section className={`${page.container} pb-24 pt-14 md:pb-32 md:pt-20`}>
          {results.length > 0 ? (
            <div className="space-y-16 md:space-y-24">
              {skillResults.length > 0 && (
                <SearchSection title={t('skillsSection')} count={skillResults.length} countLabel={t('resultCount', { count: skillResults.length })}>
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
                <SearchSection title={t('articles')} count={articleResults.length} countLabel={t('resultCount', { count: articleResults.length })}>
                  <div className="space-y-4">
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
            <div className="border border-border bg-card px-6 py-14 text-center md:p-16">
              <p className={page.mono}>
                {t('noResults')}
              </p>
              <p className="m-0 mt-3 text-[15px] leading-[1.6] text-muted-foreground">
                {t('tryAdjusting')}
              </p>
              <Link href="/resources" className={`mt-8 ${page.link}`}>
                {t('clearSearch')}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SearchSection({
  title,
  countLabel,
  children,
}: {
  title: string;
  count: number;
  countLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-5 md:mb-8">
        <h2 className={page.h2}>{title}</h2>
        <span className={`${page.mono} shrink-0 pb-1`}>
          {countLabel}
        </span>
      </header>
      {children}
    </section>
  );
}
