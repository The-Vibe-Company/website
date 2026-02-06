"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  components,
  typography,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";

const navItems = [
  { label: "Agency", href: "/agency" },
  { label: "Resources", href: "/resources" },
];

export function TopNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 lg:px-24 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={createTransition(0.6, 0.3)}
      >
        {/* Wordmark */}
        <a
          href="/"
          className={cn(
            typography.label.mono,
            "text-foreground hover:text-muted-foreground transition-colors"
          )}
        >
          THE VIBE CO.
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <ul className="flex items-center gap-2 list-none m-0 p-0">
            {navItems.map((item, index) => (
              <li key={item.label}>
                <a
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
                </a>
              </li>
            ))}
          </ul>
          <div className={cn(components.divider.vertical, "mx-2")} aria-hidden="true" />
          <a href="mailto:founders@thevibecompany.co" className={components.button.primary}>
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
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
      </motion.nav>

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
              <motion.a
                key={item.label}
                href={item.href}
                className={cn(typography.heading.h3, "text-foreground")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={createTransition(0.6, index * 0.1)}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </motion.a>
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
