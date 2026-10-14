"use client";

import { useEffect } from "react";
import { isBookingHref, trackBookingLinkClick } from "@/lib/booking-tracking";
import { isPostHogEnabled } from "@/lib/posthog";

/**
 * Sends `booking_link_clicked` for every cal.com link on the page, including
 * the ones inside rendered article Markdown. Listens once on the document in
 * the capture phase, so a handler that stops propagation cannot hide a click,
 * and middle-clicks (auxclick) count too. Inert when PostHog is off.
 */
export function BookingLinkTracker() {
  useEffect(() => {
    if (!isPostHogEnabled) return;

    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link || !isBookingHref(link.getAttribute("href"))) return;
      trackBookingLinkClick(link, window.location.pathname);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}
