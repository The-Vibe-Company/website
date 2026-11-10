"use client";

import { useEffect, useRef, type ReactNode } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const HIDDEN = { opacity: "0", transform: "translateY(24px)" };
const SHOWN = { opacity: "1", transform: "none" };

/**
 * A list item that rises into place the first time a fifth of it is on
 * screen (shown at once with reduced motion). It starts and ends on the same
 * inline styles framer-motion's `whileInView` used, with a Web Animation in
 * between, so the offers no longer ship framer-motion.
 */
export function RevealItem({
  delay = 0,
  className,
  children,
}: {
  /** Seconds, like the stagger it replaces. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => Object.assign(el.style, SHOWN);
    if (window.matchMedia(REDUCED).matches || typeof IntersectionObserver === "undefined") {
      show();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        el.animate([HIDDEN, SHOWN], {
          duration: 700,
          delay: delay * 1000,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards",
        });
        show();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <li ref={ref} className={className} style={{ opacity: 0, transform: "translateY(24px)" }}>
      {children}
    </li>
  );
}
