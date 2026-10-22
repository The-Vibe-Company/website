"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ContactMenu } from "@/components/ContactMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn, createTransition } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";

const navItems = [
  { key: "portfolio", href: "/portfolio" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "resources", href: "/resources" },
] as const;

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
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
  );
}

interface TopNavProps {
  showResourcesSearch?: boolean;
}

export function TopNav(props: TopNavProps) {
  return (
    <Suspense fallback={null}>
      <TopNavInner {...props} />
    </Suspense>
  );
}

function TopNavInner({ showResourcesSearch = false }: TopNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [searchValue, setSearchValue] = useState(
    showResourcesSearch ? searchParams.get("q") || "" : ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuActive = mobileMenuOpen || mobileMenuClosing;

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
        className="btn btn-lacquer btn-sm sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100]"
      >
        {tA11y("skipToContent")}
      </a>

      {/* The header: one clay pill on the page's own edge (the same .wrap as the
          content), sticky so it stays when the page scrolls. */}
      <header
        className="nav-wrap"
        aria-hidden={mobileMenuActive || undefined}
        inert={mobileMenuActive || undefined}
      >
        <div className="wrap">
          <nav aria-label={tA11y("mainNavigation")} className="nav clay rim rounded-full">
            {/* Wordmark */}
            <Link href="/" className="brand">
              <Image
                src="/brand/tvc-glyph-w192.png"
                alt=""
                width={26}
                height={25}
                priority
              />
              <span>THE VIBE CO.</span>
            </Link>

            {/* Inline search. Kept in the flex flow (never absolutely centred) so
                it can never slide under the nav links, and only shown from xl
                up: below that the wordmark and the nav already fill the bar. */}
            {showSearch && (
              <label className="field field-sm ml-2 hidden max-w-sm flex-1 xl:flex">
                <SearchIcon />
                <input
                  type="search"
                  placeholder={t("searchShort")}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  aria-label={tA11y("searchResources")}
                />
              </label>
            )}

            {/* Right cluster: search toggle (below xl) + nav + menu button */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {/* Search toggle. Replaces the inline field below xl, on tablet as
                  well as mobile. */}
              {showSearch && (
                <button
                  type="button"
                  className="round round-sm well xl:hidden"
                  onClick={() => setSearchOpen((open) => !open)}
                  aria-label={searchOpen ? tA11y("closeSearch") : tA11y("openSearch")}
                  aria-controls="resources-search-panel"
                  aria-expanded={searchOpen}
                >
                  <SearchIcon />
                </button>
              )}

              {/* Desktop nav */}
              <div className="hidden items-center gap-3 lg:flex xl:gap-5">
                <ul className="nav-links">
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
                        className="nav-link"
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <LanguageSwitcher />
                <ContactMenu location="nav" />
              </div>

              {/* Phone and tablet menu button */}
              <button
                ref={menuTriggerRef}
                type="button"
                className="round round-sm well lg:hidden"
                onClick={() => {
                  captureEvent("mobile_menu_opened");
                  setSearchOpen(false);
                  setMobileMenuClosing(false);
                  setMobileMenuOpen(true);
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
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {showSearch && (
        <div
          id="resources-search-panel"
          aria-hidden={!searchOpen}
          className={cn(
            "fixed inset-x-0 z-[65] transition-all duration-200 xl:hidden",
            searchOpen
              ? "top-[84px] translate-y-0 opacity-100"
              : "pointer-events-none top-[72px] -translate-y-2 opacity-0"
          )}
        >
          <div className="wrap">
            <div className="clay-quiet rounded-plate p-2">
              <label className="field">
                <SearchIcon />
                <input
                  type="search"
                  placeholder={t("searchLong")}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  aria-label={tA11y("searchResources")}
                  tabIndex={searchOpen ? 0 : -1}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu: a porcelaine sheet. The wordmark and the close button sit
          exactly where the bar's wordmark and menu button are, so opening it
          does not make the brand vanish. */}
      <AnimatePresence onExitComplete={() => setMobileMenuClosing(false)}>
        {mobileMenuOpen && (
          <motion.div
            ref={menuDialogRef}
            id="mobile-navigation-dialog"
            data-variant="hybrid"
            // Scrolls on its own: on a landscape phone the stack is taller than
            // the screen.
            className="fixed inset-0 z-[70] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={tA11y("mobileNavigation")}
          >
            <div className="wrap flex min-h-full flex-col pb-10 pt-3">
              <div className="flex min-h-14 items-center justify-between pl-4 pr-2">
                <Link href="/" onClick={closeMobileMenu} className="brand">
                  <Image src="/brand/tvc-glyph-w192.png" alt="" aria-hidden="true" width={26} height={25} />
                  <span>THE VIBE CO.</span>
                </Link>
                <button
                  ref={menuCloseRef}
                  type="button"
                  className="round round-sm clay"
                  onClick={closeMobileMenu}
                  aria-label={tA11y("closeMenu")}
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
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ul className="m-0 mt-10 flex list-none flex-col gap-1 p-0 px-4">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={createTransition(0.5, index * 0.06)}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "display d-md block py-2 text-ink transition-colors hover:text-bisque",
                        isActive(item.href) &&
                          "underline decoration-rim decoration-[3px] underline-offset-[10px]"
                      )}
                      onClick={() => {
                        captureEvent("nav_link_clicked", {
                          label: item.key,
                          href: item.href,
                          location: "mobile_menu",
                        });
                        closeMobileMenu();
                      }}
                    >
                      {t(item.key)}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-auto flex flex-col items-center gap-6 pt-12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={createTransition(0.5, 0.2)}
              >
                <ContactMenu location="mobile_menu" variant="stack" onSelect={closeMobileMenu} />
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
