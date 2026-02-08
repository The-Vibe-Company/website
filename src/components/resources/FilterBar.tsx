'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { resourcesTheme } from '@/lib/resources-theme';

interface DomainOption {
  slug: string;
  shortLabel: string;
  color: string;
  colorDark?: string | null;
}

interface FilterBarProps {
  domains?: DomainOption[];
}

export function FilterBar({ domains }: FilterBarProps) {
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

  const items = [
    { slug: '', shortLabel: 'All', color: '', colorDark: null as string | null },
    ...(domains ?? []),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((d) => {
        const isActive = activeDomain === d.slug;
        const hasColor = d.slug && d.color;

        return (
          <button
            key={d.slug}
            onClick={() => handleFilter(d.slug)}
            className={`${resourcesTheme.filter.pill} cursor-pointer ${
              isActive && !hasColor
                ? 'bg-res-text text-res-surface border-res-text'
                : !isActive
                  ? resourcesTheme.filter.pillInactive
                  : ''
            }`}
            style={
              isActive && hasColor
                ? {
                    backgroundColor: `color-mix(in srgb, ${d.color} 10%, transparent)`,
                    color: d.color,
                    borderColor: `color-mix(in srgb, ${d.color} 30%, transparent)`,
                  }
                : undefined
            }
          >
            {d.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
