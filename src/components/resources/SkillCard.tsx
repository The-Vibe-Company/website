import Link from 'next/link';

import { renderInlineMarkdown } from '@/lib/inline-markdown';
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

export function SkillCard({
  title,
  summary,
  slug,
  skill,
}: SkillCardProps) {
  const trigger = skill?.trigger;
  const detailHref = `/resources/skills/${slug}`;

  return (
    <Link href={detailHref} className="group block h-full">
      <article className="flex h-full min-h-[260px] flex-col border border-res-border bg-res-surface p-5 transition-colors hover:border-res-text/35">
        <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
          Skill
        </p>

        <h3 className="text-2xl font-bold tracking-tight text-res-text leading-[1.05] group-hover:underline decoration-1 underline-offset-4">
          {title}
        </h3>

        <p
          className="mt-3 text-sm text-res-text-muted leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary ?? '') }}
        />

        {trigger && (
          <div className="mt-5 border border-res-border bg-res-bg-secondary px-3 py-2">
            <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-res-text-muted">
              Good for
            </p>
            <p className="text-xs text-res-text leading-relaxed line-clamp-2">{trigger}</p>
          </div>
        )}

        <span className="mt-auto pt-6 text-[11px] font-mono uppercase tracking-wider text-res-text">
          Open skill -&gt;
        </span>
      </article>
    </Link>
  );
}
