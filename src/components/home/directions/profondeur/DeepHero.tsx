"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, type CSSProperties } from "react";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { Backers } from "../../Backers";
import { emWidth } from "../../FitText";
import { Dust } from "./Dust";
import { extrude } from "./extrude";
import { Horizon } from "./Horizon";
import { usePointer } from "./pointer";
import s from "./profondeur.module.css";

/** Display tracking, in em, applied after every glyph of the headline. */
const TRACK = -0.04;

/** A word's width at 1em in Geist ExtraBold, tracking included. */
function wordEm(word: string) {
  return emWidth(word) + TRACK * [...word].length;
}

const COPY = {
  fr: { dive: "Descendre" },
  en: { dive: "Dive in" },
};

/**
 * The hero is a place, not a layout: a floor laid back into the dark toward a
 * low orange horizon, and the mascot standing on it, between the two words of
 * the headline, its reflection and its long shadow on the floor in front of
 * it. The horizon behind it is what lights its orange rim. The pointer turns
 * the floor and slides each layer by its depth; scrolling moves the camera in:
 * the words rise and blur past, the mascot comes closer, the grid runs.
 */
export function DeepHero({ locale }: { locale: "fr" | "en" }) {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const [left, right] = t.raw("poster") as [string, string];
  const copy = COPY[locale];

  const ref = useRef<HTMLElement>(null);
  const { x: px, y: py } = usePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Layers by depth: horizon far, words mid, mascot near.
  const wordsX = useTransform(px, (v) => v * -14);
  const wordsY = useTransform([py, scrollYProgress], ([y, p]: number[]) => y * -8 - p * 180);
  const wordsBlur = useTransform(scrollYProgress, [0, 0.6], [0, 10]);
  const wordsFilter = useMotionTemplate`blur(${wordsBlur}px)`;
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const mascotX = useTransform(px, (v) => v * -26);
  const mascotY = useTransform([py, scrollYProgress], ([y, p]: number[]) => y * -10 + p * 90);
  const mascotScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const travel = useTransform(scrollYProgress, [0, 1], [0, 900]);
  const glow = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const uiOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Sizes from the glyphs, so the server sends the final layout. Desktop:
  // both words and the mascot's slot share the content width. Phone: the
  // words stack, each line at the size of the wider one.
  const emL = wordEm(left);
  const emR = wordEm(right);
  const vars = {
    // The slot between the words is the mascot's head plus air, so no letter
    // ever hides behind it.
    "--slot": "calc(var(--mh) * 0.6 + 28px)",
    "--fs": `calc((var(--cw) * 0.97 - var(--slot)) / ${(emL + emR).toFixed(4)})`,
    "--fsm": `calc((100vw - 48px) * 0.98 / ${Math.max(emL, emR).toFixed(4)})`,
    "--l-end": `calc(${emL.toFixed(4)} * var(--fs))`,
    "--ext-l": extrude({ dx: 0.55, dy: 1, steps: 16, unit: 1.15 }),
    "--ext-r": extrude({ dx: -0.55, dy: 1, steps: 16, unit: 1.15 }),
    "--ext-m": extrude({ dx: 0, dy: 1, steps: 12, unit: 0.9 }),
  } as CSSProperties;

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="deep-title"
      style={vars}
      className="relative isolate overflow-hidden bg-background [--cw:calc(100vw-48px)] md:[--mh:min(52svh,500px)] lg:[--mh:min(60svh,580px)] md:h-[calc(100svh-64px)] md:max-h-[1000px] md:min-h-[680px] md:[--cw:calc(min(100vw,90rem)-80px)] lg:h-[calc(100svh-84px)] lg:[--cw:calc(min(100vw,90rem)-128px)]"
    >
      {/* The stage, from md up. */}
      <div className="absolute inset-0 hidden md:block">
        <Horizon px={px} travel={travel} glow={glow} />
        <Dust density={0.8} warmBelow={0.5} />
        {/* The near floor darkens so the copy over it stays legible. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
      </div>

      {/* The stage dissolves into the abyss below instead of ending on a cut:
          as the camera moves in, the mascot sinks into this. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-20 bg-gradient-to-t from-background to-transparent md:block" />

      <div className="relative mx-auto h-full max-w-[90rem] px-6 md:px-10 lg:px-16">
        <div className="relative h-full">
          <motion.p
            style={{ opacity: uiOpacity }}
            className="m-0 inline-flex items-center gap-3 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:absolute md:left-0 md:top-8 md:pt-0 md:text-[12px]"
          >
            <span aria-hidden="true" className="h-2 w-2 bg-brand shadow-[0_0_12px_2px_rgb(242_115_19/0.6)]" />
            {tFooter("openToProjects")}
          </motion.p>

          <motion.a
            href="#cases"
            style={{ opacity: uiOpacity }}
            className="group absolute right-0 top-8 hidden items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            {copy.dive}
            <span aria-hidden="true" className="relative block h-6 w-px overflow-hidden bg-border">
              <span className={`absolute inset-x-0 top-0 h-2 bg-brand ${s.dive}`} />
            </span>
          </motion.a>

          {/* One h1: the two words, plus the claim for assistive tech (the
              visible claim sits lower, aria-hidden). */}
          <motion.h1
            id="deep-title"
            style={{ x: wordsX, y: wordsY, opacity: wordsOpacity, filter: wordsFilter }}
            className="m-0 mt-8 font-extrabold leading-[0.84] tracking-[-0.04em] text-foreground [font-size:var(--fsm)] md:absolute md:inset-x-0 md:top-[47%] md:mt-0 md:h-[1em] md:-translate-y-1/2 md:[font-size:var(--fs)]"
          >
            <span className={`${s.extrude} md:absolute md:left-0 md:top-0`}>
              <span aria-hidden="true" className="text-background [text-shadow:var(--ext-m)] md:[text-shadow:var(--ext-l)]">
                {left}
              </span>
              <span className={s.face}>{left}</span>
            </span>{" "}
            <span className={`${s.extrude} md:absolute md:top-0 md:left-[calc(var(--l-end)+var(--slot))]`}>
              <span aria-hidden="true" className="text-background [text-shadow:var(--ext-m)] md:[text-shadow:var(--ext-r)]">
                {right}
              </span>
              <span className={s.face}>{right}</span>
            </span>
            <span className="sr-only"> {t("titleLine2")}</span>
          </motion.h1>

          {/* The mascot on its floor. On phones it brings its own small
              horizon; from md up it stands in the slot between the words. */}
          <div className="relative -mx-6 mt-2 h-[420px] overflow-hidden md:absolute md:inset-0 md:mx-0 md:mt-0 md:h-auto md:overflow-visible">
            <div className="absolute inset-0 md:hidden">
              <Horizon horizon="62%" />
              <Dust density={1.2} warmBelow={0.45} />
            </div>
            <motion.div
              style={{ x: mascotX, y: mascotY, scale: mascotScale }}
              className="absolute bottom-[34px] left-1/2 h-[330px] w-[240px] -translate-x-1/2 origin-bottom md:bottom-[7%] md:left-[calc(var(--l-end)+var(--slot)/2)] md:h-[var(--mh)] md:w-auto md:aspect-[488/672]"
            >
              {/* Its long shadow, thrown toward us by the light behind it. */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[97%] h-[38%] w-[70%] -translate-x-1/2"
                style={{ background: "radial-gradient(50% 50% at 50% 30%, rgb(0 0 0 / 0.9), rgb(0 0 0 / 0.5) 45%, transparent 75%)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/home/mascot-cutout.webp"
                alt=""
                aria-hidden="true"
                className={`absolute left-0 top-[97%] h-full w-full ${s.reflection}`}
                decoding="async"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/home/mascot-cutout.webp"
                alt=""
                aria-hidden="true"
                width={488}
                height={672}
                className="relative h-full w-full drop-shadow-[0_0_36px_rgb(242_115_19/0.35)]"
                fetchPriority="high"
                decoding="async"
              />
            </motion.div>
          </div>

          <motion.div
            style={{ opacity: uiOpacity }}
            className="relative z-10 pb-10 md:absolute md:bottom-12 md:left-0 md:max-w-[25rem] md:pb-0"
          >
            <p aria-hidden="true" className="m-0 text-[24px] font-medium leading-[1.15] tracking-[-0.025em] text-foreground md:text-[clamp(1.5rem,2.1vw,2rem)]">
              {t("titleLine2")}
            </p>
            <p className="m-0 mt-4 max-w-[34ch] text-[16px] leading-[1.6] text-muted-foreground">{t("subtitle")}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href={BOOKING_URL}
                {...bookingLocation("hero")}
                onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
                className="group inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-foreground px-6 text-[15px] font-medium text-background shadow-[0_18px_50px_-14px_rgb(242_115_19/0.55)] transition-colors hover:bg-soft-foreground"
              >
                {t("bookCall")}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#services"
                className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-brand"
              >
                {t("seeWhatWeDo")}
              </a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-6 md:hidden">
              <Backers className="flex-wrap gap-x-8" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("response")}</span>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: uiOpacity }}
            className="absolute bottom-12 right-0 z-10 hidden flex-col items-end gap-5 md:flex"
          >
            <Backers />
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">{t("response")}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
