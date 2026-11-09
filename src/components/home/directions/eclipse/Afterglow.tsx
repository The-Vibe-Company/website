"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * The light after the sun has set. A layer pinned to the viewport behind the
 * sections between the hero and the dawn glows up from the bottom of the
 * screen, and its temperature follows the scroll: orange afterglow under the
 * cases, deep ember under the quote and services, almost nothing at night.
 * Pinned with `sticky` inside this wrapper, so it ends with it. With reduced
 * motion a steady afterglow stays (set in CSS, so server and client agree).
 */
export function Afterglow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const afterglow = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 0.85, 0]);
  const ember = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0.15]);
  const night = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen overflow-hidden">
        <motion.div
          style={{ opacity: afterglow }}
          className="absolute inset-x-0 bottom-0 h-[75%] motion-reduce:opacity-70! bg-[radial-gradient(75%_100%_at_50%_100%,rgba(242,115,19,0.26),rgba(242,115,19,0.07)_50%,transparent_80%)]"
        />
        <motion.div
          style={{ opacity: ember }}
          className="absolute inset-x-0 bottom-0 h-[65%] motion-reduce:opacity-0! bg-[radial-gradient(80%_100%_at_50%_100%,rgba(176,38,8,0.3),rgba(120,20,4,0.08)_55%,transparent_80%)]"
        />
        <motion.div
          style={{ opacity: night }}
          className="absolute inset-x-0 bottom-0 h-[40%] motion-reduce:opacity-0! bg-[radial-gradient(60%_100%_at_50%_100%,rgba(120,30,6,0.18),transparent_75%)]"
        />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
