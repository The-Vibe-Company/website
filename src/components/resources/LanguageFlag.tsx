'use client';

import { useTranslations } from 'next-intl';

import type { ContentLanguage } from '@/lib/content-source';

type FlagVariant = 'card' | 'sidebar' | 'inline';

interface LanguageFlagProps {
  language: ContentLanguage;
  variant?: FlagVariant;
  className?: string;
  /** Decorative when a text label already names the language beside it. */
  decorative?: boolean;
}

const LABEL_KEY: Record<ContentLanguage, 'french' | 'english'> = {
  fr: 'french',
  en: 'english',
};

// One drawn flag, 18 x 12, whatever the system's emoji font does: the French
// tricolour and the Union Jack as small SVGs (porcelaine has no emoji).
const SIZE: Record<FlagVariant, string> = {
  card: 'h-3 w-[18px]',
  sidebar: 'h-3.5 w-[21px]',
  inline: 'h-3 w-[18px]',
};

export function LanguageFlag({
  language,
  variant = 'inline',
  className,
  decorative = false,
}: LanguageFlagProps) {
  const t = useTranslations('accessibility');
  const label = t(LABEL_KEY[language]);

  return (
    <svg
      viewBox={language === 'fr' ? '0 0 3 2' : '0 0 60 40'}
      preserveAspectRatio="none"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      focusable="false"
      className={`flag inline-block shrink-0 select-none ${SIZE[variant]}${className ? ` ${className}` : ''}`}
    >
      {!decorative && <title>{label}</title>}
      {language === 'fr' ? (
        <>
          <rect width="1" height="2" fill="#0055a4" />
          <rect x="1" width="1" height="2" fill="#fff" />
          <rect x="2" width="1" height="2" fill="#ef4135" />
        </>
      ) : (
        <>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0L60 40M60 0L0 40" stroke="#c8102e" strokeWidth="3" />
          <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
          <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="7" />
        </>
      )}
    </svg>
  );
}
