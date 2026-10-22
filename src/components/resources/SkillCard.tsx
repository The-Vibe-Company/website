'use client';

import { Arrow } from '@/components/kit';
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
  skill,
}: SkillCardProps) {
  const t = useTranslations('resources');
  const trigger = skill?.trigger;
  const detailHref = `/resources/skills/${slug}`;

  return (
    <Link href={detailHref} className="group block h-full rounded-plate">
      {/* A quiet piece: flat clay on a hairline. The grid of skills is a list of
          equals, so none of them gets the main piece's shadow and rim. */}
      <article className="clay-quiet lift flex h-full min-h-[260px] flex-col rounded-plate p-5">
        <p className="kicker mb-4">{t('skillBadge')}</p>

        <h3 className="display m-0 text-2xl leading-[1.05] group-hover:underline decoration-rim decoration-2 underline-offset-4">
          {title}
        </h3>

        <p
          className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summary ?? '') }}
        />

        {trigger && (
          <div className="well mt-5 rounded-piece px-3 py-2">
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {t('goodFor')}
            </p>
            <p className="line-clamp-2 text-xs leading-relaxed text-foreground">{trigger}</p>
          </div>
        )}

        <span className="link-rim mt-auto min-h-0 self-start pt-4">
          <span className="t">{t('openSkill')}</span>
          <Arrow />
        </span>
      </article>
    </Link>
  );
}
