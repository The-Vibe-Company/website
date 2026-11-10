'use client';

import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

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
  language,
  skill,
}: SkillCardProps) {
  const t = useTranslations('resources');
  const trigger = skill?.trigger;
  const detailHref = `/resources/skills/${slug}`;

  return (
    // A skill lives under its own language's prefix only, so link straight there.
    <Link href={detailHref} locale={language} className="group block h-full">
      <article className="flex h-full min-h-[260px] flex-col border border-border bg-card p-6 transition-colors hover:border-border-strong md:p-7">
        <p className="m-0 mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {t('skillBadge')}
        </p>

        <h3 className="m-0 text-[26px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] group-hover:underline decoration-1 underline-offset-4">
          {title}
        </h3>

        <p
          className="m-0 mt-3 text-[15px] text-muted-foreground leading-[1.6] line-clamp-3"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary ?? '') }}
        />

        {trigger && (
          <div className="mt-5 border-l border-border-strong pl-4">
            <p className="m-0 mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t('goodFor')}
            </p>
            <p className="m-0 text-[13px] text-foreground leading-relaxed line-clamp-2">{trigger}</p>
          </div>
        )}

        <span className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
          {t('openSkill')} -&gt;
        </span>
      </article>
    </Link>
  );
}
