"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { BrandSquare } from "@/components/BrandSquare";
import { captureEvent } from "@/lib/posthog";
import { Dust } from "./Dust";
import { extrude } from "./extrude";
import { Horizon } from "./Horizon";
import { usePointer } from "./pointer";
import s from "./profondeur.module.css";

const SHADOW = extrude({ dx: 0, dy: 1, steps: 16, unit: 1.1 });

/**
 * The bottom of the descent: the floor again, the horizon at its brightest,
 * and far away on it, standing in the light, the mascot waiting. The closing
 * question hangs above it, extruded toward the same vanishing point.
 */
export function ClosingHorizon() {
  const t = useTranslations("finalCta");
  const ref = useRef<HTMLElement>(null);
  const { x: px, y: py } = usePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const glow = useTransform(scrollYProgress, [0, 1], [0.6, 1.5]);
  const travel = useTransform(scrollYProgress, [0, 1], [0, 700]);
  const titleY = useTransform(py, (y) => y * -8);
  // The whole block (question and call) rises into place together.
  const blockY = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const titleX = useTransform(px, (v) => v * -10);
  const mascotX = useTransform(px, (v) => v * -22);
  const mascotScale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <section ref={ref} id="contact" className="relative z-10 isolate flex min-h-[100svh] flex-col overflow-hidden">
      <Horizon horizon="76%" px={px} travel={travel} glow={glow} />
      <Dust density={0.9} warmBelow={0.45} />

      <motion.div style={{ y: blockY }} className="relative mx-auto w-full max-w-[90rem] flex-1 px-6 pt-24 text-center md:px-10 md:pt-28 lg:px-16">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
          <BrandSquare />
          {t("kicker")}
        </p>
        <motion.h2
          style={{ y: titleY, x: titleX }}
          className="m-0 mt-6 text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]"
        >
          <span className={s.extrude}>
            <span aria-hidden="true" className="text-background" style={{ textShadow: SHADOW }}>
              {t("titleLine1")}
            </span>
            <span className={s.face}>{t("titleLine1")}</span>
          </span>
          <br />
          <span className={s.extrude}>
            <span aria-hidden="true" className="text-background" style={{ textShadow: SHADOW }}>
              {t("titleLine2")}
            </span>
            <span className={s.face}>{t("titleLine2")}</span>
          </span>
        </motion.h2>

        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a
            href={BOOKING_URL}
            {...bookingLocation("cta_final")}
            onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
            className="group inline-flex h-[60px] items-center gap-3 rounded-[2px] bg-foreground px-7 text-[17px] font-medium text-background shadow-[0_24px_70px_-16px_rgb(242_115_19/0.7)] transition-colors hover:bg-soft-foreground"
          >
            {t("bookCall")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("responseLabel")} <span className="text-foreground">{t("responseValue")}</span>
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
            className="font-mono text-[12px] tracking-[0.05em] text-foreground underline decoration-1 underline-offset-4 hover:text-brand"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </motion.div>

      {/* Far away on the horizon, in its light. */}
      <motion.div
        aria-hidden="true"
        style={{ x: mascotX, scale: mascotScale }}
        className="pointer-events-none absolute bottom-[21%] left-1/2 h-[clamp(120px,18svh,180px)] -translate-x-1/2 origin-bottom aspect-[488/672]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/home/mascot-cutout.webp" alt="" className={`absolute left-0 top-[97%] h-full w-full ${s.reflection}`} loading="lazy" decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/home/mascot-cutout.webp" alt="" className="relative h-full w-full drop-shadow-[0_0_30px_rgb(242_115_19/0.55)]" loading="lazy" decoding="async" />
      </motion.div>
    </section>
  );
}
