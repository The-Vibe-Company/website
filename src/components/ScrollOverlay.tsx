"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl overflow-y-auto"
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
            className={cn("w-full max-w-5xl mx-auto py-20 md:py-0", spacing.page.x)}
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
                "text-muted-foreground text-center mb-6 md:mb-10"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={createTransition(0.4, 0.1)}
            >
              WHERE TO NEXT?
            </motion.p>

            {/* Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ staggerChildren: 0.08, delayChildren: 0.15 }}
            >
              {/* Portfolio Card (white) */}
              <motion.div
                variants={cardVariants}
                transition={animations.easing.spring}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "10px 10px 0px 0px rgba(0,0,0,0.75)",
                }}
                className="relative overflow-hidden border-2 border-foreground bg-background group min-h-[520px]"
              >
                <Link href="/portfolio" className="flex h-full flex-col p-6 md:p-10">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-zinc-900/10" />
                  <div className="flex items-center justify-between mb-8 md:mb-16">
                    <span className={cn(typography.label.mono, "text-muted-foreground")}>
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
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                  <h3 className={cn(typography.heading.h3, "mb-2")}>
                    What we built.
                  </h3>
                  <p className="text-muted-foreground text-lg mb-8">
                    Product showcase with distinct identities.
                  </p>
                  <span className={cn(typography.label.mono, "mt-auto text-muted-foreground group-hover:text-foreground transition-colors")}>
                    SEE OUR WORK &rarr;
                  </span>
                </Link>
              </motion.div>

              {/* Resources Card (gray) */}
              <motion.div
                variants={cardVariants}
                transition={animations.easing.spring}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "10px 10px 0px 0px rgba(70,70,70,0.4)",
                }}
                className="relative overflow-hidden border border-zinc-600 bg-zinc-800 text-zinc-100 group min-h-[520px]"
              >
                <Link href="/resources" className="flex h-full flex-col p-6 md:p-10">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-white/8" />
                  <div className="flex items-center justify-between mb-8 md:mb-16">
                    <span className={cn(typography.label.mono, "text-zinc-300")}>
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
                      className="text-zinc-300 group-hover:text-zinc-50 transition-colors"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                  <h3 className={cn(typography.heading.h3, "mb-2 text-zinc-100")}>
                    What we learned.
                  </h3>
                  <p className="text-zinc-200/85 text-lg mb-8">
                    Tutorials, build logs, and raw learnings.
                  </p>
                  <span className={cn(typography.label.mono, "mt-auto text-zinc-300 group-hover:text-zinc-50 transition-colors")}>
                    START LEARNING &rarr;
                  </span>
                </Link>
              </motion.div>

              {/* Agency Card (dark) */}
              <motion.div
                variants={cardVariants}
                transition={animations.easing.spring}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "10px 10px 0px 0px rgba(105,105,105,0.45)",
                }}
                className="relative overflow-hidden bg-foreground text-background border border-zinc-700 group min-h-[520px]"
              >
                <Link href="/agency" className="flex h-full flex-col p-6 md:p-10">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-white/10" />
                  <div className="flex items-center justify-between mb-8 md:mb-16">
                    <span className={cn(typography.label.mono, "text-background/50")}>
                      03
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
                    Who are we.
                  </h3>
                  <p className="text-background/60 text-lg mb-8">
                    A tiny team shipping fast, loudly, and in public.
                  </p>
                  <span className={cn(typography.label.mono, "mt-auto text-background/40 group-hover:text-background/70 transition-colors")}>
                    MEET THE TEAM &rarr;
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              className={cn(
                typography.label.mono,
                "text-muted-foreground/50 text-center mt-6 md:mt-12"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={createTransition(0.4, 0.4)}
            >
              <span className="hidden md:inline">ESC OR SCROLL BACK TO CLOSE</span>
              <span className="md:hidden">SWIPE DOWN TO CLOSE</span>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
