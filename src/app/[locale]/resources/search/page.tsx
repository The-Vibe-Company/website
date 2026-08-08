import type { Metadata } from 'next';
import { Link } from "@/i18n/navigation";
import type React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { ContentCard } from '@/components/resources/ContentCard';
import { ContentGrid } from '@/components/resources/ContentGrid';
import { SkillCard } from '@/components/resources/SkillCard';
import { searchContent } from '@/lib/content-source';
import { resourcesTheme } from '@/lib/resources-theme';
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
  return {
    title,
    alternates: localizedAlternates(locale, '/resources/search'),
    ...localizedSocialMetadata({
      locale,
      path: '/resources/search',
      title,
      description: title,
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
    <main id="main-content" tabIndex={-1} className="pt-12 pb-12">
      <section className={`${resourcesTheme.section.padding} pt-2 pb-8 border-b border-res-border mb-8`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
            {t('searchResults')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
            &ldquo;{query}&rdquo;
          </h1>
          <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
            {t('foundResults', { count: results.length })}
          </p>
        </div>
      </section>

      <section className={`${resourcesTheme.section.padding} pb-32`}>
        {results.length > 0 ? (
          <div className="space-y-14">
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
                <div className="space-y-6">
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
          <div className="rounded-xl border border-res-border p-12 text-center bg-res-surface">
            <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              {t('noResults')}
            </p>
            <p className="text-sm text-res-text-muted mt-2">
              {t('tryAdjusting')}
            </p>
            <Link href="/resources" className="inline-block mt-8 text-xs font-mono uppercase tracking-widest text-res-text border-b border-res-text pb-1 hover:text-res-text-muted hover:border-res-text-muted transition-colors">
              {t('clearSearch')}
            </Link>
          </div>
        )}
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
  count: number;
  countLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-6 flex items-baseline gap-3 border-b border-res-border pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-res-text">{title}</h2>
        <span className="text-[11px] font-mono uppercase tracking-widest text-res-text-muted">
          {countLabel}
        </span>
      </header>
      {children}
    </section>
  );
}
