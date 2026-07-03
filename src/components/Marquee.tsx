"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { components, cn } from "@/lib/design-system";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  /** Scroll speed in pixels per second, kept constant across screen widths. */
  speed?: number;
}

/**
 * Number of content copies so that half the track (the distance scrolled
 * before the seamless `translateX(-50%)` reset) always covers the viewport,
 * plus one unit of headroom, on any screen width. Kept even so the reset
 * lands exactly on a unit boundary and the loop never shows a seam or a gap.
 */
function neededCopies(unitWidth: number, viewport: number): number {
  if (unitWidth <= 0) return 4;
  const halfUnits = Math.ceil(viewport / unitWidth) + 1;
  return Math.max(4, halfUnits * 2);
}

export function Marquee({ children, reverse = false, speed = 140 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(6);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const unit = unitRef.current;
    if (!container || !unit) return;

    const recompute = () => {
      const unitWidth = unit.getBoundingClientRect().width;
      const viewport = container.clientWidth;
      if (unitWidth <= 0) return;
      const nextCopies = neededCopies(unitWidth, viewport);
      setCopies(nextCopies);
      // Constant speed: distance per cycle = half the track = (copies / 2) * unit.
      setDuration(((nextCopies / 2) * unitWidth) / speed);
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    observer.observe(unit);
    return () => observer.disconnect();
  }, [children, speed]);

  return (
    <div ref={containerRef} className={components.marquee.container}>
      <div
        className={components.marquee.content}
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          ...(duration != null ? { animationDuration: `${duration}s` } : {}),
        }}
      >
        {Array.from({ length: copies }).map((_, index) => (
          <div
            key={index}
            ref={index === 0 ? unitRef : undefined}
            className={cn("flex shrink-0", reverse ? "flex-row-reverse" : "flex-row")}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
