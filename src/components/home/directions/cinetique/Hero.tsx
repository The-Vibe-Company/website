"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { Backers } from "../../Backers";
import { DISPLAY } from "./font";
import { KineticLine } from "./KineticLine";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The hero the user approved, set in Anybody and put in motion: the headline's
 * letters breathe on the width axis, the mascot sinks and tilts away as the
 * page scrolls past it, and the whole block lifts off at a slower pace than
 * the page. One h1 for both layouts: phones read the two-line poster, wider
 * screens the single width-filling line.
 */
export function CinetiqueHero() {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const reduceMotion = useReducedMotion() ?? false;
  const poster = t.raw("poster") as string[];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const mascotY = useTransform(progress, [0, 1], [0, 220]);
  const mascotRotate = useTransform(progress, [0, 1], [0, -8]);
  const bloomScale = useTransform(progress, [0, 1], [1, 1.35]);
  const headlineY = useTransform(progress, [0, 1], [0, -90]);

  const rise = (delay: number, y = 16) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : delay, ease: EASE },
  });

  return (
    <section ref={ref} id="hero" className="relative overflow-hidden bg-background">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -right-40 h-[760px] w-[980px] motion-reduce:transform-none!"
        style={{
          scale: bloomScale,
          background:
            "radial-gradient(closest-side, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <div aria-hidden="true" className="absolute inset-x-6 bottom-0 z-10 h-px bg-border md:inset-x-10 lg:inset-x-16" />

        <motion.p
          {...rise(0, 10)}
          className="m-0 flex items-center justify-between gap-3 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:inline-flex md:pt-14 md:text-[12px] lg:pt-[80px]"
        >
          <span className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-2 w-2 bg-brand" />
            {tFooter("openToProjects")}
          </span>
          <span className="text-muted-foreground md:hidden">Paris</span>
        </motion.p>

        <h1 className={`m-0 font-extrabold text-foreground ${DISPLAY}`}>
          <motion.span
            style={{ y: headlineY }}
            className="mt-8 hidden motion-reduce:transform-none! md:mt-9 md:block lg:mt-10"
          >
            <motion.span {...rise(0.05, 28)} className="block leading-[0.84] [container-type:inline-size]">
              <KineticLine text={t("titleLine1")} stretch={74} amplitude={16} />
            </motion.span>
          </motion.span>
          <motion.span
            {...rise(0.05, 28)}
            className="mt-7 block leading-[0.84] [container-type:inline-size] md:hidden"
          >
            <KineticLine text={poster[0]} stretch={74} amplitude={12} fill={0.99} />
            <KineticLine text={poster[1]} stretch={74} amplitude={12} fill={0.99} />
          </motion.span>
          <motion.span
            {...rise(0.18)}
            className="mt-7 block max-w-[17ch] font-sans text-[22px] font-medium leading-[1.15] tracking-[-0.03em] md:mt-14 md:text-[clamp(1.75rem,2.5vw,2.25rem)] lg:mt-[58px]"
          >
            {t("titleLine2")}
          </motion.span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <motion.div {...rise(0.26)} className="pb-12 md:pb-20 lg:pb-[72px]">
            <p className="m-0 mt-4 max-w-[33rem] text-base leading-[1.55] text-muted-foreground md:mt-7 md:text-[19px] md:leading-[1.6]">
              {t("subtitle")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-11">
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
                href="#cases"
                onClick={() => captureEvent("see_what_we_do_clicked")}
                className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-brand"
              >
                {t("seeWhatWeDo")}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-border pt-7 md:mt-14">
              <Backers className="flex-wrap gap-x-8" />
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("response")}
              </span>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.3, ease: EASE }}
            // The blend sits on the outermost moving layer: a transformed
            // wrapper isolates its children, so a blend on the image itself
            // would only lighten against that wrapper's empty backdrop.
            className="relative hidden mix-blend-lighten lg:block"
          >
            <motion.div
              style={{ y: mascotY, rotate: mascotRotate }}
              className="absolute motion-reduce:transform-none! -top-24 left-1/2 w-[min(476px,38vw)] -translate-x-[30%] xl:-top-[124px]"
            >
              <Image
                src="/images/home/mascot-glow.webp"
                alt=""
                width={516}
                height={716}
                loading="eager"
                sizes="(min-width: 1024px) 476px, 0px"
                className="w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
