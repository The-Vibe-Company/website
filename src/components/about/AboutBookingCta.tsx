"use client";

import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/kit";
import { cn } from "@/lib/design-system";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";

/**
 * The 30-minute call, in the hero: the black lacquer pill with the orange rim,
 * the same one as the header and the closing call.
 *
 * Its own named event, `cta_booking_click`, carries a `page` property so the
 * About page can be told apart from the homepage CTAs (which fire
 * `discovery_call_clicked` and `contact_cta_clicked`). The landing pages that
 * reuse it pass their own `page`, `location` and message namespace (which must
 * hold `bookCall` and `response`); `inverse` paints it clay on an ink band,
 * and `className` lets them space it (the About hero lays it out in a row).
 */
export function AboutBookingCta({
  page = "about",
  location = "cta_about",
  namespace = "about",
  inverse = false,
  className,
}: {
  page?: string;
  location?: string;
  namespace?: string;
  inverse?: boolean;
  className?: string;
}) {
  const t = useTranslations(namespace);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-3 max-md:w-full", className)}>
      <ButtonLink
        href={BOOKING_URL}
        size="lg"
        arrow
        variant={inverse ? "clay" : "lacquer"}
        {...bookingLocation(location)}
        onClick={() => captureEvent("cta_booking_click", { page })}
        className="max-md:w-full"
      >
        {t("bookCall")}
      </ButtonLink>
      <span
        className={cn(
          "font-mono text-xs font-medium uppercase tracking-[0.14em]",
          inverse ? "text-white/55" : "text-muted-foreground",
        )}
      >
        {t("response")}
      </span>
    </div>
  );
}
