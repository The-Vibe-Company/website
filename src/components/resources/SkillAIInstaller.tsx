'use client';

import { useCallback, useMemo } from 'react';
import { Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BrandSquare } from '@/components/BrandSquare';
import { CopyButton } from '@/components/resources/CopyButton';
import { captureEvent } from '@/lib/posthog';
import { resourcesTheme } from '@/lib/resources-theme';
import {
  buildAIInstallPrompt,
  type SkillInstallContext,
} from '@/lib/skill-install-templates';

interface SkillAIInstallerProps {
  context: SkillInstallContext;
}

export function SkillAIInstaller({ context }: SkillAIInstallerProps) {
  const t = useTranslations('resources');
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
      className="lamp-card relative overflow-hidden border border-border p-6 pt-8 sm:p-7 sm:pt-9"
      aria-labelledby="ai-installer-heading"
    >
      <span aria-hidden="true" className={resourcesTheme.page.lamp} />
      <div className="relative flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-foreground text-background">
          <Bot size={17} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <BrandSquare />
            {t('recommended')}
          </p>
          <h3
            id="ai-installer-heading"
            className="m-0 mt-2 text-[26px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
          >
            {t('installWithAi')}
          </h3>
          <p className="m-0 mt-3 max-w-xl text-[15px] leading-[1.6] text-muted-foreground">
            {t('installWithAiDescription')}
          </p>
        </div>
      </div>

      <CopyButton
        value={prompt}
        variant="primary"
        label={t('copyInstallPrompt')}
        copiedLabel={t('copied')}
        className="relative mt-6 w-full justify-center sm:w-auto"
        onCopy={handleCopy}
      />

      <details className="relative mt-6 border-t border-border pt-4">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">
          {t('previewPrompt')}
        </summary>
        <pre className="mt-3 max-h-56 overflow-auto border border-border bg-background p-4 text-[12px] leading-relaxed font-mono text-foreground whitespace-pre-wrap break-words">
          {prompt}
        </pre>
      </details>
    </section>
  );
}
