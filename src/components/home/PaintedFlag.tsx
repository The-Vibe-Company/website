"use client";

import { useEffect } from "react";

/**
 * Sets `data-painted` on <html> once the page's first frame is out: two
 * animation frames after hydration, so the frame that carries the hero has
 * been produced. globals.css holds back, until then, the two decorations that
 * weigh most on that first frame without being part of it: the homepage film
 * grain (a full-screen blended layer) and the mascot's float (an animation
 * that lifts the picture onto a layer of its own). On a slow GPU, Lighthouse's
 * software one included, drawing them delayed the first paint, and with it the
 * mascot, the phones' largest contentful paint.
 */
export function PaintedFlag() {
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => document.documentElement.setAttribute("data-painted", ""));
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
