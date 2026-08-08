'use client';

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { resourcesTheme } from '@/lib/resources-theme';

export interface NavContentType {
  label: string;
  href: string;
}

/**
 * Formats a URL segment into a human-readable breadcrumb label.
 * Capitalizes words and handles common slug patterns.
 */
function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function useBreadcrumbs(pathname: string, typeLinks: NavContentType[], rootLabel: string) {
  if (pathname === '/resources') return [{ label: rootLabel, href: '/resources' }];

  const segments = pathname.replace('/resources/', '').split('/');
  const type = segments[0];
  const slug = segments[1];

  const crumbs = [{ label: rootLabel, href: '/resources' }];

  if (type) {
    // Look up the label from typeLinks if available
    const matchedLink = typeLinks.find((l) => l.href === `/resources/${type}`);
    crumbs.push({
      label: matchedLink?.label || formatSegment(type),
      href: `/resources/${type}`,
    });
  }

  if (slug) {
    const readableSlug = formatSegment(slug);
    crumbs.push({
      label: readableSlug.length > 30 ? readableSlug.slice(0, 30) + '...' : readableSlug,
      href: `/resources/${type}/${slug}`,
    });
  }

  return crumbs;
}

interface ResourcesNavProps {
  typeLinks?: NavContentType[];
}

export function ResourcesNav({ typeLinks = [] }: ResourcesNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('resources');
  const tNav = useTranslations('nav');
  const tA11y = useTranslations('accessibility');

  // Build full links list: All + CMS types (including Tools)
  const allLinks: NavContentType[] = [
    { label: t('all'), href: '/resources' },
    ...typeLinks,
  ];
  const crumbs = useBreadcrumbs(pathname, allLinks, t('kicker'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search: navigates to dedicated search page
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          router.push(`/resources/search?q=${encodeURIComponent(value.trim())}`, { scroll: false });
        } else {
          router.push('/resources', { scroll: false });
        }
      }, 400);
    },
    [router],
  );

  // Focus search input when opened on mobile
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <div key={pathname}>
      <nav className={resourcesTheme.nav.container} aria-label={tA11y('resourcesNavigation')}>
        <div className={resourcesTheme.nav.inner}>
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-0 min-w-0">
            <Link href="/" className={resourcesTheme.nav.brandLink}>
              THE VIBE CO.
            </Link>
            {crumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center min-w-0">
                <span className={`${resourcesTheme.nav.breadcrumb} mx-1.5 shrink-0`}>
                  /
                </span>
                {i === crumbs.length - 1 ? (
                  <span className={`${resourcesTheme.nav.breadcrumb} text-res-text truncate`}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className={`${resourcesTheme.nav.breadcrumb} hover:text-res-text transition-colors truncate`}
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </div>

          {/* Right: Desktop search + Mobile icons */}
          <div className="flex items-center gap-3">
            {/* Desktop search */}
            <div className="hidden md:block">
              <input
                type="text"
                placeholder={tNav('searchShort')}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label={tA11y('searchResources')}
                className={resourcesTheme.search.compact}
              />
            </div>

            {/* Mobile search icon */}
            <button
              className="md:hidden p-1.5 text-res-text-muted hover:text-res-text transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? tA11y('closeSearch') : tA11y('openSearch')}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-res-text-muted hover:text-res-text transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? tA11y('closeMenu') : tA11y('openMenu')}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile search bar */}
      <div
        aria-hidden={!searchOpen}
        className={`fixed top-14 left-0 right-0 z-40 bg-res-surface border-b border-res-border px-6 py-3 transition-all duration-200 md:hidden ${searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder={tNav('searchLong')}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label={tA11y('searchResources')}
          tabIndex={searchOpen ? 0 : -1}
          className={resourcesTheme.search.input}
        />
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-30 bg-res-bg/95 backdrop-blur-lg flex flex-col pt-20 px-6 transition-all duration-200 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label={tA11y('mobileNavigation')}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen || undefined}
      >
        <nav className="space-y-1" aria-label={tA11y('contentTypes')}>
          {allLinks.map((link) => {
            const isActive =
              link.href === '/resources'
                ? pathname === '/resources'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 rounded-lg text-sm font-mono uppercase tracking-wider transition-colors ${isActive
                  ? 'bg-res-bg-secondary text-res-text'
                  : 'text-res-text-muted hover:text-res-text hover:bg-res-bg-secondary'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-res-border">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-widest text-res-text-muted hover:text-res-text transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            &larr; {t('backMainSite')}
          </Link>
        </div>
      </div>
    </div>
  );
}
