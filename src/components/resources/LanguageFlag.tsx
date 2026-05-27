import { resourcesTheme } from '@/lib/resources-theme';
import type { ContentLanguage } from '@/lib/content-source';

const FLAGS: Record<ContentLanguage, { emoji: string; label: string }> = {
  fr: { emoji: '🇫🇷', label: 'French' },
  en: { emoji: '🇬🇧', label: 'English' },
};

type FlagVariant = 'card' | 'sidebar' | 'inline';

interface LanguageFlagProps {
  language: ContentLanguage;
  variant?: FlagVariant;
  className?: string;
}

export function LanguageFlag({ language, variant = 'inline', className }: LanguageFlagProps) {
  const { emoji, label } = FLAGS[language];
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
