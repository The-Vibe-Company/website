"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { cn } from "@/lib/design-system";
import { doto } from "./fonts";
import s from "./live.module.css";

/** Class pair for anything set in the dot-matrix face. */
export const DOT = cn(doto.variable, s.dot, "font-bold");

/**
 * Whether a section is on screen, for pausing what it animates. Not "once":
 * a section scrolled away stops, and starts again when it comes back.
 */
export function useRun<T extends Element>(ref: RefObject<T | null>) {
  return useInView(ref, { margin: "120px 0px 120px 0px" });
}

/** Feeds the pointer position to a .spot element as --x/--y. */
export function trackPointer(event: ReactPointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const box = el.getBoundingClientRect();
  el.style.setProperty("--x", `${event.clientX - box.left}px`);
  el.style.setProperty("--y", `${event.clientY - box.top}px`);
}

/** The live square: orange, with a ring that keeps expanding. */
export function LivePulse({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn(s.pulse, className)} />;
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A figure that counts up from zero the first time it scrolls in. The server
 * renders the final value, so it reads right without script; a figure already
 * on screen when the page loads is left alone rather than reset under the eye.
 * Only the first run of digits counts: "4 M€" counts 0→4, "87%" 0→87.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion() ?? false;
  const armed = useRef(false);

  const raw = match?.[2] ?? "";
  const target = Number.parseFloat(raw.replace(",", "."));
  const decimals = raw.includes(".") || raw.includes(",") ? raw.split(/[.,]/)[1].length : 0;
  const format = (n: number) => n.toFixed(decimals).replace(".", raw.includes(",") ? "," : ".");

  useIsomorphicLayoutEffect(() => {
    const el = numberRef.current;
    if (!el || !match || reduce) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    el.textContent = format(0);
    armed.current = true;
    // Only on mount: whether to arm is decided once.
  }, []);

  useEffect(() => {
    const el = numberRef.current;
    if (!el || !inView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">
        {match[1]}
        <span ref={numberRef}>{raw}</span>
        {match[3]}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ clock */

function subscribeSecond(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

const nowSecond = () => Math.floor(Date.now() / 1000);

/** Seconds since the epoch, ticking; 0 on the server so the HTML is stable. */
export function useNowSecond() {
  return useSyncExternalStore(subscribeSecond, nowSecond, () => 0);
}

const TIME = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/** Paris wall-clock time as hh:mm:ss, or a dashed placeholder before hydration. */
export function parisTime(seconds: number) {
  return seconds ? TIME.format(new Date(seconds * 1000)) : "--:--:--";
}

export function ParisClock({ className }: { className?: string }) {
  const now = useNowSecond();
  return (
    <time className={cn("tabular-nums", className)} suppressHydrationWarning>
      {parisTime(now)}
    </time>
  );
}
