"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandGlyph } from "@/components/BrandGlyph";
import { ContactMenu } from "@/components/ContactMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { typography, cn, createTransition } from "@/lib/design-system";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { navItems } from "./nav-items";

/**
 * The full-screen mobile menu, with its fade and staggered links. Kept out of
 * TopNav so that framer-motion, which only this overlay uses, is not part of
 * every page's load: TopNav imports this module when the hamburger is
 * hovered, focused or pressed.
 */
export function MobileMenu({
  open,
  onClose,
  onExitComplete,
  isActive,
  dialogRef,
  closeRef,
}: {
  open: boolean;
  onClose: () => void;
  onExitComplete: () => void;
  isActive: (href: string) => boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
  closeRef: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("nav");
  const tA11y = useTranslations("accessibility");

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          ref={dialogRef}
          id="mobile-navigation-dialog"
          // Safe centring plus its own scroll: on a landscape phone the
          // stack is taller than the screen, and plain centring pushed the
          // first link under the bar and the language switcher (the only
          // one below lg) out of reach. py-20 keeps clear of the wordmark.
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center-safe gap-8 overflow-y-auto bg-background py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={tA11y("mobileNavigation")}
        >
          {/* Same wordmark, same spot as the bar it covers, so opening the
              menu does not make the brand vanish. */}
          <Link
            href="/"
            onClick={onClose}
            className="absolute left-6 top-3 inline-flex h-10 items-center gap-3 font-mono text-[13px] uppercase tracking-[0.24em] text-foreground"
          >
            <BrandGlyph className="h-[15px] w-auto" />
            <span>THE VIBE CO.</span>
          </Link>
          <button
            ref={closeRef}
            className="absolute top-3 right-6 p-2"
            onClick={onClose}
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
                  onClose();
                }}
              >
                {t(item.key)}
              </Link>
            </motion.div>
          ))}
          <motion.div
            className="mt-4 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={createTransition(0.6, 0.3)}
          >
            <a
              href={BOOKING_URL}
              {...bookingLocation("header_mobile_menu")}
              onClick={() => {
                captureEvent("discovery_call_clicked", { location: "mobile_menu" });
                onClose();
              }}
              className="inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 text-[15px] font-semibold text-background"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>
            <ContactMenu
              location="mobile_menu"
              onSelect={onClose}
              className="flex flex-col items-center"
              triggerClassName="min-h-11 text-sm text-muted-foreground underline decoration-1 underline-offset-4 hover:text-foreground aria-expanded:text-foreground"
              menuClassName="mt-2 w-max"
            />
          </motion.div>
          <LanguageSwitcher className="text-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
