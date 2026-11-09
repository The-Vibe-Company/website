"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { Backers } from "../../Backers";
import { EclipseSky } from "./EclipseSky";
import { Embers } from "./Embers";
import { FitLine } from "./FitLine";
import { DISPLAY } from "./font";
import mascot from "./mascot-eclipse.webp";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The sunset is scroll-driven only where the stage is pinned (md and up). */
const PINNED_MEDIA = "(min-width: 768px)";
function subscribePinned(onChange: () => void) {
  const query = window.matchMedia(PINNED_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * The head in mascot-eclipse.webp (488×672, cut so its glow is translucent
 * light rather than a dark band): a disc of radius 195 centred at (242, 225). The anchor below sits exactly on it, so the sun can
 * be centred on the head and sized from it: the head eclipses the sun.
 */
const HEAD = { left: "9.63%", top: "4.46%", width: "79.92%" };

export function EclipseHero() {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const reduce = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const mobileHeadRef = useRef<HTMLDivElement>(null);
  const [shaderReady, setShaderReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const still = useMotionValue(0);
  const pinned = useSyncExternalStore(
    subscribePinned,
    () => window.matchMedia(PINNED_MEDIA).matches,
    () => true,
  );
  // Behaviour only, never markup: on phones (no pin) and with reduced motion
  // the sun stays up.
  const sunset = reduce || !pinned ? still : scrollYProgress;

  // The mascot falls into silhouette as the sun goes down behind it.
  const brightness = useTransform(sunset, [0, 1], [0.94, 0.38]);
  const mascotFilter = useTransform(brightness, (b) => `brightness(${b}) saturate(${1 + (1 - b) * 0.4})`);
  const rimOpacity = useTransform(sunset, [0, 0.6, 1], [0.75, 1, 0.9]);
  const nightfall = useTransform(sunset, [0, 1], [0, 0.55]);
  const titleY = useTransform(sunset, [0, 1], ["0%", "-18%"]);

  const rise = (delay: number, y = 18) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: EASE },
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="eclipse-title"
      className="relative md:h-[175vh] motion-reduce:md:h-auto"
    >
      <div className="relative overflow-hidden md:sticky md:top-16 md:h-[calc(100svh-4rem)] md:min-h-[680px] lg:top-[84px] lg:h-[calc(100svh-84px)] motion-reduce:md:static">
        {/* The still eclipse: what paints before the shader, without WebGL,
            and under it while it fades in. Drawn around the head anchor. */}
        <EclipseSky
          anchors={[headRef, mobileHeadRef]}
          progress={sunset}
          reduced={reduce}
          onReady={() => setShaderReady(true)}
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        />

        {/* Night creeping down from the top of the sky. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: nightfall }}
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,#0c0c0d_0%,rgba(12,12,13,0.6)_45%,transparent_75%)]"
        />

        <Embers className="pointer-events-none absolute inset-0 z-[4] h-full w-full" density={1.1} />

        <div className="relative z-[5] mx-auto flex h-full max-w-[90rem] flex-col px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8 lg:px-16">
          <motion.div
            {...rise(0, 8)}
            className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]"
          >
            <span className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-2 w-2 bg-brand shadow-[0_0_12px_2px_rgba(242,115,19,0.8)]" />
              {tFooter("openToProjects")}
            </span>
            <span className="hidden text-muted-foreground sm:inline">Paris · {t("response")}</span>
          </motion.div>

          <motion.h1
            id="eclipse-title"
            style={{ y: titleY }}
            className={`${DISPLAY} m-0 mt-3 font-black leading-[0.78] text-foreground [container-type:inline-size] md:mt-4`}
          >
            <motion.span {...rise(0.08, 40)} className="block">
              <FitLine tracking={-0.01} className="drop-shadow-[0_6px_30px_rgba(242,115,19,0.25)]">
                {t("titleLine1")}
              </FitLine>
            </motion.span>
            <span className="sr-only"> {t("titleLine2")}</span>
          </motion.h1>

          {/* Phones: the eclipse gets its own square of sky under the title. */}
          <div className="relative mx-auto mt-2 aspect-[488/470] w-[86%] overflow-hidden md:hidden">
            <MascotFigure
              headRef={mobileHeadRef}
              showFallbackSun={!shaderReady}
              filter={mascotFilter}
              rimOpacity={rimOpacity}
              reduce={reduce}
              className="absolute inset-x-0 top-0 w-full"
            />
          </div>

          <div className="relative mt-auto grid grid-cols-1 gap-8 pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] md:items-end md:gap-6 md:pt-0">
            <motion.div {...rise(0.3)} className="max-w-[24rem]">
              <p aria-hidden="true" className="m-0 text-[clamp(1.5rem,2.1vw,2rem)] font-medium leading-[1.12] tracking-[-0.03em] text-foreground">
                {t("titleLine2")}
              </p>
              <p className="m-0 mt-4 text-[16px] leading-[1.6] text-soft-foreground md:text-[17px]">
                {t("subtitle")}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href={BOOKING_URL}
                  {...bookingLocation("hero")}
                  onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
                  className="group relative inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-brand px-6 text-[15px] font-semibold text-[#0c0c0d] shadow-[0_0_0_1px_rgba(255,170,90,0.4),0_10px_40px_-6px_rgba(242,115,19,0.75)] transition-[box-shadow,background-color] duration-300 hover:bg-[#ff8a33] hover:shadow-[0_0_0_1px_rgba(255,190,120,0.6),0_14px_60px_-4px_rgba(242,115,19,0.95)]"
                >
                  {t("bookCall")}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="#eclipse-cases"
                  onClick={() => captureEvent("see_what_we_do_clicked")}
                  className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-brand"
                >
                  {t("seeWhatWeDo")}
                </a>
              </div>
            </motion.div>

            {/* The centre column belongs to the mascot (drawn below). */}
            <div aria-hidden="true" className="hidden md:block" />

            <motion.div {...rise(0.4)} className="flex flex-col gap-5 md:items-end md:text-right">
              <Backers className="flex-wrap gap-x-8 md:justify-end" />
            </motion.div>
          </div>
        </div>

        {/* Desktop mascot, centred, standing in front of the sun and cut by
            the foot of the stage. */}
        <div className="pointer-events-none absolute left-1/2 top-[33%] z-[3] hidden w-[min(29vw,calc((100svh-84px)*0.52))] -translate-x-1/2 md:block">
          <MascotFigure headRef={headRef} showFallbackSun={!shaderReady} filter={mascotFilter} rimOpacity={rimOpacity} reduce={reduce} className="w-full" />
        </div>
      </div>
    </section>
  );
}

function MascotFigure({
  headRef,
  showFallbackSun,
  filter,
  rimOpacity,
  reduce,
  className,
}: {
  headRef: RefObject<HTMLDivElement | null>;
  showFallbackSun: boolean;
  filter: MotionValue<string>;
  rimOpacity: MotionValue<number>;
  reduce: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 0.15, ease: EASE }}
      className={className}
    >
      <div className="relative">
        {/* The anchor the sun is centred on. */}
        <div
          ref={headRef}
          aria-hidden="true"
          className="absolute aspect-square"
          style={{ left: HEAD.left, top: HEAD.top, width: HEAD.width }}
        >
          {/* CSS stand-in for the shader's sun until its first frame (and
              without WebGL): the same disc and glow, behind the mascot. */}
          <div
            className="absolute left-1/2 top-1/2 aspect-square w-[128%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#ffbd73_0%,#f27313_55%,#9a2c05_100%)] shadow-[0_0_120px_40px_rgba(242,115,19,0.45)] transition-opacity duration-700"
            style={{ opacity: showFallbackSun ? 1 : 0 }}
          />
        </div>
        <motion.img
          src={mascot.src}
          alt=""
          aria-hidden="true"
          width={488}
          height={672}
          decoding="async"
          style={{ filter }}
          className="relative block h-auto w-full"
        />
        {/* Backlight: an orange rim on the edges of the silhouette that face
            the sun, painted through the mascot's own alpha. */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: rimOpacity,
            // The mascot's own alpha, faded out below the head so the rim
            // never draws an arc across the shoulders.
            maskImage: `url(${mascot.src}), linear-gradient(to bottom, #000 52%, transparent 62%)`,
            WebkitMaskImage: `url(${mascot.src}), linear-gradient(to bottom, #000 52%, transparent 62%)`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_49.6%_33.5%,transparent_31%,rgba(255,150,60,0.5)_35.5%,rgba(255,120,30,0.95)_38.2%,transparent_39.5%)] mix-blend-screen"
        />
      </div>
    </motion.div>
  );
}
