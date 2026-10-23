"use client";

import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/kit";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";

/**
 * The 30-minute call, in the hero: the black lacquer pill with the orange rim,
 * the same one as the header and the closing call.
 *
 * Its own named event, `cta_booking_click`, carries a `page` property so the
 * About page can be told apart from the homepage CTAs (which fire
 * `discovery_call_clicked` and `contact_cta_clicked`).
 */
export function AboutBookingCta({ page = "about" }: { page?: string }) {
  const t = useTranslations("about");

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 max-md:w-full">
      <ButtonLink
        href={BOOKING_URL}
        size="lg"
        arrow
        {...bookingLocation("cta_about")}
        onClick={() => captureEvent("cta_booking_click", { page })}
        className="max-md:w-full"
      >
        {t("bookCall")}
      </ButtonLink>
      <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {t("response")}
      </span>
    </div>
  );
}
