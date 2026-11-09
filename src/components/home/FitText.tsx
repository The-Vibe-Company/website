"use client";

import { createContext, useContext, useLayoutEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/design-system";

/**
 * Advance widths of Geist ExtraBold, in thousandths of an em, measured in the
 * browser (canvas `measureText` at 1000px). Accented letters share their base
 * letter's advance, so they are looked up through it.
 */
const ADVANCE: Record<string, number> = {
  A: 750, B: 710, C: 745, D: 723, E: 628, F: 609, G: 751, H: 724, I: 310, J: 637, K: 705, L: 592, M: 927,
  N: 753, O: 788, P: 679, Q: 781, R: 706, S: 695, T: 615, U: 708, V: 751, W: 1038, X: 715, Y: 650, Z: 610,
  a: 609, b: 647, c: 615, d: 647, e: 620, f: 464, g: 647, h: 621, i: 294, j: 355, k: 666, l: 328, m: 907,
  n: 621, o: 633, p: 647, q: 647, r: 440, s: 586, t: 462, u: 618, v: 633, w: 859, x: 671, y: 603, z: 598,
  "0": 703, "1": 470, "2": 665, "3": 662, "4": 670, "5": 686, "6": 638, "7": 551, "8": 684, "9": 643,
  " ": 221, ".": 248, ",": 248, ";": 315, ":": 315, "!": 272, "?": 602, "'": 212, "’": 261, "-": 417,
  "–": 597, "—": 913, "&": 734, "(": 339, ")": 339, "/": 536, "«": 682, "»": 695, '"': 405, "%": 833,
  "+": 574, "@": 981,
};

/** Kerning tightens a heavy line by about 1.8% against the sum of its advances. */
const KERNING = 0.982;

/** The poster callers set `tracking-[-1px]`, applied after every glyph. */
const TRACKING_PX = -1;

/** Width of `text` set at 1em, in em: what the server sizes the line from. */
export function emWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    width += ADVANCE[char] ?? ADVANCE[char.normalize("NFD")[0]] ?? 600;
  }
  return (width / 1000) * KERNING;
}

/**
 * Lines that must read as a set (the figures of a row of cards) share one
 * size: the largest at which every one of them still fits its own box on one
 * line. Each line measures its own fit; the group applies the smallest.
 */
interface FitGroup {
  /** The member that sets the server estimate: the widest text. */
  longest: string;
  report: (el: HTMLElement, size: number) => void;
  leave: (el: HTMLElement) => void;
}

const FitGroupContext = createContext<FitGroup | null>(null);

export function FitTextGroup({ texts, children }: { texts: string[]; children: ReactNode }) {
  const key = texts.join("\n");
  const group = useMemo<FitGroup>(() => {
    const sizes = new Map<HTMLElement, number>();
    const apply = () => {
      if (!sizes.size) return;
      const size = Math.min(...sizes.values());
      for (const el of sizes.keys()) el.style.fontSize = `${size}px`;
    };
    return {
      longest: key.split("\n").reduce((a, b) => (emWidth(b) > emWidth(a) ? b : a), ""),
      report(el, size) {
        sizes.set(el, size);
        apply();
      },
      leave(el) {
        sizes.delete(el);
        apply();
      },
    };
  }, [key]);
  return <FitGroupContext.Provider value={group}>{children}</FitGroupContext.Provider>;
}

/**
 * One line of display type sized to fill its container's width exactly, the
 * way a poster sets its headline. The parent must be a padding-free block with
 * `container-type: inline-size`: the server renders an estimate in container
 * units from the glyphs' advance widths, so the line arrives at its final size,
 * then the client measures it once the fonts are in and on every width change.
 */
export function FitText({
  children,
  max,
  trackingEm,
  className,
  style,
}: {
  children: string;
  /** Cap in px, for short lines that would otherwise fill the page. */
  max?: number;
  /**
   * Letter-spacing in em, for a line tracked in em rather than the posters'
   * -1px. It is applied here so the server estimate accounts for it.
   */
  trackingEm?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const group = useContext(FitGroupContext);

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;

    let lastWidth = -1;
    const fit = (force = false) => {
      const target = box.clientWidth;
      // Resizing the type changes the box's height, which calls this again:
      // only a new width is worth a re-measure.
      if (!target || (!force && target === lastWidth)) return;
      lastWidth = target;
      el.style.fontSize = "100px";
      const natural = el.getBoundingClientRect().width;
      if (!natural) return;
      const fitted = (100 * target) / natural;
      const size = max ? Math.min(max, fitted) : fitted;
      if (group) group.report(el, size);
      else el.style.fontSize = `${size}px`;
    };

    fit(true);
    document.fonts?.ready.then(() => fit(true));
    // Measured on the next frame rather than inside the callback: resizing the
    // type there changes the observed box again mid-delivery, which the
    // browser reports as a ResizeObserver loop error.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fit());
    });
    observer.observe(box);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      group?.leave(el);
    };
  }, [children, max, group]);

  // A flat 0.56em per glyph used to be the estimate. It held for "We build"
  // but not for French: on a 412px phone it set "Agence" at 108px (it fits at
  // 97, so it ran off the screen) and the narrow glyphs of "IA-First." at
  // 72px (it fits at 91), and hydration had to re-set the whole poster.
  // Summing the real advances lands within about 1%.
  // In a group, every line arrives at the size of the widest one.
  const sized = group?.longest || children;
  const glyphs = [...sized].length;
  const estimate =
    trackingEm === undefined
      ? `calc((100cqw + ${-TRACKING_PX * glyphs}px) / ${emWidth(sized).toFixed(4)})`
      : `calc(100cqw / ${(emWidth(sized) + trackingEm * glyphs).toFixed(4)})`;

  return (
    <span
      ref={ref}
      className={cn("block w-max whitespace-nowrap", className)}
      style={{
        fontSize: max ? `min(${max}px, ${estimate})` : estimate,
        ...(trackingEm === undefined ? null : { letterSpacing: `${trackingEm}em` }),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
