'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const typeLinks = [
  { label: 'All', href: '/resources' },
  { label: 'Dailies', href: '/resources/daily' },
  { label: 'Tutorials', href: '/resources/tutorial' },
  { label: 'Articles', href: '/resources/article' },
  { label: 'Tool Focus', href: '/resources/tool-focus' },
];

export function TypeNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/resources') return pathname === '/resources';
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="flex items-center gap-0 border-b border-foreground/10 overflow-x-auto"
      aria-label="Content type navigation"
    >
      {typeLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={[
            'relative px-5 py-3.5 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors whitespace-nowrap shrink-0',
            isActive(link.href)
              ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-foreground'
              : 'text-muted-foreground/50 hover:text-foreground',
          ].join(' ')}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
