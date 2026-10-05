"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/design-system";

/** Average advance of one glyph, in em, for heavy Geist at poster tracking. */
const EM_PER_CHAR = 0.56;

/**
 * One line of display type sized to fill its container's width exactly, the
 * way a poster sets its headline. The parent must be a padding-free block with
 * `container-type: inline-size`: the server renders an estimate in container
 * units from the character count, so the line arrives close to its final size,
 * then the client measures it once the fonts are in and on every width change.
 */
export function FitText({
  children,
  max,
  className,
  style,
}: {
  children: string;
  /** Cap in px, for short lines that would otherwise fill the page. */
  max?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

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
      const size = (100 * target) / natural;
      el.style.fontSize = `${max ? Math.min(max, size) : size}px`;
    };

    fit(true);
    document.fonts?.ready.then(() => fit(true));
    const observer = new ResizeObserver(() => fit());
    observer.observe(box);
    return () => observer.disconnect();
  }, [children, max]);

  const estimate = `calc(100cqw / ${(children.length * EM_PER_CHAR).toFixed(2)})`;

  return (
    <span
      ref={ref}
      className={cn("block w-max whitespace-nowrap", className)}
      style={{ fontSize: max ? `min(${max}px, ${estimate})` : estimate, ...style }}
    >
      {children}
    </span>
  );
}
