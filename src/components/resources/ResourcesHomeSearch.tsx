'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { captureEvent } from '@/lib/posthog';

export function ResourcesHomeSearch() {
  const router = useRouter();
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
    <form onSubmit={handleSubmit} role="search" className="relative w-full sm:flex-1 max-w-xl">
      <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-res-text-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        placeholder="Search articles, topics…"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="w-full bg-res-surface border border-res-border pl-12 pr-4 py-3.5 text-base font-mono text-res-text placeholder:text-res-text-muted/60 focus:outline-none focus:border-res-text rounded-md transition-colors"
        aria-label="Search resources"
      />
    </form>
  );
}
