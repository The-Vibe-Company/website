'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

import { CopyButton } from '@/components/resources/CopyButton';
import { resourcesTheme } from '@/lib/resources-theme';

interface SkillPromptBlockProps {
  body: string;
  label?: string;
}

export function SkillPromptBlock({ body, label = 'Skill prompt' }: SkillPromptBlockProps) {
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
          <span>{label}</span>
          <span className="hidden sm:inline">· {lineCount} lines · {wordCount} words</span>
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="inline-flex min-h-9 items-center gap-1.5 border border-res-border bg-res-surface px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-res-text-muted transition-colors hover:text-res-text"
            >
              <ChevronDown
                size={13}
                strokeWidth={1.8}
                className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{expanded ? 'Collapse' : 'View full'}</span>
            </button>
          )}
          <CopyButton
            value={trimmed}
            variant="primary"
            label="Copy"
            copiedLabel="Copied"
            ariaLabel="Copy skill prompt"
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
