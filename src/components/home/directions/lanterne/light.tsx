"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/design-system";
import s from "./lantern.module.css";

/** True once the element has come far enough into view; at once with reduced motion. */
export function useLitOnce<T extends Element>(amount = 0.35) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion() ?? false;
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    // Reduced motion: nothing waits to be lit, the stylesheet shows every
    // lit state from the start.
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, reduce]);
  // Never branches on reduced motion while rendering, so server and client
  // markup always match.
  return [ref, lit] as const;
}

/** Mono kicker opened by a glowing ember instead of the flat square. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]", className)}>
      <span aria-hidden="true" className={s.ember} />
      {children}
    </p>
  );
}

/**
 * A section title that catches one sweep of light as it scrolls in: the
 * first line in paper, the second in a warm falloff, as if lit from the left.
 */
export function LitTitle({
  line1,
  line2,
  className,
  as: Tag = "h2",
}: {
  line1: string;
  line2?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  const [ref, lit] = useLitOnce<HTMLHeadingElement>(0.6);
  return (
    <Tag
      ref={ref}
      className={cn(
        "m-0 font-[800] leading-[0.94] tracking-[-0.045em] text-[clamp(2.6rem,6.4vw,6.25rem)]",
        className,
      )}
    >
      <span className={cn("block pb-[0.08em]", s.sweep, lit && s.sweepOn)}>{line1}</span>
      {line2 ? (
        <span className={cn("-mt-[0.08em] block pb-[0.12em]", s.sweep, s.sweepWarm, lit && s.sweepOn)} style={{ animationDelay: "160ms" }}>
          {line2}
        </span>
      ) : null}
    </Tag>
  );
}

/** Pointer position inside the element, for a rim of light on the side it faces. */
export function trackRim(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--rx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--ry", `${e.clientY - r.top}px`);
}

export function Rim() {
  return <span aria-hidden="true" className={s.rim} />;
}

/**
 * The visitor's own small light: a warm glow that follows the mouse over the
 * page below the hero (inside the hero, the lantern itself follows it). It
 * warms what it passes without ever covering text.
 */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let x = -999;
    let y = -999;
    let shown = false;
    const paint = () => {
      frame = 0;
      el.style.transform = `translate3d(${x - 360}px, ${y - 360}px, 0)`;
      el.style.opacity = shown ? "1" : "0";
    };
    const onMove = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const inStage = (e.target as Element | null)?.closest?.("[data-lantern-stage]");
      shown = !inStage;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onOut = () => {
      shown = false;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onOut);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  // The dark at the foot of the screen, which each section rises out of.
  useEffect(() => {
    const el = darkRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Off over the hero, so the first screen is crisp, and off again as the
      // page ends.
      const top = Math.min(1, Math.max(0, (window.scrollY - 160) / 420));
      const left = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      const end = Math.max(0, Math.min(1, (left - 120) / 500));
      el.style.opacity = String(Math.min(top, end));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={darkRef} aria-hidden="true" className={s.underDark} />
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[45] h-[720px] w-[720px] rounded-full opacity-0 mix-blend-screen transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgb(255 170 90 / 0.13) 0%, rgb(242 115 19 / 0.07) 28%, rgb(242 115 19 / 0.02) 50%, transparent 68%)",
        }}
      />
    </>
  );
}

/** Spread on a card: tracks the pointer for its rim light. */
export const rimHost = { onPointerMove: trackRim, className: s.rimHost };
