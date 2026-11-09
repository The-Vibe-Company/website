import type { Metadata } from 'next';
import { Link, permanentRedirect } from "@/i18n/navigation";
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BrandSquare } from '@/components/BrandSquare';
import { JsonLd } from '@/components/JsonLd';
import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { SkillAIInstaller } from '@/components/resources/SkillAIInstaller';
import { SkillCard } from '@/components/resources/SkillCard';
import { SkillPromptBlock } from '@/components/resources/SkillPromptBlock';
import { getContentByType, getContentItem, getRelatedContent } from '@/lib/content-source';
import { normalizeMarkdownBody } from '@/lib/markdown';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  localizedUrl,
  monolingualAlternates,
  openGraphImage,
  openGraphLocale,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';
import { breadcrumbList } from '@/lib/structured-data';
import { getOgImageDimensions } from '@/lib/og-image-dimensions';

export async function generateStaticParams() {
  return getContentByType('skill').map((doc) => ({ slug: doc.slug }));
}

const getSkill = cache(async (slug: string) => {
  return getContentItem('skill', slug);
});

const getRelated = cache(async (slug: string) => {
  return getRelatedContent('skill', slug, 3);
});

export const dynamicParams = true;

const page = resourcesTheme.page;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getSkill(slug);
  if (!item) return { title: 'Not Found' };

  const canonicalPath = `/resources/skills/${item.slug}`;
  const canonicalUrl = localizedUrl(item.language, canonicalPath);
  const socialImage = item.ogImage ?? item.featuredImage;
  const socialImageUrl = socialImage?.url ? new URL(socialImage.url, SITE_URL).toString() : undefined;
  const socialImageDimensions = getOgImageDimensions(item.ogImage?.sourceUrl);

  return {
    title: `${item.title} | Skills`,
    description: item.summary,
    alternates: monolingualAlternates(item.language, canonicalPath),
    openGraph: {
      type: 'article',
      locale: openGraphLocale(item.language),
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: item.title,
      description: item.summary,
      publishedTime: item.publishedAt,
      tags: item.topics,
      // A skill without a cover shares the default card, like the other pages.
      images: socialImageUrl
        ? [
            {
              url: socialImageUrl,
              ...(socialImageDimensions ?? {}),
              alt: socialImage?.alt ?? item.title,
            },
          ]
        : [openGraphImage(DEFAULT_OG_IMAGE)],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.summary,
      images: [socialImageUrl ?? absoluteUrl(DEFAULT_OG_IMAGE.path)],
    },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getSkill(slug);
  if (!item) notFound();

  // A skill is published in one language, under that language's prefix only:
  // the other prefix redirects there instead of serving a duplicate.
  if (item.language !== locale) {
    permanentRedirect({ href: `/resources/skills/${item.slug}`, locale: item.language });
  }

  const t = await getTranslations('resources');
  const skill = item.skill ?? { kind: 'native' as const };
  const body = normalizeMarkdownBody(item.body);
  const related = await getRelated(slug);

  const canonicalUrl = localizedUrl(item.language, `/resources/skills/${item.slug}`);
  const tFooter = await getTranslations({ locale: item.language, namespace: 'footer' });
  const breadcrumb = breadcrumbList([
    { name: tFooter('home'), url: localizedUrl(item.language) },
    { name: tFooter('resources'), url: localizedUrl(item.language, '/resources') },
    { name: item.title, url: canonicalUrl },
  ]);

  const installContext = {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    canonicalUrl,
    kind: skill.kind,
    allowedTools: skill.allowedTools,
    trigger: skill.trigger,
    sourceUrl: skill.sourceUrl,
    sourcePath: skill.sourcePath,
  };

  const promptBody = skill.kind === 'native' ? body : '';
  const showPromptBlock = promptBody.trim().length > 0;
  const showDocumentation = skill.kind !== 'native' && body.trim().length > 0;
  const creatorNote = skill.creatorNote;

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1} className="bg-res-bg">
        <article lang={item.language}>
          {/* 1 — On the ink: the skill's name and what it does, in the
              orange light. */}
          <div className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-96 -right-48 h-[900px] w-[1100px]"
              style={{ background: page.bloom }}
            />
            <div className={`relative ${page.container} pb-14 pt-10 md:pb-20 lg:pt-14`}>
              <Link href="/resources" className={page.link}>
                <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
                {t('skillsSection')}
              </Link>

              <header className="mt-10 flex flex-col lg:mt-14">
                <span className={page.heroKicker}>
                  <BrandSquare />
                  {t('skillBadge')}
                </span>

                <h1 className="m-0 mt-6 max-w-[16ch] text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-8">
                  {item.title}
                </h1>

                {item.summary && (
                  <p
                    className={`${page.heroLede} mt-8 md:mt-10`}
                    dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                  />
                )}
              </header>
            </div>
          </div>

          {/* 2 — On warm paper: why it exists, the AI install under its lamp,
              then the prompt itself. */}
          <div data-surface="paper">
            <div className={`${page.container} py-14 md:py-20`}>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
                <div className="min-w-0 empty:hidden">
                  {creatorNote && (
                    <CreatorNote note={creatorNote} label={t('creatorNote')} />
                  )}

                  {skill.trigger && (
                    <SkillSnapshot trigger={skill.trigger} label={t('goodFor')} />
                  )}
                </div>

                <aside className="lg:sticky lg:top-28 lg:row-span-2">
                  <SkillAIInstaller context={installContext} />
                </aside>

                <div className="min-w-0 lg:col-start-1">
                  {showPromptBlock && (
                    <section className="mt-2 lg:mt-4">
                      <SectionHeader
                        title={t('prompt')}
                        hint={t('promptHint')}
                      />
                      <SkillPromptBlock body={promptBody} />
                    </section>
                  )}

                  {showDocumentation && (
                    <section className="mt-8">
                      <SectionHeader title={t('notes')} />
                      <div className="prose-vibe prose-vibe-warm max-w-none">
                        <MarkdownRenderer content={body} className="prose-vibe prose-vibe-warm" trackingLocation="skill_body" />
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <div data-surface="paper">
            <section className={page.container}>
              <div className="border-t border-border py-20 md:py-24">
                <div className="mb-10 flex items-center justify-between gap-4">
                  <span className={page.mono}>
                    <BrandSquare />
                    {t('relatedSkills')}
                  </span>
                  <Link href="/resources" className={page.link}>
                    {t('viewAll')} &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <SkillCard
                      key={r.id}
                      title={r.title}
                      summary={r.summary}
                      slug={r.slug}
                      publishedAt={r.publishedAt ?? undefined}
                      language={r.language}
                      topics={r.topics}
                      complexity={r.complexity}
                      skill={r.skill}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function CreatorNote({ note, label }: { note: string; label: string }) {
  return (
    <aside className="max-w-3xl border border-border bg-card px-5 py-5 md:px-7 md:py-6">
      <div className="grid gap-2 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-6">
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p
          className="m-0 text-[15px] leading-[1.65] text-foreground md:text-base"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(note) }}
        />
      </div>
    </aside>
  );
}

function SkillSnapshot({ trigger, label }: { trigger: string; label: string }) {
  return (
    <section className="mt-4 max-w-3xl border-l border-border-strong py-1 pl-5 md:pl-7 first:mt-0">
      <p className="m-0 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="m-0 text-[15px] leading-[1.6] text-foreground">{trigger}</p>
    </section>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="mb-5 flex flex-col gap-2">
      <h2 className="m-0 font-mono text-[12px] font-normal uppercase tracking-[0.2em] text-foreground">
        <BrandSquare />
        {title}
      </h2>
      {hint && <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">{hint}</p>}
    </header>
  );
}
