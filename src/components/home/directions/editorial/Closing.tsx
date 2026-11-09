"use client";

import { useTranslations } from "next-intl";
import { BrandSquare } from "@/components/BrandSquare";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { SERIF } from "./fonts";
import { MaskLines } from "./MaskLines";

/**
 * The last spread: the question set huge in the page's two voices, Geist then
 * the serif, over the orange bloom that mirrors the hero's, and one way in.
 */
export function Closing() {
  const t = useTranslations("finalCta");

  return (
    <section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-80 -left-40 h-[820px] w-[1100px]"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 115 19 / 0.15), rgb(242 115 19 / 0.04) 55%, transparent)",
        }}
      />
      <div className="relative mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <div className="border-t border-border pb-24 pt-20 md:pb-32 md:pt-28">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
          <BrandSquare />
          {t("kicker")}
        </p>
        <h2 className="m-0 mt-8 text-[clamp(60px,11.5vw,196px)] font-bold leading-[0.88] tracking-[-0.055em] text-foreground">
          <MaskLines
            lines={[
              t("titleLine1"),
              <span key="serif" className={`${SERIF} block text-[1.06em] leading-[0.95] tracking-[-0.025em] md:pl-[0.6em]`}>
                {/* French sets a space before "?": keep it from breaking. */}
                {t("titleLine2").replace(/ ([?!:;])/g, "\u00a0$1")}
              </span>,
            ]}
          />
        </h2>
        <div className="mt-14 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <a
            href={BOOKING_URL}
            {...bookingLocation("cta_final")}
            onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
            className="group inline-flex h-[60px] items-center gap-3 self-start rounded-[2px] bg-foreground px-7 text-[17px] font-medium text-background transition-colors hover:bg-soft-foreground"
          >
            {t("bookCall")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground md:text-right">
            <dt className="text-muted-foreground">{t("responseLabel")}</dt>
            <dd className="m-0">{t("responseValue")}</dd>
            <dt className="text-muted-foreground">{t("emailLabel")}</dt>
            <dd className="m-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                className="normal-case tracking-[0.05em] underline decoration-1 underline-offset-4 hover:text-brand"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </dl>
        </div>
        </div>
      </div>
    </section>
  );
}
