import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import type React from 'react';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Gauge,
  Github,
  Languages,
  Tags,
  User,
  Wrench,
} from 'lucide-react';

import { LanguageFlag } from '@/components/resources/LanguageFlag';
import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { ReadingProgress } from '@/components/resources/ReadingProgress';
import { SkillAIInstaller } from '@/components/resources/SkillAIInstaller';
import { SkillCard } from '@/components/resources/SkillCard';
import { SkillInstallBlock } from '@/components/resources/SkillInstallBlock';
import { SkillPromptBlock } from '@/components/resources/SkillPromptBlock';
import { SkillSourceBadge } from '@/components/resources/SkillSourceBadge';
import { getContentByType, getContentItem, getRelatedContent } from '@/lib/content-source';
import { normalizeMarkdownBody } from '@/lib/markdown';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';
import { getOgImageDimensions } from '@/lib/og-image-dimensions';
import type { SkillInstallContext } from '@/lib/skill-install-templates';
import type { ContentLanguage, SkillKind, SkillInstallCommand } from '@/lib/content-source';

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

const complexityLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

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
  const installCommands = skill.installCommands ?? [];
  const skillKind = skill.kind;
  const isExternal = skillKind === 'external';

  return (
    <>
      <ReadingProgress />
      <main className="pt-12 pb-24 min-h-screen bg-res-bg">
        <div className={`${resourcesTheme.section.padding} pb-16 md:pb-20`}>
          <Link
            href="/resources/skills"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors group"
          >
            <ArrowLeft size={14} strokeWidth={1.8} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Skills
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-8 lg:gap-12 items-start">
            <article className="min-w-0">
              <header className="mb-8 md:mb-10 flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 border border-res-text/30 bg-res-text/5 text-[10px] font-mono uppercase tracking-widest text-res-text">
                    Skill
                  </span>
                  <SkillSourceBadge kind={skillKind} sourceUrl={skill.sourceUrl} />
                  <LanguageFlag language={item.language} variant="inline" />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.92] text-res-text">
                  {item.title}
                </h1>

                {item.summary && (
                  <p
                    className="text-base md:text-xl text-res-text-muted leading-relaxed max-w-3xl"
                    dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary) }}
                  />
                )}

                {skill.trigger && (
                  <div className="max-w-3xl border border-res-border bg-res-bg-secondary p-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted mb-1">
                      Use when
                    </p>
                    <p className="text-sm md:text-base text-res-text leading-relaxed">{skill.trigger}</p>
                  </div>
                )}

                <SkillMetaChips
                  kind={skillKind}
                  author={skill.author}
                  authorUrl={skill.authorUrl}
                  language={item.language}
                  complexity={item.complexity}
                  publishedAt={item.publishedAt}
                  allowedTools={skill.allowedTools}
                  topics={item.topics}
                />
              </header>

              <div className="lg:hidden mb-10">
                <ActionPanel
                  context={installContext}
                  installCommands={installCommands}
                  kind={skillKind}
                  sourceUrl={skill.sourceUrl}
                />
              </div>

              <div className="space-y-10">
                {isExternal && skill.sourceUrl && (
                  <section className="border border-res-border bg-res-surface p-5">
                    <SectionHeader title="Source" hint="This skill is maintained outside The Vibe Company." />
                    <Link
                      href={skill.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 bg-res-text px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-res-surface transition-colors hover:bg-res-text/85"
                    >
                      <Github size={15} strokeWidth={1.8} aria-hidden="true" />
                      Open GitHub source
                      <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  </section>
                )}

                {showPromptBlock && (
                  <section>
                    <SectionHeader
                      title="Prompt body"
                      hint="Secondary path: copy the raw skill prompt directly."
                    />
                    <SkillPromptBlock body={promptBody} />
                  </section>
                )}

                {isExternal && body.trim().length > 0 && (
                  <section>
                    <SectionHeader title="Documentation" />
                    <div className="prose-vibe prose-vibe-warm max-w-none">
                      <MarkdownRenderer content={body} className="prose-vibe prose-vibe-warm" />
                    </div>
                  </section>
                )}
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <ActionPanel
                  context={installContext}
                  installCommands={installCommands}
                  kind={skillKind}
                  sourceUrl={skill.sourceUrl}
                />
              </div>
            </aside>
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

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="mb-4 flex flex-col gap-1">
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-res-text">{title}</h2>
      {hint && <p className="text-sm text-res-text-muted leading-relaxed">{hint}</p>}
    </header>
  );
}

function ActionPanel({
  context,
  installCommands,
  kind,
  sourceUrl,
}: {
  context: SkillInstallContext;
  installCommands: SkillInstallCommand[];
  kind: SkillKind;
  sourceUrl?: string;
}) {
  return (
    <div className="space-y-4">
      <SkillAIInstaller context={context} />

      {installCommands.length > 0 && (
        <section className="border border-res-border bg-res-surface p-4">
          <SectionHeader
            title="CLI install"
            hint="Use this when your runtime supports direct skill installation."
          />
          <SkillInstallBlock commands={installCommands} />
        </section>
      )}

      {kind === 'external' && sourceUrl && (
        <Link
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full min-h-11 items-center justify-center gap-2 border border-res-border bg-res-surface px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-res-text-muted transition-colors hover:border-res-text/40 hover:text-res-text"
        >
          <Github size={15} strokeWidth={1.8} aria-hidden="true" />
          View source
          <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function SkillMetaChips({
  author,
  authorUrl,
  language,
  complexity,
  publishedAt,
  allowedTools,
  topics,
}: {
  kind: SkillKind;
  author?: string;
  authorUrl?: string;
  language: ContentLanguage;
  complexity?: string;
  publishedAt?: string;
  allowedTools?: string[];
  topics?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {author && (
        <MetaChip icon={<User size={13} strokeWidth={1.8} />}>
          {authorUrl ? (
            <Link href={authorUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {author}
            </Link>
          ) : (
            author
          )}
        </MetaChip>
      )}
      <MetaChip icon={<Languages size={13} strokeWidth={1.8} />}>{language.toUpperCase()}</MetaChip>
      {complexity && (
        <MetaChip icon={<Gauge size={13} strokeWidth={1.8} />}>
          {complexityLabels[complexity] || complexity}
        </MetaChip>
      )}
      {publishedAt && (
        <MetaChip icon={<CalendarDays size={13} strokeWidth={1.8} />}>
          {formatDate(publishedAt)}
        </MetaChip>
      )}
      {allowedTools?.map((tool) => (
        <MetaChip key={tool} icon={<Wrench size={13} strokeWidth={1.8} />}>
          {tool}
        </MetaChip>
      ))}
      {topics?.slice(0, 4).map((topic) => (
        <MetaChip key={topic} icon={<Tags size={13} strokeWidth={1.8} />}>
          {topic}
        </MetaChip>
      ))}
    </div>
  );
}

function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 border border-res-border bg-res-surface px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-res-text-muted">
      {icon}
      {children}
    </span>
  );
}
