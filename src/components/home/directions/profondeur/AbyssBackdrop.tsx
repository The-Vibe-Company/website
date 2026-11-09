"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useMotionValueEvent } from "framer-motion";
import { Dust } from "./Dust";

const COPY = {
  fr: { depth: "Profondeur" },
  en: { depth: "Depth" },
};

/** Decorative only: metres of descent, not a business figure. */
const MAX_DEPTH = 1200;

/**
 * The water the page sinks through, behind every section after the hero:
 * dust at three depths that slides with the scroll at three speeds, a warmth
 * rising from below that grows as you go down, and on the right a depth gauge
 * counting the descent. It is sticky inside the sections' wrapper, so it never
 * reaches the hero above or the footer below.
 */
export function AbyssBackdrop({ locale }: { locale: "fr" | "en" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const warm = useTransform(scrollYProgress, [0, 1], [0.05, 0.22]);
  const glow = useMotionTemplate`radial-gradient(120% 60% at 50% 115%, rgb(242 115 19 / ${warm}), transparent 70%)`;
  const marker = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [depth, setDepth] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setDepth(Math.round((v * MAX_DEPTH) / 10) * 10));

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ background: glow }} />
        <Dust scroll density={0.7} warmBelow={0.7} />
        {/* Depth gauge. */}
        <div className="absolute right-5 top-1/2 hidden h-[44svh] -translate-y-1/2 flex-col items-center gap-3 xl:flex">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground [writing-mode:vertical-rl]">
            {COPY[locale].depth}
          </span>
          <div className="relative w-3 flex-1">
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-border-strong" style={{ top: `${i * 10}%` }} />
            ))}
            <motion.span
              style={{ top: marker }}
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-brand shadow-[0_0_12px_2px_rgb(242_115_19/0.7)]"
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums tracking-[0.12em] text-soft-foreground">
            −{String(depth).padStart(4, "0")} m
          </span>
        </div>
      </div>
    </div>
  );
}
