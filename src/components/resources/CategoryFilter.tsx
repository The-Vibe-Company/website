'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { resourcesTheme, categoryLabels } from '@/lib/resources-theme';

const categories = [
  { label: 'All', value: '' },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const isActive = activeCategory === c.value;

        return (
          <button
            key={c.value}
            onClick={() => handleFilter(c.value)}
            className={`${resourcesTheme.filter.pill} cursor-pointer ${
              isActive
                ? 'bg-res-text text-res-surface border-res-text'
                : resourcesTheme.filter.pillInactive
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
