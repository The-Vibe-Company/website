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

/**
 * Language control for an article. An article published in a single language
 * keeps showing its lone flag, exactly as before. A translated one shows a
 * pressed-in rail with two labelled positions: the version on screen (flag and
 * code) and a link to the other one, written out as « Lire en anglais » /
 * « Lire en français » (and the English equivalents) so the way to the other
 * language is plain text, not a bare flag. The link keeps its `aria-label`
 * (the same words) and crosses locales: each version is canonical under its
 * own language prefix.
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
      className={`tr max-w-full${className ? ` ${className}` : ''}`}
    >
      <span aria-current="true" className="shrink-0">
        <LanguageFlag language={language} variant={variant} decorative />
        <span>{language.toUpperCase()}</span>
      </span>
      {others.map((translation) => (
        <Link
          key={translation.language}
          href={translation.href}
          // Each version is canonical under its own language prefix, so the
          // switch crosses locales instead of staying under the current one.
          locale={translation.language}
          hrefLang={translation.language}
          aria-label={t(READ_IN[translation.language])}
          className="min-w-0"
        >
          <LanguageFlag language={translation.language} variant={variant} decorative />
          <span className="truncate">{t(READ_IN[translation.language])}</span>
        </Link>
      ))}
    </span>
  );
}
