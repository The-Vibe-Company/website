"use client";

import { useEffect } from "react";

/**
 * The homepage's small motion layer, wired once for the whole page so the
 * sections only carry a class or a data attribute:
 *
 * - `.vc-spotlight` cards get a glow that follows a mouse pointer (delegated
 *   listeners, written at most once a frame), kept under the pointer when the
 *   page scrolls beneath a still mouse;
 * - `[data-reveal]` blocks still below the fold on load fade up as they come
 *   into view. Blocks already on screen are never touched, so nothing visible
 *   ever blinks out, and without JavaScript nothing is hidden at all;
 * - the hero's drifting light pauses while the hero is off screen.
 *
 * The styles are in globals.css ("Homepage motion").
 */
export function HomeMotion() {
  useEffect(() => {
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const paint = () => {
      frame = 0;
      if (!pointer) return;
      // Hit-tested rather than taken from the event target, so a scroll moving
      // a card under a still pointer lands on the right card too.
      const card = document.elementFromPoint(pointer.x, pointer.y)?.closest<HTMLElement>(".vc-spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${pointer.x - rect.left}px`);
      card.style.setProperty("--spot-y", `${pointer.y - rect.top}px`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const onScroll = () => {
      if (pointer) schedule();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    // Capture, so the horizontal carousels' own scrolling counts as well.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    const observers: IntersectionObserver[] = [];

    const aurora = document.querySelector<HTMLElement>("[data-hero-aurora]");
    if (aurora) {
      const pause = new IntersectionObserver((entries) => {
        const latest = entries[entries.length - 1];
        aurora.toggleAttribute("data-offscreen", !latest.isIntersecting);
      });
      pause.observe(aurora);
      observers.push(pause);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.reveal = "shown";
            reveal.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
        // Hidden blocks (display: none) report a zero rect and are left alone.
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.dataset.reveal = "pending";
          reveal.observe(el);
        }
      }
      observers.push(reveal);
    }

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("scroll", onScroll, { capture: true });
      cancelAnimationFrame(frame);
      for (const observer of observers) observer.disconnect();
    };
  }, []);

  return null;
}
