'use client';

import { useMemo, useState } from 'react';
import { Bot, ClipboardCheck, Terminal } from 'lucide-react';

import { CopyButton } from '@/components/resources/CopyButton';
import { resourcesTheme } from '@/lib/resources-theme';
import {
  AI_INSTALL_TARGETS,
  buildAIInstallPrompt,
  type AIInstallTargetId,
  type SkillInstallContext,
} from '@/lib/skill-install-templates';

interface SkillAIInstallerProps {
  context: SkillInstallContext;
}

export function SkillAIInstaller({ context }: SkillAIInstallerProps) {
  const [target, setTarget] = useState<AIInstallTargetId>('claude-code');

  const prompt = useMemo(() => buildAIInstallPrompt(target, context), [target, context]);

  return (
    <section
      id="install-with-ai"
      className={resourcesTheme.skill.generatorWrap}
      aria-labelledby="ai-installer-heading"
    >
      <header className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center bg-res-text text-res-surface">
          <Bot size={17} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-res-text-muted">
            Primary action
          </p>
          <h3
            id="ai-installer-heading"
            className="text-xl font-bold tracking-tight text-res-text"
          >
            Install with AI
          </h3>
          <p className="text-sm text-res-text-muted leading-relaxed">
            Choose a runtime, copy the generated prompt, and paste it into your agent.
          </p>
        </div>
      </header>

      <div className="space-y-2">
        <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-res-text-muted">
          <Terminal size={13} strokeWidth={1.8} aria-hidden="true" />
          Runtime
        </p>
        <div
          aria-label="AI install target"
          className={resourcesTheme.skill.generatorTargetGroup}
        >
          {AI_INSTALL_TARGETS.map((option) => {
            const isActive = option.id === target;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTarget(option.id)}
                className={`${resourcesTheme.skill.generatorTarget} ${
                  isActive
                    ? resourcesTheme.skill.generatorTargetActive
                    : resourcesTheme.skill.generatorTargetInactive
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden border border-res-border bg-res-surface">
        <pre className={resourcesTheme.skill.generatorOutput}>{prompt}</pre>
        <div className="flex flex-col gap-3 border-t border-res-border bg-res-bg-secondary p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[11px] font-mono text-res-text-muted leading-relaxed">
            <ClipboardCheck size={13} strokeWidth={1.8} aria-hidden="true" />
            Paste into your agent. It will fetch and install the skill.
          </p>
          <CopyButton
            value={prompt}
            variant="primary"
            label="Copy install prompt"
            copiedLabel="Copied"
            className="w-full justify-center sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
