"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import type { RunnerItem } from "@/lib/runner-worlds";
import { Backers } from "./Backers";
import { FitText } from "./FitText";

/**
 * The game is a desktop-only extra, so it is not part of the hero's bundle.
 * Statically imported it put ~1600 lines of game and audio into the homepage's
 * critical client chunk for every visitor, including the phones where it is
 * never shown.
 */
const HeroRunner = dynamic(() => import("./HeroRunner").then((m) => m.HeroRunner), {
  ssr: false,
});

/**
 * Width alone was the wrong gate: at the md breakpoint the panel appeared on
 * tablets, where the only touch control is jump — and ceiling bars, which
 * cannot be jumped, start arriving after eight seconds. Requiring a hovering
 * pointer as well keeps it to machines that have the keyboard it needs.
 */
const RUNNER_MEDIA = "(min-width: 1024px) and (hover: hover)";

function subscribeRunnerMedia(onChange: () => void): () => void {
  const query = window.matchMedia(RUNNER_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** The headline's tracking, in em: tight enough to read as one slab. */
const HEADLINE_TRACKING = -0.055;

export function Hero({ runnerItems }: { runnerItems: RunnerItem[] }) {
  // Server-side this is false, so the chunk is never even requested on a phone.
  const canRun = useSyncExternalStore(
    subscribeRunnerMedia,
    () => window.matchMedia(RUNNER_MEDIA).matches,
    () => false,
  );
  const reduceMotion = useReducedMotion() ?? false;
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");

  const rise = (delay: number, y = 16) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: EASE },
  });

  return (
    <>
      {/* Phones get HeroMobile, a poster layout, in its place. */}
      <section id="hero" className="relative hidden overflow-hidden bg-background md:block">
        {/* The mascot's warmth: a low orange bloom in the corner it stands in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-64 -right-40 h-[760px] w-[980px]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(242 115 19 / 0.16), rgb(242 115 19 / 0.05) 55%, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-[90rem] px-10 lg:px-16">
          {/* The floor the mascot is cut at: a hairline between the gutters,
              so the crop reads as staging rather than an accident. */}
          <div aria-hidden="true" className="absolute inset-x-10 bottom-0 z-10 h-px bg-border lg:inset-x-16" />
          <motion.p
            {...rise(0, 10)}
            className="m-0 inline-flex items-center gap-3 pt-14 font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground lg:pt-[80px]"
          >
            <span aria-hidden="true" className="h-2 w-2 bg-brand" />
            {tFooter("openToProjects")}
          </motion.p>

          {/* An h2: HeroMobile, first in the DOM, carries the page's one h1.
              Preflight resets both tags alike, so the look is unchanged. HeroMobile
              is display:none from md up, so this heading stays level 1 for
              assistive technology on desktop. */}
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

            {/* The mascot stands in the right column and runs out of the
                section, which crops it at the chest. Its black backdrop is
                lightened away into the ink, so the orange bloom shows through. */}
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

      {canRun ? (
        <div className="mx-auto hidden max-w-[90rem] px-10 pb-24 lg:block lg:px-16">
          <HeroRunner items={runnerItems} />
        </div>
      ) : (
        /* Holds the panel's place from the server HTML so the game drops into
           a gap that already exists. Mounting it client-side only, with no
           placeholder, pushed the rest of the page down after hydration. Same
           media query as the game, so a touch screen at 1024px keeps no gap. */
        <div aria-hidden="true" className="hidden h-[352px] [@media(min-width:1024px)_and_(hover:hover)]:block" />
      )}
    </>
  );
}
