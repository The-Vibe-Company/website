"use client";

import { ReactNode } from "react";

export function Marquee({ children, reverse = false }: { children: ReactNode; reverse?: boolean }) {
    return (
        <div className="relative flex overflow-hidden w-full border-y border-border/50 bg-background/50 backdrop-blur-sm select-none">
            <div
                className={`animate-marquee flex gap-8 py-3 items-center ${reverse ? "flex-row-reverse" : "flex-row"}`}
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
