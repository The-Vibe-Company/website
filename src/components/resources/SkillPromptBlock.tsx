'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CopyButton } from '@/components/resources/CopyButton';
import { captureEvent } from '@/lib/posthog';
import { resourcesTheme } from '@/lib/resources-theme';

interface SkillPromptBlockProps {
  body: string;
  label?: string;
}

export function SkillPromptBlock({ body, label }: SkillPromptBlockProps) {
  const t = useTranslations('resources');
  const [expanded, setExpanded] = useState(false);
  const trimmed = body.trim();
  const lineCount = trimmed.split('\n').length;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const canExpand = lineCount > 16 || wordCount > 160;

  return (
    <div className={resourcesTheme.skill.promptBlock}>
      <div className={resourcesTheme.skill.promptBlockToolbar}>
        <span className={resourcesTheme.skill.promptBlockLabel}>
          <FileText size={13} strokeWidth={1.8} aria-hidden="true" />
          <span>{label ?? t('skillPrompt')}</span>
          <span className="hidden sm:inline">· {t('promptStats', { lineCount, wordCount })}</span>
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {canExpand && (
            <button
              type="button"
              aria-label={expanded ? t('collapsePrompt') : t('expandPrompt')}
              onClick={() => {
                if (!expanded) captureEvent("skill_prompt_expanded", { word_count: wordCount });
                setExpanded((current) => !current);
              }}
              className="inline-flex min-h-11 items-center gap-1.5 border border-res-border bg-res-surface px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-res-text-muted transition-colors hover:text-res-text"
            >
              <ChevronDown
                size={13}
                strokeWidth={1.8}
                className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{expanded ? t('collapse') : t('viewFull')}</span>
            </button>
          )}
          <CopyButton
            value={trimmed}
            variant="primary"
            label={t('copy')}
            copiedLabel={t('copied')}
            ariaLabel={t('copySkillPrompt')}
            onCopy={() => captureEvent("skill_prompt_copied", { word_count: wordCount })}
          />
        </div>
      </div>
      <pre
        className={`${resourcesTheme.skill.promptBlockBody} ${
          expanded ? 'max-h-[720px]' : 'max-h-[260px]'
        }`}
      >
        {trimmed}
      </pre>
      {!expanded && canExpand && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-res-bg-secondary to-transparent" />
      )}
    </div>
  );
}
