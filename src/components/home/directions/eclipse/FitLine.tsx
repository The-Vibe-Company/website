"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/design-system";

/**
 * Advance widths of Darker Grotesque Black (900), in thousandths of an em,
 * measured in the browser with canvas `measureText` at 1000px. Used only for
 * the server estimate; the client measures the real line once fonts are in.
 */
const ADVANCE: Record<string, number> = {};
const FALLBACK = 520;

function emWidth(text: string, tracking: number) {
  let width = 0;
  for (const char of text) width += (ADVANCE[char] ?? ADVANCE[char.normalize("NFD")[0]] ?? FALLBACK) + tracking * 1000;
  return width / 1000;
}

/**
 * One line of display type set to fill its container's width exactly. The
 * parent must be a padding-free block with `container-type: inline-size`.
 */
export function FitLine({
  children,
  tracking = 0,
  className,
  style,
}: {
  children: string;
  /** Letter-spacing in em. */
  tracking?: number;
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
      if (!target || (!force && target === lastWidth)) return;
      lastWidth = target;
      el.style.fontSize = "100px";
      const natural = el.getBoundingClientRect().width;
      if (natural) el.style.fontSize = `${(100 * target) / natural}px`;
    };
    fit(true);
    document.fonts?.ready.then(() => fit(true));
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fit());
    });
    observer.observe(box);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [children]);

  return (
    <span
      ref={ref}
      // transition-none: the site's reduced-motion rule gives everything a
      // 0.01ms transition, which breaks the synchronous re-measure above.
      className={cn("block w-max whitespace-nowrap transition-none", className)}
      style={{
        fontSize: `calc(100cqw / ${emWidth(children, tracking).toFixed(4)})`,
        letterSpacing: `${tracking}em`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
