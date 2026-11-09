"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";
import { DISPLAY } from "./font";
import mascot from "./mascot-eclipse.webp";
import { CONTAINER } from "./shared";

/**
 * The closing call is the sunrise. The night above it turns to ember, then to
 * the brand orange, and a sun far wider than the screen comes up from below as
 * the section scrolls in. The mascot stands against it as a black cut-out.
 * Everything written here is ink on orange, so the dusk band above is set in
 * fixed lengths that end before the first line of text.
 */
export function Dawn() {
  const t = useTranslations("finalCta");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const sunY = useTransform(scrollYProgress, [0, 1], ["38%", "0%"]);
  const figureY = useTransform(scrollYProgress, [0, 1], ["14%", "0%"]);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,#0c0c0d_0px,#2a0d04_70px,#8f2b07_150px,#e0620f_210px,#f27313_250px)] pt-24 md:bg-[linear-gradient(to_bottom,#0c0c0d_0px,#2a0d04_90px,#8f2b07_190px,#e0620f_260px,#f27313_310px)] md:pt-32"
    >
      {/* The rising sun. */}
      <motion.div
        aria-hidden="true"
        style={{ y: sunY }}
        className="pointer-events-none absolute left-1/2 top-[34%] -z-10 motion-reduce:[transform:none]! aspect-square w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#ffe1b8_0%,#ffb067_28%,#ff8a2e_55%,#f27313_80%,rgba(242,115,19,0)_100%)] md:w-[120vw]"
      />

      {/* The mascot, cut out black against the light. */}
      <motion.div
        aria-hidden="true"
        style={{ y: figureY }}
        className="pointer-events-none absolute -bottom-[6%] right-[6%] -z-[5] motion-reduce:[transform:none]! w-[40vw] max-w-[420px] md:-bottom-[18%] md:right-[7%] md:w-[26vw]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mascot.src} alt="" width={488} height={672} className="block h-auto w-full brightness-[0.22] contrast-[1.15] saturate-150" loading="lazy" decoding="async" />
      </motion.div>

      <div className={cn(CONTAINER, "relative pb-[62vw] pt-40 text-[#0c0c0d] md:pb-24 md:pt-48")}>
        <p className="m-0 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] md:text-[12px]">
          <span aria-hidden="true" className="h-2 w-2 bg-[#0c0c0d]" />
          {t("kicker")}
        </p>
        <h2
          className={cn(
            DISPLAY,
            "m-0 mt-6 max-w-[11ch] text-[clamp(3.6rem,10vw,10rem)] font-black leading-[0.82] tracking-[-0.01em]",
          )}
        >
          <span className="block">{t("titleLine1")}</span>
          <span className="block">{t("titleLine2")}</span>
        </h2>

        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:gap-14">
          <a
            href={BOOKING_URL}
            {...bookingLocation("cta_final")}
            onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
            className="group inline-flex h-[60px] w-fit items-center gap-3 rounded-[2px] bg-[#0c0c0d] px-7 text-[17px] font-medium text-foreground shadow-[0_18px_40px_-14px_rgba(12,12,13,0.8)] transition-colors hover:bg-[#2a0d04]"
          >
            {t("bookCall")}
            <span aria-hidden="true" className="text-brand transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] md:text-[12px]">
            <dt>{t("responseLabel")}</dt>
            <dd className="m-0 font-semibold">{t("responseValue")}</dd>
            <dt>{t("emailLabel")}</dt>
            <dd className="m-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                className="font-semibold normal-case tracking-[0.04em] underline decoration-1 underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
