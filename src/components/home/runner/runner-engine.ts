// Vibe Runner V2 engine — cinematic redesign.
// Chrome-dino physics preserved; everything visual rebuilt:
// deep multi-layer parallax, per-world universes, warp transitions, comet mascot.
//
// Ported from the Claude Design handoff `runner-engine.js`. The only behavioural
// change for this codebase: font families are injected via the constructor
// (`fonts`) instead of hardcoding `'Geist Mono'` / `'Geist'`, because those names
// resolve to hashed next/font families here and a literal ctx.font silently no-ops.
// The physics, spawn/gap formula, warp, silhouettes, motifs and mascot are verbatim.

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const wrap = (v: number, m: number) => ((v % m) + m) % m;
const hexToRgb = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbStr = (a: RGB, al?: number) =>
  al === undefined ? `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})` : `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;

type RGB = [number, number, number] | number[];

export interface Sun {
  x: number;
  y: number;
  r: number;
  color: string;
  halo: number;
}

export type SilhouetteKind = "domes" | "slabs" | "towers" | "graph" | "peaks" | "waves" | "crystals" | "gears" | "crowd" | "none";
export type MotifKind = "vanish" | "companion" | "vibedrift" | "granite" | "agentflow" | "vibecoding" | "yc" | "home";

export interface World {
  tag: string;
  name: string;
  line: string;
  url: string;
  external: boolean;
  linkLabel?: string;
  words: string[];
  sky: [string, string, string];
  ink: string;
  accent: string;
  player: string;
  sun: Sun | null;
  far: SilhouetteKind;
  mid: SilhouetteKind;
  motif: MotifKind;
  stars: boolean;
  dark: boolean;
}

interface Palette {
  sky0: number[];
  sky1: number[];
  sky2: number[];
  ink: number[];
  accent: number[];
  player: number[];
}

interface Char {
  x: number;
  jy: number;
  jv: number;
  jumping: boolean;
  minH: boolean;
  sdrop: boolean;
  duck: boolean;
}

interface Obstacle {
  kind: "cactus" | "bird";
  x: number;
  w: number;
  h: number;
  cy: number;
  word: string;
  seed: number;
  counted?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  life: number;
  kind: "dust" | "ember";
}

interface Cloud {
  x: number;
  y: number;
  s: number;
}

export interface EngineState {
  phase: "idle" | "running" | "dead";
  world: World | null;
  finalScore: string;
  bestScore: string;
  deadKicker: string;
  deadTitle: string;
  discovered: World[];
  total: number;
  sound: boolean;
}

export interface EngineHooks {
  onState?: (s: EngineState) => void;
  onScore?: (score: number, best: number) => void;
  onMilestone?: () => void;
}

export interface EngineFonts {
  mono: string;
  sans: string;
}

// ---------------------------------------------------------------- worlds
// Each world is a full universe: sky, celestial body, silhouettes, motif.
export const WORLDS: World[] = [
  {
    tag: "PRODUCT", name: "vanish.sh", line: "Temporary uploads, auto-expiring.",
    url: "https://vanish.sh", external: true,
    words: ["BLOAT", "FOREVER", "STORAGE", "LEAKS"],
    sky: ["#021711", "#04352a", "#0f6b4e"], ink: "#d8fcee", accent: "#34d399", player: "#6ee7b7",
    sun: { x: 0.72, y: 0.30, r: 0.14, color: "#34d399", halo: 0.35 },
    far: "domes", mid: "slabs", motif: "vanish", stars: true, dark: true,
  },
  {
    tag: "PRODUCT", name: "The Companion", line: "Agent workflows, no slideware.",
    url: "https://www.thecompanion.sh/", external: true,
    words: ["SLIDEWARE", "HANDOFF", "TICKETS", "STANDUP"],
    sky: ["#180701", "#7c2d12", "#f97316"], ink: "#ffedd5", accent: "#fdba74", player: "#fed7aa",
    sun: { x: 0.5, y: 0.62, r: 0.30, color: "#fb923c", halo: 0.5 },
    far: "towers", mid: "towers", motif: "companion", stars: false, dark: true,
  },
  {
    tag: "PRODUCT", name: "vibedrift.dev", line: "Dev activity becomes real metrics.",
    url: "https://www.vibedrift.dev", external: true,
    words: ["VANITY KPI", "BURNOUT", "FRICTION", "GUESSWORK"],
    sky: ["#fef6e0", "#fdeebd", "#f8d98a"], ink: "#713f12", accent: "#d97706", player: "#92400e",
    sun: { x: 0.24, y: 0.26, r: 0.17, color: "#f59e0b", halo: 0.4 },
    far: "graph", mid: "peaks", motif: "vibedrift", stars: false, dark: false,
  },
  {
    tag: "PRODUCT", name: "Granite", line: "The personal OS your agent runs on.",
    url: "https://github.com/The-Vibe-Company/Granite", external: true,
    words: ["SILOS", "LOST NOTES", "SPRAWL", "CHAOS"],
    sky: ["#060b16", "#0d1d33", "#1d3a57"], ink: "#dbf2ff", accent: "#2dd4bf", player: "#7bf1e1",
    sun: { x: 0.82, y: 0.2, r: 0.09, color: "#8ecae6", halo: 0.3 },
    far: "crystals", mid: "crystals", motif: "granite", stars: true, dark: true,
  },
  {
    tag: "WHAT WE DO", name: "Agent workflows", line: "Orchestration that ships, not slideware.",
    url: "mailto:founders@thevibecompany.co", linkLabel: "Work with us", external: false,
    words: ["MANUAL", "COPY-PASTE", "QUEUES", "BACKLOG"],
    sky: ["#0a081f", "#1e1b4b", "#4338ca"], ink: "#e0e7ff", accent: "#818cf8", player: "#a5b4fc",
    sun: { x: 0.6, y: 0.24, r: 0.11, color: "#818cf8", halo: 0.35 },
    far: "gears", mid: "slabs", motif: "agentflow", stars: true, dark: true,
  },
  {
    tag: "WHAT WE DO", name: "Vibe coding", line: "Disciplined intuition. Magic that ships.",
    url: "mailto:founders@thevibecompany.co", linkLabel: "Work with us", external: false,
    words: ["WATERFALL", "SCOPE CREEP", "TECH DEBT", "SPECS"],
    sky: ["#160423", "#3b0764", "#9333ea"], ink: "#f3e8ff", accent: "#c084fc", player: "#d8b4fe",
    sun: { x: 0.5, y: 0.4, r: 0.2, color: "#a855f7", halo: 0.45 },
    far: "waves", mid: "waves", motif: "vibecoding", stars: true, dark: true,
  },
  {
    tag: "BACKED BY", name: "Y Combinator", line: "W24, built by the Quivr team.",
    url: "https://www.ycombinator.com", linkLabel: "YC W24", external: true,
    words: ["PITCH DECK", "TAM", "MOAT", "RUNWAY"],
    sky: ["#050505", "#0a0a0a", "#1a120c"], ink: "#fafaf7", accent: "#f26625", player: "#f26625",
    sun: null,
    far: "crowd", mid: "none", motif: "yc", stars: false, dark: true,
  },
];

const HOME: World = {
  tag: "", name: "", line: "", url: "#", external: false,
  words: ["HYPE"],
  sky: ["#fdfbf7", "#fdfbf7", "#f5f1e8"], ink: "#0a0a0a", accent: "#0a0a0a", player: "#0a0a0a",
  sun: null, far: "none", mid: "peaks", motif: "home", stars: false, dark: false,
};

const DEATHS: [string, string][] = [
  ["CAUGHT BY THE HYPE", "The hype caught up."],
  ["TRIPPED ON A BUZZWORD", "Synergy got you."],
  ["DEPLOY FAILED", "Shipping interrupted."],
];

// ---------------------------------------------------------------- engine
export class VibeEngine {
  cv: HTMLCanvasElement;
  hooks: EngineHooks;
  ctx: CanvasRenderingContext2D;
  phase: "idle" | "running" | "dead" = "idle";
  sound = false;
  score = 0;
  best = 0;

  private _mono: string;
  private _sans: string;

  W = 0;
  H = 0;
  S = 1;
  groundY = 0;
  originX = 0;

  BASE_SPEED = 0;
  MAX_SPEED = 0;
  ACCEL = 0;
  WORLD_SECS = 6.5;
  WARP = 1.0;

  // dino constants
  readonly DGY = 93;
  readonly DMINJ = 63;
  readonly DMAXJ = 30;
  readonly GRAV = 0.6;
  readonly INITJV = -10;
  readonly DROPV = -5;
  readonly SDROP = 3;

  _t = 0;
  _last = 0;
  _raf = 0;
  _visible = true;
  _reduced = false;

  // caches
  private _skyCache: CanvasGradient | null = null;
  private _grain: CanvasPattern | null = null;
  private _grainTick = 0;
  private _labelCache = new Map<string, HTMLCanvasElement>();
  private _nameCache: HTMLCanvasElement | null = null;
  private _starSeed: number[][] = [];
  private _fgSeed: number[][] = [];

  // run state
  order: number[] = [];
  pos = -1;
  worldT = 0;
  world: World | null = null;
  view: World = HOME;
  visited: World[] = [];
  firstWorld = true;
  speed = 0;
  worldX = 0;
  char!: Char;
  obstacles: Obstacle[] = [];
  particles: Particle[] = [];
  trail: { x: number; jy: number }[] = [];
  clouds: Cloud[] = [];
  h1: number[] = [];
  h2: number[] = [];

  cur: Palette = this._pal(HOME);
  tgt: Palette = this._pal(HOME);
  private _settled = true;

  private _nextSpawn = 0;
  private _lastDrone = false;
  private _jumpBuf = 0;
  private _squash = 0;
  private _freeze = 0;
  private _pendingDeath = false;
  private _shake = 0;
  private _shakeMag = 0;
  private _closeT = 0;
  private _milestone = 0;
  private _warpT = -1;
  private _pendingWorld: World | null = null;
  private _warpApplied = false;
  private _deadAt = -1;
  private _lastScore = -1;
  private _lastBest = -1;
  private _lastIdx = -1;
  private _touchDuck = false;
  private _deadKicker = DEATHS[0][0];
  private _deadTitle = DEATHS[0][1];

  private _ac: AudioContext | null = null;
  private _io: IntersectionObserver | null = null;

  private _onResize!: () => void;
  private _kd!: (e: KeyboardEvent) => void;
  private _ku!: (e: KeyboardEvent) => void;
  private _pd!: (e: PointerEvent) => void;
  private _pu!: () => void;

  constructor(canvas: HTMLCanvasElement, hooks: EngineHooks, fonts: EngineFonts) {
    this.cv = canvas;
    this.hooks = hooks || {};
    this.ctx = (canvas.getContext("2d", { alpha: false, desynchronized: true }) || canvas.getContext("2d"))!;
    this._mono = fonts.mono;
    this._sans = fonts.sans;
    try {
      this.best = parseInt(localStorage.getItem("vibeco_runner_v2_best") || "0", 10) || 0;
    } catch {
      this.best = 0;
    }
    try {
      this._reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      this._reduced = false;
    }
    for (let i = 0; i < 90; i++) this._starSeed.push([Math.random(), Math.random(), Math.random()]);
    for (let i = 0; i < 5; i++) this._fgSeed.push([Math.random(), 0.4 + Math.random() * 0.6, Math.random()]);
    this._buildGrain();
    this._onResize = () => this.resize();
    window.addEventListener("resize", this._onResize);
    this.resize();
    this.reset();
    this._bindInput();
    // 0.15 threshold: idle the loop (and release the Space key — see _kd) once the
    // hero is mostly scrolled off, so the game doesn't run or hijack keys off-screen.
    this._io = new IntersectionObserver((e) => {
      this._visible = e[0] ? e[0].isIntersecting : true;
    }, { threshold: 0.15 });
    this._io.observe(canvas);
    this._last = performance.now();
    this._raf = requestAnimationFrame((t) => this._loop(t));
    this._emit();
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    if (this._io) this._io.disconnect();
    window.removeEventListener("resize", this._onResize);
    this._unbind();
    if (this._ac) {
      this._ac.close().catch(() => {});
      this._ac = null;
    }
  }

  // ------------------------------------------------------------- sizing
  resize() {
    const r = this.cv.getBoundingClientRect();
    this.W = Math.max(320, r.width);
    this.H = Math.max(260, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = Math.round(this.W * dpr);
    this.cv.height = Math.round(this.H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.S = clamp(this.W / 700, 0.7, 1.85);
    const S = this.S, FPS = 60;
    this.BASE_SPEED = 6 * FPS * S;
    this.MAX_SPEED = 13 * FPS * S;
    this.ACCEL = 0.001 * FPS * FPS * S * 0.85;
    this.groundY = this.H - Math.max(54, this.H * 0.12);
    this.originX = Math.max(60, this.W * 0.16);
    if (this.char) this.char.x = this.originX;
    this._genTerrain();
    this._skyCache = null;
    this._labelCache.clear();
  }

  private _genTerrain() {
    this.h1 = [];
    this.h2 = [];
    for (let i = 0; i < 60; i++) {
      this.h1.push(30 + Math.random() * 46);
      this.h2.push(16 + Math.random() * 26);
    }
    this.clouds = [];
    for (let i = 0; i < 6; i++) this.clouds.push({ x: Math.random() * 2000, y: this.H * (0.12 + Math.random() * 0.3), s: 0.5 + Math.random() * 0.6 });
  }

  private _buildGrain() {
    const tile = document.createElement("canvas");
    tile.width = 160;
    tile.height = 160;
    const tc = tile.getContext("2d");
    if (!tc) return;
    const img = tc.createImageData(160, 160);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (Math.random() < 0.08) {
        const v = Math.random() < 0.5 ? 10 : 250;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
    }
    tc.putImageData(img, 0, 0);
    this._grain = this.ctx.createPattern(tile, "repeat");
  }

  // ------------------------------------------------------------- state
  reset() {
    this.score = 0;
    this.order = this._shuffle(WORLDS.map((_, i) => i));
    if (this.order.length > 1 && this.order[0] === this._lastIdx) {
      const t = this.order[0];
      this.order[0] = this.order[1];
      this.order[1] = t;
    }
    this.pos = -1;
    this.worldT = 0;
    this.world = null;
    this.visited = [];
    this.firstWorld = true;
    this.speed = this.BASE_SPEED;
    this.worldX = 0;
    this.char = { x: this.originX, jy: this.DGY, jv: 0, jumping: false, minH: false, sdrop: false, duck: false };
    this.obstacles = [];
    this.particles = [];
    this.trail = [];
    this._nextSpawn = this.W + 200;
    this._lastDrone = false;
    this._jumpBuf = 0;
    this._squash = 0;
    this._freeze = 0;
    this._pendingDeath = false;
    this._shake = 0;
    this._shakeMag = 0;
    this._closeT = 0;
    this._milestone = 0;
    this._warpT = -1;
    this._pendingWorld = null;
    this._warpApplied = false;
    this._deadAt = -1;
    this._lastScore = -1;
    this._lastBest = -1;
    this.cur = this._pal(HOME);
    this.tgt = this._pal(HOME);
    this._settled = true;
    this._skyCache = null;
    this._labelCache.clear();
    this._nameCache = null;
    this.view = HOME;
  }

  private _pal(w: World): Palette {
    return { sky0: hexToRgb(w.sky[0]), sky1: hexToRgb(w.sky[1]), sky2: hexToRgb(w.sky[2]), ink: hexToRgb(w.ink), accent: hexToRgb(w.accent), player: hexToRgb(w.player) };
  }
  private _shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  private _emit() {
    if (!this.hooks.onState) return;
    this.hooks.onState({
      phase: this.phase,
      world: this.world,
      finalScore: String(Math.round(this.score)),
      bestScore: String(this.best),
      deadKicker: this._deadKicker || DEATHS[0][0],
      deadTitle: this._deadTitle || DEATHS[0][1],
      discovered: this.visited.slice(),
      total: WORLDS.length,
      sound: this.sound,
    });
  }

  toggleSound() {
    this._ensureAudio();
    if (this._ac && this._ac.state === "suspended") this._ac.resume().catch(() => {});
    this.sound = !this.sound;
    this._emit();
  }

  // ------------------------------------------------------------- audio
  private _ensureAudio() {
    if (this._ac) return;
    try {
      const C = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this._ac = C ? new C() : null;
    } catch {
      this._ac = null;
    }
  }
  blip(freq: number, dur?: number, type?: OscillatorType, when = 0, endFreq?: number) {
    if (!this.sound || !this._ac) return;
    const ac = this._ac, o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + when, d = dur || 0.09;
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t0);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t0 + d);
    g.gain.setValueAtTime(0.06, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g);
    g.connect(ac.destination);
    o.start(t0);
    o.stop(t0 + d);
  }
  arpeggio(root: number) {
    this.blip(root, 0.09, "sine", 0);
    this.blip(root * 1.26, 0.09, "sine", 0.07);
    this.blip(root * 1.5, 0.14, "sine", 0.14);
  }

  // ------------------------------------------------------------- input
  private _bindInput() {
    this._kd = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (this.phase === "running") {
          e.preventDefault();
          this.startOrJump();
          return;
        }
        if (e.target instanceof Element && e.target.closest("a, button")) return;
        // Hero scrolled off-screen: let Space/ArrowUp scroll the page normally
        // instead of preventing default and starting the game the user can't see.
        if (!this._visible) return;
        e.preventDefault();
        this.startOrJump();
      } else if (e.code === "ArrowDown" && this.phase === "running") {
        e.preventDefault();
        this.setDuck(true);
      }
    };
    this._ku = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        if (this.phase === "running") e.preventDefault();
        this.setDuck(false);
      } else if ((e.code === "Space" || e.code === "ArrowUp") && this.phase === "running") this.endJump();
    };
    this._pd = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest("a, button")) return;
      const r = this.cv.getBoundingClientRect();
      const ly = e.clientY - r.top;
      if (ly > r.height * 0.62 && this.phase === "running") {
        this.setDuck(true);
        this._touchDuck = true;
      } else this.startOrJump();
    };
    this._pu = () => {
      if (this._touchDuck) {
        this.setDuck(false);
        this._touchDuck = false;
      }
    };
    window.addEventListener("keydown", this._kd);
    window.addEventListener("keyup", this._ku);
    this.cv.addEventListener("pointerdown", this._pd);
    window.addEventListener("pointerup", this._pu);
    window.addEventListener("pointercancel", this._pu);
  }
  private _unbind() {
    window.removeEventListener("keydown", this._kd);
    window.removeEventListener("keyup", this._ku);
    window.removeEventListener("pointerup", this._pu);
    window.removeEventListener("pointercancel", this._pu);
    this.cv.removeEventListener("pointerdown", this._pd);
  }

  startOrJump() {
    if (this.phase === "idle") {
      this.begin();
      return;
    }
    if (this.phase === "dead") {
      if (this._deadAt >= 0 && this._t - this._deadAt > 0.75) this.restart();
      return;
    }
    const c = this.char;
    if (!c.jumping && !c.duck) this.startJump();
    else if (c.jumping) this._jumpBuf = this._t + 0.14;
  }
  startJump() {
    const c = this.char;
    if (c.jumping || c.duck) return;
    const vd = this.speed / (60 * this.S);
    c.jv = this.INITJV - vd / 10;
    c.jumping = true;
    c.minH = false;
    c.sdrop = false;
    this._squash = 0;
    this._dust();
    this._burst(8);
    this.blip(520, 0.08, "square");
  }
  endJump() {
    const c = this.char;
    if (c.minH && c.jv < this.DROPV) c.jv = this.DROPV;
  }
  setDuck(on: boolean) {
    if (this.phase !== "running") return;
    const c = this.char;
    if (on) {
      if (c.jumping) {
        c.sdrop = true;
        c.jv = 1;
      } else c.duck = true;
    } else {
      c.sdrop = false;
      c.duck = false;
    }
  }
  begin() {
    this._ensureAudio();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    this._nextSpawn = this.worldX + this.W + this.BASE_SPEED * 1.2;
    this._jumpBuf = 0;
    this.phase = "running";
    this._emit();
    this._nextWorld();
  }
  restart() {
    this.reset();
    this.begin();
  }

  die() {
    this.blip(90, 0.28, "sine", 0, 42);
    this.blip(140, 0.12, "sawtooth", 0);
    if (this._reduced) {
      this._finishDeath();
      return;
    }
    this._freeze = 0.09;
    this._pendingDeath = true;
    this._shake = 0.32;
    this._shakeMag = 6;
  }
  private _finishDeath() {
    if (this.score > this.best) {
      this.best = Math.round(this.score);
      try {
        localStorage.setItem("vibeco_runner_v2_best", String(this.best));
      } catch {
        /* storage unavailable */
      }
    }
    const d = DEATHS[Math.floor(Math.random() * DEATHS.length)];
    this._deadKicker = d[0];
    this._deadTitle = d[1];
    this._deadAt = this._t;
    this.phase = "dead";
    this._emit();
  }

  // ------------------------------------------------------------- worlds
  private _nextWorld() {
    this.worldT = 0;
    this.pos = (this.pos + 1) % this.order.length;
    const idx = this.order[this.pos];
    this._lastIdx = idx;
    const w = WORLDS[idx];
    if (this.firstWorld || this._reduced) {
      this.firstWorld = false;
      // still warp on the very first world — that reveal IS the wow
      if (this._reduced) {
        this._applyWorld(w, true);
        return;
      }
    }
    this._pendingWorld = w;
    this._warpApplied = false;
    this._warpT = 0;
    this.blip(300, 0.3, "sawtooth", 0, 900);
  }
  private _applyWorld(w: World, instant: boolean) {
    this.world = w;
    this.view = w;
    this.tgt = this._pal(w);
    if (instant) this.cur = this._pal(w);
    this._settled = instant;
    this._skyCache = null;
    this._buildLabels(w);
    this._buildName(w);
    this.arpeggio(w.tag === "BACKED BY" ? 523 : w.tag === "PRODUCT" ? 440 : 392);
    if (!this.visited.includes(w)) this.visited.push(w);
    this._emit();
  }

  private _buildLabels(w: World) {
    const accent = hexToRgb(w.accent);
    const px = Math.max(9, Math.round(10 * this.S));
    for (const word of w.words) {
      if (this._labelCache.has(word)) continue;
      const cnv = document.createElement("canvas");
      const cc = cnv.getContext("2d");
      if (!cc) continue;
      const font = `600 ${px}px ${this._mono}`;
      cc.font = font;
      const wpx = Math.ceil(cc.measureText(word).width) + 4;
      cnv.width = Math.max(8, wpx);
      cnv.height = px + 4;
      cc.font = font;
      cc.textBaseline = "top";
      cc.fillStyle = rgbStr(accent, 0.95);
      cc.fillText(word, 2, 2);
      this._labelCache.set(word, cnv);
    }
  }
  private _buildName(w: World) {
    const size = Math.round(clamp(this.W * 0.085, 40, 120));
    const cnv = document.createElement("canvas");
    const cc = cnv.getContext("2d");
    if (!cc) return;
    const font = `800 ${size}px ${this._sans}`;
    cc.font = font;
    const label = w.name.toUpperCase();
    const wpx = Math.ceil(cc.measureText(label).width) + 12;
    cnv.width = Math.max(8, wpx);
    cnv.height = Math.round(size * 1.3);
    cc.font = font;
    cc.textBaseline = "top";
    cc.fillStyle = w.ink;
    cc.fillText(label, 6, size * 0.1);
    this._nameCache = cnv;
  }

  // ------------------------------------------------------------- loop
  private _loop(t: number) {
    if (!this._visible) {
      this._last = t;
      this._raf = requestAnimationFrame((tt) => this._loop(tt));
      return;
    }
    const dt = Math.min(0.034, (t - this._last) / 1000) || 0.016;
    this._last = t;
    this._t += dt;
    if (this._shake > 0) this._shake = Math.max(0, this._shake - dt);
    if (this._closeT > 0) this._closeT = Math.max(0, this._closeT - dt);
    if (!(this._reduced && this.phase === "idle")) this._update(dt);
    this._draw();
    this._raf = requestAnimationFrame((tt) => this._loop(tt));
  }

  private _update(dt: number) {
    if (this._freeze > 0) {
      this._freeze -= dt;
      if (this._freeze <= 0 && this._pendingDeath) {
        this._pendingDeath = false;
        this._finishDeath();
      }
      return;
    }
    // palette lerp
    if (!this._settled) {
      const lr = Math.min(1, dt * 4.2);
      let maxD = 0;
      for (const k of Object.keys(this.cur) as (keyof Palette)[]) {
        const c = this.cur[k], g = this.tgt[k];
        for (let i = 0; i < 3; i++) {
          c[i] += (g[i] - c[i]) * lr;
          const d = Math.abs(g[i] - c[i]);
          if (d > maxD) maxD = d;
        }
      }
      if (maxD < 0.5) {
        for (const k of Object.keys(this.cur) as (keyof Palette)[]) for (let i = 0; i < 3; i++) this.cur[k][i] = this.tgt[k][i];
        this._settled = true;
      }
      this._skyCache = null;
    }
    for (const cl of this.clouds) {
      cl.x -= (8 + cl.s * 10) * dt * this.S * (this.phase === "running" ? 1 : 0.4);
      if (cl.x < -200) cl.x = this.W + 100 + Math.random() * 300;
    }
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    // warp
    if (this._warpT >= 0) {
      this._warpT += dt;
      if (!this._warpApplied && this._warpT >= this.WARP * 0.42) {
        this._warpApplied = true;
        if (this._pendingWorld) this._applyWorld(this._pendingWorld, false);
        this._pendingWorld = null;
      }
      if (this._warpT >= this.WARP) this._warpT = -1;
    }

    if (this.phase !== "running") return;

    this.speed = Math.min(this.MAX_SPEED, this.speed + this.ACCEL * dt);
    this.worldX += this.speed * dt;
    this.score += (this.speed / this.S) * dt * 0.025;

    // imperative HUD
    const si = Math.round(this.score);
    if (si !== this._lastScore) {
      this._lastScore = si;
      if (this.hooks.onScore) this.hooks.onScore(si, Math.max(this.best, si));
      const m = Math.floor(si / 100);
      if (m > this._milestone) {
        this._milestone = m;
        this.blip(988, 0.08, "square", 0);
        this.blip(1319, 0.12, "square", 0.09);
        if (this.hooks.onMilestone) this.hooks.onMilestone();
      }
    }

    // trail sample
    this.trail.push({ x: this.worldX, jy: this.char.jy });
    if (this.trail.length > 26) this.trail.shift();

    // physics
    const c = this.char;
    if (this._squash > 0) this._squash = Math.max(0, this._squash - dt);
    if (c.jumping) {
      const fe = dt * 60;
      c.jy += (c.sdrop ? c.jv * this.SDROP : c.jv) * fe;
      c.jv += this.GRAV * fe;
      if (c.jy < this.DMINJ || c.sdrop) c.minH = true;
      if (c.jy < this.DMAXJ || c.sdrop) this.endJump();
      if (c.jy > this.DGY) {
        if (c.sdrop && !this._reduced) {
          this._shake = 0.08;
          this._shakeMag = 2;
        }
        c.jy = this.DGY;
        c.jv = 0;
        c.jumping = false;
        c.sdrop = false;
        this._dust();
        this._squash = 0.1;
        if (this._t <= this._jumpBuf) {
          this._jumpBuf = 0;
          this.startJump();
        }
      }
    }

    this.worldT += dt;
    if (this.worldT >= this.WORLD_SECS && this._warpT < 0) this._nextWorld();

    // spawn — exact dino gap formula
    if (this.worldX + this.W > this._nextSpawn) {
      const vd = this.speed / (60 * this.S);
      const words = this.world ? this.world.words : ["HYPE"];
      const allowBird = vd > 6.3 && !this._lastDrone && Math.random() < 0.42;
      let owU: number, minGapU: number;
      if (allowBird) {
        owU = 46;
        minGapU = 150;
        const high = Math.random() < 0.5;
        this.obstacles.push({ kind: "bird", x: this._nextSpawn, w: 46 * this.S, h: 26 * this.S, cy: this.groundY - (high ? 46 : 20) * this.S, word: words[(Math.random() * words.length) | 0], seed: Math.random() });
        this._lastDrone = true;
      } else {
        const seg = 1 + Math.floor(Math.random() * 3);
        owU = 17 + (seg > 2 ? 8 : 0);
        minGapU = 120;
        this.obstacles.push({ kind: "cactus", x: this._nextSpawn, w: owU * this.S, h: (32 + seg * 8) * this.S, cy: 0, word: words[(Math.random() * words.length) | 0], seed: Math.random() });
        this._lastDrone = false;
      }
      const minGap = Math.round(owU * vd + minGapU * 0.6);
      const gap = minGap + Math.random() * (minGap * 0.5);
      this._nextSpawn += gap * this.S;
    }

    // collision
    const feetY = this.groundY - (this.DGY - c.jy) * this.S;
    const cTop = c.duck ? feetY - 22 * this.S : feetY - 40 * this.S;
    const cBot = feetY, cL = c.x - 11 * this.S, cR = c.x + 13 * this.S;
    for (const o of this.obstacles) {
      const sx = o.x - this.worldX;
      let oL: number, oR: number, oT: number, oB: number;
      if (o.kind === "cactus") {
        oL = sx - o.w / 2;
        oR = sx + o.w / 2;
        oT = this.groundY - o.h;
        oB = this.groundY;
      } else {
        oL = sx - o.w / 2;
        oR = sx + o.w / 2;
        oT = o.cy - o.h / 2;
        oB = o.cy + o.h / 2;
      }
      const inset = 3 * this.S;
      if (cR - inset > oL + inset && cL + inset < oR - inset && cBot - inset > oT + inset && cTop + inset < oB - inset) {
        this.die();
        return;
      }
      if (!o.counted && sx <= c.x) {
        o.counted = true;
        const over = oT - cBot, under = cTop - oB;
        const clr = over >= 0 ? over : under >= 0 ? under : -1;
        if (clr >= 0 && clr < 8 * this.S) {
          this._closeT = 0.7;
          this.blip(1480, 0.06, "square");
        }
      }
    }
    this.obstacles = this.obstacles.filter((o) => o.x - this.worldX > -160 * this.S);
  }

  private _dust() {
    for (let i = 0; i < 6; i++)
      this.particles.push({ x: this.char.x - 4, y: this.groundY, vx: (-40 - Math.random() * 80) * this.S, vy: (-20 - Math.random() * 60) * this.S, g: 200 * this.S, life: 0.4 + Math.random() * 0.3, kind: "dust" });
  }
  private _burst(n: number) {
    const feetY = this.groundY - (this.DGY - this.char.jy) * this.S;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (0.25 + Math.random() * 0.5);
      const sp = (60 + Math.random() * 120) * this.S;
      this.particles.push({ x: this.char.x, y: feetY - 10 * this.S, vx: -Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6, g: -60 * this.S, life: 0.3 + Math.random() * 0.25, kind: "ember" });
    }
  }

  // ------------------------------------------------------------- draw
  private _draw() {
    const ctx = this.ctx, W = this.W, H = this.H, S = this.S;
    const cur = this.cur;
    const accS = rgbStr(cur.accent);
    const gY = this.groundY;
    const view = this.view;
    const t = this._t;
    const reduced = this._reduced;

    const shaking = this._shake > 0 && !reduced;
    if (shaking) {
      const m = this._shakeMag * Math.min(1, this._shake * 6) * S;
      ctx.save();
      ctx.translate((Math.random() * 2 - 1) * m, (Math.random() * 2 - 1) * m);
    }

    // ---- sky
    if (!this._skyCache) {
      const g = ctx.createLinearGradient(0, -16, 0, gY);
      g.addColorStop(0, rgbStr(cur.sky0));
      g.addColorStop(0.55, rgbStr(cur.sky1));
      g.addColorStop(1, rgbStr(cur.sky2));
      this._skyCache = g;
    }
    ctx.fillStyle = this._skyCache;
    ctx.fillRect(-16, -16, W + 32, H + 32);

    // ---- stars
    if (view.stars) {
      const tw = reduced ? 0 : t;
      for (let i = 0; i < this._starSeed.length; i++) {
        const s = this._starSeed[i];
        const sx = wrap(s[0] * W - this.worldX * 0.01, W);
        const sy = s[1] * gY * 0.75;
        const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(tw * (0.6 + s[2]) + i));
        ctx.fillStyle = rgbStr(cur.ink, a * 0.5);
        const r = (s[2] > 0.85 ? 1.6 : 0.9) * S;
        ctx.fillRect(sx, sy, r, r);
      }
    }

    // ---- celestial body
    if (view.sun) {
      const su = view.sun;
      const sx = su.x * W - this.worldX * 0.008;
      const sy = su.y * gY;
      const r = su.r * Math.min(W, H * 1.4);
      const scol = hexToRgb(su.color);
      const halo = ctx.createRadialGradient(sx, sy, r * 0.3, sx, sy, r * 2.4);
      halo.addColorStop(0, rgbStr(scol, su.halo * 0.5));
      halo.addColorStop(1, rgbStr(scol, 0));
      ctx.fillStyle = halo;
      ctx.fillRect(sx - r * 2.4, sy - r * 2.4, r * 4.8, r * 4.8);
      ctx.fillStyle = rgbStr(scol, 0.9);
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
      // horizon slice lines through the disc (retro cut)
      ctx.fillStyle = this._skyCache;
      for (let i = 0; i < 4; i++) {
        const ly = sy + r * (0.25 + i * 0.2);
        if (ly < sy + r) ctx.fillRect(sx - r, ly, r * 2, (2 + i) * S * 0.8);
      }
    }

    // ---- home grid (idle brand look)
    if (view.motif === "home") {
      ctx.strokeStyle = rgbStr(cur.ink, 0.05);
      ctx.lineWidth = 1;
      const cell = 40;
      const gx0 = -wrap(this.worldX * 0.2, cell);
      for (let x = gx0; x < W; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    // ---- far silhouettes (huge scale)
    this._silhouette(view.far, 0.05, 1.0, rgbStr(cur.sky0, view.dark ? 0.55 : 0.12));
    // ---- mid silhouettes
    this._silhouette(view.mid, 0.16, 0.55, rgbStr(cur.sky0, view.dark ? 0.8 : 0.2));

    // ---- light shafts (dark worlds)
    if (view.dark && !reduced) {
      const tw = t * 0.1;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i++) {
        const bx = wrap(i * W * 0.45 - this.worldX * 0.03 + Math.sin(tw + i * 2) * 40 * S, W * 1.4) - W * 0.2;
        const g = ctx.createLinearGradient(bx, 0, bx + 140 * S, gY);
        g.addColorStop(0, rgbStr(cur.accent, 0.05));
        g.addColorStop(1, rgbStr(cur.accent, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(bx, -10);
        ctx.lineTo(bx + 70 * S, -10);
        ctx.lineTo(bx + 260 * S, gY);
        ctx.lineTo(bx + 80 * S, gY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // ---- clouds
    ctx.strokeStyle = rgbStr(cur.ink, 0.12);
    ctx.lineWidth = 1.5;
    for (const cl of this.clouds) {
      ctx.beginPath();
      ctx.arc(cl.x, cl.y, 22 * cl.s * S, Math.PI * 0.15, Math.PI * 0.95, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cl.x + 26 * cl.s * S, cl.y + 4 * S, 16 * cl.s * S, Math.PI * 0.1, Math.PI, true);
      ctx.stroke();
    }

    // ---- motif (near-field scene)
    this._motif(view.motif, ctx, this.worldX, t, S, W, gY, cur, reduced);

    // ---- fog band above ground
    const fg = ctx.createLinearGradient(0, gY - 110 * S, 0, gY);
    fg.addColorStop(0, rgbStr(cur.sky2, 0));
    fg.addColorStop(1, rgbStr(cur.sky2, view.dark ? 0.5 : 0.35));
    ctx.fillStyle = fg;
    ctx.fillRect(0, gY - 110 * S, W, 110 * S);

    // ---- near ridges
    this._ridge(this.h2, 0.30, 0.70, rgbStr(cur.ink, 0.08));
    this._ridge(this.h1, 0.5, 0.78, rgbStr(cur.ink, 0.14));

    // ---- background buildings (behind the runner — never occlude the player)
    if (view.motif !== "home") {
      ctx.fillStyle = rgbStr(cur.sky0, 0.9);
      for (let i = 0; i < this._fgSeed.length; i++) {
        const s = this._fgSeed[i];
        const period = W * 2.2;
        const fx = wrap(s[0] * period - this.worldX * 0.7, period) - W * 0.4;
        const fw = (90 + s[1] * 200) * S;
        const fh = (40 + s[2] * 110) * S;
        if (fx > W + fw || fx + fw < -fw) continue;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(fx, H - fh + 10, fw, fh + 20, 14 * S);
        else ctx.rect(fx, H - fh + 10, fw, fh + 20);
        ctx.fill();
        // accent rim on top
        ctx.strokeStyle = rgbStr(cur.accent, 0.25);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(fx + 6 * S, H - fh + 10);
        ctx.lineTo(fx + fw - 6 * S, H - fh + 10);
        ctx.stroke();
      }
    }

    // ---- speed lines
    const sp = this.speed / this.MAX_SPEED;
    if (this.phase === "running" && sp > 0.5 && !reduced) {
      const k = (sp - 0.5) / 0.5;
      const count = 4 + Math.floor(k * 9);
      ctx.strokeStyle = rgbStr(cur.accent, 0.1 + 0.2 * k);
      ctx.lineWidth = 1.2;
      for (let i = 0; i < count; i++) {
        const len = (50 + (i % 3) * 40) * S * (0.7 + k);
        const period = W + len;
        const lx = period - ((this.worldX * (1.1 + (i % 4) * 0.15) + i * 613) % period) - len;
        const ly = (30 * S + i * 57.7 * S) % Math.max(1, gY - 60 * S);
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + len, ly);
        ctx.stroke();
      }
    }

    // ---- ground
    ctx.fillStyle = rgbStr(cur.sky0, view.dark ? 0.85 : 0.05);
    ctx.fillRect(0, gY, W, H - gY);
    ctx.strokeStyle = accS;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(W, gY);
    ctx.stroke();
    // glow line above the ground
    const gl = ctx.createLinearGradient(0, gY - 8 * S, 0, gY);
    gl.addColorStop(0, rgbStr(cur.accent, 0));
    gl.addColorStop(1, rgbStr(cur.accent, 0.35));
    ctx.fillStyle = gl;
    ctx.fillRect(0, gY - 8 * S, W, 8 * S);
    ctx.strokeStyle = rgbStr(cur.ink, 0.2);
    ctx.lineWidth = 1;
    const step = 58 * S;
    const st = Math.floor(this.worldX / step) * step;
    for (let n = 0; n < W / step + 2; n++) {
      const sx = st + n * step - this.worldX;
      if (sx < 0 || sx > W) continue;
      ctx.beginPath();
      ctx.moveTo(sx, gY + 4 * S);
      ctx.lineTo(sx, gY + 10 * S);
      ctx.stroke();
    }

    // ---- obstacles
    for (const o of this.obstacles) {
      const sx = o.x - this.worldX;
      if (sx < -90 || sx > W + 90) continue;
      const lbl = this._labelCache.get(o.word);
      if (o.kind === "cactus") this._drawMonolith(sx, o, lbl);
      else this._drawDrone(sx, o, lbl);
    }

    // ---- particles
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.kind === "ember" ? 1.6 : 2) * S, 0, Math.PI * 2);
      ctx.fillStyle = p.kind === "ember" ? rgbStr(cur.accent, Math.max(0, p.life * 2)) : rgbStr(cur.ink, Math.max(0, p.life));
      ctx.fill();
    }

    // ---- mascot ribbon trail
    if (this.phase === "running" && !reduced && this.trail.length > 3) {
      const pl = cur.player;
      ctx.save();
      ctx.lineCap = "round";
      const n = this.trail.length;
      for (let i = 1; i < n; i++) {
        const a = this.trail[i - 1], b = this.trail[i];
        const f = i / n;
        const ax = this.char.x - (this.worldX - a.x), ay = gY - (this.DGY - a.jy) * S - 20 * S;
        const bx = this.char.x - (this.worldX - b.x), by = gY - (this.DGY - b.jy) * S - 20 * S;
        if (ax < -20) continue;
        ctx.strokeStyle = rgbStr(pl, f * 0.35);
        ctx.lineWidth = f * 7 * S;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();
    }

    this._drawMascot();

    // ---- near-miss
    if (this._closeT > 0 && this.phase === "running") {
      const a = this._closeT / 0.7;
      const fy = gY - (this.DGY - this.char.jy) * S;
      ctx.fillStyle = rgbStr(cur.accent, Math.min(1, a + 0.15));
      ctx.font = `700 ${Math.round(11 * S)}px ${this._mono}`;
      ctx.textAlign = "center";
      ctx.fillText("CLOSE!", this.char.x + 2 * S, fy - (54 + (1 - a) * 16) * S);
      ctx.textAlign = "start";
    }

    // ---- warp overlay
    if (this._warpT >= 0 && !reduced) this._drawWarp();

    if (shaking) ctx.restore();

    // ---- vignette
    if (view.dark) {
      const vg = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.5, W / 2, H * 0.55, H * 1.05);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    }

    // ---- grain
    if (this._grain) {
      if (!reduced) this._grainTick = (this._grainTick + 1) % 6;
      const jx = (this._grainTick * 53) % 160, jy = (this._grainTick * 31) % 160;
      ctx.save();
      ctx.globalAlpha = 0.03;
      ctx.translate(-jx, -jy);
      ctx.fillStyle = this._grain;
      ctx.fillRect(0, 0, W + 160, H + 160);
      ctx.restore();
    }
  }

  private _drawWarp() {
    const ctx = this.ctx, W = this.W, H = this.H;
    const p = clamp(this._warpT / this.WARP, 0, 1);
    const cur = this.cur;
    // horizontal hyperspeed streaks
    const mid = Math.sin(p * Math.PI); // 0→1→0
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 26; i++) {
      const y = (i * 197.3) % H;
      const len = (0.2 + ((i * 73) % 100) / 100 * 0.9) * W * mid;
      const x = W - ((this._t * (900 + (i % 5) * 400) + i * 613) % (W + len));
      ctx.strokeStyle = rgbStr(cur.accent, 0.25 * mid);
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
    ctx.restore();
    // flash at midpoint
    const fl = clamp(1 - Math.abs(p - 0.42) * 6, 0, 1);
    if (fl > 0) {
      ctx.fillStyle = rgbStr(cur.accent, fl * 0.35);
      ctx.fillRect(0, 0, W, H);
    }
    // letterbox bars
    const bar = easeOut(Math.min(p * 2.4, (1 - p) * 2.8, 1)) * H * 0.11;
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, W, bar);
    ctx.fillRect(0, H - bar, W, bar);
    // world name slam
    if (this._nameCache && p > 0.45) {
      const q = clamp((p - 0.45) / 0.5, 0, 1);
      const alpha = q < 0.15 ? q / 0.15 : q > 0.82 ? (1 - q) / 0.18 : 1;
      const sc = 1.25 - easeOut(Math.min(1, q * 2.2)) * 0.25;
      const nm = this._nameCache;
      const dw = Math.min(nm.width, W * 0.9) * sc;
      const dh = nm.height * (dw / nm.width);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(nm, (W - dw) / 2, H * 0.42 - dh / 2, dw, dh);
      ctx.globalAlpha = alpha * 0.9;
      const tag = this.world ? this.world.tag : "";
      ctx.fillStyle = rgbStr(cur.accent);
      ctx.font = `600 ${Math.round(12 * this.S)}px ${this._mono}`;
      ctx.textAlign = "center";
      ctx.fillText(`//  ${tag}  //`, W / 2, H * 0.42 - dh / 2 - 14 * this.S);
      ctx.textAlign = "start";
      ctx.restore();
    }
  }

  // -------- silhouettes (big parallax layers)
  private _silhouette(type: SilhouetteKind, parallax: number, hScale: number, color: string) {
    if (!type || type === "none") return;
    const ctx = this.ctx, W = this.W, S = this.S, gY = this.groundY;
    const base = gY;
    const maxH = this.H * 0.62 * hScale;
    const off = this.worldX * parallax;
    ctx.fillStyle = color;
    if (type === "towers" || type === "slabs" || type === "graph") {
      const seg = (type === "graph" ? 60 : 110) * S;
      const i0 = Math.floor(off / seg);
      for (let i = i0; (i - i0) * seg < W + seg * 2; i++) {
        const x = i * seg - off;
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r2 = Math.abs(Math.sin(i * 78.233) * 12543.85) % 1;
        const h = maxH * (0.25 + r1 * 0.75);
        const w = seg * (type === "graph" ? 0.72 : 0.55 + r2 * 0.4);
        ctx.fillRect(x, base - h, w, h);
        if (type === "towers" && r2 > 0.6) ctx.fillRect(x + w * 0.4, base - h - 26 * S, 2 * S, 26 * S);
      }
    } else if (type === "peaks" || type === "waves") {
      const seg = 170 * S;
      const i0 = Math.floor(off / seg);
      ctx.beginPath();
      ctx.moveTo(-20, base);
      for (let i = i0; (i - i0) * seg < W + seg * 3; i++) {
        const x = i * seg - off;
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const h = maxH * (0.3 + r1 * 0.7);
        if (type === "peaks") {
          ctx.lineTo(x + seg / 2, base - h);
          ctx.lineTo(x + seg, base);
        } else ctx.quadraticCurveTo(x + seg / 2, base - h, x + seg, base - maxH * 0.12);
      }
      ctx.lineTo(W + 20, base);
      ctx.closePath();
      ctx.fill();
    } else if (type === "domes") {
      const seg = 240 * S;
      const i0 = Math.floor(off / seg);
      for (let i = i0; (i - i0) * seg < W + seg * 2; i++) {
        const x = i * seg - off;
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r = maxH * (0.3 + r1 * 0.5);
        ctx.beginPath();
        ctx.arc(x + seg / 2, base, r, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
      }
    } else if (type === "crystals") {
      const seg = 150 * S;
      const i0 = Math.floor(off / seg);
      for (let i = i0; (i - i0) * seg < W + seg * 2; i++) {
        const x = i * seg - off;
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r2 = Math.abs(Math.sin(i * 78.233) * 12543.85) % 1;
        const h = maxH * (0.3 + r1 * 0.7);
        const w = seg * (0.3 + r2 * 0.3);
        const tilt = (r2 - 0.5) * w * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.lineTo(x + w / 2 + tilt, base - h);
        ctx.lineTo(x + w, base);
        ctx.closePath();
        ctx.fill();
      }
    } else if (type === "gears") {
      const seg = 260 * S;
      const i0 = Math.floor(off / seg);
      for (let i = i0; (i - i0) * seg < W + seg * 2; i++) {
        const x = i * seg - off + seg / 2;
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r = maxH * (0.22 + r1 * 0.3);
        const cy = base - r * 0.4;
        const rot = this.worldX * parallax * 0.004 * (i % 2 ? 1 : -1);
        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.fill();
        // teeth
        for (let k = 0; k < 8; k++) {
          const a = rot + (k / 8) * Math.PI * 2;
          const tx = x + Math.cos(a) * r, ty = cy + Math.sin(a) * r;
          ctx.fillRect(tx - 5 * S, ty - 5 * S, 10 * S, 10 * S);
        }
      }
    } else if (type === "crowd") {
      // demo-day crowd: rows of head-dots at the bottom of the frame
      const rows = 3;
      for (let ry = 0; ry < rows; ry++) {
        const y = base - (10 + ry * 16) * S;
        const seg = 26 * S;
        const roff = off * (1 + ry * 0.3);
        const i0 = Math.floor(roff / seg);
        for (let i = i0; (i - i0) * seg < W + seg; i++) {
          const x = i * seg - roff;
          const r1 = Math.abs(Math.sin(i * 12.9898 + ry) * 43758.5453) % 1;
          ctx.beginPath();
          ctx.arc(x, y + r1 * 5 * S, (5 + r1 * 3) * S, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  private _ridge(arr: number[], parallax: number, baseFrac: number, color: string) {
    const ctx = this.ctx, W = this.W, H = this.H, S = this.S;
    const seg = 80 * S;
    const off = (this.worldX * parallax) % seg;
    const base = H * baseFrac;
    ctx.beginPath();
    ctx.moveTo(0, H);
    let x = -seg - off, i = 0;
    ctx.lineTo(x, base);
    while (x < W + seg) {
      const h = arr[i % arr.length] * S;
      x += seg;
      ctx.lineTo(x - seg / 2, base - h);
      ctx.lineTo(x, base);
      i++;
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // -------- near-field motifs per world
  private _motif(kind: MotifKind, ctx: CanvasRenderingContext2D, scroll: number, t: number, S: number, W: number, gY: number, c: Palette, reduced: boolean) {
    const tt = reduced ? 0 : t;
    const A = c.accent, I = c.ink;
    if (kind === "vanish") {
      const topB = gY - 190 * S, period = 150 * S, off = (scroll * 0.5) % period;
      ctx.save();
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 12; i++) {
        const x = wrap(i * period - off, W + period) - period * 0.4 + (i % 3) * 24 * S;
        const cyc = wrap((reduced ? 0.25 : t) * 0.3 + i * 0.41, 1);
        const y = gY - 64 * S - cyc * (gY - 64 * S - topB);
        const a = (1 - cyc) * 0.6;
        if (a <= 0.02) continue;
        const w = 12 * S, h = 15 * S;
        ctx.strokeStyle = rgbStr(A, a);
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.moveTo(x + w - 4 * S, y);
        ctx.lineTo(x + w, y + 4 * S);
        ctx.stroke();
        if (cyc > 0.55) {
          ctx.fillStyle = rgbStr(A, a * 0.7);
          ctx.fillRect(x + 3 * S, y - 7 * S, 2 * S, 2 * S);
          ctx.fillRect(x + 8 * S, y - 12 * S, 1.6 * S, 1.6 * S);
        }
      }
      ctx.restore();
    } else if (kind === "companion") {
      const midY = gY - 130 * S, period = 200 * S, off = (scroll * 0.4) % period;
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = rgbStr(A, 0.2);
      ctx.setLineDash([6 * S, 6 * S]);
      ctx.lineDashOffset = -tt * 36 * S;
      for (let col = -1; col * period - off < W + period; col++) {
        const x = col * period - off;
        for (let lane = 0; lane < 3; lane++) {
          const ny = midY + (lane - 1) * 46 * S;
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
          const ny = midY + (lane - 1) * 46 * S;
          const pr = (4 + Math.sin(tt * 2 + col + lane) * 0.9) * S;
          const glow = ctx.createRadialGradient(x, ny, 0, x, ny, pr * 3);
          glow.addColorStop(0, rgbStr(A, 0.4));
          glow.addColorStop(1, rgbStr(A, 0));
          ctx.fillStyle = glow;
          ctx.fillRect(x - pr * 3, ny - pr * 3, pr * 6, pr * 6);
          ctx.fillStyle = rgbStr(A, 0.7);
          ctx.beginPath();
          ctx.arc(x, ny, pr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (kind === "vibedrift") {
      const baseY = gY - 60 * S, amp = 52 * S, sc = scroll * 0.6;
      ctx.save();
      ctx.strokeStyle = rgbStr(I, 0.16);
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
      ctx.fillStyle = rgbStr(A, 0.12);
      ctx.fill();
      ctx.beginPath();
      for (let x = 0; x <= W; x += 10 * S) {
        if (x === 0) ctx.moveTo(x, f(x));
        else ctx.lineTo(x, f(x));
      }
      ctx.strokeStyle = rgbStr(A, 0.6);
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
    } else if (kind === "granite") {
      const topB = 70 * S, botB = gY - 170 * S, N = 10;
      const fieldW = W + 200 * S;
      const off = wrap(scroll * 0.18, fieldW);
      const nx = (i: number) => wrap((i / N) * fieldW + (Math.sin(i * 12.9) * 0.5 + 0.5) * 70 * S - off, fieldW) - 100 * S;
      const ny = (i: number) => topB + (Math.sin(i * 7.7) * 0.5 + 0.5) * (botB - topB);
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgbStr(A, 0.2);
      for (let i = 0; i < N; i++) {
        const ax = nx(i), ay = ny(i), j = (i + 1) % N, bx = nx(j), by = ny(j);
        if (Math.abs(ax - bx) < 260 * S) {
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
      for (let i = 0; i < N; i++) {
        const x = nx(i), y = ny(i);
        const tw2 = 0.6 + 0.4 * Math.sin(tt * 1.5 + i);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 12 * S);
        glow.addColorStop(0, rgbStr(A, 0.3 * tw2));
        glow.addColorStop(1, rgbStr(A, 0));
        ctx.fillStyle = glow;
        ctx.fillRect(x - 12 * S, y - 12 * S, 24 * S, 24 * S);
        ctx.fillStyle = rgbStr(A, 0.3 + 0.5 * tw2);
        ctx.beginPath();
        ctx.arc(x, y, 3.4 * S, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (kind === "agentflow") {
      const laneY = gY - 112 * S, period = 150 * S, off = (scroll * 0.45) % period;
      ctx.save();
      ctx.strokeStyle = rgbStr(I, 0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, laneY + 24 * S);
      ctx.lineTo(W, laneY + 24 * S);
      ctx.stroke();
      for (let i = -1; i * period - off < W; i++) {
        const x = i * period - off;
        ctx.strokeStyle = rgbStr(A, 0.5);
        ctx.lineWidth = 1.4;
        ctx.strokeRect(x, laneY - 16 * S, 38 * S, 32 * S);
        ctx.fillStyle = rgbStr(A, 0.12);
        ctx.fillRect(x, laneY - 16 * S, 38 * S, 32 * S);
      }
      const cp = 50 * S;
      const coff = (scroll * 0.45 + tt * 50 * S) % cp;
      ctx.strokeStyle = rgbStr(A, 0.4);
      ctx.lineWidth = 1.6;
      for (let x = -coff; x < W; x += cp) {
        ctx.beginPath();
        ctx.moveTo(x, laneY - 5 * S);
        ctx.lineTo(x + 7 * S, laneY + 1 * S);
        ctx.lineTo(x, laneY + 7 * S);
        ctx.stroke();
      }
      ctx.restore();
    } else if (kind === "vibecoding") {
      const baseY = gY - 125 * S, sc = scroll * 0.5;
      const f = (x: number) => baseY + Math.sin((x + sc) / (52 * S) + tt) * 30 * S;
      ctx.save();
      ctx.strokeStyle = rgbStr(A, 0.55);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8 * S) {
        if (x === 0) ctx.moveTo(x, f(x));
        else ctx.lineTo(x, f(x));
      }
      ctx.stroke();
      const period = 90 * S, off = sc % period;
      for (let i = -1; i * period - off < W; i++) {
        const x = i * period - off + (i % 2) * 30 * S;
        const y = f(x);
        const w = (12 + (i % 3) * 9) * S;
        ctx.fillStyle = rgbStr(A, 0.28);
        ctx.fillRect(x, y - 3.5 * S, w, 7 * S);
      }
      ctx.restore();
    } else if (kind === "yc") {
      const cx = W * 0.5, topY = 40 * S, baseY = gY - 8 * S;
      ctx.save();
      const grad = ctx.createLinearGradient(0, topY, 0, baseY);
      grad.addColorStop(0, rgbStr(A, 0.2));
      grad.addColorStop(1, rgbStr(A, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx - 16 * S, topY);
      ctx.lineTo(cx + 16 * S, topY);
      ctx.lineTo(cx + 180 * S, baseY);
      ctx.lineTo(cx - 180 * S, baseY);
      ctx.closePath();
      ctx.fill();
      const yy = gY - 140 * S, ys = 38 * S;
      ctx.strokeStyle = rgbStr(A, 0.9);
      ctx.lineWidth = 7 * S;
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
      ctx.fillStyle = rgbStr(A, 0.55);
      ctx.font = `600 ${Math.round(12 * S)}px ${this._mono}`;
      ctx.textAlign = "center";
      ctx.fillText("W24", cx, yy + ys + 20 * S);
      ctx.textAlign = "start";
      ctx.restore();
    }
  }

  // -------- obstacles
  private _drawMonolith(sx: number, o: Obstacle, lbl?: HTMLCanvasElement) {
    const ctx = this.ctx, S = this.S, gY = this.groundY, cur = this.cur;
    const bx = sx - o.w / 2, by = gY - o.h;
    // glow base
    const glow = ctx.createRadialGradient(sx, gY, 0, sx, gY, o.h * 1.1);
    glow.addColorStop(0, rgbStr(cur.accent, 0.14));
    glow.addColorStop(1, rgbStr(cur.accent, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(sx - o.h, gY - o.h * 1.1, o.h * 2, o.h * 1.1);
    // slab
    ctx.fillStyle = rgbStr(cur.ink);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, o.w, o.h, [3 * S, 3 * S, 0, 0]);
    else ctx.rect(bx, by, o.w, o.h);
    ctx.fill();
    // accent rim (left edge facing runner)
    ctx.strokeStyle = rgbStr(cur.accent, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, gY);
    ctx.lineTo(bx, by + 3 * S);
    ctx.lineTo(bx + 3 * S, by);
    ctx.stroke();
    if (lbl) {
      ctx.save();
      ctx.translate(sx + o.w / 2 + 10 * S, by + o.h - 2 * S);
      ctx.rotate(-Math.PI / 2);
      ctx.drawImage(lbl, 0, -lbl.height / 2);
      ctx.restore();
    }
  }
  private _drawDrone(sx: number, o: Obstacle, lbl?: HTMLCanvasElement) {
    const ctx = this.ctx, S = this.S, cur = this.cur;
    const bob = Math.sin(this._t * 5 + (o.seed || 0) * 9) * 2.5 * S;
    const cy = o.cy + bob;
    // rotor blur
    const spin = this._t * 30;
    ctx.strokeStyle = rgbStr(cur.ink, 0.5);
    ctx.lineWidth = 1.6;
    const rl = o.w * 0.34;
    ctx.beginPath();
    ctx.moveTo(sx - rl * Math.abs(Math.cos(spin)), cy - o.h * 0.62);
    ctx.lineTo(sx + rl * Math.abs(Math.cos(spin)), cy - o.h * 0.62);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx, cy - o.h * 0.62);
    ctx.lineTo(sx, cy - o.h * 0.34);
    ctx.stroke();
    // hex body
    ctx.fillStyle = rgbStr(cur.ink);
    const r = o.h * 0.5;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
      const px = sx + Math.cos(a) * o.w * 0.3, py = cy + Math.sin(a) * r * 0.8;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    // eye light (blinking)
    const blink = 0.5 + 0.5 * Math.sin(this._t * 6 + (o.seed || 0) * 20);
    ctx.fillStyle = rgbStr(cur.accent, 0.4 + blink * 0.6);
    ctx.beginPath();
    ctx.arc(sx - o.w * 0.18, cy, 2.6 * S, 0, Math.PI * 2);
    ctx.fill();
    if (lbl) ctx.drawImage(lbl, sx - lbl.width / 2, cy - o.h / 2 - 14 * S - lbl.height / 2);
  }

  // -------- mascot: "Volt", a comet courier
  private _drawMascot() {
    const ctx = this.ctx, c = this.char, S = this.S, cur = this.cur;
    const feetY = this.groundY - (this.DGY - c.jy) * S;
    const player = rgbStr(cur.player);
    const paperTop = rgbStr(cur.sky0);
    const run = Math.sin(this._t * (this.phase === "running" ? 18 : 4));
    const air = c.jumping;
    const sq = this._squash > 0 ? this._squash / 0.1 : 0;
    const lean = this.phase === "running" ? clamp(0.12 + (air ? -c.jv * 0.012 : 0), -0.25, 0.3) : 0;
    // glow under mascot
    const glow = ctx.createRadialGradient(c.x, feetY - 18 * S, 0, c.x, feetY - 18 * S, 44 * S);
    glow.addColorStop(0, rgbStr(cur.player, 0.22));
    glow.addColorStop(1, rgbStr(cur.player, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(c.x - 44 * S, feetY - 62 * S, 88 * S, 88 * S);

    ctx.save();
    ctx.translate(c.x, feetY);
    ctx.rotate(lean);
    ctx.scale(S * (1 + sq * 0.2), S * (1 - sq * 0.24));
    ctx.fillStyle = player;
    if (c.duck && !air) {
      // slide pose — flattened comet
      ctx.beginPath();
      ctx.ellipse(2, -9, 19, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // visor
      ctx.fillStyle = paperTop;
      ctx.beginPath();
      ctx.ellipse(11, -10, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgbStr(cur.player);
      ctx.beginPath();
      ctx.arc(12.5, -10, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // spark tail
      ctx.strokeStyle = rgbStr(cur.accent, 0.9);
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-14, -11);
      ctx.lineTo(-22, -8);
      ctx.lineTo(-17, -6);
      ctx.lineTo(-26, -3);
      ctx.stroke();
    } else {
      const stretch = air ? 1.14 : 1;
      const bodyH = 17 * stretch;
      // body: teardrop capsule
      ctx.beginPath();
      ctx.ellipse(0, -bodyH, 11.5, bodyH, 0, 0, Math.PI * 2);
      ctx.fill();
      // head bump
      ctx.beginPath();
      ctx.arc(4, -bodyH - 9, 9.5, 0, Math.PI * 2);
      ctx.fill();
      // visor face
      ctx.fillStyle = paperTop;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(1, -bodyH - 14, 12, 9, 4.5);
      else ctx.rect(1, -bodyH - 14, 12, 9);
      ctx.fill();
      // pupils (look up while airborne)
      ctx.fillStyle = player;
      const py = air ? -bodyH - 11 : -bodyH - 9.5;
      ctx.beginPath();
      ctx.arc(5.5, py, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(10, py, 1.7, 0, Math.PI * 2);
      ctx.fill();
      // antenna spark
      ctx.strokeStyle = player;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(2, -bodyH - 17);
      ctx.lineTo(0, -bodyH - 23);
      ctx.stroke();
      const tw = 0.6 + 0.4 * Math.sin(this._t * 9);
      ctx.fillStyle = rgbStr(cur.accent, tw);
      ctx.beginPath();
      ctx.arc(-0.5, -bodyH - 25, 2.4, 0, Math.PI * 2);
      ctx.fill();
      // spark tail (lightning zig)
      ctx.strokeStyle = rgbStr(cur.accent, 0.9);
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-10, -bodyH - 2);
      ctx.lineTo(-18, -bodyH + 2);
      ctx.lineTo(-13, -bodyH + 4);
      ctx.lineTo(-22, -bodyH + 9);
      ctx.stroke();
      // legs
      ctx.strokeStyle = player;
      ctx.lineWidth = 2.6;
      ctx.lineCap = "round";
      if (air) {
        ctx.beginPath();
        ctx.moveTo(-3, -3);
        ctx.lineTo(-7, 0);
        ctx.moveTo(4, -3);
        ctx.lineTo(8, -1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-2, -2);
        ctx.lineTo(-2 + run * 7, 0);
        ctx.moveTo(5, -2);
        ctx.lineTo(5 - run * 7, 0);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}
