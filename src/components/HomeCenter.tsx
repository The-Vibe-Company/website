"use client";

import { motion } from "framer-motion";
import {
  spacing,
  components,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";

export function HomeCenter() {
  return (
    <section className="snap-start h-full w-full flex flex-col pt-2 md:pt-4 relative">
      {/* Top bar: badges */}
      <div
        className={cn(
          "flex items-center gap-3 pt-0 md:pt-1 md:justify-between",
          spacing.page.x
        )}
      >
        {/* YC Badge */}
        <motion.a
          href="https://www.ycombinator.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={animations.variants.fadeInScale.initial}
          animate={animations.variants.fadeInScale.animate}
          transition={createTransition(0.8)}
          className={cn(
            components.badge.base,
            "border border-orange-500/30 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" />
          </svg>
          <span className="hidden sm:inline">Backed by Y Combinator</span>
          <span className="sm:hidden">YC</span>
        </motion.a>

        {/* Build in Public badge */}
        <motion.div
          initial={animations.variants.fadeInScale.initial}
          animate={animations.variants.fadeInScale.animate}
          transition={createTransition(0.8, 0.1)}
          className={cn(components.badge.default, "md:ml-auto")}
        >
          <span className={components.statusDot.active} />
          Building in public
        </motion.div>
      </div>

      {/* Center: headline + tagline */}
      <div
        className={cn(
          "flex-1 flex flex-col justify-center -mt-14 md:-mt-24",
          spacing.page.x
        )}
      >
        <div className={spacing.container.default}>
          <motion.h1
            className="text-[15vw] md:text-[12vw] leading-[0.85] font-bold tracking-tighter"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={createTransition(1, 0.2)}
          >
            The Vibe
            <br />
            Company
          </motion.h1>

          <motion.p
            className={cn(
              "text-lg md:text-2xl lg:text-3xl font-light tracking-tight",
              "text-muted-foreground max-w-2xl mt-4 md:mt-8"
            )}
            initial={animations.variants.fadeInUp.initial}
            animate={animations.variants.fadeInUp.animate}
            transition={createTransition(0.8, 0.5)}
          >
            An AI native agency.{" "}
            <span className="text-foreground">100x efficiency.</span>
            <br />
            We build with AI. We ship fast. We show everything.
          </motion.p>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={createTransition(0.6, 1.5)}
      >
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/50">
          SCROLL ↓ DEPARTURES
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/50 animate-bounce"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
