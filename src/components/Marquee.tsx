"use client";

import { ReactNode } from "react";
import { components, cn } from "@/lib/design-system";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
}

export function Marquee({ children, reverse = false }: MarqueeProps) {
  return (
    <div className={components.marquee.container}>
      <div
        className={cn(
          components.marquee.content,
          reverse ? "flex-row-reverse" : "flex-row"
        )}
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
        {children}
        {children}
        {children}
      </div>
    </div>
  );
}
