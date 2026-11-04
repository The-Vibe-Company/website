'use client';

import { useCallback, useMemo } from 'react';
import { Bot, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Kicker } from '@/components/kit';
import { CopyButton } from '@/components/resources/CopyButton';
import { captureEvent } from '@/lib/posthog';
import {
  buildAIInstallPrompt,
  type SkillInstallContext,
} from '@/lib/skill-install-templates';

interface SkillAIInstallerProps {
  context: SkillInstallContext;
}

/** The page's one main piece: the install prompt, copied in one press. */
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
      className="clay rim rim-warm rounded-[28px] p-6 [--rim-angle:125deg] md:rounded-slab md:p-8"
      aria-labelledby="ai-installer-heading"
    >
      <div className="flex items-start gap-4">
        <span className="num !h-11 !w-11">
          <Bot size={18} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <Kicker>{t('recommended')}</Kicker>
          <h3
            id="ai-installer-heading"
            className="display d-xs mt-3 m-0"
          >
            {t('installWithAi')}
          </h3>
        </div>
      </div>
      <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground">
        {t('installWithAiDescription')}
      </p>

      <CopyButton
        value={prompt}
        variant="primary"
        label={t('copyInstallPrompt')}
        copiedLabel={t('copied')}
        className="mt-6 w-full !min-h-[52px] !px-6 !text-base sm:w-auto"
        onCopy={handleCopy}
      />

      <details className="group mt-6">
        <summary className="flex min-h-11 items-center gap-2 border-t border-ink/10 pt-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-ink">
          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className="shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
          {t('previewPrompt')}
        </summary>
        <pre className="well mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-piece p-4 font-mono text-xs leading-relaxed text-ink">
          {prompt}
        </pre>
      </details>
    </section>
  );
}
