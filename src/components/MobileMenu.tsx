"use client";

import type { CSSProperties, RefObject } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandGlyph } from "@/components/BrandGlyph";
import { ContactMenu } from "@/components/ContactMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { typography, cn } from "@/lib/design-system";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { navItems } from "./nav-items";

/**
 * The full-screen mobile menu: it fades in (0.3s), its links rise in one
 * after the other, and it fades out before TopNav unmounts it. CSS animations
 * (menu-fade-in, menu-fade-out and menu-rise in globals.css) with the timings
 * framer-motion used, so the menu no longer ships framer-motion, and stays in
 * TopNav's bundle: the phones' only navigation never waits on a lazy chunk.
 */
const rise = (delay: number) => ({ animationDelay: `${delay}s` }) as CSSProperties;

export function MobileMenu({
  closing,
  onClose,
  onExitComplete,
  isActive,
  dialogRef,
  closeRef,
}: {
  /** Fading out: TopNav unmounts it on onExitComplete. */
  closing: boolean;
  onClose: () => void;
  onExitComplete: () => void;
  isActive: (href: string) => boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
  closeRef: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("nav");
  const tA11y = useTranslations("accessibility");

  return (
    <div
      ref={dialogRef}
      id="mobile-navigation-dialog"
      // Safe centring plus its own scroll: on a landscape phone the
      // stack is taller than the screen, and plain centring pushed the
      // first link under the bar and the language switcher (the only
      // one below lg) out of reach. py-20 keeps clear of the wordmark.
      className={cn(
        "fixed inset-0 z-[70] flex flex-col items-center justify-center-safe gap-8 overflow-y-auto bg-background py-20",
        closing ? "menu-fade-out" : "menu-fade-in",
      )}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget) onExitComplete();
      }}
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
        <div
          key={item.key}
          className={cn(typography.heading.h3, "text-foreground menu-rise")}
          style={rise(index * 0.1)}
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
        </div>
      ))}
      <div className="mt-4 flex flex-col items-center gap-3 menu-rise" style={rise(navItems.length * 0.1)}>
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
      </div>
      <LanguageSwitcher className="text-sm" />
    </div>
  );
}
