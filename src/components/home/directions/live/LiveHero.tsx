"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { Backers } from "../../Backers";
import { FitText } from "../../FitText";
import { LivePulse, ParisClock } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;
const HEADLINE_TRACKING = -0.055;

/**
 * The homepage hero as approved, with one live touch: the kicker line carries
 * the time in Paris, ticking. No game under it in this direction: the ticker
 * that follows is the page's first moving part.
 */
export function LiveHero() {
  const reduceMotion = useReducedMotion() ?? false;
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");

  const rise = (delay: number, y = 16) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: EASE },
  });

  return (
    <section id="hero" className="relative hidden overflow-hidden bg-background md:block">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -right-40 h-[760px] w-[980px]"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 115 19 / 0.16), rgb(242 115 19 / 0.05) 55%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[90rem] px-10 lg:px-16">
        <div aria-hidden="true" className="absolute inset-x-10 bottom-0 z-10 h-px bg-border lg:inset-x-16" />

        <motion.div
          {...rise(0, 10)}
          className="flex items-center justify-between gap-6 pt-14 font-mono text-[12px] uppercase tracking-[0.2em] lg:pt-[80px]"
        >
          <p className="m-0 inline-flex items-center gap-3 text-soft-foreground">
            <span aria-hidden="true" className="h-2 w-2 bg-brand" />
            {tFooter("openToProjects")}
          </p>
          <p className="m-0 inline-flex items-center gap-3 text-muted-foreground">
            <LivePulse />
            <span>Paris</span>
            <ParisClock className="text-soft-foreground" />
          </p>
        </motion.div>

        <h2 role="heading" aria-level={1} className="m-0 font-bold text-foreground">
          <motion.span
            {...rise(0.05, 28)}
            className="mt-9 block leading-[0.86] [container-type:inline-size] lg:mt-10"
          >
            <FitText trackingEm={HEADLINE_TRACKING} className="-ml-[0.04em]">
              {t("titleLine1")}
            </FitText>
          </motion.span>

          <motion.span
            {...rise(0.18)}
            className="mt-14 block max-w-[17ch] text-[clamp(1.75rem,2.5vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:mt-[58px]"
          >
            {t("titleLine2")}
          </motion.span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <motion.div {...rise(0.26)} className="pb-20 lg:pb-[72px]">
            <p className="m-0 mt-7 max-w-[33rem] text-[19px] leading-[1.6] text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href={BOOKING_URL}
                {...bookingLocation("hero")}
                onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
                className="group inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-soft-foreground"
              >
                {t("bookCall")}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#services"
                onClick={() => captureEvent("see_what_we_do_clicked")}
                className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-brand"
              >
                {t("seeWhatWeDo")}
              </a>
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-border pt-7">
              <Backers />
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("response")}
              </span>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.3, ease: EASE }}
            className="relative hidden lg:block"
          >
            <Image
              src="/images/home/mascot-glow.webp"
              alt=""
              width={516}
              height={716}
              loading="eager"
              sizes="(min-width: 1024px) 500px, 0px"
              className="absolute -top-24 left-1/2 w-[min(476px,38vw)] max-w-none -translate-x-[30%] mix-blend-lighten xl:-top-[124px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
