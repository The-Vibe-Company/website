"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  components,
  typography,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";
import { resourcesTheme } from "@/lib/resources-theme";

const navItems = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Resources", href: "/resources" },
];

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    showResourcesSearch ? searchParams.get("q") || "" : ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

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

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 lg:px-24 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 relative"
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
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
          <span>THE VIBE CO.</span>
        </Link>

        {showResourcesSearch && (
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className={resourcesTheme.search.compact}
            />
          </div>
        )}

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <ul className="flex items-center gap-2 list-none m-0 p-0">
            {navItems.map((item, index) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(components.nav.link, "relative")}
                >
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-muted/20 rounded-full -z-10"
                      transition={animations.easing.bounce}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={cn(components.divider.vertical, "mx-2")} aria-hidden="true" />
          <a href="mailto:founders@thevibecompany.co" className={components.button.primary}>
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-1">
          {showResourcesSearch && (
            <button
              className="p-2"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? "Close search" : "Open search"}
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
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
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
          className={`fixed left-0 right-0 z-[65] bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-3 transition-all duration-200 md:hidden ${searchOpen ? "top-16 opacity-100 translate-y-0" : "top-14 opacity-0 -translate-y-2 pointer-events-none"}`}
        >
          <input
            type="text"
            placeholder="Search resources..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className={resourcesTheme.search.input}
          />
        </div>
      )}

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <button
              className="absolute top-4 right-6 p-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
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
                key={item.label}
                className={cn(typography.heading.h3, "text-foreground")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={createTransition(0.6, index * 0.1)}
              >
                <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.a
              href="mailto:founders@thevibecompany.co"
              className={cn(components.button.primary, "mt-4")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={createTransition(0.6, 0.2)}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get in touch
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
