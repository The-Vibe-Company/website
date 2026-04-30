import Link from 'next/link';

import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { getSkillPreviewLines } from '@/lib/skill-preview';
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
  body?: string | null;
}

export function SkillCard({
  title,
  summary,
  slug,
  skill,
  body,
}: SkillCardProps) {
  const trigger = skill?.trigger;
  const previewLines = getSkillPreviewLines(body, 3);
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

        {previewLines.length > 0 && (
          <div className="mt-5 border-t border-res-border pt-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-res-text-muted">
              Inside
            </p>
            <ul className="mt-2 space-y-2">
              {previewLines.map((line) => (
                <li key={line} className="flex gap-2 text-xs leading-relaxed text-res-text">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 bg-res-text-muted" aria-hidden="true" />
                  <span className="line-clamp-2">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {trigger && (
          <p className="mt-4 text-xs leading-relaxed text-res-text-muted line-clamp-2">
            <span className="font-mono uppercase tracking-wider">Good for:</span> {trigger}
          </p>
        )}

        <span className="mt-auto pt-6 text-[11px] font-mono uppercase tracking-wider text-res-text">
          Open skill -&gt;
        </span>
      </article>
    </Link>
  );
}
