"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  components,
  typography,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";
import { resourcesTheme } from "@/lib/resources-theme";

const navItems = [
  { key: "portfolio", href: "/portfolio" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "resources", href: "/resources" },
] as const;

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      <motion.nav
        aria-label={tA11y("mainNavigation")}
        aria-hidden={mobileMenuActive || undefined}
        inert={mobileMenuActive || undefined}
        className="sticky top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 lg:px-24 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={createTransition(0.6, 0.3)}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className={cn(
            typography.label.mono,
            "inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          )}
        >
          <Image
            src="/favicon.svg"
            alt="The Vibe Co. logo"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span>THE VIBE CO.</span>
        </Link>

        {showResourcesSearch && (
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <input
              type="text"
              placeholder={t("searchShort")}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label={tA11y("searchResources")}
              className={resourcesTheme.search.compact}
            />
          </div>
        )}

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <ul className="flex items-center gap-2 list-none m-0 p-0">
            {navItems.map((item, index) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() =>
                    captureEvent("nav_link_clicked", {
                      label: item.key,
                      href: item.href,
                      location: "desktop_nav",
                    })
                  }
                  className={cn(
                    components.nav.link,
                    "relative",
                    isActive(item.href) &&
                      "text-foreground underline decoration-1 underline-offset-[6px]"
                  )}
                >
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-muted/20 rounded-full -z-10"
                      transition={animations.easing.bounce}
                    />
                  )}
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className={cn(components.divider.vertical, "mx-2")} aria-hidden="true" />
          <LanguageSwitcher />
          <div className={cn(components.divider.vertical, "mx-2")} aria-hidden="true" />
          <a
            href="mailto:founders@thevibecompany.co"
            onClick={() => captureEvent("get_in_touch_clicked", { location: "nav" })}
            className={cn(components.button.primary, "min-w-[150px] rounded-none text-center")}
          >
            {t("getInTouch")}
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-1">
          {showResourcesSearch && (
            <button
              className="p-2"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? tA11y("closeSearch") : tA11y("openSearch")}
              aria-controls="mobile-resources-search"
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
          <button
            ref={menuTriggerRef}
            className="p-2"
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
      </motion.nav>

      {showResourcesSearch && (
        <div
          id="mobile-resources-search"
          aria-hidden={!searchOpen}
          className={`fixed left-0 right-0 z-[65] bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-3 transition-all duration-200 md:hidden ${searchOpen ? "top-16 opacity-100 translate-y-0" : "top-14 opacity-0 -translate-y-2 pointer-events-none"}`}
        >
          <input
            type="text"
            placeholder={t("searchLong")}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label={tA11y("searchResources")}
            tabIndex={searchOpen ? 0 : -1}
            className={resourcesTheme.search.input}
          />
        </div>
      )}

      {/* Mobile menu */}
      <AnimatePresence onExitComplete={() => setMobileMenuClosing(false)}>
        {mobileMenuOpen && (
          <motion.div
            ref={menuDialogRef}
            id="mobile-navigation-dialog"
            className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={tA11y("mobileNavigation")}
          >
            <button
              ref={menuCloseRef}
              className="absolute top-4 right-6 p-2"
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
            {navItems.map((item, index) => (
              <motion.div
                key={item.key}
                className={cn(typography.heading.h3, "text-foreground")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={createTransition(0.6, index * 0.1)}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    isActive(item.href) &&
                      "underline decoration-1 underline-offset-[6px]"
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
              </motion.div>
            ))}
            <motion.a
              href="mailto:founders@thevibecompany.co"
              className={cn(components.button.primary, "mt-4 rounded-none")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={createTransition(0.6, 0.2)}
              onClick={() => {
                captureEvent("get_in_touch_clicked", { location: "mobile_menu" });
                closeMobileMenu();
              }}
            >
              {t("getInTouch")}
            </motion.a>
            <LanguageSwitcher className="mt-2 text-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
