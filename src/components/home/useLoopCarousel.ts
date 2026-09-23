"use client";

import { useEffect, useRef } from "react";

// Loop arrows: grey frame, orange Lucide arrow (centers cleanly), fills orange
// on hover — a cue that there are more cards to scroll to left and right.
export const LOOP_ARROW_CLASS =
  "hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center self-center border-2 border-border text-orange-500 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-background sm:flex";

/** Copies of the card set rendered in the track; only the middle one is interactive. */
export const LOOP_COPIES = [0, 1, 2] as const;

/**
 * A horizontal track scrolled by hand (trackpad or arrows) in an infinite loop
 * that wraps seamlessly in both directions. Nothing auto-scrolls. Render the
 * cards once per entry in LOOP_COPIES, each wrapped in a `[data-card]` element:
 * three identical copies give a full set of buffer on each side, and when the
 * scroll position drifts past a copy it jumps by exactly one set width onto
 * identical content, so the wrap is invisible.
 */
export function useLoopCarousel(setLen: number, gap: number) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const setWidth = () => {
      const cards = track.querySelectorAll<HTMLElement>("[data-card]");
      if (cards.length < setLen * 2) return 0;
      return cards[setLen].offsetLeft - cards[0].offsetLeft;
    };

    // Start in the middle copy so there is room to scroll left immediately.
    const init = () => {
      const w = setWidth();
      if (w > 0) track.scrollLeft = w;
    };
    init();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const w = setWidth();
        if (w > 0) {
          if (track.scrollLeft < w * 0.5) track.scrollLeft += w;
          else if (track.scrollLeft > w * 1.5) track.scrollLeft -= w;
        }
        ticking = false;
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", init);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", init);
    };
  }, [setLen]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return { trackRef, scrollByCard };
}
