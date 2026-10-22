'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { captureEvent } from '@/lib/posthog';

export function ResourcesHomeSearch() {
  const router = useRouter();
  const t = useTranslations('resources');
  const tA11y = useTranslations('accessibility');
  const [value, setValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (next: string) => {
      setValue(next);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (next.trim()) {
          router.push(`/resources/search?q=${encodeURIComponent(next.trim())}`, { scroll: false });
        }
      }, 400);
    },
    [router],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.trim()) {
        const query = value.trim();
        captureEvent("resources_searched", {
          query_length: query.length,
          word_count: query.split(/\s+/).length,
        });
        router.push(`/resources/search?q=${encodeURIComponent(query)}`);
      }
    },
    [router, value],
  );

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full md:max-w-[560px] md:flex-1">
      <label className="field">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-5-5" />
        </svg>
        <input
          type="search"
          placeholder={t('searchPlaceholder')}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          aria-label={tA11y('searchResources')}
        />
      </label>
    </form>
  );
}
