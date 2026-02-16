'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resourcesTheme } from '@/lib/resources-theme';
import { RESOURCE_ICONS } from '@/lib/resource-icons';

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

  // Always show "All"; filter other types by counts when provided
  const filteredTypes = counts
    ? (types ?? []).filter((t) => (counts[t.slug] ?? 0) > 0)
    : (types ?? []);

  const typeLinks: ContentTypeLink[] = [
    { label: 'All', href: '/resources', slug: 'all' },
    ...filteredTypes,
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
        const Icon = RESOURCE_ICONS[link.slug];
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${resourcesTheme.typeNav.pill} ${active
                ? resourcesTheme.typeNav.pillActive
                : resourcesTheme.typeNav.pillInactive
              }`}
          >
            {Icon && <Icon size={14} strokeWidth={1.5} />}
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
