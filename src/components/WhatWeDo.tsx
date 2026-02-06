"use client";

import { motion } from "framer-motion";
import {
  typography,
  spacing,
  layout,
  components,
  animations,
  cn,
  createTransition,
  createViewportConfig,
} from "@/lib/design-system";

const trainingTopics = [
  "Thinking in Systems",
  "The Art of Shipping",
  "Vibe Engineering",
  "Full Stack Intuition",
];

export function WhatWeDo() {
  return (
    <section id="learn" className={spacing.section.padding}>
      <div className={spacing.container.default}>
        <div
          className={cn(
            layout.grid.cols2,
            spacing.gap.lg,
            "lg:gap-24 items-start"
          )}
        >
          {/* Pillar 1 - Ship */}
          <motion.div
            initial={animations.variants.fadeInUpLarge.initial}
            whileInView={animations.variants.fadeInUpLarge.animate}
            viewport={createViewportConfig()}
            transition={createTransition(0.8)}
            className="md:sticky md:top-32"
          >
            <div className={components.bordered.left}>
              <h2
                className={cn(
                  typography.label.default,
                  "text-muted-foreground mb-8"
                )}
              >
                01 — The Output
              </h2>
              <h3 className={cn(typography.display.section, "mb-8")}>
                WE
                <br />
                SHIP.
              </h3>
              <p
                className={cn(
                  typography.body.default,
                  "text-muted-foreground max-w-xl"
                )}
              >
                Every project is public. Documented. Live. <br />
                We don&apos;t build visuals. We build engines.
              </p>
            </div>

            {/* Visual Card */}
            <div
              className={cn(
                "mt-12 w-full aspect-video",
                components.card.base,
                "relative overflow-hidden group"
              )}
            >
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={cn(
                    "border border-foreground px-4 py-2 bg-background z-10",
                    typography.label.mono
                  )}
                >
                  DEPLOYMENT_READY
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          </motion.div>

          {/* Pillar 2 - Show */}
          <motion.div
            initial={animations.variants.fadeInUpLarge.initial}
            whileInView={animations.variants.fadeInUpLarge.animate}
            viewport={createViewportConfig()}
            transition={createTransition(0.8, 0.2)}
            className="pt-24 md:pt-64"
          >
            <div
              className={cn(
                components.bordered.left,
                "border-foreground border-l"
              )}
            >
              <h2
                className={cn(
                  typography.label.default,
                  "text-muted-foreground mb-8"
                )}
              >
                02 — The Transfer
              </h2>
              <h3 className={cn(typography.display.section, "mb-8")}>
                WE
                <br />
                SHOW.
              </h3>
              <p
                className={cn(
                  typography.body.default,
                  "text-muted-foreground max-w-xl"
                )}
              >
                Vibe coding training. No abstraction layers. <br />
                You see the code, the bugs, the fixes, and the feeling.
              </p>
            </div>

            {/* Training List Card */}
            <div className={cn(components.card.hover, "mt-12 p-8")}>
              <div
                className={cn(
                  typography.fonts.mono,
                  typography.label.small,
                  "space-y-2 group-hover:opacity-100 transition-opacity"
                )}
              >
                {trainingTopics.map((item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "flex gap-4 pb-2",
                      index < trainingTopics.length - 1 &&
                        components.divider.dashed
                    )}
                  >
                    <span className="text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
