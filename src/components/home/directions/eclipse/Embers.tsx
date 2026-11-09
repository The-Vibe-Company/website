"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  vy: number;
  sway: number;
  phase: number;
  size: number;
  life: number;
  max: number;
}

/**
 * Sparks rising off the heat: a 2D canvas of small orange embers that drift up,
 * sway and burn out. Cheap (a few dozen arcs), paused offscreen and in a hidden
 * tab, and absent with reduced motion.
 */
export function Embers({ density = 1, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.round(Math.min(90, (w / 20) * density));
    const spawn = (anywhere: boolean): Ember => {
      const max = 4 + Math.random() * 7;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        vy: 14 + Math.random() * 38,
        sway: 6 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        size: 0.6 + Math.random() * 1.8,
        life: anywhere ? Math.random() * max : 0,
        max,
      };
    };
    const embers = Array.from({ length: count }, () => spawn(true));

    let frame = 0;
    let last = performance.now();
    let running = false;
    let visible = true;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += dt;
        e.y -= e.vy * dt;
        const x = e.x + Math.sin(e.phase + e.life * 1.3) * e.sway;
        const t = e.life / e.max;
        if (t >= 1 || e.y < -10) {
          embers[i] = spawn(false);
          continue;
        }
        // Flare up, then cool from yellow-orange to ember red as it rises.
        const alpha = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(now / 90 + e.phase));
        const g = Math.round(170 - 110 * t);
        const r = e.size * (1.6 - t);
        const grad = ctx.createRadialGradient(x, e.y, 0, x, e.y, r * 4);
        grad.addColorStop(0, `rgba(255,${g},40,${alpha})`);
        grad.addColorStop(0.35, `rgba(242,${Math.round(g * 0.7)},19,${alpha * 0.45})`);
        grad.addColorStop(1, "rgba(242,80,19,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, e.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
