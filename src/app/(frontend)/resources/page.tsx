import Link from 'next/link';
import type { Metadata } from 'next';

import { ContentCard } from '@/components/resources/ContentCard';
import { ResourcesHomeSearch } from '@/components/resources/ResourcesHomeSearch';
import { SkillCard } from '@/components/resources/SkillCard';
import { TypeNav } from '@/components/resources/TypeNav';
import { getNavContentTypes } from '@/lib/content-types';
import { getContentByType, getContentCounts, type ContentEntry } from '@/lib/content-source';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { resourcesTheme } from '@/lib/resources-theme';
import { getSkillPreviewLines } from '@/lib/skill-preview';

export const metadata: Metadata = {
  title: 'Resources | The Vibe Company',
  description:
    'Shareable AI skills and longer reads from The Vibe Company. Drop a skill into Claude Code, Cursor, or any agent in seconds.',
};

const SKILLS_LIMIT = 6;
const ARTICLES_LIMIT = 6;

export default async function ResourcesPage() {
  const skills = getContentByType('skill');
  const articles = getContentByType('article');
  const counts = getContentCounts();
  const allCount = (counts.skill ?? 0) + (counts.article ?? 0);

  const navContentTypes = getNavContentTypes();
  const typeNavLinks = navContentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.urlSlug}`,
    slug: ct.slug,
  }));

  const featuredSkills = skills.slice(0, SKILLS_LIMIT);
  const featuredArticles = articles.slice(0, ARTICLES_LIMIT);

  const skillCount = counts.skill ?? 0;
  const articleCount = counts.article ?? 0;
  const skillLabel = skillCount === 1 ? 'skill' : 'skills';
  const articleLabel = articleCount === 1 ? 'article' : 'articles';

  return (
    <main className="pb-20 bg-res-bg">
      <section className={`${resourcesTheme.section.padding} pt-10 md:pt-16 pb-10 md:pb-12 border-b border-res-border`}>
        <div className="max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-res-text-muted block mb-4">
            Resources / {allCount} entries
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.92] text-res-text mb-5">
            Useful prompts and essays.
          </h1>
          <p className="text-base md:text-lg text-res-text-muted leading-relaxed max-w-2xl mb-7">
            Start with a skill, copy one instruction, and use it with your agent. No marketplace, no setup maze.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ResourcesHomeSearch />
            <Link
              href="/resources/skills"
              className="inline-flex min-h-12 items-center justify-center bg-res-text px-5 py-3 text-[11px] font-mono uppercase tracking-wider text-res-surface transition-colors hover:bg-res-text/85"
            >
              Browse skills
            </Link>
          </div>

          <p className="mt-5 text-[11px] font-mono uppercase tracking-widest text-res-text-muted">
            {skillCount} {skillLabel} / {articleCount} {articleLabel}
          </p>
        </div>
      </section>

      <section className={`${resourcesTheme.section.padding} pt-8`}>
        <TypeNav types={typeNavLinks} counts={counts} />
      </section>

      <Section
        title="Skills"
        count={skillCount}
        href="/resources/skills"
        emptyLabel="No skills yet — first ones land soon."
        hint="Copy-paste workflows for any agent."
      >
        {featuredSkills.length === 1 ? (
          <FeaturedSkillPanel item={featuredSkills[0]} />
        ) : featuredSkills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map((item) => (
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
                body={item.body}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Articles"
        count={articleCount}
        href="/resources/articles"
        emptyLabel="No articles yet."
        hint="Longer reads on agents, tooling, and the way we work."
      >
        {featuredArticles.length > 0 && (
          <div className="space-y-6">
            {featuredArticles.map((item) => (
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
        )}
      </Section>
    </main>
  );
}

function FeaturedSkillPanel({ item }: { item: ContentEntry }) {
  const previewLines = getSkillPreviewLines(item.body, 4);
  const trigger = item.skill?.trigger;

  return (
    <Link href={`/resources/skills/${item.slug}`} className="group block max-w-5xl mx-auto">
      <article className="grid overflow-hidden border border-res-border bg-res-surface transition-colors hover:border-res-text/35 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col p-5 sm:p-6 lg:p-7 md:min-h-[300px]">
          <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
            Featured skill
          </p>

          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-res-text leading-[1.02] group-hover:underline decoration-1 underline-offset-4">
            {item.title}
          </h3>

          <p
            className="mt-4 text-sm md:text-base text-res-text-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.summary ?? '') }}
          />

          {previewLines.length > 0 && (
            <div className="mt-5 border-l border-res-border pl-4 md:hidden">
              <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-res-text-muted">
                Inside
              </p>
              <ul className="space-y-1.5">
                {previewLines.slice(0, 2).map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-res-text line-clamp-2">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {trigger && (
            <div className="mt-6 hidden border-l border-res-border pl-4 md:block">
              <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-res-text-muted">
                Good for
              </p>
              <p className="text-sm text-res-text leading-relaxed line-clamp-2">{trigger}</p>
            </div>
          )}

          <span className="mt-auto pt-8 text-[11px] font-mono uppercase tracking-wider text-res-text">
            Open skill -&gt;
          </span>
        </div>

        {previewLines.length > 0 && (
          <div className="hidden border-t border-res-border bg-res-bg-secondary/70 p-5 sm:p-6 lg:p-7 md:block md:border-l md:border-t-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
              Inside the skill
            </p>
            <ul className="mt-5 space-y-4">
              {previewLines.map((line, index) => (
                <li key={line} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center border border-res-border bg-res-surface text-[10px] font-mono text-res-text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-base leading-relaxed text-res-text">{line}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </Link>
  );
}

interface SectionProps {
  title: string;
  count: number;
  href: string;
  hint?: string;
  emptyLabel?: string;
  children?: React.ReactNode;
}

function Section({ title, count, href, hint, emptyLabel, children }: SectionProps) {
  const isEmpty = count === 0;

  return (
    <section className={`${resourcesTheme.section.padding} pt-16 md:pt-20`}>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-7 pb-4 border-b border-res-border">
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-res-text">{title}</h2>
          <span className="text-[11px] font-mono uppercase tracking-widest text-res-text-muted">
            {count} {count === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        {!isEmpty && (
          <Link
            href={href}
            className="text-[11px] font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors"
          >
            View all -&gt;
          </Link>
        )}
      </header>
      {hint && (
        <p className="text-sm text-res-text-muted leading-relaxed mb-8 max-w-2xl">{hint}</p>
      )}
      {isEmpty ? (
        <div className="border border-dashed border-res-border bg-res-surface rounded-md p-10 text-center">
          <p className="text-[11px] font-mono uppercase tracking-widest text-res-text-muted">
            {emptyLabel ?? 'Nothing here yet.'}
          </p>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
