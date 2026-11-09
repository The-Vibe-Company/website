"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { SERIF } from "./fonts";
import { MaskLines } from "./MaskLines";

/**
 * One numbered chapter of the page. On wide screens its number and label hold
 * still in a left rail while the content scrolls past, and a hairline in that
 * rail fills with orange as you read through the chapter. Phones get the
 * number and label above the content instead.
 */
export function Chapter({
  id,
  n,
  label,
  word,
  children,
}: {
  id?: string;
  n: number;
  label: string;
  /** "Chapitre" / "Chapter". */
  word: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section id={id} ref={ref} className="mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
      {/* The chapter's rule stops at the gutters, like every rule on the site. */}
      <div className="grid grid-cols-1 border-t border-border lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <div className="pt-16 lg:pb-32 lg:pt-28">
          <div className="flex items-end justify-between gap-6 border-b border-border pb-5 lg:sticky lg:top-[132px] lg:block lg:border-b-0 lg:pb-0">
            <div>
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {word}
              </span>
              <span className={`${SERIF} mt-1 block text-[64px] leading-[0.9] tracking-[-0.02em] text-foreground lg:text-[104px]`}>
                {String(n).padStart(2, "0")}
              </span>
            </div>
            <p className="m-0 mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground lg:mb-0 lg:mt-6">
              <BrandSquare />
              {label}
            </p>
            <div aria-hidden="true" className="relative mt-8 hidden h-40 w-px bg-border lg:block">
              <motion.span
                className="absolute inset-x-0 top-0 block h-full origin-top bg-brand"
                style={{ scaleY: reduce ? 1 : progress }}
              />
            </div>
          </div>
        </div>
        <div className="min-w-0 pb-24 pt-10 lg:pb-32 lg:pt-28">{children}</div>
      </div>
    </section>
  );
}

/** A chapter title: a Geist line, then the serif italic line beneath it. */
export function ChapterTitle({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <h2 className="m-0 text-[clamp(44px,6.2vw,104px)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground">
      <MaskLines
        lines={[
          line1,
          <span key="serif" className={`${SERIF} text-[1.08em] leading-[0.95] tracking-[-0.02em]`}>
            {line2}
          </span>,
        ]}
      />
    </h2>
  );
}
