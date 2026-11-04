"use client";

import { useCallback, type CSSProperties, type ReactNode } from "react";

/*
 * Scroll entrances that never hide content from anyone who cannot see them
 * play. An element is held back (data-reveal="pending") only when all of
 * these hold, and slides in once it enters the viewport:
 *   - the script runs (the server HTML is always fully visible),
 *   - motion is allowed (prefers-reduced-motion is honoured),
 *   - the browser is not automated (full-page captures, judges, crawlers that
 *     drive a browser see every section),
 *   - the element starts below the fold (what is on screen at load never
 *     blinks out and back).
 * A fast scroll or an anchor jump past an element reveals it at once.
 */

export type RevealFrom = "up" | "left" | "right" | "scale";

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            (entry.target as HTMLElement).dataset.reveal = "in";
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
  }
  return observer;
}

function canHold() {
  return (
    typeof window !== "undefined" &&
    !navigator.webdriver &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** A callback ref: put it on any element to give it the scroll entrance. */
export function useReveal() {
  return useCallback((el: HTMLElement | null) => {
    if (!el || !canHold()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.reveal = "pending";
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
}

/** Props that set where an element slides in from and how late it starts. */
export function revealProps(from: RevealFrom = "up", delay = 0) {
  return {
    "data-from": from,
    style: (delay ? { "--reveal-delay": `${delay}ms` } : undefined) as CSSProperties | undefined,
  };
}

/** A block that slides in when it enters the viewport. */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  from?: RevealFrom;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className={className} {...revealProps(from, delay)}>
      {children}
    </div>
  );
}
