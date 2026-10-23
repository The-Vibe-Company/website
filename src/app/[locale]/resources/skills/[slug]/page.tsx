import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BackLink } from '@/components/BackLink';
import { Chip, Groove, Kicker, LinkRim } from '@/components/kit';
import { JsonLd } from '@/components/JsonLd';
import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { SkillAIInstaller } from '@/components/resources/SkillAIInstaller';
import { SkillCard } from '@/components/resources/SkillCard';
import { SkillPromptBlock } from '@/components/resources/SkillPromptBlock';
import { getContentByType, getContentItem, getRelatedContent } from '@/lib/content-source';
import { normalizeMarkdownBody } from '@/lib/markdown';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import {
  absoluteUrl,
  localizedUrl,
  monolingualAlternates,
  openGraphLocale,
  SITE_LOGO,
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
    robots: locale === item.language ? undefined : { index: false, follow: true },
    openGraph: {
      type: 'article',
      locale: openGraphLocale(item.language),
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: item.title,
      description: item.summary,
      publishedTime: item.publishedAt,
      tags: item.topics,
      // A skill without a cover shares the site logo, like the other pages.
      images: socialImageUrl
        ? [
            {
              url: socialImageUrl,
              ...(socialImageDimensions ?? {}),
              alt: socialImage?.alt ?? item.title,
            },
          ]
        : [{ url: absoluteUrl(SITE_LOGO.path), width: SITE_LOGO.width, height: SITE_LOGO.height, alt: SITE_NAME }],
    },
    twitter: {
      card: socialImageUrl ? 'summary_large_image' : 'summary',
      title: item.title,
      description: item.summary,
      images: [socialImageUrl ?? absoluteUrl(SITE_LOGO.path)],
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

  const [titleHead, titleTail] = splitTitle(item.title);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1} className="pb-24">
        <article lang={item.language}>
          <div className="wrap pt-3.5 md:pt-[22px]">
            <BackLink href="/resources" label={t('skillsSection')} />

            <div className="mt-2 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
              <div className="min-w-0">
                <header className="flex flex-col items-start gap-5">
                  <Chip>{t('skillBadge')}</Chip>

                  <h1 className="display m-0 text-4xl leading-none md:text-5xl lg:text-[56px] lg:leading-[0.98]">
                    {titleTail ? (
                      <>
                        {titleHead} <span className="bisque block">{titleTail}</span>
                      </>
                    ) : (
                      titleHead
                    )}
                  </h1>

                  {item.summary && (
                    <p
                      className="lede m-0"
                      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                    />
                  )}
                </header>

                {creatorNote && <CreatorNote note={creatorNote} label={t('creatorNote')} />}

                {skill.trigger && <SkillSnapshot trigger={skill.trigger} label={t('goodFor')} />}
              </div>

              <aside className="lg:sticky lg:top-24 lg:row-span-2">
                <SkillAIInstaller context={installContext} />
              </aside>

              <div className="min-w-0 lg:col-start-1">
                {showPromptBlock && (
                  <section className="mt-2 lg:mt-4" aria-labelledby="skill-prompt-title">
                    <SectionHeader id="skill-prompt-title" title={t('prompt')} hint={t('promptHint')} />
                    <SkillPromptBlock body={promptBody} />
                  </section>
                )}

                {showDocumentation && (
                  <section className="mt-10" aria-labelledby="skill-notes-title">
                    <SectionHeader id="skill-notes-title" title={t('notes')} />
                    <MarkdownRenderer
                      content={body}
                      className="prose-vibe"
                      trackingLocation="skill_body"
                    />
                  </section>
                )}
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="pt-20 md:pt-28" aria-labelledby="related-skills-title">
            <div className="wrap">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-x-4">
                <Kicker as="h2" className="text-ink">
                  <span id="related-skills-title">{t('relatedSkills')}</span>
                </Kicker>
                <LinkRim href="/resources">{t('viewAll')}</LinkRim>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        )}
      </main>
    </>
  );
}

/**
 * « Titre : sous-titre » is set on two lines, the second in grey clay, like the
 * titles elsewhere. A title with no colon stays whole.
 */
function splitTitle(title: string): [string, string | null] {
  const match = title.match(/^([^\n]{4,64}?[:：])\s+([\s\S]+)$/);
  return match ? [match[1], match[2]] : [title, null];
}

const labelClass =
  'm-0 font-mono text-xs font-medium uppercase leading-none tracking-[0.14em] text-muted-foreground';

/** The creator's note: pressed into the page, a drawn lacquer bar on its edge. */
function CreatorNote({ note, label }: { note: string; label: string }) {
  return (
    <aside className="well relative mt-8 max-w-[60ch] rounded-piece py-5 pl-9 pr-6">
      <span
        className="absolute bottom-5 left-[18px] top-5 w-1 rounded bg-gradient-to-b from-[#3a3a3c] to-ink"
        aria-hidden="true"
      />
      <p className={labelClass}>{label}</p>
      <p
        className="m-0 mt-3 text-base leading-relaxed text-ink"
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(note) }}
      />
    </aside>
  );
}

function SkillSnapshot({ trigger, label }: { trigger: string; label: string }) {
  return (
    <section className="mt-8 max-w-[60ch]">
      <Groove />
      <p className={`${labelClass} mt-5`}>{label}</p>
      <p className="m-0 mt-3 text-[15px] leading-relaxed text-ink-2">{trigger}</p>
    </section>
  );
}

function SectionHeader({ id, title, hint }: { id: string; title: string; hint?: string }) {
  return (
    <header className="mb-5 flex flex-col gap-2">
      <Kicker as="h2" className="text-ink">
        <span id={id}>{title}</span>
      </Kicker>
      {hint && <p className="m-0 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">{hint}</p>}
    </header>
  );
}
