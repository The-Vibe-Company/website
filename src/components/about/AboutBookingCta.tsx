import { useTranslations } from "next-intl";
import { CaptureLink } from "@/components/CaptureLink";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";

/**
 * The black slab that opens the 30-minute call, right under the H1.
 *
 * Its own named event, `cta_booking_click`, carries a `page` property so the
 * About page can be told apart from the homepage CTAs (which fire
 * `discovery_call_clicked` and `contact_cta_clicked`). The landing pages that
 * reuse it pass their own `page`, `location` and message namespace (which must
 * hold `bookCall` and `response`); `inverse` paints it paper on an ink band.
 *
 * A server component: its copy is read on the server, so the landing
 * namespaces never travel to the client. Only the link is hydrated.
 */
export function AboutBookingCta({
  page = "about",
  location = "cta_about",
  namespace = "about",
  inverse = false,
}: {
  page?: string;
  location?: string;
  namespace?: string;
  inverse?: boolean;
}) {
  const t = useTranslations(namespace);

  return (
    <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-10">
      <CaptureLink
        href={BOOKING_URL}
        {...bookingLocation(location)}
        event="cta_booking_click"
        properties={{ page }}
        className={`inline-flex items-center gap-3 rounded-[2px] border px-6 py-4 text-[15px] font-semibold transition-colors duration-300 md:px-7 md:py-5 md:text-[17px] ${
          inverse
            ? "border-background bg-background text-foreground hover:bg-transparent hover:text-background"
            : "border-foreground bg-foreground text-background hover:border-soft-foreground hover:bg-soft-foreground"
        }`}
      >
        {t("bookCall")}
        <span aria-hidden="true" className="text-lg leading-none">
          →
        </span>
      </CaptureLink>
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
          inverse ? "text-white/55" : "text-muted-foreground"
        }`}
      >
        {t("response")}
      </span>
    </div>
  );
}
