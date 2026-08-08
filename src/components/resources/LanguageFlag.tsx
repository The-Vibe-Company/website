'use client';

import { resourcesTheme } from '@/lib/resources-theme';
import type { ContentLanguage } from '@/lib/content-source';
import { useTranslations } from 'next-intl';

const FLAGS: Record<ContentLanguage, { emoji: string; labelKey: 'french' | 'english' }> = {
  fr: { emoji: '🇫🇷', labelKey: 'french' },
  en: { emoji: '🇬🇧', labelKey: 'english' },
};

type FlagVariant = 'card' | 'sidebar' | 'inline';

interface LanguageFlagProps {
  language: ContentLanguage;
  variant?: FlagVariant;
  className?: string;
}

export function LanguageFlag({ language, variant = 'inline', className }: LanguageFlagProps) {
  const t = useTranslations('accessibility');
  const { emoji, labelKey } = FLAGS[language];
  const label = t(labelKey);
  const variantClass = resourcesTheme.flag[variant];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`${resourcesTheme.flag.base} ${variantClass}${className ? ` ${className}` : ''}`}
      style={{ fontFamily: 'var(--font-flag)' }}
    >
      {emoji}
    </span>
  );
}
