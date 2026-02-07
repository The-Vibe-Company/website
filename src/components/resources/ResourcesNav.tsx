'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { resourcesTheme, typeLabels } from '@/lib/resources-theme';

const typeLinks = [
  { label: 'All', href: '/resources' },
  { label: 'Dailies', href: '/resources/daily' },
  { label: 'Tutorials', href: '/resources/tutorial' },
  { label: 'Articles', href: '/resources/article' },
  { label: 'Tool Focus', href: '/resources/tool-focus' },
];

function useBreadcrumbs(pathname: string) {
  if (pathname === '/resources') return [{ label: 'Resources', href: '/resources' }];

  const segments = pathname.replace('/resources/', '').split('/');
  const type = segments[0];
  const slug = segments[1];

  const crumbs = [{ label: 'Resources', href: '/resources' }];

  if (type) {
    const typeLabel =
      typeLabels[type] ||
      type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
    crumbs.push({
      label: type === 'daily' ? 'Dailies' : typeLabel + 's',
      href: `/resources/${type}`,
    });
  }

  if (slug) {
    const readableSlug = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      label: readableSlug.length > 30 ? readableSlug.slice(0, 30) + '...' : readableSlug,
      href: `/resources/${type}/${slug}`,
    });
  }

  return crumbs;
}

export function ResourcesNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const crumbs = useBreadcrumbs(pathname);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search: updates URL params
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set('q', value.trim());
        } else {
          params.delete('q');
        }
        const query = params.toString();
        router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
      }, 400);
    },
    [pathname, router, searchParams],
  );

  // Focus search input when opened on mobile
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={resourcesTheme.nav.container} aria-label="Resources navigation">
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
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className={resourcesTheme.search.compact}
              />
            </div>

            {/* Mobile search icon */}
            <button
              className="md:hidden p-1.5 text-res-text-muted hover:text-res-text transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-res-text-muted hover:text-res-text transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
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
        className={`fixed top-14 left-0 right-0 z-40 bg-res-surface border-b border-res-border px-6 py-3 transition-all duration-200 md:hidden ${
          searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search resources..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className={resourcesTheme.search.input}
        />
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-30 bg-res-bg/95 backdrop-blur-lg flex flex-col pt-20 px-6 transition-all duration-200 md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <nav className="space-y-1" aria-label="Content types">
          {typeLinks.map((link) => {
            const isActive =
              link.href === '/resources'
                ? pathname === '/resources'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 rounded-lg text-sm font-mono uppercase tracking-wider transition-colors ${
                  isActive
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
            &larr; Back to main site
          </Link>
        </div>
      </div>
    </>
  );
}
