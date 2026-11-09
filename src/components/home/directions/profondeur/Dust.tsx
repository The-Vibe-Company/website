"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/design-system";
import { prefersReducedMotion, readPointer } from "./pointer";

interface Mote {
  x: number;
  y: number;
  /** 0.25 far … 1 near: size, brightness, drift and parallax all scale with it. */
  z: number;
  r: number;
  phase: number;
}

/**
 * Dust hanging in the dark at three depths. Near motes are larger, brighter,
 * drift faster and follow the pointer (and, if asked, the scroll) further than
 * far ones, so the black reads as a volume. Motes low in the frame, near the
 * horizon, take the orange of its light. Paused off screen and in hidden tabs;
 * a single still frame under reduced motion.
 */
export function Dust({
  className,
  density = 1,
  scroll = false,
  warmBelow = 0.55,
}: {
  className?: string;
  /** Motes per 10 000 px² of canvas, roughly. */
  density?: number;
  /** Shift layers with the page scroll too (the fixed backdrop does). */
  scroll?: boolean;
  /** From this height (0 top … 1 bottom) down, motes are lit orange. */
  warmBelow?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    let motes: Mote[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const count = Math.round(((width * height) / 10000) * 0.9 * density);
      motes = Array.from({ length: Math.min(260, count) }, () => {
        const z = [0.25, 0.5, 1][Math.floor(Math.random() * 3)] * (0.8 + Math.random() * 0.4);
        return { x: Math.random(), y: Math.random(), z, r: 0.5 + Math.random() * 1.3, phase: Math.random() * Math.PI * 2 };
      });
    };

    let px = 0;
    let py = 0;
    let last = performance.now();
    let frame = 0;
    let visible = true;

    const draw = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const target = readPointer();
      px += (target.x - px) * 0.05;
      py += (target.y - py) * 0.05;
      const scrollShift = scroll ? window.scrollY : 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        if (!reduce) m.y -= dt * 0.006 * m.z;
        if (m.y < -0.02) m.y += 1.04;
        let y = m.y * height - scrollShift * 0.35 * m.z - py * 18 * m.z;
        y = ((y % height) + height) % height;
        const x = m.x * width - px * 40 * m.z;
        const twinkle = 0.65 + 0.35 * Math.sin(now / 900 + m.phase);
        const depthAlpha = 0.12 + 0.5 * m.z;
        const warm = Math.max(0, Math.min(1, (y / height - warmBelow) / (1 - warmBelow)));
        const r = Math.round(244 - (244 - 242) * warm);
        const g = Math.round(243 - (243 - 140) * warm);
        const b = Math.round(239 - (239 - 60) * warm);
        ctx.fillStyle = `rgba(${r},${g},${b},${(depthAlpha * twinkle * (0.7 + warm * 0.5)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, m.r * (0.5 + m.z), 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };

    seed();
    start();

    const resize = new ResizeObserver(() => {
      seed();
      if (reduce) start();
    });
    resize.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce) start();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (!document.hidden && visible && !reduce) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, scroll, warmBelow]);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
