"use client";

import { motion } from "framer-motion";
import {
  typography,
  spacing,
  components,
  animations,
  cn,
  createTransition,
  createViewportConfig,
} from "@/lib/design-system";

export function Mission() {
  return (
    <section id="mission" className={spacing.section.padding}>
      <div className={spacing.container.default}>
        <motion.div
          initial={animations.variants.fadeInUp.initial}
          whileInView={animations.variants.fadeInUp.animate}
          viewport={createViewportConfig()}
          transition={createTransition(0.8)}
        >
          {/* Section Label */}
          <div className={components.sectionHeader.wrapper}>
            <h2 className={components.sectionHeader.title}>
              <span className={components.sectionHeader.indicator} />
              Mission
            </h2>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left - Headline */}
            <div>
              <h3 className={cn(typography.heading.h2, "mb-8")}>
                An AI native agency.{" "}
                <span className="text-muted-foreground">100x efficiency.</span>
              </h3>
            </div>

            {/* Right - Description */}
            <div className={cn(components.bordered.left, "border-muted")}>
              <p className={cn(typography.body.default, "text-muted-foreground mb-8")}>
                We use AI everywhere we can to achieve 100x efficiency and
                productivity. We vibe. We vibe code. We build products and teach
                others to do the same.
              </p>
              <p className={cn(typography.body.default, "text-muted-foreground")}>
                From the team behind{" "}
                <a
                  href="https://quivr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={components.link.underline}
                >
                  Quivr
                </a>
                , backed by Y Combinator.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
