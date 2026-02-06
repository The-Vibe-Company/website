"use client";

import { motion } from "framer-motion";
import {
  typography,
  spacing,
  components,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";

export function HomeCenter() {
  return (
    <section className="h-screen w-full flex flex-col pt-16">
      {/* Top bar: badges */}
      <div
        className={cn(
          "flex items-center gap-3 pt-4 md:pt-8 md:justify-between",
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
      <div className={cn("flex-1 flex flex-col justify-center", spacing.page.x)}>
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

      {/* Bottom spacer for scroll hint (rendered by parent) */}
      <div className="h-12 md:h-16" />
    </section>
  );
}
