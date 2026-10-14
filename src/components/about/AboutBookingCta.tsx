"use client";

import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/booking";
import { bookingLocation } from "@/lib/booking-tracking";
import { captureEvent } from "@/lib/posthog";

/**
 * The black slab that opens the 30-minute call, right under the H1.
 *
 * Its own named event, `cta_booking_click`, carries a `page` property so the
 * About page can be told apart from the homepage CTAs (which fire
 * `discovery_call_clicked` and `contact_cta_clicked`).
 */
export function AboutBookingCta({ page = "about" }: { page?: string }) {
  const t = useTranslations("about");

  return (
    <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-10">
      <a
        href={BOOKING_URL}
        {...bookingLocation("cta_about")}
        onClick={() => captureEvent("cta_booking_click", { page })}
        className="inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)] md:px-7 md:py-5 md:text-[17px]"
      >
        {t("bookCall")}
        <span aria-hidden="true" className="text-lg leading-none">
          →
        </span>
      </a>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {t("response")}
      </span>
    </div>
  );
}
