'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { LanguageFlag } from '@/components/resources/LanguageFlag';
import type { ContentLanguage } from '@/lib/content-source';

export interface TranslationLink {
  language: ContentLanguage;
  href: string;
}

type SwitchVariant = 'card' | 'sidebar' | 'inline';

interface TranslationSwitchProps {
  /** Language of the version currently being shown. */
  language: ContentLanguage;
  /** Every version of the article, the current one included. */
  translations?: TranslationLink[];
  variant?: SwitchVariant;
  className?: string;
}

const READ_IN: Record<ContentLanguage, 'readInFrench' | 'readInEnglish'> = {
  fr: 'readInFrench',
  en: 'readInEnglish',
};

const SEPARATOR_SIZE: Record<SwitchVariant, string> = {
  card: 'text-[10px]',
  sidebar: 'text-sm',
  inline: 'text-[10px]',
};

/**
 * Language control for an article. An article published in a single language
 * keeps showing its lone flag, exactly as before. A translated one shows the
 * pair, the version on screen at full strength and the other as a dimmed link
 * to its own URL, mirroring the `FR / EN` switch in the main nav.
 */
export function TranslationSwitch({
  language,
  translations = [],
  variant = 'inline',
  className,
}: TranslationSwitchProps) {
  const t = useTranslations('accessibility');
  const others = translations.filter((translation) => translation.language !== language);

  if (others.length === 0) {
    return <LanguageFlag language={language} variant={variant} className={className} />;
  }

  return (
    <span
      role="group"
      aria-label={t('language')}
      className={`inline-flex items-center gap-1${className ? ` ${className}` : ''}`}
    >
      <LanguageFlag language={language} variant={variant} />
      {others.map((translation) => (
        <span key={translation.language} className="inline-flex items-center gap-1">
          <span
            className={`font-mono text-res-border ${SEPARATOR_SIZE[variant]}`}
            aria-hidden="true"
          >
            /
          </span>
          <Link
            href={translation.href}
            // Each version is canonical under its own language prefix, so the
            // switch crosses locales instead of staying under the current one.
            locale={translation.language}
            aria-label={t(READ_IN[translation.language])}
            className="inline-flex items-center opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <LanguageFlag language={translation.language} variant={variant} />
          </Link>
        </span>
      ))}
    </span>
  );
}
