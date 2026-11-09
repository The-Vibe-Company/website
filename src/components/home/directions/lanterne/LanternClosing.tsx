"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";
import { Kicker, useLitOnce } from "./light";
import s from "./lantern.module.css";

/**
 * The last room. The booking slab is the light now, a lit doorway: its glow
 * rises over the question, which is lit from below, and spills on the floor.
 * The mascot waits at the edge of the light with its lantern turned down low.
 */
export function LanternClosing() {
  const t = useTranslations("finalCta");
  const [ref, lit] = useLitOnce<HTMLElement>(0.35);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate overflow-hidden bg-[#070707] pb-0 pt-24 md:pt-36"
    >
      {/* Light rising from the doorway. */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] motion-reduce:opacity-100", lit ? "opacity-100" : "opacity-0")}
        style={{
          background:
            "radial-gradient(1000px 640px at 22% 92%, rgb(255 150 60 / 0.3), rgb(242 115 19 / 0.12) 38%, rgb(242 115 19 / 0.03) 64%, transparent 80%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <Kicker>{t("kicker")}</Kicker>
        <h2 className="m-0 mt-8 font-[800] leading-[0.9] tracking-[-0.05em] text-[clamp(3.4rem,10vw,10rem)]">
          {/* Lit from below: dark at the top of the letters, warm at their foot. */}
          <span
            className="block pb-[0.1em]"
            style={{
              color: "transparent",
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundImage: "linear-gradient(to bottom, #8f8b84 0%, #e9e4da 55%, #fff1df 100%)",
            }}
          >
            {t("titleLine1")}
          </span>
          <span
            className="-mt-[0.1em] block pb-[0.14em]"
            style={{
              color: "transparent",
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundImage: "linear-gradient(to bottom, #f4e7d6 0%, #ffc58c 50%, #ff8c35 100%)",
            }}
          >
            {t("titleLine2")}
          </span>
        </h2>

        <div className="mt-10 flex flex-col items-start gap-8 pb-[min(70vw,360px)] md:mt-14 md:flex-row md:items-end md:justify-between md:pb-40">
          <a
            href={BOOKING_URL}
            {...bookingLocation("cta_final")}
            onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
            className="group relative inline-flex h-[64px] items-center gap-3 rounded-[2px] bg-[#fff4e6] px-8 text-[17px] font-medium text-background shadow-[0_0_0_1px_rgb(255_200_140/0.6),0_0_40px_6px_rgb(255_160_70/0.45),0_30px_120px_10px_rgb(242_115_19/0.45)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgb(255_210_160/0.9),0_0_60px_12px_rgb(255_160_70/0.6),0_30px_160px_30px_rgb(242_115_19/0.55)]"
          >
            {t("bookCall")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground md:mr-[min(30vw,420px)]">
            <dt className="text-muted-foreground">{t("responseLabel")}</dt>
            <dd className="m-0">{t("responseValue")}</dd>
            <dt className="text-muted-foreground">{t("emailLabel")}</dt>
            <dd className="m-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                className="normal-case tracking-[0.05em] underline decoration-1 underline-offset-4 hover:text-[#ffb36b]"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </dl>
        </div>
      </div>

      {/* The mascot at the edge of the light, its lantern turned down. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-12%] right-[-8vw] w-[64vw] max-w-[380px] md:bottom-[-22%] md:right-[3vw] md:w-[30vw] md:max-w-[420px]"
        // Lit from the doorway: low, and off to its left.
        style={{ aspectRatio: "488 / 672", "--ox": "0px", "--oy": "0px", "--lx": "-60%", "--ly": "72%" } as CSSProperties}
      >
        <Image src="/images/home/mascot-cutout.webp" alt="" fill sizes="(min-width: 768px) 420px, 64vw" className="object-contain" />
        <div className={`${s.mascotPass} ${s.shadePass}`} />
        <div className={`${s.mascotPass} ${s.warmPass}`} />
        <div className={cn(s.orb, s.orbSmall)} style={{ left: "6%", top: "58%" }} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-[#070707] to-transparent"
      />
    </section>
  );
}
