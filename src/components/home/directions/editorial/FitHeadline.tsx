"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/design-system";
import { SERIF } from "./fonts";

/**
 * Width of each headline at 1em, Geist head plus serif tail, measured in the
 * browser: what the server sizes the line from before the client measures it.
 */
const ESTIMATE_EM: Record<string, number> = {
  "Agence IA-First.": 6.91,
  "We build your product,": 9.43,
};

/** Splits a headline before its last word, which is set in the serif. */
export function splitLastWord(text: string): [string, string] {
  const cut = Math.max(text.lastIndexOf(" "), text.lastIndexOf("-")) + 1;
  return cut > 0 ? [text.slice(0, cut), text.slice(cut)] : ["", text];
}

/**
 * The hero headline on one line filling its container exactly, like the shared
 * FitText, but in two voices: Geist bold, then the last word in the serif
 * italic. The parent must be a padding-free block with container-type set.
 */
export function FitHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [head, tail] = splitLastWord(text);

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
  }, [text]);

  const estimate = ESTIMATE_EM[text] ?? text.length * 0.5;

  return (
    <span
      ref={ref}
      className={cn("block w-max whitespace-nowrap tracking-[-0.055em]", className)}
      style={{ fontSize: `calc(100cqw / ${estimate})` }}
    >
      {head}
      <span className={`${SERIF} pr-[0.05em] tracking-[-0.03em]`}>{tail}</span>
    </span>
  );
}
