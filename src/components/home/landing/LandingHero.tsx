"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import type { RunnerItem } from "@/lib/runner-worlds";
import { cn } from "@/lib/design-system";
import { Backers } from "../Backers";
import { FitText } from "../FitText";
import styles from "./landing.module.css";
import { SecretLevel, type Origin } from "./SecretLevel";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The game needs a keyboard: a wide screen with a hovering pointer. */
const PLAY_MEDIA = "(min-width: 1024px) and (hover: hover)";

function subscribePlay(onChange: () => void): () => void {
  const query = window.matchMedia(PLAY_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The mascot's part in the easter egg: at rest, leaping out, away while the
 *  level is open, landing back when it closes. */
type Mascot = "rest" | "leap" | "away" | "land";

const LEAP_MS = 420;

/**
 * The approved hero, with only the mascot as its picture: the headline on
 * the ink, the pitch on the left, and the mascot on the right in its own
 * orange light, floating a little and leaning with the pointer. The paper
 * section that follows is its floor: the mascot is cut where the paper starts.
 *
 * The easter egg: on a desktop, the space bar (or a click on the mascot) makes
 * it jump, and the runner game opens out of it as a secret level.
 */
export function LandingHero({ runnerItems }: { runnerItems: RunnerItem[] }) {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const en = useLocale() === "en";
  const reduceMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const mascotRef = useRef<HTMLButtonElement>(null);

  const canPlay = useSyncExternalStore(subscribePlay, () => window.matchMedia(PLAY_MEDIA).matches, () => false);
  const [mascot, setMascotState] = useState<Mascot>("rest");
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0, r: 0 });
  // Read by the key listener without re-subscribing it on every change.
  const mascotStateRef = useRef<Mascot>("rest");
  const setMascot = useCallback((next: Mascot) => {
    mascotStateRef.current = next;
    setMascotState(next);
  }, []);

  const play = useCallback(() => {
    const el = mascotRef.current;
    if (!el || mascotStateRef.current !== "rest") return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height * 0.4;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    setMascot("leap");
    captureEvent("hero_secret_level_opened");
    window.setTimeout(
      () => {
        setOrigin({ x, y, r });
        setMascot("away");
      },
      reduceMotion ? 0 : LEAP_MS,
    );
  }, [reduceMotion, setMascot]);

  const closeLevel = useCallback(() => setMascot(reduceMotion ? "rest" : "land"), [reduceMotion, setMascot]);

  // The space bar opens the level while the hero is the screen, unless the
  // reader is typing or sitting on a link or a button.
  useEffect(() => {
    if (!canPlay) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (mascotStateRef.current !== "rest") return;
      const section = sectionRef.current;
      if (!section || section.getBoundingClientRect().bottom < window.innerHeight * 0.5) return;
      const active = document.activeElement;
      if (active && active !== document.body && active.matches("input, textarea, select, button, a, [contenteditable]")) return;
      event.preventDefault();
      play();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canPlay, play]);

  // Pointer depth: written to CSS variables, so moving the mouse never
  // re-renders the hero.
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--px", ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };

  // Scrolling away lifts the mascot a touch slower than the page.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-12%"]);

  // The text rises in with a CSS animation (styles.rise) rather than
  // framer-motion, so the server HTML paints it on its own instead of waiting
  // for the JavaScript to hydrate the hero. This sets each element's offset
  // and delay.
  const rise = (delay: number, y = 18) => ({ "--rise-y": `${y}px`, animationDelay: `${delay}s` }) as CSSProperties;

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      style={{ "--px": 0, "--py": 0 } as CSSProperties}
      className="relative overflow-hidden bg-background"
    >
      {/* The mascot's light: a low orange bloom in the corner it stands in,
          drifting a little with the pointer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px] transition-transform duration-700 ease-out"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 115 19 / 0.24), rgb(242 115 19 / 0.07) 55%, transparent)",
          transform: "translate3d(calc(var(--px) * 40px), calc(var(--py) * 30px), 0)",
        }}
      />

      <div className="relative mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <p
          style={rise(0, 8)}
          className={`m-0 inline-flex items-center gap-3 pt-12 font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground lg:pt-[80px] ${styles.rise}`}
        >
          <span aria-hidden="true" className="h-2 w-2 bg-brand" />
          {tFooter("openToProjects")}
        </p>

        <h1 className="m-0 font-bold text-foreground">
          <span style={rise(0.06, 28)} className={`mt-8 block leading-[0.86] [container-type:inline-size] lg:mt-10 ${styles.rise}`}>
            <FitText trackingEm={-0.055} className="-ml-[0.04em] transition-none">
              {t("titleLine1")}
            </FitText>
          </span>
          <span
            style={rise(0.16)}
            className={`relative z-20 mt-10 block max-w-[17ch] text-[clamp(1.6rem,2.5vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:mt-[58px] ${styles.rise}`}
          >
            {t("titleLine2")}
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <div style={rise(0.26)} className={`relative z-20 pb-10 lg:pb-[72px] ${styles.rise}`}>
            <p className="m-0 mt-6 max-w-[33rem] text-[17px] leading-[1.6] text-muted-foreground md:text-[19px]">{t("subtitle")}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href={BOOKING_URL}
                {...bookingLocation("hero")}
                onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
                className="group inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-foreground px-6 text-[15px] font-medium text-background shadow-[0_18px_60px_-18px_rgba(242,115,19,0.6)] transition-colors hover:bg-soft-foreground"
              >
                {t("bookCall")}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#offres"
                onClick={() => captureEvent("see_what_we_do_clicked")}
                className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-brand"
              >
                {t("seeWhatWeDo")}
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-border pt-7">
              <Backers className="flex-wrap gap-x-10" />
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">{t("response")}</span>
            </div>
          </div>

          {/* Phones: the mascot under the pitch, cut by the floor. */}
          <div aria-hidden="true" className="relative h-[300px] lg:hidden">
            <Image
              src="/images/home/mascot-cutout.webp"
              alt=""
              width={488}
              height={672}
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 0px, 280px"
              className={`absolute left-1/2 top-0 w-[280px] max-w-none -translate-x-1/2 ${styles.float}`}
            />
          </div>

          {/* Desktop: the mascot stands in the right column and runs out of
              the section, cut at the chest by the floor. It is also the way
              into the secret level. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.3, ease: EASE }}
            style={{ y: lift }}
            className="relative hidden lg:block"
          >
            <div
              className="absolute -top-28 left-1/2 w-[min(470px,36vw)] transition-transform duration-700 ease-out xl:-top-[132px]"
              style={{ transform: "translate3d(calc(-24% + var(--px) * -18px), calc(var(--py) * -12px), 0) rotate(calc(var(--px) * 2deg))" }}
            >
              {canPlay ? (
                <button
                  ref={mascotRef}
                  type="button"
                  onClick={play}
                  aria-label={en ? "Play the hidden game" : "Jouer au jeu caché"}
                  className={cn(
                    "group/mascot relative block w-full cursor-pointer focus-visible:outline-none",
                    mascot !== "rest" && styles[mascot],
                  )}
                  onAnimationEnd={() => {
                    if (mascotStateRef.current === "land") setMascot("rest");
                  }}
                >
                  <MascotImage />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-full top-[30%] whitespace-nowrap pr-2 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground opacity-0 transition-opacity duration-300 group-hover/mascot:opacity-100 group-focus-visible/mascot:opacity-100"
                  >
                    [ {en ? "space" : "espace"} ] {en ? "play" : "jouer"}
                  </span>
                </button>
              ) : (
                <MascotImage />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {canPlay && <SecretLevel open={mascot === "away"} origin={origin} items={runnerItems} onClose={closeLevel} />}
    </section>
  );
}

function MascotImage() {
  return (
    <Image
      src="/images/home/mascot-cutout.webp"
      alt=""
      width={488}
      height={672}
      priority
      sizes="(min-width: 1024px) 470px, 0px"
      className={`h-auto w-full ${styles.float}`}
    />
  );
}
