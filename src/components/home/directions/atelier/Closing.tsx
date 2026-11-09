"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { BrandSquare } from "@/components/BrandSquare";
import { captureEvent } from "@/lib/posthog";
import type { Scene } from "./scenes";

/**
 * The last scene: the mascot walking up to the workshop at dawn, the flag
 * over the door. The call to action sits in the foreground light.
 */
export function Closing({ scene }: { scene: Scene }) {
  const t = useTranslations("finalCta");
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1.04, 1.04] : [1.18, 1.02]);

  return (
    <section ref={ref} id="contact" className="relative min-h-[92svh] overflow-hidden bg-background">
      <motion.div aria-hidden="true" style={{ scale }} className="absolute inset-0 origin-[60%_60%]">
        <Image src={scene.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: scene.focus }} />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(180deg, rgb(12 12 13 / 0.45) 0%, rgb(12 12 13 / 0) 18%)",
            "linear-gradient(0deg, rgb(12 12 13 / 0.96) 0%, rgb(12 12 13 / 0.55) 30%, rgb(12 12 13 / 0) 58%)",
            "linear-gradient(270deg, rgb(12 12 13 / 0.9) 0%, rgb(12 12 13 / 0.35) 40%, rgb(12 12 13 / 0) 62%)",
          ].join(", "),
        }}
      />
      {/* The copy stands on the right, over the workshop, so the mascot
          walking up on the left stays in view. */}
      <div className="relative mx-auto flex min-h-[92svh] max-w-[90rem] flex-col justify-end px-6 pb-16 md:px-10 lg:items-end lg:px-16 lg:pb-20 lg:text-right">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground">
          <BrandSquare />
          {t("kicker")}
        </span>
        <h2 className="m-0 mt-6 text-[clamp(3.25rem,7.4vw,7.5rem)] font-bold leading-[0.88] tracking-[-0.05em] text-foreground drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 lg:flex-row-reverse">
          <a
            href={BOOKING_URL}
            {...bookingLocation("cta_final")}
            onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
            className="group inline-flex h-[60px] items-center gap-3 rounded-[2px] bg-foreground px-7 text-[17px] font-medium text-background shadow-[0_18px_70px_-14px_rgba(242,115,19,0.75)] transition-colors hover:bg-soft-foreground"
          >
            {t("bookCall")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.2em]">
            <dt className="text-muted-foreground">{t("responseLabel")}</dt>
            <dd className="m-0 text-foreground">{t("responseValue")}</dd>
            <dt className="text-muted-foreground">{t("emailLabel")}</dt>
            <dd className="m-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                className="normal-case tracking-[0.05em] text-foreground underline decoration-1 underline-offset-4 hover:text-brand"
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
