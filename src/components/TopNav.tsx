"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BrandGlyph } from "@/components/BrandGlyph";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/design-system";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { resourcesTheme } from "@/lib/resources-theme";
import { navItems } from "./nav-items";

type MobileMenuComponent = typeof import("./MobileMenu").MobileMenu;

/** Shared by every TopNav instance: the menu module is fetched once. Nothing
 *  loads it during the page load, so no late script runs while the page
 *  settles. */
let mobileMenuModule: Promise<MobileMenuComponent> | null = null;
function loadMobileMenu(): Promise<MobileMenuComponent> {
  mobileMenuModule ??= import("./MobileMenu").then((m) => m.MobileMenu);
  return mobileMenuModule;
}

// Each page renders its own TopNav, so it remounts on every client-side
// navigation. The slide-in only plays on the first page of a visit; after
// that the bar stays put instead of vanishing and fading back in.
let hasPlayedEntrance = false;

function SearchIcon() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-res-text-muted"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </span>
  );
}

interface TopNavProps {
  showResourcesSearch?: boolean;
}

/**
 * Seeds the bar's search field with the ?q= of the page it mounts on, once.
 * useSearchParams() makes a static page client-render everything up to the
 * nearest Suspense boundary, so it sits alone in a boundary that renders
 * nothing: the bar itself stays server-rendered and is hydrated in place,
 * which is what lets its entrance play from the server HTML.
 */
function SearchQuerySeed({ onQuery }: { onQuery: (query: string) => void }) {
  const query = useSearchParams().get("q");
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (query) onQuery(query);
  }, [query, onQuery]);
  return null;
}

export function TopNav({ showResourcesSearch = false }: TopNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tA11y = useTranslations("accessibility");
  // Highlight the section the visitor is currently in (a detail page like
  // /case-studies/monka still lights up "Études de cas").
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  // /resources has its own large search box, so the bar does not repeat it.
  const showSearch = showResourcesSearch && pathname !== "/resources";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuActive = mobileMenuOpen || mobileMenuClosing;
  const [MobileMenu, setMobileMenu] = useState<MobileMenuComponent | null>(null);

  const showMobileMenu = useCallback(
    () =>
      loadMobileMenu().then((menu) => {
        setMobileMenu(() => menu);
        return menu;
      }),
    []
  );

  const onMenuExitComplete = useCallback(() => setMobileMenuClosing(false), []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuClosing(true);
    setMobileMenuOpen(false);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          router.push(`/resources/search?q=${encodeURIComponent(value.trim())}`, {
            scroll: false,
          });
        } else {
          router.push("/resources", { scroll: false });
        }
      }, 400);
    },
    [router]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuActive) return;

    const menuTrigger = menuTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const backgroundElements = [
      document.getElementById("main-content"),
      document.querySelector<HTMLElement>("footer"),
    ].filter((element): element is HTMLElement => element !== null);
    document.body.style.overflow = "hidden";
    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const focusInitialControl = requestAnimationFrame(() => {
      menuCloseRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      // Already handled inside the dialog, e.g. Escape closing the contact
      // menu: it closes that menu only, not the whole dialog.
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = menuDialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("hidden"));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusInitialControl);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach((element) => {
        element.inert = false;
        element.removeAttribute("aria-hidden");
      });
      requestAnimationFrame(() => menuTrigger?.focus());
    };
  }, [closeMobileMenu, mobileMenuActive]);

  return (
    <>
      {/* Keyboard/screen-reader skip link: jumps past the nav to the page's
          main content. Hidden until focused. */}
      <a
        href="#main-content"
        aria-hidden={mobileMenuActive || undefined}
        tabIndex={mobileMenuActive ? -1 : undefined}
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main-content");
          if (main) {
            main.focus({ preventScroll: true });
            main.scrollIntoView();
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-full focus:border focus:border-foreground focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg"
      >
        {tA11y("skipToContent")}
      </a>
      <nav
        aria-label={tA11y("mainNavigation")}
        aria-hidden={mobileMenuActive || undefined}
        inert={mobileMenuActive || undefined}
        // site-nav: held still while the page under it changes. nav-enter: the
        // slide-in, a CSS animation so it plays from the server HTML
        // (globals.css).
        className={cn(
          "site-nav sticky top-0 left-0 right-0 z-[60] bg-background/85 px-6 backdrop-blur-xl md:px-10 lg:px-16",
          !hasPlayedEntrance && "nav-enter",
        )}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) hasPlayedEntrance = true;
        }}
      >
        {/* The rule stops at the page gutters, like every other rule on the
            site, instead of running edge to edge under the blur. */}
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between border-b border-border lg:h-[84px]">
        {/* Wordmark */}
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-3 font-mono text-[13px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-soft-foreground"
        >
          <BrandGlyph className="h-4 w-auto" />
          <span>THE VIBE CO.</span>
        </Link>

        {/* Inline search. Kept in the flex flow (never absolutely centered) so
            it can never slide under the nav links, and only shown from xl up:
            below that the wordmark and the nav already fill the bar. */}
        {showSearch && (
          <div className="relative hidden xl:block flex-1 min-w-0 max-w-sm mx-8">
            <SearchIcon />
            <input
              type="search"
              placeholder={t("searchShort")}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label={tA11y("searchResources")}
              // Fixed height so the bar keeps the same height as on pages
              // without a search field.
              className={cn(resourcesTheme.search.input, "h-9 py-0 pl-9")}
            />
          </div>
        )}

        {/* Right cluster: search toggle (below xl) + nav + hamburger */}
        <div className="flex shrink-0 items-center gap-1 lg:gap-2">
          {/* Search toggle. Replaces the inline field below xl, on tablet as
              well as mobile. */}
          {showSearch && (
            <button
              className="xl:hidden p-2"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? tA11y("closeSearch") : tA11y("openSearch")}
              aria-controls="resources-search-panel"
              aria-expanded={searchOpen}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          )}

          {/* Desktop nav */}
          <div className="hidden items-center lg:flex">
            <ul className="m-0 flex list-none items-center gap-9 p-0">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() =>
                      captureEvent("nav_link_clicked", {
                        label: item.key,
                        href: item.href,
                        location: "desktop_nav",
                      })
                    }
                    className={cn(
                      "text-[14px] text-soft-foreground transition-colors hover:text-foreground",
                      isActive(item.href) &&
                        "text-foreground underline decoration-brand decoration-1 underline-offset-[8px]"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher className="ml-[52px]" />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() => captureEvent("contact_email_clicked", { location: "nav" })}
              aria-label={t("contactEmail")}
              title={CONTACT_EMAIL}
              className="ml-8 inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-brand"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="1.5" />
                <path d="m3.5 6 8.5 7 8.5-7" />
              </svg>
            </a>
            <a
              href={BOOKING_URL}
              {...bookingLocation("header")}
              onClick={() => {
                setSearchOpen(false);
                captureEvent("discovery_call_clicked", { location: "nav" });
              }}
              className="ml-5 inline-flex h-11 items-center rounded-[2px] bg-foreground px-[18px] text-[14px] font-medium text-background transition-colors hover:bg-soft-foreground"
            >
              {t("bookCall")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={menuTriggerRef}
            className="lg:hidden p-2"
            // The menu's code is fetched on the first sign of intent (hover,
            // focus, touch), not while the page loads; the tap then waits for
            // it if it has not landed yet.
            onPointerEnter={() => void loadMobileMenu()}
            onPointerDown={() => void loadMobileMenu()}
            onFocus={() => void loadMobileMenu()}
            onClick={() => {
              captureEvent("mobile_menu_opened");
              setSearchOpen(false);
              // Opened in the same render as the menu module lands (at once
              // when it was prefetched), so its focus handling finds it.
              void showMobileMenu().then(() => {
                setMobileMenuClosing(false);
                setMobileMenuOpen(true);
              });
            }}
            aria-label={tA11y("openMenu")}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-dialog"
            tabIndex={mobileMenuActive ? -1 : undefined}
          >
            <svg
              width="24"
              height="24"
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

      {showSearch && (
        <div
          id="resources-search-panel"
          aria-hidden={!searchOpen}
          className={`fixed left-0 right-0 z-[65] bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-3 transition-all duration-200 xl:hidden ${searchOpen ? "top-16 opacity-100 translate-y-0" : "top-14 opacity-0 -translate-y-2 pointer-events-none"}`}
        >
          <div className="relative">
            <SearchIcon />
            <input
              type="search"
              placeholder={t("searchLong")}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label={tA11y("searchResources")}
              tabIndex={searchOpen ? 0 : -1}
              className={cn(resourcesTheme.search.input, "pl-9")}
            />
          </div>
        </div>
      )}

      {/* Mobile menu: its own module, loaded on the hamburger (see
          loadMobileMenu), so framer-motion stays out of the page load. */}
      {MobileMenu && (
        <MobileMenu
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          onExitComplete={onMenuExitComplete}
          isActive={isActive}
          dialogRef={menuDialogRef}
          closeRef={menuCloseRef}
        />
      )}
      {showResourcesSearch && (
        <Suspense fallback={null}>
          <SearchQuerySeed onQuery={setSearchValue} />
        </Suspense>
      )}
    </>
  );
}
