"use client";

import { MotionConfig, motion, useInView } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Link } from "@/i18n/navigation";
import {
  formatStarsCompact,
  QUIVR_PLUGINS,
  QUIVR_PLUGINS_DOCS_URL,
  QUIVR_QUICKSTART_URL,
  QUIVR_STACK,
  QUIVR_STORY_ARTICLE_PATH,
  QUIVR_V1_URL,
} from "@/lib/quivr";

/**
 * The animated diagrams of the Quivr product page. Every one is drawn in
 * HTML/CSS, never a screenshot, in the site's paper-and-ink language.
 *
 * Motion rules: entrances reveal once on scroll (framer-motion, transform and
 * opacity only); the looping signals are CSS keyframes on transform/opacity
 * (globals.css, `quivr-*`) that only run while the diagram is on screen; with
 * prefers-reduced-motion, loops and movement stop and each diagram shows its
 * final state, with at most a short fade.
 *
 * Hydration: the server cannot know the motion preference, so the first
 * client render must match it. The preference is read through
 * useSyncExternalStore (server value: false), entrances keep the same
 * `initial` everywhere, and <MotionConfig reducedMotion="user"> drops their
 * transforms for visitors who asked for less motion.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground";
const QUIVR_LOGO = "/projects/quivr-favicon.svg";
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The visitor's motion preference, false on the server and at hydration. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** True while the element is on screen and motion is allowed. */
function useLive(ref: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  return { live: inView && !reduced, reduced };
}

/** Fades and slides a block in the first time it scrolls into view. */
function Reveal({
  children,
  className,
  style,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  from?: "up" | "left" | "right";
}) {
  const offset = from === "left" ? { x: -32 } : from === "right" ? { x: 32 } : { y: 20 };
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A connector with an arrowhead and, when animated, a dot running along it.
 * The dot rides on a full-length track translated from -100% to 0, so only
 * transform and opacity change.
 */
function Lane({
  axis = "x",
  running,
  animated,
  delay = 0,
  duration = 2.4,
  reverse = false,
}: {
  axis?: "x" | "y";
  running: boolean;
  animated: boolean;
  delay?: number;
  duration?: number;
  /** Signal flows the other way (right to left, or bottom to top). */
  reverse?: boolean;
}) {
  const x = axis === "x";
  return (
    <div
      aria-hidden="true"
      className={`relative ${x ? "h-px w-full" : "h-full w-px"} bg-foreground ${
        reverse ? (x ? "-scale-x-100" : "-scale-y-100") : ""
      }`}
    >
      <span
        className={
          x
            ? "absolute -right-px top-1/2 -translate-y-1/2 border-y-[4px] border-l-[7px] border-y-transparent border-l-foreground"
            : "absolute -bottom-px left-1/2 -translate-x-1/2 border-x-[4px] border-t-[7px] border-x-transparent border-t-foreground"
        }
      />
      {animated ? (
        <div
          className="absolute inset-0"
          style={{
            animation: `${x ? "quivr-stream-x" : "quivr-stream-y"} ${duration}s linear ${delay}s infinite both`,
            animationPlayState: running ? "running" : "paused",
          }}
        >
          <span
            className={
              x
                ? "absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-500"
                : "absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500"
            }
          />
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1 — Data flow: sources stream into the core, which feeds four outputs.     */
/* -------------------------------------------------------------------------- */

const FLOW_DURATION = 2.4;
const inDelay = (i: number) => i * 0.6;
const outDelay = (i: number) => 1.2 + i * 0.6;

export function FlowDiagram() {
  const t = useTranslations("quivr.diagrams.flow");
  const ref = useRef<HTMLDivElement>(null);
  const { live, reduced } = useLive(ref);
  const sources = t.raw("sources") as string[];
  const core = t.raw("core") as string[];
  const outputs = t.raw("outputs") as { label: string; note: string }[];

  const sourceNode = (label: string, i: number) => (
    <div className="flex h-full items-center gap-3 border border-foreground bg-background px-4 py-3">
      <span className="font-mono text-[11px] text-muted-foreground">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="text-[15px] font-semibold text-foreground md:text-base">{label}</span>
    </div>
  );

  const outputNode = (output: { label: string; note: string }, i: number) => (
    <div className="relative flex h-full flex-col justify-center border border-foreground bg-background px-4 py-3">
      {!reduced ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px border-2 border-orange-500 bg-orange-500/10 opacity-0"
          style={{
            animation: `quivr-ping ${FLOW_DURATION}s linear ${outDelay(i)}s infinite`,
            animationPlayState: live ? "running" : "paused",
          }}
        />
      ) : null}
      <span className="relative text-[15px] font-semibold text-foreground md:text-base">
        {output.label}
      </span>
      <span className={`relative mt-0.5 ${MONO}`}>{output.note}</span>
    </div>
  );

  const coreBlock = (
    <div
      data-surface="inverse"
      className="flex h-full flex-col justify-center border-2 border-foreground bg-foreground px-6 py-6 text-background shadow-[8px_8px_0_0_var(--border)]"
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={QUIVR_LOGO} alt="" className="h-10 w-10" />
        <span className="text-[28px] font-bold leading-none tracking-[-0.04em]">Quivr</span>
      </div>
      <ul className="m-0 mt-5 flex list-none flex-col gap-2.5 p-0">
        {core.map((step, i) => (
          <li key={step} className="flex items-center gap-3 text-[14px] text-background/85">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-orange-400"
              style={
                reduced
                  ? undefined
                  : {
                      animation: `quivr-blink 2.4s ease-in-out ${i * 0.8}s infinite`,
                      animationPlayState: live ? "running" : "paused",
                    }
              }
            />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <figure ref={ref} aria-label={t("label")} className="m-0">
        {/* Desktop: left to right. */}
        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(40px,88px)_minmax(0,1.1fr)_minmax(40px,88px)_minmax(0,1fr)] grid-rows-4 gap-y-3 md:grid">
          {sources.map((label, i) => (
            <Reveal key={label} from="left" delay={i * 0.08} style={{ gridColumn: 1, gridRow: i + 1 }}>
              {sourceNode(label, i)}
            </Reveal>
          ))}
          {sources.map((label, i) => (
            <div key={`in-${label}`} className="flex items-center" style={{ gridColumn: 2, gridRow: i + 1 }}>
              <Lane running={live} animated={!reduced} delay={inDelay(i)} duration={FLOW_DURATION} />
            </div>
          ))}
          <Reveal delay={0.2} style={{ gridColumn: 3, gridRow: "1 / span 4" }}>
            {coreBlock}
          </Reveal>
          {outputs.map((output, i) => (
            <div key={`out-${output.label}`} className="flex items-center" style={{ gridColumn: 4, gridRow: i + 1 }}>
              <Lane running={live} animated={!reduced} delay={outDelay(i)} duration={FLOW_DURATION} />
            </div>
          ))}
          {outputs.map((output, i) => (
            <Reveal key={output.label} from="right" delay={0.3 + i * 0.08} style={{ gridColumn: 5, gridRow: i + 1 }}>
              {outputNode(output, i)}
            </Reveal>
          ))}
        </div>

        {/* Phones: top to bottom. */}
        <div className="flex flex-col md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {sources.map((label, i) => (
              <Reveal key={label} delay={i * 0.06}>
                {sourceNode(label, i)}
              </Reveal>
            ))}
          </div>
          <div className="grid h-12 grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="flex justify-center">
                <Lane axis="y" running={live} animated={!reduced} delay={inDelay(i * 2)} duration={FLOW_DURATION} />
              </div>
            ))}
          </div>
          <Reveal>{coreBlock}</Reveal>
          <div className="grid h-12 grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="flex justify-center">
                <Lane axis="y" running={live} animated={!reduced} delay={outDelay(i * 2)} duration={FLOW_DURATION} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {outputs.map((output, i) => (
              <Reveal key={output.label} delay={i * 0.06}>
                {outputNode(output, i)}
              </Reveal>
            ))}
          </div>
        </div>
      </figure>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 — Alert: an article arrives, the match is explained, a webhook goes out. */
/* -------------------------------------------------------------------------- */

const ALERT_STEPS = 4;
const ALERT_TICK_MS = 1700;

/** A connector that sends one packet each time `fire` turns on. */
function PacketLane({ axis, fire, animated }: { axis: "x" | "y"; fire: boolean; animated: boolean }) {
  const x = axis === "x";
  return (
    <div aria-hidden="true" className={`relative ${x ? "h-px w-full" : "h-full w-px"} bg-foreground`}>
      <span
        className={
          x
            ? "absolute -right-px top-1/2 -translate-y-1/2 border-y-[4px] border-l-[7px] border-y-transparent border-l-foreground"
            : "absolute -bottom-px left-1/2 -translate-x-1/2 border-x-[4px] border-t-[7px] border-x-transparent border-t-foreground"
        }
      />
      {animated && fire ? (
        <motion.div
          className="absolute inset-0"
          initial={x ? { x: "-100%", opacity: 0 } : { y: "-100%", opacity: 0 }}
          animate={x ? { x: "0%", opacity: [0, 1, 1, 0] } : { y: "0%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <span
            className={
              x
                ? "absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-500"
                : "absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500"
            }
          />
        </motion.div>
      ) : null}
    </div>
  );
}

export function AlertDiagram() {
  const t = useTranslations("quivr.diagrams.alert");
  const ref = useRef<HTMLDivElement>(null);
  const { live, reduced } = useLive(ref);
  // 0 alert saved · 1 article arrives · 2 match explained · 3 webhook sent ·
  // 4 hold the final frame, then loop.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setTick((s) => (s + 1) % (ALERT_STEPS + 1)), ALERT_TICK_MS);
    return () => window.clearInterval(id);
  }, [live]);

  const step = reduced ? ALERT_STEPS - 1 : Math.min(tick, ALERT_STEPS - 1);
  const steps = t.raw("steps") as string[];
  const headline = t.raw("headline") as { text: string; hit?: boolean }[];
  const spring = { type: "spring", stiffness: 320, damping: 24 } as const;

  const sourcePanel = (
    <div className="flex h-full flex-col gap-3">
      <div className="border border-foreground bg-background p-4">
        <span className={MONO}>{t("alertLabel")}</span>
        <code className="mt-2 block break-words font-mono text-[13px] text-foreground">{t("query")}</code>
      </div>
      <motion.div
        className="flex-1 border-2 border-foreground bg-background p-4"
        animate={{ opacity: step >= 1 ? 1 : 0.2, y: step >= 1 ? 0 : -10 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className={MONO}>{t("articleLabel")}</span>
        <p className="m-0 mt-2 text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
          {headline.map((part, i) =>
            part.hit ? (
              <span key={i} className="relative inline-block">
                {part.text}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-[3px] origin-left bg-orange-500"
                  initial={false}
                  animate={{ scaleX: step >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                />
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      </motion.div>
    </div>
  );

  const quivrPanel = (
    <div
      data-surface="inverse"
      className="flex h-full flex-col justify-center border-2 border-foreground bg-foreground p-5 text-background"
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={QUIVR_LOGO} alt="" className="h-8 w-8" />
        <span className="text-[22px] font-bold leading-none tracking-[-0.03em]">Quivr</span>
      </div>
      <div className="relative mt-4">
        <motion.p
          aria-hidden={step >= 2}
          className="absolute inset-x-0 top-0 m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-background/55"
          initial={false}
          animate={{ opacity: step >= 2 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {t("watching")}
        </motion.p>
        <motion.div
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.92 }}
          transition={spring}
          style={{ transformOrigin: "left center" }}
        >
          <span className="inline-flex items-center gap-2 border border-background/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-background">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            {t("match")}
          </span>
          <p className="m-0 mt-2 text-[14px] leading-[1.45] text-background/80">{t("reason")}</p>
        </motion.div>
      </div>
    </div>
  );

  const appPanel = (
    <div className="flex h-full flex-col justify-center border border-foreground bg-background p-5">
      <span className={MONO}>{t("appLabel")}</span>
      <div className="relative mt-3">
        <motion.p
          aria-hidden={step >= 3}
          className="absolute inset-x-0 top-1/2 m-0 -translate-y-1/2 text-[14px] text-muted-foreground"
          initial={false}
          animate={{ opacity: step >= 3 ? 0 : 1 }}
          transition={{ duration: 0.3, delay: step >= 3 && !reduced ? 0.7 : 0 }}
        >
          {t("waiting")}
        </motion.p>
        <motion.div
          className="flex items-center gap-3"
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 8 }}
          transition={{ duration: 0.4, ease: EASE, delay: step >= 3 && !reduced ? 0.7 : 0 }}
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-foreground text-[13px] font-bold text-foreground"
          >
            ✓
          </span>
          <span className="text-[16px] font-semibold text-foreground">{t("received")}</span>
        </motion.div>
      </div>
    </div>
  );

  const webhookTag = (
    <span className="whitespace-nowrap border border-foreground bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
      {t("webhook")}
    </span>
  );

  return (
    <MotionConfig reducedMotion="user">
      <figure ref={ref} aria-label={t("label")} className="m-0">
        <Reveal>
          {/* Desktop: left to right. */}
          <div className="hidden grid-cols-[minmax(0,1.15fr)_minmax(40px,72px)_minmax(0,1fr)_minmax(96px,140px)_minmax(0,0.85fr)] items-stretch md:grid">
            {sourcePanel}
            <div className="flex items-center">
              <PacketLane axis="x" fire={step === 1} animated={!reduced} />
            </div>
            {quivrPanel}
            <div className="relative flex items-center">
              <span className="absolute left-1/2 top-[calc(50%-30px)] -translate-x-1/2">{webhookTag}</span>
              <PacketLane axis="x" fire={step === 3} animated={!reduced} />
            </div>
            {appPanel}
          </div>

          {/* Phones: top to bottom. */}
          <div className="flex flex-col md:hidden">
            {sourcePanel}
            <div className="flex h-12 justify-center">
              <PacketLane axis="y" fire={step === 1} animated={!reduced} />
            </div>
            {quivrPanel}
            <div className="relative flex h-14 justify-center">
              <span className="absolute left-[calc(50%+16px)] top-1/2 -translate-y-1/2">{webhookTag}</span>
              <PacketLane axis="y" fire={step === 3} animated={!reduced} />
            </div>
            {appPanel}
          </div>
        </Reveal>

        {/* The four steps, the current one inked. */}
        <ol className="m-0 mt-6 grid list-none grid-cols-2 gap-x-4 gap-y-3 p-0 md:grid-cols-4">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-col gap-2">
              <span aria-hidden="true" className="relative block h-[2px] w-full overflow-hidden bg-border">
                <motion.span
                  className="absolute inset-0 origin-left bg-foreground"
                  initial={false}
                  animate={{ scaleX: step >= i ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </span>
              <span
                className={`text-[13px] font-medium leading-[1.35] transition-colors duration-300 ${
                  step === i ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="mr-1.5 font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </figure>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* 3 — Plugins snap into the generic core.                                    */
/* -------------------------------------------------------------------------- */

type PluginKey = (typeof QUIVR_PLUGINS)[number]["key"];
const ROLE: Record<PluginKey, "source" | "format" | "yours"> = {
  rss: "source",
  m365: "source",
  x: "source",
  newsml: "format",
  pdf: "format",
  yours: "yours",
};

export function PluginDiagram() {
  const t = useTranslations("quivr.diagrams.plugins");
  const ref = useRef<HTMLDivElement>(null);
  const { live, reduced } = useLive(ref);
  const left = QUIVR_PLUGINS.slice(0, 3);
  const right = QUIVR_PLUGINS.slice(3);

  const name = (plugin: (typeof QUIVR_PLUGINS)[number]) =>
    plugin.name ?? (plugin.key === "x" ? t("xLists") : t("yours"));

  const tile = (plugin: (typeof QUIVR_PLUGINS)[number]) => (
    <a
      href={plugin.href}
      {...EXTERNAL}
      className={`group flex h-full items-center justify-between gap-3 border-2 bg-background px-4 py-3 no-underline transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--foreground)] ${
        plugin.key === "yours" ? "border-dashed border-foreground" : "border-foreground"
      }`}
    >
      <span className="text-[15px] font-bold tracking-[-0.01em] text-foreground md:text-base">{name(plugin)}</span>
      <span className="shrink-0 border border-foreground px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground">
        {t(`roles.${ROLE[plugin.key]}`)}
      </span>
    </a>
  );

  /** A plugin tile that slides in and "snaps" (spring) toward the core. */
  const snap = (plugin: (typeof QUIVR_PLUGINS)[number], i: number, from: "left" | "right" | "up") => (
    <motion.div
      key={plugin.key}
      className="h-full"
      initial={{ opacity: 0, x: from === "left" ? -56 : from === "right" ? 56 : 0, y: from === "up" ? 28 : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.25 + i * 0.12 }}
    >
      {tile(plugin)}
    </motion.div>
  );

  const connector = (i: number, side: "left" | "right") => (
    <motion.div
      className="flex h-full w-full items-center"
      style={{ transformOrigin: side === "left" ? "right center" : "left center" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.45 + i * 0.12 }}
    >
      <Lane
        running={live}
        animated={!reduced}
        delay={i * 0.7}
        duration={2.8}
        reverse={side === "right"}
      />
    </motion.div>
  );

  const coreBlock = (
    <div
      data-surface="inverse"
      className="relative flex h-full flex-col items-center justify-center border-2 border-foreground bg-foreground px-6 py-7 text-center text-background"
    >
      {!reduced ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 border border-foreground"
          style={{
            animation: "quivr-halo 2.8s ease-out infinite",
            animationPlayState: live ? "running" : "paused",
          }}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={QUIVR_LOGO} alt="" className="h-12 w-12" />
      <span className="mt-3 text-[26px] font-bold leading-none tracking-[-0.04em]">{t("coreTitle")}</span>
      <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">{t("coreNote")}</span>
      <ul className="m-0 mt-5 flex list-none flex-wrap justify-center gap-1.5 p-0">
        {QUIVR_STACK.map((item) => (
          <li key={item} className="border border-white/25 px-1.5 py-0.5 font-mono text-[10px] text-background">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <figure ref={ref} aria-label={t("label")} className="m-0">
        {/* Desktop: the core in the middle, sources left, formats right. */}
        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(40px,88px)_minmax(0,1fr)_minmax(40px,88px)_minmax(0,1fr)] grid-rows-3 gap-y-4 md:grid">
          {left.map((plugin, i) => (
            <div key={plugin.key} style={{ gridColumn: 1, gridRow: i + 1 }}>
              {snap(plugin, i, "left")}
            </div>
          ))}
          {left.map((plugin, i) => (
            <div key={`c-${plugin.key}`} style={{ gridColumn: 2, gridRow: i + 1 }}>
              {connector(i, "left")}
            </div>
          ))}
          <Reveal style={{ gridColumn: 3, gridRow: "1 / span 3" }}>{coreBlock}</Reveal>
          {right.map((plugin, i) => (
            <div key={`c-${plugin.key}`} style={{ gridColumn: 4, gridRow: i + 1 }}>
              {connector(i + 3, "right")}
            </div>
          ))}
          {right.map((plugin, i) => (
            <div key={plugin.key} style={{ gridColumn: 5, gridRow: i + 1 }}>
              {snap(plugin, i + 3, "right")}
            </div>
          ))}
        </div>

        {/* Phones: the core on top, plugins snapping in below it. */}
        <div className="flex flex-col md:hidden">
          <Reveal>{coreBlock}</Reveal>
          <div className="flex h-12 justify-center">
            <Lane axis="y" running={live} animated={!reduced} duration={2.8} reverse />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUIVR_PLUGINS.map((plugin, i) => snap(plugin, i, "up"))}
          </div>
        </div>

        <a href={QUIVR_PLUGINS_DOCS_URL} {...EXTERNAL} className={`mt-8 ${TEXT_LINK}`}>
          {t("link")}
          <span aria-hidden="true">↗</span>
        </a>
      </figure>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* 4 — Timeline: V1, YC, The Vibe Company, V2.                                */
/* -------------------------------------------------------------------------- */

const TIMELINE_KEYS = ["v1", "yc", "tvc", "v2"] as const;

export function TimelineDiagram({ stars }: { stars: number | null }) {
  const t = useTranslations("quivr.diagrams.timeline");
  const locale = useLocale();

  const node = (key: (typeof TIMELINE_KEYS)[number], i: number) => {
    const current = key === "v2";
    return (
      <motion.li
        key={key}
        className="relative pb-8 pl-8 md:pb-0 md:pl-0 md:pr-6 md:pt-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.35 + i * 0.22 }}
      >
        <motion.span
          aria-hidden="true"
          className={`absolute left-[-7px] top-0.5 h-4 w-4 border-2 border-foreground md:left-0 md:top-[-7px] ${
            current ? "bg-orange-500" : "bg-background"
          }`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.3 + i * 0.22 }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {t(`items.${key}.label`)}
        </span>
        <p className="m-0 mt-2 max-w-[26ch] text-[19px] font-bold leading-[1.2] tracking-[-0.025em] text-foreground md:text-[22px]">
          {t(`items.${key}.title`)}
        </p>
        {key === "v1" ? (
          <p className="m-0 mt-2 flex items-center gap-1.5 font-mono text-[12px] text-foreground">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {t("stars", { stars: formatStarsCompact(stars, locale) })}
          </p>
        ) : null}
        {key === "v1" ? (
          <a href={QUIVR_V1_URL} {...EXTERNAL} className={`mt-3 ${TEXT_LINK}`}>
            {t("v1Link")}
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {key === "tvc" ? (
          <Link href={QUIVR_STORY_ARTICLE_PATH} className={`mt-3 ${TEXT_LINK}`}>
            {t("storyLink")}
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
        {current ? (
          <a href={QUIVR_QUICKSTART_URL} {...EXTERNAL} className={`mt-3 ${TEXT_LINK}`}>
            {t("quickstart")}
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </motion.li>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        {/* The rule draws itself: across on desktop, down on phones. */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-[2px] w-full origin-left bg-foreground md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[2px] origin-top bg-foreground md:hidden"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <ol className="m-0 grid list-none grid-cols-1 p-0 md:grid-cols-4">
          {TIMELINE_KEYS.map((key, i) => node(key, i))}
        </ol>
      </div>
    </MotionConfig>
  );
}
