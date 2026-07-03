"use client";

import { Fragment, ReactNode } from "react";
import { components, cn } from "@/lib/design-system";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
}

/**
 * Enough content copies that half the track (the distance scrolled before the
 * seamless `translateX(-50%)` reset) covers even ultrawide / 4K viewports, so
 * the band never shows a gap. Fixed and pure-CSS on purpose: nothing is
 * recomputed at runtime, so the animation never restarts mid-scroll. The two
 * halves of the track are identical, so the -50% reset is invisible and the
 * loop runs forever without a seam.
 */
const COPIES = 8;

export function Marquee({ children, reverse = false }: MarqueeProps) {
  return (
    <div className={components.marquee.container}>
      <div
        className={cn(
          components.marquee.content,
          // Take the full content width instead of being shrunk by the flex
          // container, so translateX(-50%) lands exactly on the track's midpoint
          // (a whole number of copies) and the loop resets with no visible jump.
          "w-max shrink-0",
          reverse ? "flex-row-reverse" : "flex-row"
        )}
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          // COPIES doubles the original 4-copy track, so the duration doubles
          // too (20s -> 40s) to keep the same on-screen scroll speed.
          animationDuration: "40s",
        }}
      >
        {Array.from({ length: COPIES }, (_, index) => (
          <Fragment key={index}>{children}</Fragment>
        ))}
      </div>
    </div>
  );
}
