"use client";

import { useTranslations } from "next-intl";
import { BrandSquare } from "@/components/BrandSquare";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";
import { DOT, LivePulse, parisTime, useNowSecond } from "./primitives";

const COPY = {
  fr: { panel: "Ligne directe", city: "Heure à Paris", latest: "Réponse au plus tard", status: "Statut" },
  en: { panel: "Direct line", city: "Time in Paris", latest: "Reply by", status: "Status" },
};

const DEADLINE = {
  fr: new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  en: new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
};

/**
 * The closing call, with a live readout beside the booking slab: the time in
 * Paris and when a reply is due at the latest, from the 24-hour promise.
 */
export function LiveCTA({ locale }: { locale: "fr" | "en" }) {
  const t = useTranslations("finalCta");
  const tFooter = useTranslations("footer");
  const now = useNowSecond();
  const c = COPY[locale];
  const deadline = now ? DEADLINE[locale].format(new Date((now + 24 * 3600) * 1000)) : "—";
  const [hm, sec] = (() => {
    const time = parisTime(now);
    return [time.slice(0, 5), time.slice(6)];
  })();

  const ROW = "flex items-baseline justify-between gap-6 border-t border-border py-4 font-mono text-[11px] uppercase tracking-[0.18em]";

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -left-48 h-[720px] w-[960px]"
        style={{
          background: "radial-gradient(closest-side, rgb(242 115 19 / 0.13), rgb(242 115 19 / 0.04) 55%, transparent)",
        }}
      />
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 gap-14 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:px-16">
        <div>
          <span className="mb-8 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <BrandSquare />
            {t("kicker")}
          </span>
          <h2 className="m-0 text-[clamp(52px,8.4vw,136px)] font-bold leading-[0.88] tracking-[-0.05em] text-foreground">
            {t("titleLine1")}
            <br />
            <span className="text-muted-foreground">{t("titleLine2")}</span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={BOOKING_URL}
              {...bookingLocation("cta_final")}
              onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
              className="group inline-flex h-[60px] items-center gap-3 rounded-[2px] bg-foreground px-7 text-[17px] font-medium text-background transition-colors hover:bg-soft-foreground"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
              className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-brand"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="border border-border bg-card/70 px-6 pt-5 backdrop-blur-sm">
          <p className="m-0 flex items-center justify-between pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
            <span className="flex items-center gap-3">
              <LivePulse />
              {c.panel}
            </span>
            <span className="text-muted-foreground">Paris</span>
          </p>
          <div className="border-t border-border py-5">
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.city}</p>
            <p className={cn(DOT, "m-0 mt-3 flex items-baseline gap-2 leading-none text-foreground")} suppressHydrationWarning>
              <span className="text-[72px]">{hm}</span>
              <span className="text-[32px] text-muted-foreground">{sec}</span>
            </p>
          </div>
          <p className={ROW}>
            <span className="text-muted-foreground">{t("responseLabel")}</span>
            <span className="text-foreground">{t("responseValue")}</span>
          </p>
          <p className={ROW} suppressHydrationWarning>
            <span className="text-muted-foreground">{c.latest}</span>
            <span className="text-foreground">{deadline}</span>
          </p>
          <p className={ROW}>
            <span className="text-muted-foreground">{c.status}</span>
            <span className="flex items-center gap-2 text-foreground">
              <span aria-hidden="true" className="h-2 w-2 bg-brand" />
              {tFooter("openToProjects")}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
