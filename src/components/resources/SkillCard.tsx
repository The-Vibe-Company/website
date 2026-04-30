import Link from 'next/link';
import type React from 'react';
import { ArrowRight, Bot, GitBranch, Hammer, Wrench } from 'lucide-react';

import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import { SkillSourceBadge } from '@/components/resources/SkillSourceBadge';
import type { ContentLanguage, SkillMeta } from '@/lib/content-source';

interface SkillCardProps {
  title: string;
  summary?: string | null;
  slug: string;
  publishedAt?: string;
  language?: ContentLanguage;
  topics?: string[];
  complexity?: string;
  skill?: SkillMeta;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const complexityLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function SkillCard({
  title,
  summary,
  slug,
  publishedAt,
  language,
  topics,
  complexity,
  skill,
}: SkillCardProps) {
  const kind = skill?.kind ?? 'native';
  const trigger = skill?.trigger;
  const author = skill?.author;
  const tools = skill?.allowedTools ?? [];
  const detailHref = `/resources/skills/${slug}`;

  return (
    <article className="group h-full min-h-[360px] flex flex-col border border-res-border bg-res-surface shadow-[0_1px_0_rgba(17,17,16,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-res-text/35 hover:shadow-[0_18px_50px_rgba(17,17,16,0.08)]">
      <div className="flex flex-col gap-5 p-5 sm:p-6 flex-1">
        <div className="flex items-start justify-between gap-3">
          <SkillSourceBadge kind={kind} sourceUrl={skill?.sourceUrl} displayOnly />
          <div className="flex items-center gap-2">
            {language && <LanguageFlag language={language} variant="card" />}
            <span className="inline-flex h-8 w-8 items-center justify-center border border-res-border bg-res-bg-secondary text-res-text">
              {kind === 'external' ? (
                <GitBranch size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Hammer size={15} strokeWidth={1.8} aria-hidden="true" />
              )}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold tracking-tight text-res-text leading-[1.08]">
            <Link href={detailHref} className="hover:underline decoration-1 underline-offset-4">
              {title}
            </Link>
          </h3>

          <p
            className="text-sm text-res-text-muted leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary ?? '') }}
          />
        </div>

        {trigger && (
          <div className="border border-res-border bg-res-bg-secondary px-3 py-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-res-text-muted mb-1">
              Use when
            </p>
            <p className="text-xs text-res-text leading-relaxed line-clamp-2">{trigger}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {complexity && (
            <Chip label={complexityLabels[complexity] || complexity} />
          )}
          {tools.slice(0, 3).map((tool) => (
            <Chip key={tool} label={tool} icon={<Wrench size={11} strokeWidth={1.8} />} />
          ))}
          {tools.length > 3 && <Chip label={`+${tools.length - 3}`} />}
          {topics?.slice(0, 1).map((topic) => <Chip key={topic} label={topic} />)}
        </div>
      </div>

      <div className="border-t border-res-border bg-res-bg-secondary/70 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Link
            href={`${detailHref}#install-with-ai`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-res-text px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-res-surface transition-colors hover:bg-res-text/85"
          >
            <Bot size={14} strokeWidth={1.8} aria-hidden="true" />
            Install with AI
          </Link>
          <Link
            href={detailHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-res-border bg-res-surface px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-res-text-muted transition-colors hover:border-res-text/40 hover:text-res-text"
          >
            View
            <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          {author ? (
            <span className="truncate text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              by {author}
            </span>
          ) : publishedAt ? (
            <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
              {formatDate(publishedAt)}
            </span>
          ) : (
            <span />
          )}
          <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted">
            {kind === 'external' ? 'GitHub source' : 'Native prompt'}
          </span>
        </div>
      </div>
    </article>
  );
}

function Chip({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-res-border bg-res-bg-secondary px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-res-text-muted">
      {icon}
      {label}
    </span>
  );
}
