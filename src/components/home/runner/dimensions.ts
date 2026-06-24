// Dimensions for the playable-runner homepage: each "world" is a designed
// vignette revealing one facet of The Vibe Company (a product, a service, the
// YC backing). Pure presentation data + canvas scene painters — no engine refs.
// The T-Rex physics live in VibeRunner.tsx and are untouched by anything here.

const MONO = "var(--font-geist-mono), monospace";

export type SceneKey = "vanish" | "companion" | "vibedrift" | "granite" | "agentflow" | "vibecoding" | "yc";

export interface Dimension {
  tag: string; // kicker, e.g. "PRODUCT" / "WHAT WE DO" / "BACKED BY"
  name: string;
  line: string; // the real one-liner
  paper: string;
  ink: string;
  accent: string;
  player: string;
  words: string[]; // obstacle labels (the problems this facet kills)
  url: string; // live "visit" / CTA target
  logo?: string; // /projects/*-favicon.* (omitted for services + YC)
  linkLabel?: string; // overrides the default "visit <name>"
  external?: boolean; // open in a new tab (true) vs same tab / mailto (false)
  scene: SceneKey;
}

export const DIMENSIONS: Dimension[] = [
  { tag: "PRODUCT", name: "vanish.sh", line: "Temporary uploads, auto-expiring.", paper: "#ecfdf5", ink: "#064e3b", accent: "#10b981", player: "#059669", words: ["BLOAT", "FOREVER", "STORAGE", "LEAKS"], url: "https://vanish.sh", logo: "/projects/vanish-favicon.svg", external: true, scene: "vanish" },
  { tag: "PRODUCT", name: "The Companion", line: "Agent workflows, no slideware.", paper: "#fff7ed", ink: "#7c2d12", accent: "#f97316", player: "#ea580c", words: ["SLIDEWARE", "HANDOFF", "TICKETS", "STANDUP"], url: "https://www.thecompanion.sh/", logo: "/projects/compagnon-favicon.svg", external: true, scene: "companion" },
  { tag: "PRODUCT", name: "vibedrift.dev", line: "Dev activity becomes real metrics.", paper: "#fefce8", ink: "#713f12", accent: "#eab308", player: "#ca8a04", words: ["VANITY KPI", "BURNOUT", "FRICTION", "GUESSWORK"], url: "https://www.vibedrift.dev", logo: "/projects/vibedrift-favicon.svg", external: true, scene: "vibedrift" },
  { tag: "PRODUCT", name: "Granite", line: "The personal OS your agent runs on.", paper: "#f1f5f9", ink: "#0f172a", accent: "#14b8a6", player: "#0f766e", words: ["SILOS", "LOST NOTES", "SPRAWL", "CHAOS"], url: "https://github.com/The-Vibe-Company/Granite", logo: "/projects/granite-favicon.png", external: true, scene: "granite" },
  { tag: "WHAT WE DO", name: "Agent workflows", line: "Orchestration that ships, not slideware.", paper: "#eef2ff", ink: "#1e1b4b", accent: "#6366f1", player: "#4f46e5", words: ["MANUAL", "COPY-PASTE", "QUEUES", "BACKLOG"], url: "mailto:founders@thevibecompany.co", linkLabel: "Work with us", external: false, scene: "agentflow" },
  { tag: "WHAT WE DO", name: "Vibe coding", line: "Disciplined intuition. Magic that ships.", paper: "#faf5ff", ink: "#3b0764", accent: "#a855f7", player: "#9333ea", words: ["WATERFALL", "SCOPE CREEP", "TECH DEBT", "SPECS"], url: "mailto:founders@thevibecompany.co", linkLabel: "Work with us", external: false, scene: "vibecoding" },
  { tag: "BACKED BY", name: "Y Combinator", line: "W24, built by the Quivr team.", paper: "#0a0a0a", ink: "#fafaf7", accent: "#f26625", player: "#f26625", words: ["PITCH DECK", "TAM", "MOAT", "RUNWAY"], url: "https://www.ycombinator.com", linkLabel: "YC W24", external: true, scene: "yc" },
];

// The lerped palette the engine hands each scene every frame (plain arrays).
export interface SceneColors {
  paper: number[];
  ink: number[];
  accent: number[];
  player: number[];
}

export type SceneFn = (
  ctx: CanvasRenderingContext2D,
  scroll: number, // = worldX (raw); each scene applies its own parallax
  t: number, // = engine time accumulator
  S: number, // difficulty scale
  W: number,
  groundY: number,
  c: SceneColors,
  reduced: boolean, // prefers-reduced-motion -> freeze the time term
) => void;

const rgba = (c: number[], a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const wrap = (v: number, m: number) => ((v % m) + m) % m;

// vanish.sh — file packets drifting up and dissolving (ephemerality)
const vanish: SceneFn = (ctx, scroll, t, S, W, gY, c, reduced) => {
  const topB = gY - 168 * S;
  const period = 150 * S;
  const off = (scroll * 0.5) % period;
  const tt = reduced ? 0.25 : t;
  ctx.save();
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 12; i++) {
    const x = wrap(i * period - off, W + period) - period * 0.4 + (i % 3) * 24 * S;
    const cyc = wrap(tt * 0.3 + i * 0.41, 1); // 0..1 rise cycle
    const y = gY - 64 * S - cyc * (gY - 64 * S - topB);
    const a = (1 - cyc) * 0.5;
    if (a <= 0.02) continue;
    const w = 9 * S;
    const h = 11 * S;
    ctx.strokeStyle = rgba(c.accent, a);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.moveTo(x + w - 3 * S, y);
    ctx.lineTo(x + w, y + 3 * S);
    ctx.stroke();
    if (cyc > 0.62) {
      ctx.fillStyle = rgba(c.accent, a * 0.7);
      ctx.fillRect(x + 2 * S, y - 5 * S, 1.6 * S, 1.6 * S);
      ctx.fillRect(x + 6 * S, y - 8 * S, 1.4 * S, 1.4 * S);
    }
  }
  ctx.restore();
};

// The Companion — orchestration node-graph with flowing dashed edges
const companion: SceneFn = (ctx, scroll, t, S, W, gY, c, reduced) => {
  const midY = gY - 118 * S;
  const period = 200 * S;
  const off = (scroll * 0.4) % period;
  const tt = reduced ? 0 : t;
  ctx.save();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = rgba(c.accent, 0.16);
  ctx.setLineDash([6 * S, 6 * S]);
  ctx.lineDashOffset = -tt * 36 * S;
  for (let col = -1; col * period - off < W + period; col++) {
    const x = col * period - off;
    for (let lane = 0; lane < 3; lane++) {
      const ny = midY + (lane - 1) * 40 * S;
      ctx.beginPath();
      ctx.moveTo(x, ny);
      ctx.lineTo(x + period, midY);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);
  for (let col = -1; col * period - off < W + period; col++) {
    const x = col * period - off;
    for (let lane = 0; lane < 3; lane++) {
      const ny = midY + (lane - 1) * 40 * S;
      const pr = (3.4 + Math.sin(tt * 2 + col + lane) * 0.7) * S;
      ctx.fillStyle = rgba(c.accent, 0.5);
      ctx.beginPath();
      ctx.arc(x, ny, pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rgba(c.ink, 0.12);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  ctx.restore();
};

// vibedrift.dev — live scrolling area/line chart with axis ticks
const vibedrift: SceneFn = (ctx, scroll, t, S, W, gY, c, reduced) => {
  const baseY = gY - 58 * S;
  const amp = 44 * S;
  const tt = reduced ? 0 : t;
  const sc = scroll * 0.6;
  ctx.save();
  ctx.strokeStyle = rgba(c.ink, 0.14);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  ctx.lineTo(W, baseY);
  ctx.stroke();
  const tick = 60 * S;
  for (let gx = tick - (sc % tick); gx < W; gx += tick) {
    ctx.beginPath();
    ctx.moveTo(gx, baseY - 4 * S);
    ctx.lineTo(gx, baseY + 4 * S);
    ctx.stroke();
  }
  const f = (x: number) => {
    const p = (x + sc) / (42 * S);
    return baseY - (Math.sin(p) * 0.6 + Math.sin(p * 0.37 + tt) * 0.4) * amp - amp * 0.25;
  };
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let x = 0; x <= W; x += 10 * S) ctx.lineTo(x, f(x));
  ctx.lineTo(W, baseY);
  ctx.closePath();
  ctx.fillStyle = rgba(c.accent, 0.1);
  ctx.fill();
  ctx.beginPath();
  for (let x = 0; x <= W; x += 10 * S) {
    if (x === 0) ctx.moveTo(x, f(x));
    else ctx.lineTo(x, f(x));
  }
  ctx.strokeStyle = rgba(c.accent, 0.55);
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();
};

// Granite — a constellation / knowledge-graph of linked note-nodes
const granite: SceneFn = (ctx, scroll, t, S, W, gY, c, reduced) => {
  const topB = 60 * S;
  const botB = gY - 152 * S;
  const tt = reduced ? 0 : t;
  const N = 9;
  const fieldW = W + 200 * S;
  const off = wrap(scroll * 0.18, fieldW);
  const nx = (i: number) => wrap((i / N) * fieldW + (Math.sin(i * 12.9) * 0.5 + 0.5) * 70 * S - off, fieldW) - 100 * S;
  const ny = (i: number) => topB + (Math.sin(i * 7.7) * 0.5 + 0.5) * (botB - topB);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(c.accent, 0.16);
  for (let i = 0; i < N; i++) {
    const ax = nx(i);
    const ay = ny(i);
    const j = (i + 1) % N;
    const bx = nx(j);
    const by = ny(j);
    if (Math.abs(ax - bx) < 260 * S) {
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }
  for (let i = 0; i < N; i++) {
    const x = nx(i);
    const y = ny(i);
    const tw = 0.6 + 0.4 * Math.sin(tt * 1.5 + i);
    ctx.fillStyle = rgba(c.accent, 0.2 + 0.4 * tw);
    ctx.beginPath();
    ctx.arc(x, y, 3.2 * S, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = rgba(c.ink, 0.12);
    ctx.stroke();
  }
  ctx.restore();
};

// Agent workflows — a conveyor pipeline of boxed steps + drifting chevrons
const agentflow: SceneFn = (ctx, scroll, t, S, W, gY, c, reduced) => {
  const laneY = gY - 102 * S;
  const period = 150 * S;
  const off = (scroll * 0.45) % period;
  const tt = reduced ? 0 : t;
  ctx.save();
  ctx.strokeStyle = rgba(c.ink, 0.1);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, laneY + 22 * S);
  ctx.lineTo(W, laneY + 22 * S);
  ctx.stroke();
  for (let i = -1; i * period - off < W; i++) {
    const x = i * period - off;
    ctx.strokeStyle = rgba(c.accent, 0.4);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(x, laneY - 14 * S, 34 * S, 28 * S);
    ctx.fillStyle = rgba(c.accent, 0.1);
    ctx.fillRect(x, laneY - 14 * S, 34 * S, 28 * S);
  }
  const cp = 50 * S;
  const coff = (scroll * 0.45 + tt * 50 * S) % cp;
  ctx.strokeStyle = rgba(c.accent, 0.32);
  ctx.lineWidth = 1.4;
  for (let x = -coff; x < W; x += cp) {
    ctx.beginPath();
    ctx.moveTo(x, laneY - 5 * S);
    ctx.lineTo(x + 6 * S, laneY + 1 * S);
    ctx.lineTo(x, laneY + 7 * S);
    ctx.stroke();
  }
  ctx.restore();
};

// Vibe coding — a flowing signal/wave with code-token rects on the crest
const vibecoding: SceneFn = (ctx, scroll, t, S, W, gY, c, reduced) => {
  const baseY = gY - 112 * S;
  const tt = reduced ? 0 : t;
  const sc = scroll * 0.5;
  const f = (x: number) => baseY + Math.sin((x + sc) / (52 * S) + tt) * 26 * S;
  ctx.save();
  ctx.strokeStyle = rgba(c.accent, 0.45);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 8 * S) {
    if (x === 0) ctx.moveTo(x, f(x));
    else ctx.lineTo(x, f(x));
  }
  ctx.stroke();
  const period = 90 * S;
  const off = sc % period;
  for (let i = -1; i * period - off < W; i++) {
    const x = i * period - off + (i % 2) * 30 * S;
    const y = f(x);
    const w = (10 + (i % 3) * 8) * S;
    ctx.fillStyle = rgba(c.accent, 0.22);
    ctx.fillRect(x, y - 3 * S, w, 6 * S);
  }
  ctx.restore();
};

// Y Combinator — dark demo-day stage: spotlight cone + orange Y mark + W24
const yc: SceneFn = (ctx, scroll, t, S, W, gY, c) => {
  const cx = W * 0.5;
  const topY = 48 * S;
  const baseY = gY - 8 * S;
  ctx.save();
  const grad = ctx.createLinearGradient(0, topY, 0, baseY);
  grad.addColorStop(0, rgba(c.accent, 0.16));
  grad.addColorStop(1, rgba(c.accent, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(cx - 14 * S, topY);
  ctx.lineTo(cx + 14 * S, topY);
  ctx.lineTo(cx + 150 * S, baseY);
  ctx.lineTo(cx - 150 * S, baseY);
  ctx.closePath();
  ctx.fill();
  const yy = gY - 122 * S;
  const ys = 30 * S;
  ctx.strokeStyle = rgba(c.accent, 0.85);
  ctx.lineWidth = 6 * S;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - ys * 0.7, yy - ys);
  ctx.lineTo(cx, yy);
  ctx.moveTo(cx + ys * 0.7, yy - ys);
  ctx.lineTo(cx, yy);
  ctx.moveTo(cx, yy);
  ctx.lineTo(cx, yy + ys);
  ctx.stroke();
  ctx.fillStyle = rgba(c.accent, 0.5);
  ctx.font = `600 ${Math.round(11 * S)}px ${MONO}`;
  ctx.textAlign = "center";
  ctx.fillText("W24", cx, yy + ys + 18 * S);
  ctx.restore();
};

export const SCENE_DRAW: Record<SceneKey, SceneFn> = { vanish, companion, vibedrift, granite, agentflow, vibecoding, yc };
