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

type NavCardTheme = "light" | "gray" | "dark";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

const navCardThemeClasses: Record<
  NavCardTheme,
  {
    card: string;
    topLine: string;
    number: string;
    icon: string;
    title: string;
    description: string;
    cta: string;
    defaultShadow: string;
  }
> = {
  light: {
    card: "relative h-full overflow-hidden border-2 border-foreground bg-background group min-h-0 md:min-h-[520px]",
    topLine: "absolute inset-x-0 top-0 h-[2px] bg-zinc-900/10",
    number: "text-muted-foreground",
    icon: "text-muted-foreground group-hover:text-foreground transition-colors",
    title: "mb-2",
    description: "text-muted-foreground text-lg mb-8",
    cta: "mt-auto text-muted-foreground group-hover:text-foreground transition-colors",
    defaultShadow: "10px 10px 0px 0px rgba(0,0,0,0.75)",
  },
  gray: {
    card: "relative h-full overflow-hidden border border-zinc-600 bg-zinc-800 text-zinc-100 group min-h-0 md:min-h-[520px]",
    topLine: "absolute inset-x-0 top-0 h-[1px] bg-white/8",
    number: "text-zinc-300",
    icon: "text-zinc-300 group-hover:text-zinc-50 transition-colors",
    title: "mb-2 text-zinc-100",
    description: "text-zinc-200/85 text-lg mb-8",
    cta: "mt-auto text-zinc-300 group-hover:text-zinc-50 transition-colors",
    defaultShadow: "10px 10px 0px 0px rgba(70,70,70,0.4)",
  },
  dark: {
    card: "relative h-full overflow-hidden bg-foreground text-background border border-zinc-700 group min-h-0 md:min-h-[520px]",
    topLine: "absolute inset-x-0 top-0 h-[2px] bg-white/10",
    number: "text-background/50",
    icon: "text-background/30 group-hover:text-background/60 transition-colors",
    title: "text-background mb-2",
    description: "text-background/60 text-lg mb-8",
    cta: "mt-auto text-background/40 group-hover:text-background/70 transition-colors",
    defaultShadow: "10px 10px 0px 0px rgba(105,105,105,0.45)",
  },
};

interface NavCardProps {
  href: string;
  number: string;
  title: string;
  description: string;
  cta: string;
  theme: NavCardTheme;
  shadow?: string;
  className?: string;
}

function NavCard({
  href,
  number,
  title,
  description,
  cta,
  theme,
  shadow,
  className,
}: NavCardProps) {
  const styles = navCardThemeClasses[theme];

  return (
    <motion.div
      variants={cardVariants}
      transition={animations.easing.spring}
      whileHover={{
        scale: 1.02,
        boxShadow: shadow ?? styles.defaultShadow,
      }}
      className={cn(styles.card, className)}
    >
      <Link href={href} className="flex h-full flex-col p-3 md:p-10">
        <div className={styles.topLine} />
        <div className="flex items-center justify-between mb-3 md:mb-16">
          <span className={cn(typography.label.mono, styles.number)}>
            {number}
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
            className={styles.icon}
            aria-hidden="true"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
        <h3 className={cn(typography.heading.h3, "text-base md:text-3xl lg:text-4xl", styles.title)}>
          {title}
        </h3>
        <p className={cn(styles.description, "hidden md:block")}>{description}</p>
        <span className={cn(typography.label.mono, styles.cta)}>
          {cta} &rarr;
        </span>
      </Link>
    </motion.div>
  );
}

export function ScrollOverlay({ isOpen, onClose }: ScrollOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-x-0 bottom-0 top-16 md:inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl overflow-hidden md:overflow-y-auto"
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
            className={cn("w-full max-w-5xl mx-auto h-full md:h-auto py-2 md:py-0 flex flex-col", spacing.page.x)}
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
                "text-muted-foreground text-center mb-2 md:mb-10"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={createTransition(0.4, 0.1)}
            >
              WHERE TO NEXT?
            </motion.p>

            {/* Cards */}
            <motion.div
              className="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-2 md:gap-6 flex-1 min-h-0 overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ staggerChildren: 0.08, delayChildren: 0.15 }}
            >
              <NavCard
                href="/portfolio"
                number="01"
                title="What we built."
                description="Product showcase with distinct identities."
                cta="SEE OUR WORK"
                theme="light"
              />
              <NavCard
                href="/resources"
                number="02"
                title="What we learned."
                description="Tutorials, build logs, and raw learnings."
                cta="START LEARNING"
                theme="gray"
              />
              <NavCard
                href="/agency"
                number="03"
                title="Who we are."
                description="A tiny team shipping fast, loudly, and in public."
                cta="MEET THE TEAM"
                theme="dark"
              />
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              className={cn(
                typography.label.mono,
                "text-muted-foreground/50 text-center mt-2 md:mt-12"
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
