"use client";

import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useSyncExternalStore } from "react";

/**
 * The animated "how it works" diagram of the Quivr project page, drawn in
 * HTML/CSS in porcelaine: sources and outputs are quiet clay pebbles, the
 * engine is the lacquer piece with the rim light, the signals are ink lines
 * with an orange dot.
 *
 * Motion rules: nothing waits for a scroll-in (the diagram is whole as soon as
 * it is in the page). The looping signals are CSS keyframes on
 * transform/opacity (globals.css, `quivr-*`) that only run while the diagram
 * is on screen; with prefers-reduced-motion they stop and the diagram shows
 * its final state.
 *
 * Hydration: the server cannot know the motion preference, so the first
 * client render must match it. The preference is read through
 * useSyncExternalStore (server value: false).
 */

const MONO = "truncate font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground";
const QUIVR_LOGO = "/projects/quivr-favicon.svg";

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
}: {
  axis?: "x" | "y";
  running: boolean;
  animated: boolean;
  delay?: number;
  duration?: number;
}) {
  const x = axis === "x";
  return (
    <div
      aria-hidden="true"
      className={`relative ${x ? "h-px w-full" : "h-full w-px"} bg-foreground/80`}
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
                ? "absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-rim"
                : "absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-rim"
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
    <div className="clay-quiet flex h-full min-w-0 items-center gap-3 rounded-piece px-4 py-3">
      <span className="font-mono text-xs text-muted-foreground">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 truncate text-[15px] font-semibold text-foreground md:text-base">
        {label}
      </span>
    </div>
  );

  const outputNode = (output: { label: string; note: string }, i: number) => (
    <div className="clay-quiet relative flex h-full min-w-0 flex-col justify-center rounded-piece px-4 py-3">
      {!reduced ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-piece border-2 border-orange-500 bg-orange-500/10 opacity-0"
          style={{
            animation: `quivr-ping ${FLOW_DURATION}s linear ${outDelay(i)}s infinite`,
            animationPlayState: live ? "running" : "paused",
          }}
        />
      ) : null}
      <span className="relative truncate text-[15px] font-semibold text-foreground md:text-base">
        {output.label}
      </span>
      <span className={`relative mt-0.5 ${MONO}`}>{output.note}</span>
    </div>
  );

  const coreBlock = (
    <div
      data-surface="inverse"
      className="lacquer rim flex h-full flex-col justify-center rounded-plate px-6 py-6 [--rim-angle:122deg]"
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={QUIVR_LOGO} alt="" className="h-10 w-10 rounded-[10px]" />
        <span className="display text-[30px] leading-none tracking-[-0.04em]">Quivr</span>
      </div>
      <ul className="m-0 mt-5 flex list-none flex-col gap-2.5 p-0">
        {core.map((step, i) => (
          <li key={step} className="flex items-center gap-3 text-[14px] text-on-lacquer/90">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-rim"
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
    <figure ref={ref} aria-label={t("label")} className="m-0">
      {/* Desktop: left to right. */}
      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(40px,88px)_minmax(0,1.1fr)_minmax(40px,88px)_minmax(0,1fr)] grid-rows-4 gap-y-3 md:grid">
        {sources.map((label, i) => (
          <div key={label} style={{ gridColumn: 1, gridRow: i + 1 }}>
            {sourceNode(label, i)}
          </div>
        ))}
        {sources.map((label, i) => (
          <div key={`in-${label}`} className="flex items-center" style={{ gridColumn: 2, gridRow: i + 1 }}>
            <Lane running={live} animated={!reduced} delay={inDelay(i)} duration={FLOW_DURATION} />
          </div>
        ))}
        <div style={{ gridColumn: 3, gridRow: "1 / span 4" }}>{coreBlock}</div>
        {outputs.map((output, i) => (
          <div key={`out-${output.label}`} className="flex items-center" style={{ gridColumn: 4, gridRow: i + 1 }}>
            <Lane running={live} animated={!reduced} delay={outDelay(i)} duration={FLOW_DURATION} />
          </div>
        ))}
        {outputs.map((output, i) => (
          <div key={output.label} style={{ gridColumn: 5, gridRow: i + 1 }}>
            {outputNode(output, i)}
          </div>
        ))}
      </div>

      {/* Phones: top to bottom. */}
      <div className="flex flex-col md:hidden">
        <div className="grid grid-cols-2 gap-2">
          {sources.map((label, i) => (
            <div key={label}>{sourceNode(label, i)}</div>
          ))}
        </div>
        <div className="grid h-12 grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex justify-center">
              <Lane axis="y" running={live} animated={!reduced} delay={inDelay(i * 2)} duration={FLOW_DURATION} />
            </div>
          ))}
        </div>
        {coreBlock}
        <div className="grid h-12 grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex justify-center">
              <Lane axis="y" running={live} animated={!reduced} delay={outDelay(i * 2)} duration={FLOW_DURATION} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {outputs.map((output, i) => (
            <div key={output.label}>{outputNode(output, i)}</div>
          ))}
        </div>
      </div>
    </figure>
  );
}
