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

export function TopNav() {
  return (
    <Suspense fallback={null}>
      <TopNavInner />
    </Suspense>
  );
}

function TopNavInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tA11y = useTranslations("accessibility");
  // Highlight the section the visitor is currently in (a detail page like
  // /case-studies/monka still lights up "Études de cas").
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuActive = mobileMenuOpen || mobileMenuClosing;

  const closeMobileMenu = useCallback(() => {
    setMobileMenuClosing(true);
    setMobileMenuOpen(false);
  }, []);

  const goToSearch = useCallback(
    (value: string, options?: { scroll: false }) => {
      const query = value.trim();
      if (query) {
        router.push(`/resources/search?q=${encodeURIComponent(query)}`, options);
      } else {
        router.push("/resources", options);
      }
    },
    [router]
  );

  // Typing inside the resources section searches as you type; anywhere else the
  // search waits for Enter, so a pause in the middle of a word never carries
  // the visitor off the page they are reading.
  const inResources = pathname === "/resources" || pathname.startsWith("/resources/");

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!inResources) return;
      debounceRef.current = setTimeout(() => goToSearch(value, { scroll: false }), 400);
    },
    [goToSearch, inResources]
  );

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!searchValue.trim()) return;
      goToSearch(searchValue);
      setSearchOpen(false);
    },
    [goToSearch, searchValue]
  );

  const closeSearch = useCallback((returnFocus = false) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchOpen(false);
    if (returnFocus) searchToggleRef.current?.focus();
  }, []);

  // The one search button, the same on every page. A page that shows its own
  // search field (the resources home) is not given a second one: the button
  // takes the visitor to it. Anywhere else it opens the search panel.
  const toggleSearch = useCallback(() => {
    if (searchOpen) {
      closeSearch();
      return;
    }
    const own = document.querySelector<HTMLInputElement>(
      '#main-content input[type="search"]'
    );
    if (own) {
      own.scrollIntoView({ block: "center" });
      own.focus({ preventScroll: true });
      return;
    }
    setSearchValue(pathname === "/resources/search" ? searchParams.get("q") || "" : "");
    setSearchOpen(true);
  }, [closeSearch, pathname, searchOpen, searchParams]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (searchPanelRef.current?.contains(target)) return;
      if (searchToggleRef.current?.contains(target)) return;
      setSearchOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [searchOpen]);

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
        className="btn btn-lacquer btn-sm sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:h-[42px] focus:whitespace-nowrap focus:px-[18px]"
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

            {/* Right cluster: search + nav + menu button */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {/* The search button, the same on every page and at every width:
                  a round icon, compact enough for a phone. */}
              <button
                ref={searchToggleRef}
                type="button"
                className="round round-sm well"
                onClick={toggleSearch}
                aria-label={searchOpen ? tA11y("closeSearch") : tA11y("openSearch")}
                aria-controls={searchOpen ? "header-search-panel" : undefined}
                aria-expanded={searchOpen}
              >
                <SearchIcon />
              </button>

              {/* Desktop nav */}
              <div className="hidden items-center gap-3 min-[1100px]:flex xl:gap-5">
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
                className="round round-sm well min-[1100px]:hidden"
                onClick={() => {
                  captureEvent("mobile_menu_opened");
                  closeSearch();
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

      {/* The search panel: one field under the header, mounted only while it is
          open (so a page that shows its own field never has two of them). */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchPanelRef}
            id="header-search-panel"
            className="fixed inset-x-0 top-[84px] z-[65]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeSearch(true);
              }
            }}
          >
            <div className="wrap">
              <form
                role="search"
                onSubmit={handleSearchSubmit}
                className="clay-quiet rounded-plate p-2"
              >
                <label className="field">
                  <SearchIcon />
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder={t("searchLong")}
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    aria-label={tA11y("searchResources")}
                    enterKeyHint="search"
                  />
                </label>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
