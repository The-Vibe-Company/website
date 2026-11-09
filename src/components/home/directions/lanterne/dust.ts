/**
 * Dust hanging in a dark room: invisible in the dark, lit only where the
 * lantern reaches, the way motes show in a beam. A few large out-of-focus
 * specks drift nearer the eye for depth.
 */
export interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  /** Out of focus: drawn large and soft, nearer the eye. */
  bokeh: boolean;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function makeDust(count: number, w: number, h: number): Mote[] {
  const rnd = seeded(7);
  return Array.from({ length: count }, (_, i) => {
    const bokeh = i % 11 === 0;
    return {
      x: rnd() * w,
      y: rnd() * h,
      r: bokeh ? 7 + rnd() * 9 : 0.5 + rnd() * 1.7,
      vx: (rnd() - 0.5) * 6,
      vy: -2 - rnd() * 6,
      phase: rnd() * Math.PI * 2,
      bokeh,
    };
  });
}

export function drawDust(
  ctx: CanvasRenderingContext2D,
  motes: Mote[],
  o: { w: number; h: number; dpr: number; lx: number; ly: number; time: number; still: boolean },
) {
  const { w, h, dpr, lx, ly, time, still } = o;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  const reach = Math.max(360, Math.min(w, 1400) * 0.42);
  for (const m of motes) {
    // Drift up, sway, wrap around the room.
    const x = (((m.x + (still ? 0 : time * m.vx + Math.sin(time * 0.6 + m.phase) * 14)) % w) + w) % w;
    const y = (((m.y + (still ? 0 : time * m.vy)) % h) + h) % h;
    const d = Math.hypot(x - lx, y - ly);
    const lit = Math.max(0, 1 - d / reach);
    if (lit <= 0.01) continue;
    const glow = Math.pow(lit, 1.8);
    const twinkle = still ? 1 : 0.75 + 0.25 * Math.sin(time * 2.3 + m.phase * 3);
    if (m.bokeh) {
      const a = glow * 0.12 * twinkle;
      const g = ctx.createRadialGradient(x, y, 0, x, y, m.r);
      g.addColorStop(0, `rgba(255, 196, 140, ${a})`);
      g.addColorStop(0.7, `rgba(242, 115, 19, ${a * 0.45})`);
      g.addColorStop(1, "rgba(242, 115, 19, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, m.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Hot white near the flame, orange further out.
      const near = Math.pow(lit, 3);
      const r = 255;
      const gch = Math.round(150 + 85 * near);
      const b = Math.round(60 + 150 * near);
      ctx.fillStyle = `rgba(${r}, ${gch}, ${b}, ${Math.min(1, glow * 0.95 * twinkle)})`;
      ctx.beginPath();
      ctx.arc(x, y, m.r * (0.8 + glow * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";
}
