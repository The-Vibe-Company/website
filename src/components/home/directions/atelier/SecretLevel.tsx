"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import type { RunnerItem } from "@/lib/runner-worlds";

/** The game and its audio stay out of the page's bundle until it is found. */
const HeroRunner = dynamic(() => import("../../HeroRunner").then((m) => m.HeroRunner), { ssr: false });

/** Where the level opens from, in viewport pixels, and how far it has to
 *  grow to cover the screen from there. */
export type Origin = { x: number; y: number; r: number };

const COPY = {
  fr: { kicker: "Niveau secret", title: "Battez votre record, l’audit est offert.", close: "Échap" },
  en: { kicker: "Secret level", title: "Beat your record, the audit is on us.", close: "Esc" },
} as const;

/**
 * The hidden game: a full-screen ink level that opens out of the mascot when
 * it jumps, and closes back into it. Escape or the close button leaves; the
 * page underneath does not scroll while it is open.
 */
export function SecretLevel({
  open,
  origin,
  items,
  onClose,
}: {
  open: boolean;
  origin: Origin;
  items: RunnerItem[];
  onClose: () => void;
}) {
  const copy = COPY[useLocale() === "en" ? "en" : "fr"];
  const reduceMotion = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    // The dialog takes the focus, not the close button: with a button
    // focused, the space bar would press it instead of jumping.
    dialogRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const at = `${origin.x}px ${origin.y}px`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-level-title"
          tabIndex={-1}
          initial={{ clipPath: `circle(0px at ${at})` }}
          animate={{ clipPath: `circle(${origin.r}px at ${at})` }}
          exit={{ clipPath: `circle(0px at ${at})` }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[80] flex flex-col bg-background outline-none"
        >
          {/* The portal glows where the mascot went in, then settles. */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.4, delay: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(520px circle at ${at}, rgb(242 115 19 / 0.4), rgb(242 115 19 / 0.08) 55%, transparent)` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[75vh]"
            style={{
              background: "radial-gradient(60% 70% at 50% 100%, rgb(242 115 19 / 0.22), rgb(242 115 19 / 0.05) 55%, transparent)",
            }}
          />

          <div className="relative mx-auto flex w-full max-w-[90rem] items-center justify-between gap-10 px-16 pt-10">
            <p className="m-0 font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
              <BrandSquare />
              {copy.kicker}
            </p>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onClose}
              className="inline-flex shrink-0 cursor-pointer items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground transition-colors hover:text-foreground"
            >
              {copy.close}
              <span aria-hidden="true" className="text-[16px] leading-none">
                ×
              </span>
            </button>
          </div>

          <div className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center px-16 pb-24">
            <h2
              id="secret-level-title"
              className="m-0 text-[clamp(2.5rem,4.6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-foreground"
            >
              {copy.title}
            </h2>
            <div className="mt-12">
              {/* The run starts once the portal has opened, with the mascot
                  that just jumped in as the runner. */}
              <HeroRunner items={items} autoStart={900} player="mascot" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
