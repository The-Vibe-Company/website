"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/kit";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";

/**
 * On phones, the booking call rides under the thumb once the hero has scrolled
 * away, and steps aside again as soon as the closing call comes into view: the
 * page never shows two of them at once, and the bar never sits over the closing
 * panel. Hidden, it is not just moved off screen: it is not painted at all, so
 * nothing (a full-page capture, a reader) finds it parked over the content.
 */
export function MobileBookingBar() {
  const t = useTranslations("finalCta");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const end = document.getElementById("contact");
    if (!hero || !end) return;

    let pastHero = false;
    let atEnd = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const above = entry.boundingClientRect.top < 0;
        if (entry.target === hero) pastHero = !entry.isIntersecting && above;
        else atEnd = entry.isIntersecting || above;
      }
      setShow(pastHero && !atEnd);
    });
    observer.observe(hero);
    observer.observe(end);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!show || undefined}
      inert={!show || undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-[var(--gut)] pb-[calc(10px+env(safe-area-inset-bottom))] transition-[transform,opacity,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:hidden",
        show ? "translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0",
      )}
    >
      {/* A slim clay pill, not a slab: the reply time on the left, the booking
          action on the right. */}
      <div className="clay flex items-center justify-between gap-3 rounded-full py-1.5 pl-5 pr-1.5">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {t("responseLabel")} {t("responseValue")}
        </span>
        <ButtonLink
          href={BOOKING_URL}
          size="sm"
          arrow
          {...bookingLocation("mobile_booking_bar")}
          onClick={() => captureEvent("discovery_call_clicked", { location: "mobile_bar" })}
        >
          {t("bookCall")}
        </ButtonLink>
      </div>
    </div>
  );
}
