"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Marquee } from "./Marquee";
import {
  typography,
  spacing,
  components,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end pb-32 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className={cn("relative z-10 mb-12", spacing.page.x)}
      >
        <div className={spacing.container.default}>
          {/* Status Badge */}
          <motion.div
            initial={animations.variants.fadeInScale.initial}
            animate={animations.variants.fadeInScale.animate}
            transition={createTransition(0.8)}
            className={cn(components.badge.default, "mb-8")}
          >
            <span className={components.statusDot.active} />
            a project from the{" "}
            <a
              href="https://quivr.com"
              target="_blank"
              rel="noopener noreferrer"
              className={components.link.underline}
            >
              Quivr
            </a>
            {" "}team
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className={typography.display.hero}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={createTransition(1)}
          >
            The Vibe
            <br />
            Company
          </motion.h1>

          {/* Tagline Section */}
          <div className={cn(
            "flex flex-col md:flex-row items-start md:items-end justify-between",
            spacing.gap.lg,
            "mt-12 border-t border-foreground pt-8"
          )}>
            <motion.p
              className={cn(
                typography.body.large,
                "text-muted-foreground max-w-2xl"
              )}
              initial={animations.variants.fadeInUp.initial}
              animate={animations.variants.fadeInUp.animate}
              transition={createTransition(0.8, 0.2)}
            >
              We vibe. We ship. We show you how.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Marquee Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Marquee>
          <span className={cn(typography.marquee, "px-8 text-foreground/10")}>
            WE SHIP PRODUCTS
          </span>
          <span className={cn(typography.marquee, "px-8 text-foreground/10")}>
            •
          </span>
          <span className={cn(typography.marquee, "px-8 text-foreground/10")}>
            WE BUILD IN PUBLIC
          </span>
          <span className={cn(typography.marquee, "px-8 text-foreground/10")}>
            •
          </span>
          <span className={cn(typography.marquee, "px-8 text-foreground/10")}>
            NO STEALTH MODE
          </span>
          <span className={cn(typography.marquee, "px-8 text-foreground/10")}>
            •
          </span>
        </Marquee>
      </motion.div>
    </section>
  );
}
