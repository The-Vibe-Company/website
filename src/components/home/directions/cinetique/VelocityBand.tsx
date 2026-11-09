"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Fragment, useRef } from "react";
import { cn } from "@/lib/design-system";
import { DISPLAY } from "./font";

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/** Copies of the word group per half-track: wide enough for any screen. */
const COPIES = 4;

/**
 * A full-bleed band of giant words that drifts on its own, runs faster and
 * reverses with the scroll, and leans and widens with scroll speed. The group
 * is repeated so the -50% wrap is seamless; every copy but the first is hidden
 * from assistive technology.
 */
export function VelocityBand({
  words,
  direction = 1,
  speed = 3,
  variant = "solid",
  separator = "square",
  className,
  textClassName,
}: {
  words: string[];
  /** 1 drifts left, -1 drifts right. */
  direction?: 1 | -1;
  /** Resting drift, in % of the track per second. */
  speed?: number;
  variant?: "solid" | "outline" | "tape";
  separator?: "square" | "slash" | "dot";
  className?: string;
  textClassName?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const skew = useTransform(smooth, [-3000, 0, 3000], [-9, 0, 9]);
  const stretch = useTransform(smooth, (v) => `${Math.min(100 + Math.abs(v) / 45, 145).toFixed(1)}%`);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const heading = useRef<1 | -1>(direction);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const b = boost.get();
    // Scrolling up turns the band around; scrolling down sends it back.
    if (b < 0) heading.current = (-direction) as 1 | -1;
    else if (b > 0) heading.current = direction;
    let move = -heading.current * speed * (delta / 1000);
    move += move * Math.abs(b);
    baseX.set(baseX.get() + move / 2);
  });

  const sep =
    separator === "square" ? (
      <span aria-hidden="true" className="mx-[0.35em] inline-block h-[0.32em] w-[0.32em] shrink-0 translate-y-[-0.08em] bg-brand align-middle" />
    ) : separator === "slash" ? (
      <span aria-hidden="true" className="mx-[0.3em] text-brand">/</span>
    ) : (
      <span aria-hidden="true" className="mx-[0.3em] text-muted-foreground">·</span>
    );

  const group = (copy: number) => (
    <span aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center whitespace-nowrap pr-[0.35em]">
      {words.map((word) => (
        <Fragment key={word}>
          <span>{word}</span>
          {sep}
        </Fragment>
      ))}
    </span>
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden select-none",
        variant === "tape" && "border-y border-foreground bg-foreground text-background",
        variant === "solid" && "text-foreground",
        variant === "outline" && "text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]",
        className,
      )}
    >
      <motion.div
        className={cn(
          DISPLAY,
          "flex w-max shrink-0 font-extrabold uppercase leading-[0.86] tracking-[-0.02em] motion-reduce:transform-none! motion-reduce:[font-stretch:100%]!",
          textClassName,
        )}
        style={{ x, skewX: skew, fontStretch: stretch }}
      >
        {Array.from({ length: COPIES * 2 }, (_, i) => (
          <Fragment key={i}>{group(i)}</Fragment>
        ))}
      </motion.div>
    </div>
  );
}
