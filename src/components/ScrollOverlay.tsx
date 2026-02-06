"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  typography,
  spacing,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";

interface ScrollOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

export function ScrollOverlay({ isOpen, onClose }: ScrollOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: animations.easing.smooth }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation overlay"
        >
          {/* Content container */}
          <motion.div
            className={cn("w-full max-w-5xl mx-auto", spacing.page.x)}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={createTransition(0.5, 0.1)}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prompt */}
            <motion.p
              className={cn(
                typography.label.mono,
                "text-muted-foreground text-center mb-10"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={createTransition(0.4, 0.1)}
            >
              WHERE TO NEXT?
            </motion.p>

            {/* Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ staggerChildren: 0.08, delayChildren: 0.15 }}
            >
              {/* Agency Card (dark) */}
              <motion.a
                href="/agency"
                variants={cardVariants}
                transition={animations.easing.spring}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "8px 8px 0px 0px var(--background)",
                }}
                className="block bg-foreground text-background p-6 md:p-12 border border-foreground cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-12 md:mb-24">
                  <span className={cn(typography.label.mono, "text-background/50")}>
                    01
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-background/30 group-hover:text-background/60 transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
                <h3 className={cn(typography.heading.h3, "text-background mb-2")}>
                  We build it.
                </h3>
                <p className="text-background/60 text-lg mb-8">
                  AI-native products, from zero to production.
                </p>
                <span className={cn(typography.label.mono, "text-background/40 group-hover:text-background/70 transition-colors")}>
                  SEE OUR WORK &rarr;
                </span>
              </motion.a>

              {/* Resources Card (light) */}
              <motion.a
                href="/resources"
                variants={cardVariants}
                transition={animations.easing.spring}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "8px 8px 0px 0px var(--foreground)",
                }}
                className="block border-2 border-foreground bg-background p-6 md:p-12 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-12 md:mb-24">
                  <span className={cn(typography.label.mono, "text-muted-foreground")}>
                    02
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
                <h3 className={cn(typography.heading.h3, "mb-2")}>
                  We show it.
                </h3>
                <p className="text-muted-foreground text-lg mb-8">
                  Tutorials, build logs, and raw learnings.
                </p>
                <span className={cn(typography.label.mono, "text-muted-foreground group-hover:text-foreground transition-colors")}>
                  START LEARNING &rarr;
                </span>
              </motion.a>
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              className={cn(
                typography.label.mono,
                "text-muted-foreground/50 text-center mt-12"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={createTransition(0.4, 0.4)}
            >
              <span className="hidden md:inline">ESC OR SCROLL BACK TO CLOSE</span>
              <span className="md:hidden">TAP OUTSIDE TO CLOSE</span>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
