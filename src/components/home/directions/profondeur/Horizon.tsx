"use client";

import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/design-system";
import s from "./profondeur.module.css";

/**
 * The stage every deep section stands on: a floor laid back into the dark
 * from `horizon` (a top offset) down, the orange light lying on the horizon,
 * and two banks of haze it lights from below. `px` (the shared pointer) slides
 * the floor's vanishing point sideways, which is what makes the grid turn as
 * the pointer moves; `travel` (px) runs the grid toward the viewer.
 */
export function Horizon({
  horizon = "63%",
  px,
  travel,
  glow = 1,
  className,
}: {
  horizon?: string;
  px?: MotionValue<number>;
  travel?: MotionValue<number>;
  /** Strength of the light, 0..1.5. */
  glow?: number | MotionValue<number>;
  className?: string;
}) {
  const fallback = useTransform(() => 0);
  const origin = useTransform(px ?? fallback, (v) => `${50 - v * 9}% 0%`);
  const shift = useTransform(px ?? fallback, (v) => v * -6);
  const travelPx = useMotionTemplate`${travel ?? fallback}px`;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {/* Sky: ink, warming toward the horizon. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 65% at 50% ${horizon}, #22140b 0%, #140f0d 30%, #0e0d0d 55%, #0c0c0d 75%)`,
        }}
      />
      <motion.div className={s.floorWrap} style={{ top: horizon, perspectiveOrigin: origin }}>
        <motion.div className={s.floor} style={{ "--travel": travelPx } as unknown as CSSProperties} />
        <motion.div className={cn(s.floor, s.floorLit)} style={{ "--travel": travelPx } as unknown as CSSProperties} />
        {/* The near floor sinks back into ink. */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-background/80 to-transparent" />
      </motion.div>
      <motion.div className="absolute inset-x-0" style={{ top: horizon, x: shift, opacity: glow }}>
        <div className={s.horizonGlow} />
        <div className={s.horizonLine} />
      </motion.div>
      <div
        className={s.fog}
        style={{
          top: `calc(${horizon} - 120px)`,
          left: "-10%",
          width: "60%",
          height: "220px",
          background: "radial-gradient(closest-side, rgb(120 60 25 / 0.32), transparent)",
        }}
      />
      <div
        className={s.fog}
        style={{
          top: `calc(${horizon} - 60px)`,
          right: "-12%",
          width: "58%",
          height: "200px",
          background: "radial-gradient(closest-side, rgb(110 55 22 / 0.28), transparent)",
          animationDelay: "-11s",
        }}
      />
    </div>
  );
}
