'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resourcesTheme } from '@/lib/resources-theme';

interface ContentTypeLink {
  label: string;
  href: string;
  slug: string;
}

interface TypeNavProps {
  types?: ContentTypeLink[];
  counts?: Record<string, number>;
}

export function TypeNav({ types, counts }: TypeNavProps) {
  const pathname = usePathname();

  const typeLinks: ContentTypeLink[] = [
    { label: 'All', href: '/resources', slug: 'all' },
    ...(types ?? []),
    { label: 'Tools', href: '/resources/tools', slug: 'tools' },
  ];

  function isActive(href: string) {
    if (href === '/resources') return pathname === '/resources';
    return pathname.startsWith(href);
  }

  function getCount(slug: string): number | undefined {
    if (!counts) return undefined;
    return counts[slug];
  }

  return (
    <nav
      className={resourcesTheme.typeNav.container}
      aria-label="Content type navigation"
    >
      {typeLinks.map((link) => {
        const active = isActive(link.href);
        const count = getCount(link.slug);
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
