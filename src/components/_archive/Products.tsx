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

const techTags = [
  "Next.js",
  "AI Agents",
  "Design Systems",
  "Vercel",
  "Turbopack",
  "React Server Components",
];

export function Products() {
  return (
    <section id="products" className={spacing.section.paddingLarge}>
      <div className={spacing.container.default}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={createViewportConfig()}
          transition={{ duration: animations.duration.normal }}
        >
          {/* Section Header */}
          <div className={components.sectionHeader.wrapper}>
            <h2 className={components.sectionHeader.title}>
              <span className={components.sectionHeader.indicator} />
              SYSTEM_STATUS
            </h2>
            <div className={cn(typography.label.mono, "flex items-center gap-4 mt-4 md:mt-0")}>
              <span className="border border-foreground px-2 py-1">
                VIBE_PROTOCOL: ACTIVE
              </span>
              <span className="border border-foreground px-2 py-1">
                UPTIME: 99.9%
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className={cn(layout.grid.cols12, spacing.gap.lg, "lg:gap-24")}>
            {/* Left Column */}
            <div className="lg:col-span-5">
              <motion.h3
                className={cn(
                  typography.heading.h1,
                  "leading-none mb-8 text-transparent stroke-text"
                )}
                initial={animations.variants.fadeInUp.initial}
                whileInView={animations.variants.fadeInUp.animate}
                viewport={{ once: true }}
                transition={createTransition(0.8)}
              >
                THE <br />
                LABORATORY
              </motion.h3>
              <p
                className={cn(
                  typography.body.default,
                  "font-light max-w-sm",
                  components.bordered.leftSolid
                )}
              >
                We are building in public. <br />
                No stealth mode. <br />
                Just raw output.
              </p>
            </div>

            {/* Right Column - Card */}
            <div className="lg:col-span-7">
              <div className={cn(components.card.hover, "relative group overflow-hidden")}>
                {/* Corner Icon */}
                <div className="absolute top-0 right-0 p-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="square"
                  >
                    <rect x="2" y="2" width="20" height="20" />
                    <path d="M12 2v20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>

                {/* Card Header */}
                <h4 className={cn(components.badge.solid, "mb-6")}>
                  Current_Objective
                </h4>

                {/* Terminal Content */}
                <div className="space-y-6">
                  <div className={components.terminal.line}>
                    &gt; Initializing Vibe Protocol... <br />
                    &gt; Compiling Next.js Archetypes... <br />
                    &gt;{" "}
                    <span className={components.terminal.cursor}>
                      Waiting for input_
                    </span>
                  </div>

                  {/* Tech Tags Grid */}
                  <div className={cn(components.tagGrid, "mt-8")}>
                    {techTags.map((tag) => (
                      <div key={tag} className={components.tagItem}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div
                  className={cn(
                    "mt-12 flex justify-between items-center",
                    typography.label.small,
                    "font-medium border-t border-foreground pt-6"
                  )}
                >
                  <span>Follow transmission</span>
                  <div className={cn(typography.fonts.mono, typography.label.mono, "flex gap-6")}>
                    <a href="https://twitter.com" className={components.link.mono}>
                      [X_TWITTER]
                    </a>
                    <a href="https://github.com" className={components.link.mono}>
                      [GITHUB]
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
