"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";

interface ContactMenuProps {
  /** Reported as `location` by the analytics events fired from the menu. */
  location: "nav" | "mobile_menu";
  /** Classes for the trigger button, so each header keeps its own look. */
  triggerClassName?: string;
  /** Classes for the popup (its position differs between bar and dialog). */
  menuClassName?: string;
  className?: string;
  /** Called when the menu opens, e.g. to close another header panel. */
  onOpen?: () => void;
  /** Called after a choice is made, e.g. to close the mobile dialog. */
  onSelect?: () => void;
}

/**
 * The header "Nous contacter" / "Contact us" button: a menu button (WAI-ARIA
 * APG pattern) offering a booking link and an email link. Arrow keys, Home and
 * End move between the choices; Escape closes and returns focus to the button;
 * Tab or a click outside closes it.
 *
 * The cal.com link is tracked as `booking_link_clicked` by BookingLinkTracker,
 * the email link as `contact_email_clicked`.
 */
export function ContactMenu({
  location,
  triggerClassName,
  menuClassName,
  className,
  onOpen,
  onSelect,
}: ContactMenuProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // Which item to focus once the menu has rendered: -1 is the last one.
  const pendingFocus = useRef<number | null>(null);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const menuId = `${id}-menu`;

  const focusItem = useCallback((index: number) => {
    const items = itemRefs.current.filter(
      (item): item is HTMLAnchorElement => item !== null
    );
    if (items.length === 0) return;
    items[(index + items.length) % items.length].focus();
  }, []);

  const openMenu = (focusIndex: number) => {
    pendingFocus.current = focusIndex;
    if (!open) {
      captureEvent("get_in_touch_clicked", { location });
      onOpen?.();
    }
    setOpen(true);
  };

  const closeMenu = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    if (pendingFocus.current !== null) {
      focusItem(pendingFocus.current);
      pendingFocus.current = null;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, closeMenu, focusItem]);

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(-1);
    } else if (event.key === "Escape" && open) {
      // preventDefault marks the Escape as handled: the mobile dialog around
      // the menu also listens for Escape and would otherwise close entirely.
      event.preventDefault();
      closeMenu(true);
    }
  };

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.indexOf(
      document.activeElement as HTMLAnchorElement
    );
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(-1);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        // Focus moves on naturally; the menu just stops being open.
        closeMenu(false);
        break;
    }
  };

  const select = () => {
    closeMenu(false);
    onSelect?.();
  };

  const itemClassName =
    "flex min-h-11 items-center justify-between gap-6 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? closeMenu(false) : openMenu(0))}
        onKeyDown={onTriggerKeyDown}
        className={cn("inline-flex cursor-pointer items-center justify-center gap-2", triggerClassName)}
      >
        {t("getInTouch")}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={cn("transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M1.5 3.5 5 7l3.5-3.5" />
        </svg>
      </button>
      <div
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className={cn(
          "z-[80] min-w-full border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_var(--foreground)]",
          menuClassName
        )}
      >
        <a
          ref={(node) => {
            itemRefs.current[0] = node;
          }}
          role="menuitem"
          tabIndex={-1}
          href={BOOKING_URL}
          {...bookingLocation(location === "nav" ? "header_contact_menu" : "header_mobile_contact_menu")}
          onClick={select}
          className={itemClassName}
        >
          {t("contactBookCall")}
          <span aria-hidden="true">→</span>
        </a>
        <a
          ref={(node) => {
            itemRefs.current[1] = node;
          }}
          role="menuitem"
          tabIndex={-1}
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() => {
            captureEvent("contact_email_clicked", { location });
            select();
          }}
          className={cn(itemClassName, "border-t border-border")}
        >
          {t("contactEmail")}
          <span aria-hidden="true">@</span>
        </a>
      </div>
    </div>
  );
}
