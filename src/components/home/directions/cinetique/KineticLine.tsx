"use client";

import { useReducedMotion, useScroll, useVelocity } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/design-system";

/**
 * Advance widths of Anybody ExtraBold at width 100%, in thousandths of an em,
 * measured in the browser. Accented letters share their base letter's advance.
 */
const ADVANCE: Record<string, number> = {
  A: 761, B: 710, C: 706, D: 702, E: 593, F: 552, G: 729, H: 722, I: 332, J: 700, K: 673, L: 539, M: 963,
  N: 831, O: 729, P: 676, Q: 730, R: 697, S: 710, T: 668, U: 732, V: 724, W: 1068, X: 725, Y: 741, Z: 610,
  a: 700, b: 698, c: 660, d: 703, e: 698, f: 526, g: 706, h: 690, i: 313, j: 328, k: 668, l: 312, m: 1014,
  n: 687, o: 700, p: 698, q: 699, r: 684, s: 690, t: 551, u: 686, v: 669, w: 1001, x: 689, y: 664, z: 574,
  "0": 640, "1": 603, "2": 654, "3": 654, "4": 647, "5": 646, "6": 652, "7": 586, "8": 644, "9": 653,
  " ": 260, ".": 262, ",": 329, ";": 314, ":": 267, "!": 285, "?": 659, "'": 196, "’": 216, "-": 479,
  "–": 537, "&": 847, "%": 784, "€": 692, "×": 328,
};

/** Kerning tightens a heavy line by about 1.1% against the sum of its advances. */
const KERNING = 0.989;

/**
 * Width of `text` set at 1em on the given width axis value. The face widens
 * almost linearly along the axis: 50% is 0.487 of the 100% line, 150% is 1.513.
 */
export function anybodyEm(text: string, stretch: number, trackingEm = 0): number {
  let width = 0;
  for (const char of text) {
    width += ADVANCE[char] ?? ADVANCE[char.normalize("NFD")[0]] ?? 680;
  }
  const glyphs = [...text].length;
  return (width / 1000) * KERNING * ((stretch - 2.6) / 97.4) + trackingEm * glyphs;
}

/**
 * One line of display type that fills its container's width, its letters
 * breathing in a slow wave along the width axis. Scrolling fast makes the wave
 * swell. The parent must be a padding-free block with
 * `container-type: inline-size`; the server sizes the line from the advance
 * table above so it lands at its final size, the client re-measures it.
 */
export function KineticLine({
  text,
  stretch = 75,
  amplitude = 14,
  fill = 0.965,
  trackingEm = -0.02,
  className,
}: {
  text: string;
  /** Resting position on the width axis, in %. */
  stretch?: number;
  /** How far each letter swings around it, in %. */
  amplitude?: number;
  /** Share of the container width the line fills at rest. */
  fill?: number;
  trackingEm?: number;
  className?: string;
}) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const letters = [...text];

  // Size the line to its container once fonts are in, and on every width change.
  useLayoutEffect(() => {
    const line = lineRef.current;
    const box = line?.parentElement;
    if (!line || !box) return;
    let lastWidth = -1;
    const fit = (force = false) => {
      const target = box.clientWidth;
      if (!target || (!force && target === lastWidth)) return;
      lastWidth = target;
      const spans = Array.from(line.children) as HTMLElement[];
      const saved = spans.map((s) => s.style.fontStretch);
      spans.forEach((s) => (s.style.fontStretch = `${stretch}%`));
      line.style.fontSize = "100px";
      const natural = line.offsetWidth;
      spans.forEach((s, i) => (s.style.fontStretch = saved[i]));
      if (natural) line.style.fontSize = `${(100 * target * fill) / natural}px`;
    };
    fit(true);
    // `fonts.ready` can resolve before this face has even started loading, so
    // ask for it by name and refit once it is in, and on any later swap.
    const refit = () => fit(true);
    const family = getComputedStyle(line).fontFamily;
    document.fonts?.load(`800 100px ${family}`).then(refit, () => {});
    document.fonts?.addEventListener("loadingdone", refit);
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fit());
    });
    observer.observe(box);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", refit);
      cancelAnimationFrame(frame);
    };
  }, [text, stretch, fill]);

  // The wave: each letter's width follows a sine, offset by its position.
  useEffect(() => {
    const line = lineRef.current;
    if (!line || reduceMotion) return;
    const spans = Array.from(line.children) as HTMLElement[];
    let frame = 0;
    let swell = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) frame = requestAnimationFrame(tick);
    });
    io.observe(line);
    const tick = (now: number) => {
      if (!visible || line.offsetParent === null) return;
      // Scroll speed swells the wave for a moment, then it settles back.
      const speed = Math.min(Math.abs(velocity.get()) / 2500, 1);
      swell += (speed - swell) * 0.08;
      const amp = amplitude * (1 + swell * 1.6);
      const t = now / 1000;
      spans.forEach((span, i) => {
        const value = stretch + amp * Math.sin(t * 1.3 - i * 0.42);
        span.style.fontStretch = `${value.toFixed(1)}%`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      spans.forEach((span) => (span.style.fontStretch = ""));
    };
  }, [amplitude, stretch, reduceMotion, velocity]);

  const em = anybodyEm(text, stretch, trackingEm);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        ref={lineRef}
        aria-hidden="true"
        // No transitions: the site's reduced-motion rule gives every element a
        // 0.01ms `transition: all`, which would make the synchronous re-measure
        // above read the size from before it was changed.
        className={cn("block w-max whitespace-nowrap transition-none [&>span]:transition-none", className)}
        style={{
          fontSize: `calc(100cqw * ${fill} / ${em.toFixed(4)})`,
          fontStretch: `${stretch}%`,
          letterSpacing: `${trackingEm}em`,
        }}
      >
        {letters.map((letter, i) => (
          <span key={i} style={{ fontStretch: `${stretch}%` }}>
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
    </>
  );
}
