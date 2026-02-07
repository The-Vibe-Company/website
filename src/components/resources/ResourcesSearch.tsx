'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { resourcesTheme } from '@/lib/resources-theme';

interface ResourcesSearchProps {
  compact?: boolean;
}

export function ResourcesSearch({ compact = false }: ResourcesSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateUrl = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set('q', q);
      } else {
        params.delete('q');
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => updateUrl(next), 300);
  }

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-res-text-muted/50 pointer-events-none"
        width={compact ? 14 : 16}
        height={compact ? 14 : 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search..."
        className={`${compact ? resourcesTheme.search.compact : resourcesTheme.search.input} pl-9`}
      />
    </div>
  );
}
