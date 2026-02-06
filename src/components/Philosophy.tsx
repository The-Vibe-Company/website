"use client";

import { motion } from "framer-motion";
import {
  typography,
  spacing,
  animations,
  cn,
  createTransition,
  createViewportConfig,
} from "@/lib/design-system";

export function Philosophy() {
  return (
    <section
      className={cn(
        spacing.section.paddingLarge,
        "bg-foreground text-background"
      )}
    >
      <div className={cn(spacing.container.narrow, "text-center")}>
        <motion.div
          initial={animations.variants.fadeInUp.initial}
          whileInView={animations.variants.fadeInUp.animate}
          viewport={createViewportConfig()}
          transition={createTransition(0.8)}
        >
          {/* Section Label */}
          <h2 className={cn(typography.label.default, "text-white/60 mb-16")}>
            Philosophy
          </h2>

          {/* Main Quote */}
          <blockquote className={cn(typography.heading.h2, "mb-16")}>
            &ldquo;Vibe coding isn&apos;t chaos. It&apos;s disciplined
            intuition.&rdquo;
          </blockquote>

          {/* Description */}
          <p
            className={cn(
              typography.body.default,
              "text-white/80 font-light",
              spacing.container.medium,
              "mx-auto"
            )}
          >
            We trust the process. We move fast but we don&apos;t cut corners. We
            build things that work, document what we learn, and share it all.
            That&apos;s the vibe.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
