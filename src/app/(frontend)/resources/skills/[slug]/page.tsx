import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { SkillAIInstaller } from '@/components/resources/SkillAIInstaller';
import { SkillCard } from '@/components/resources/SkillCard';
import { SkillPromptBlock } from '@/components/resources/SkillPromptBlock';
import { getContentByType, getContentItem, getRelatedContent } from '@/lib/content-source';
import { normalizeMarkdownBody } from '@/lib/markdown';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';
import { getSkillPreviewLines } from '@/lib/skill-preview';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getSkill(slug);
  if (!item) return { title: 'Not Found' };

  const canonicalPath = `/resources/skills/${item.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const socialImage = item.ogImage ?? item.featuredImage;
  const socialImageUrl = socialImage?.url ? new URL(socialImage.url, SITE_URL).toString() : undefined;
  const socialImageDimensions = getOgImageDimensions(item.ogImage?.sourceUrl);

  return {
    title: `${item.title} | Skills · ${SITE_NAME}`,
    description: item.summary,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: item.title,
      description: item.summary,
      publishedTime: item.publishedAt,
      tags: item.topics,
      images: socialImageUrl
        ? [
            {
              url: socialImageUrl,
              ...(socialImageDimensions ?? {}),
              alt: socialImage?.alt ?? item.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.summary,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getSkill(slug);
  if (!item) notFound();

  const skill = item.skill ?? { kind: 'native' as const };
  const body = normalizeMarkdownBody(item.body);
  const related = await getRelated(slug);

  const canonicalUrl = absoluteUrl(`/resources/skills/${item.slug}`);

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
  const previewLines = getSkillPreviewLines(body, 4);
  const creatorNote = skill.creatorNote;

  return (
    <>
      <ReadingProgress />
      <main className="pt-6 md:pt-8 pb-20 min-h-screen bg-res-bg">
        <div className={`${resourcesTheme.section.padding} pb-12 md:pb-16`}>
          <div className="mx-auto max-w-6xl">
            <Link
              href="/resources/skills"
              className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors group"
            >
              <ArrowLeft size={14} strokeWidth={1.8} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Skills
            </Link>

            <article>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
                <div className="min-w-0">
                  <header className="flex flex-col gap-4">
                    <span className="self-start px-2 py-1 border border-res-text/30 bg-res-text/5 text-[10px] font-mono uppercase tracking-widest text-res-text">
                      Skill
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[0.95] text-res-text">
                      {item.title}
                    </h1>

                    {item.summary && (
                      <p
                        className="text-base md:text-lg text-res-text-muted leading-relaxed max-w-3xl"
                        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                      />
                    )}
                  </header>

                  {creatorNote && (
                    <CreatorNote note={creatorNote} />
                  )}

                  {(skill.trigger || previewLines.length > 0) && (
                    <SkillSnapshot trigger={skill.trigger} lines={previewLines} />
                  )}
                </div>

                <aside className="lg:sticky lg:top-28 lg:row-span-2">
                  <SkillAIInstaller context={installContext} />
                </aside>

                <div className="min-w-0 lg:col-start-1">
                  {showPromptBlock && (
                    <section className="mt-2 lg:mt-0">
                      <SectionHeader
                        title="Prompt"
                        hint="Use this if you prefer to copy the skill text yourself."
                      />
                      <SkillPromptBlock body={promptBody} />
                    </section>
                  )}

                  {showDocumentation && (
                    <section className="mt-8">
                      <SectionHeader title="Notes" />
                      <div className="prose-vibe prose-vibe-warm max-w-none">
                        <MarkdownRenderer content={body} className="prose-vibe prose-vibe-warm" />
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>

        {related.length > 0 && (
          <section className={`${resourcesTheme.section.padding} py-20 border-t border-res-border`}>
            <div className="flex items-center justify-between gap-4 mb-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
                Related skills
              </span>
              <Link
                href="/resources/skills"
                className="text-[11px] font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </section>
        )}
      </main>
    </>
  );
}

function CreatorNote({ note }: { note: string }) {
  return (
    <aside className="mt-5 border border-l-2 border-res-border border-l-res-text bg-res-bg-secondary px-4 py-3">
      <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
        Creator note
      </p>
      <p
        className="text-sm leading-relaxed text-res-text"
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(note) }}
      />
    </aside>
  );
}

function SkillSnapshot({ trigger, lines }: { trigger?: string; lines: string[] }) {
  const hasTrigger = Boolean(trigger);
  const hasLines = lines.length > 0;

  return (
    <section
      className={`mt-6 grid gap-3 ${hasTrigger && hasLines ? 'md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]' : ''}`}
      aria-label="Skill overview"
    >
      {trigger && (
        <div className="border border-res-border bg-res-bg-secondary p-4">
          <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted">
            Good for
          </p>
          <p className="text-sm text-res-text leading-relaxed">{trigger}</p>
        </div>
      )}

      {hasLines && (
        <div className="border border-res-border bg-res-surface p-4">
          <h2 id="skill-snapshot-heading" className="text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
            Inside this skill
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
            {lines.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-res-text">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-res-text" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="mb-4 flex flex-col gap-1">
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-res-text">{title}</h2>
      {hint && <p className="text-sm text-res-text-muted leading-relaxed">{hint}</p>}
    </header>
  );
}
