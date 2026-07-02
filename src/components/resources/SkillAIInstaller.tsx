'use client';

import { useCallback, useMemo } from 'react';
import { Bot } from 'lucide-react';

import { CopyButton } from '@/components/resources/CopyButton';
import { captureEvent } from '@/lib/posthog';
import {
  buildAIInstallPrompt,
  type SkillInstallContext,
} from '@/lib/skill-install-templates';

interface SkillAIInstallerProps {
  context: SkillInstallContext;
}

export function SkillAIInstaller({ context }: SkillAIInstallerProps) {
  const prompt = useMemo(() => buildAIInstallPrompt('generic', context), [context]);

  const handleCopy = useCallback(() => {
    captureEvent("skill_install_prompt_copied", {
      skill_slug: context.slug,
      skill_title: context.title,
      skill_kind: context.kind,
    });
  }, [context.slug, context.title, context.kind]);

  return (
    <section
      id="install-with-ai"
      className="border border-res-text/25 bg-res-surface p-5 sm:p-6"
      aria-labelledby="ai-installer-heading"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-res-text text-res-surface">
          <Bot size={17} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
            Recommended
          </p>
          <h3
            id="ai-installer-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-res-text"
          >
            Install with AI
          </h3>
          <p className="mt-2 max-w-xl text-sm text-res-text-muted leading-relaxed">
            Copy this instruction, paste it into your agent, and let it install the skill.
          </p>
        </div>
      </div>

      <CopyButton
        value={prompt}
        variant="primary"
        label="Copy install prompt"
        copiedLabel="Copied"
        className="mt-5 w-full justify-center sm:w-auto"
        onCopy={handleCopy}
      />

      <details className="mt-5 border-t border-res-border pt-4">
        <summary className="cursor-pointer text-[11px] font-mono uppercase tracking-wider text-res-text-muted hover:text-res-text">
          Preview prompt
        </summary>
        <pre className="mt-3 max-h-56 overflow-auto bg-res-bg-secondary p-4 text-[12px] leading-relaxed font-mono text-res-text whitespace-pre-wrap break-words">
          {prompt}
        </pre>
      </details>
    </section>
  );
}
