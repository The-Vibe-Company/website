"use client";

import { useEffect, useRef } from "react";

// Loop arrows, the kit's round buttons: clay to go back, black lacquer with
// the orange rim to go on. Put them on one row under the track, so the cards
// start where the section title starts.
export const LOOP_PREV_CLASS = "round round-sm clay";
export const LOOP_NEXT_CLASS = "round round-sm lacquer rim";

/**
 * Copies of the card set rendered in the track. Only the middle one is in the
 * tab order and the accessibility tree (render the others with aria-hidden and
 * tabIndex={-1}), but every copy stays clickable: scrolling by hand can stop
 * with clone cards on screen, so never make them `inert`, which also drops
 * their clicks.
 */
export const LOOP_COPIES = [0, 1, 2] as const;

/** Width of one copy of the card set, or 0 before the track has laid out. */
function measureSetWidth(track: HTMLElement, setLen: number) {
  const cards = track.querySelectorAll<HTMLElement>("[data-card]");
  if (cards.length < setLen * 2) return 0;
  return cards[setLen].offsetLeft - cards[0].offsetLeft;
}

/**
 * A horizontal track scrolled by hand (trackpad or arrows) in an infinite loop
 * that wraps seamlessly in both directions. Nothing auto-scrolls. Render the
 * cards once per entry in LOOP_COPIES, each wrapped in a `[data-card]` element:
 * three identical copies give a full set of buffer on each side, and when the
 * scroll position drifts past a copy it jumps by exactly one set width onto
 * identical content, so the wrap is invisible.
 */
export function useLoopCarousel(setLen: number) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const setWidth = () => measureSetWidth(track, setLen);

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
          // Wrap two cards (plus rounding) beyond the band scrollByCard keeps
          // the track in. Its animations start inside the band and end less
          // than two cards past it; wrapping any closer cancelled them
          // mid-flight, the next click jumped straight back, and a quick
          // series of clicks left the track stuck between two cards with
          // dead arrows.
          const margin = (2 * w) / setLen + 2;
          if (track.scrollLeft < w * 0.5 - margin) track.scrollLeft += w;
          else if (track.scrollLeft > w * 1.5 + margin) track.scrollLeft -= w;
        }
        ticking = false;
      });
    };

    // Re-centre only when the track's width changes: a phone fires resize
    // whenever its address bar folds or unfolds, and that must not send a
    // swiped carousel back to its first card.
    let lastWidth = track.clientWidth;
    const onResize = () => {
      if (track.clientWidth === lastWidth) return;
      lastWidth = track.clientWidth;
      init();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [setLen]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Measured rather than passed in, so it can never drift from the CSS gap,
    // and to the subpixel: offsetLeft rounds, which crept half a pixel out of
    // line per click on fractional card widths.
    const cards = track.querySelectorAll<HTMLElement>("[data-card]");
    const amount =
      cards.length > 1
        ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
        : track.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Wrap *before* animating, and on where the track is rather than where it
    // is going: bring it back into the middle copy first (identical content,
    // so the jump is invisible; it also stops any animation in flight, which
    // the smooth scroll below picks up from there). The destination then lies
    // less than two cards outside the band, where onScroll leaves it alone, so
    // nothing wraps mid-animation and swallows the click.
    const w = measureSetWidth(track, setLen);
    if (w > 0) {
      if (track.scrollLeft < w * 0.5) track.scrollLeft += w;
      else if (track.scrollLeft >= w * 1.5) track.scrollLeft -= w;
    }
    // Step from a card position, not from scrollLeft: browsers round scroll
    // offsets to whole pixels, so adding a fractional step to the rounded
    // offset crept half a pixel out of line on every click. The card behind
    // the leading edge is taken in the direction of travel, so a click landing
    // mid-animation still moves one card further instead of re-targeting the
    // card already on its way.
    const position = track.scrollLeft / amount;
    const from = direction > 0 ? Math.ceil(position - 0.1) : Math.floor(position + 0.1);
    track.scrollTo({
      left: (from + direction) * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return { trackRef, scrollByCard };
}
