"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Lines of a heading that slide up, one after the other, from behind their
 * own mask the first time they scroll into view. Each mask keeps a little room
 * below for descenders and to the right for the serif italic's overhang.
 * With reduced motion requested the lines are simply there.
 */
export function MaskLines({
  lines,
  delay = 0,
  lineClassName,
}: {
  lines: ReactNode[];
  delay?: number;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion() ?? false;

  return (
    <span ref={ref} className="block">
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.12em]">
          <motion.span
            className={lineClassName ?? "block"}
            initial={reduce ? false : { y: "108%" }}
            animate={reduce || inView ? { y: "0%" } : undefined}
            transition={{ duration: 0.95, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
