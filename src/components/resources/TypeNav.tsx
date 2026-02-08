'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resourcesTheme } from '@/lib/resources-theme';

const typeLinks = [
  { label: 'All', href: '/resources' },
  { label: 'Learnings', href: '/resources/daily' },
  { label: 'Tutorials', href: '/resources/tutorial' },
  { label: 'Articles', href: '/resources/article' },
  { label: 'Focus', href: '/resources/tool-focus' },
  { label: 'Tools', href: '/resources/tools' },
];

interface TypeNavProps {
  counts?: Record<string, number>;
}

export function TypeNav({ counts }: TypeNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/resources') return pathname === '/resources';
    return pathname.startsWith(href);
  }

  function getCount(href: string): number | undefined {
    if (!counts) return undefined;
    if (href === '/resources') return counts['all'];
    const type = href.split('/').pop();
    return type ? counts[type] : undefined;
  }

  return (
    <nav
      className={resourcesTheme.typeNav.container}
      aria-label="Content type navigation"
    >
      {typeLinks.map((link) => {
        const active = isActive(link.href);
        const count = getCount(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${resourcesTheme.typeNav.pill} ${active
                ? resourcesTheme.typeNav.pillActive
                : resourcesTheme.typeNav.pillInactive
              }`}
          >
            {link.label}
            {count !== undefined && (
              <span className="ml-1.5 opacity-60">{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
