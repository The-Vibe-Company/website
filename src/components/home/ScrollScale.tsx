"use client";

import { useEffect, useRef, type ReactNode } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Scales its contents as its parent section scrolls into view: `from` when
 * the section's top meets the bottom of the viewport, `to` when its bottom
 * does, and `still` throughout with reduced motion. The same scroll-linked
 * scale framer-motion's useScroll/useTransform drew, written straight to the
 * element so the closing scene no longer ships framer-motion.
 */
export function ScrollScale({
  from,
  to,
  still,
  className,
  children,
}: {
  from: number;
  to: number;
  still: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;
    const reduced = window.matchMedia(REDUCED);
    let frame = 0;
    // Only a changed value is written, so a still scene is never restyled.
    let current = el.style.transform;
    const update = () => {
      frame = 0;
      let scale = still;
      if (!reduced.matches) {
        const rect = section.getBoundingClientRect();
        const viewport = document.documentElement.clientHeight;
        const progress = rect.height > 0 ? Math.min(1, Math.max(0, (viewport - rect.top) / rect.height)) : 0;
        scale = from + (to - from) * progress;
      }
      const next = `scale(${scale})`;
      if (next === current) return;
      current = next;
      el.style.transform = next;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // First read on the next frame, not during hydration (no forced layout).
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [from, to, still]);

  return (
    <div ref={ref} aria-hidden="true" style={{ transform: `scale(${from})` }} className={className}>
      {children}
    </div>
  );
}
