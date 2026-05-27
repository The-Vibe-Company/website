'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/resources/CopyButton';
import { resourcesTheme } from '@/lib/resources-theme';
import type { SkillInstallCommand } from '@/lib/content-source';

interface SkillInstallBlockProps {
  commands: SkillInstallCommand[];
}

export function SkillInstallBlock({ commands }: SkillInstallBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (commands.length === 0) return null;

  const active = commands[activeIndex] ?? commands[0];

  return (
    <div className={resourcesTheme.skill.installBlock}>
      {commands.length > 1 && (
        <div className={resourcesTheme.skill.installTabs} aria-label="Install commands">
          {commands.map((command, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${command.label}-${index}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={`${resourcesTheme.skill.installTab} ${
                  isActive ? resourcesTheme.skill.installTabActive : resourcesTheme.skill.installTabInactive
                }`}
              >
                {command.label}
              </button>
            );
          })}
        </div>
      )}
      <div className={resourcesTheme.skill.installCommand}>
        <code className="block min-w-0 break-all sm:break-normal sm:whitespace-nowrap">
          {active.command}
        </code>
        <CopyButton value={active.command} label="Copy" copiedLabel="Copied" />
      </div>
    </div>
  );
}
