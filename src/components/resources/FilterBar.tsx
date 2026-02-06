'use client';

import { useRouter, useSearchParams } from 'next/navigation';

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
      {domains.map((d) => (
        <button
          key={d.value}
          onClick={() => handleFilter(d.value)}
          className={[
            'px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer',
            activeDomain === d.value
              ? 'bg-foreground text-background'
              : 'text-muted-foreground/50 hover:text-foreground border border-foreground/10 hover:border-foreground/30',
          ].join(' ')}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
