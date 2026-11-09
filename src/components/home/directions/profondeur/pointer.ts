"use client";

import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect } from "react";

/**
 * One shared pointer position for the whole direction, normalised to -1..1
 * from the centre of the window. Every layer reads it with its own depth, so
 * near things travel further than far ones: that difference is the parallax.
 */
const state = { x: 0, y: 0 };
const listeners = new Set<() => void>();
let bound = false;

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      state.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.y = (event.clientY / window.innerHeight) * 2 - 1;
      listeners.forEach((fn) => fn());
    },
    { passive: true },
  );
}

/** The raw shared position, for canvas loops that ease it themselves. */
export function readPointer() {
  bind();
  return state;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Sprung pointer values (-1..1) for framer-motion styles. Still under reduced motion. */
export function usePointer(stiffness = 60, damping = 18): { x: MotionValue<number>; y: MotionValue<number> } {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping, mass: 0.6 });
  const y = useSpring(rawY, { stiffness, damping, mass: 0.6 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    bind();
    const update = () => {
      rawX.set(state.x);
      rawY.set(state.y);
    };
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, [rawX, rawY]);

  return { x, y };
}
