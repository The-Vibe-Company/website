'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { resourcesTheme, domainAccentMap } from '@/lib/resources-theme';

const domains = [
  { label: 'All', value: '' },
  { label: 'Dev', value: 'dev' },
  { label: 'Design', value: 'design' },
  { label: 'Ops', value: 'ops' },
  { label: 'Business', value: 'business' },
  { label: 'AI', value: 'ai-automation' },
  { label: 'Marketing', value: 'marketing' },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeDomain = searchParams.get('domain') || '';

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('domain', value);
    } else {
      params.delete('domain');
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {domains.map((d) => {
        const isActive = activeDomain === d.value;
        const colorVar = d.value ? domainAccentMap[d.value] || 'domain-dev' : null;

        return (
          <button
            key={d.value}
            onClick={() => handleFilter(d.value)}
            className={`${resourcesTheme.filter.pill} cursor-pointer ${
              isActive && !colorVar
                ? 'bg-res-text text-res-surface border-res-text'
                : !isActive
                  ? resourcesTheme.filter.pillInactive
                  : ''
            }`}
            style={
              isActive && colorVar
                ? {
                    backgroundColor: `color-mix(in srgb, var(--${colorVar}) 10%, transparent)`,
                    color: `var(--${colorVar})`,
                    borderColor: `color-mix(in srgb, var(--${colorVar}) 30%, transparent)`,
                  }
                : undefined
            }
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
