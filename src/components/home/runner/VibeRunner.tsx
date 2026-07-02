"use client";

import React from "react";
import { DIMENSIONS, SCENE_DRAW, type Dimension, type SceneFn } from "./dimensions";

/*
 * VibeRunner — the playable endless-runner hero, embedded inside the existing
 * warm-paper homepage (TopNav + sections + Footer are provided by the page).
 *
 * Difficulty mirrors the Chrome/Firefox T-Rex runner exactly: the engine runs
 * the dino's per-frame model (SPEED 6 -> MAX 13 px/frame, ACCELERATION 0.001,
 * GRAVITY 0.6, jumpV = -(10 + speed/10), gap = round(w*speed + minGap*0.6) up
 * to x1.5) scaled to the canvas by S = W/620 so the felt difficulty and the
 * "crank up" match the real game regardless of viewport size.
 *
 * Each run cycles "our worlds" (products, services, the YC backing). Every world
 * has its own art direction — paper, ink, accent, player colour, background
 * motif — and a presentation panel that stays for the whole world. There is no
 * level system. Worlds change quickly so you see several in one run.
 *
 * INVARIANT — the score/best HUD is written imperatively via wrapRef querySelector
 * each frame; those [data-hud] nodes render once with static defaults and never
 * sit inside a conditional, so React never reconciles over the engine's writes.
 */

const MONO = "var(--font-geist-mono), monospace";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";

type Phase = "idle" | "running" | "dead";

interface WorldView {
  tag: string;
  name: string;
  line: string;
  ink: string;
  accent: string;
  paper: string;
  url: string;
  logo?: string;
  linkLabel?: string;
  external?: boolean;
}

interface DiscoveredDim {
  name: string;
  url: string;
  logo?: string;
  accent: string;
  external?: boolean;
}

interface VibeRunnerProps {
  pauseMotion?: boolean;
}

interface VibeRunnerState {
  phase: Phase;
  sound: boolean;
  world: WorldView | null;
  finalScore: string;
  bestScore: string;
  deadKicker: string;
  deadTitle: string;
  discovered: DiscoveredDim[];
  visitedNames: string[];
}

interface Char {
  x: number;
  jy: number; // dino yPos in units (rest = 93; smaller = higher)
  jv: number; // jump velocity, units/frame
  jumping: boolean;
  reachedMinHeight: boolean;
  speedDrop: boolean;
  ducking: boolean;
}
interface Obstacle {
  kind: "cactus" | "bird";
  x: number;
  w: number;
  h: number;
  cy: number;
  word: string;
  counted?: boolean; // near-miss check done (presentation only)
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
interface Cloud {
  x: number;
  y: number;
  s: number;
}

const HOME_DA = { paper: "#fdfbf7", ink: "#0a0a0a", accent: "#0a0a0a", player: "#0a0a0a" };

export class VibeRunner extends React.Component<VibeRunnerProps, VibeRunnerState> {
  static defaultProps: Required<VibeRunnerProps> = { pauseMotion: false };

  private canvasRef = React.createRef<HTMLCanvasElement>();
  private wrapRef = React.createRef<HTMLDivElement>();

  private score = 0;
  private best = 0;

  // canvas / loop
  private ctx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private S = 1; // px per dino unit (difficulty scale)
  private groundY = 0;
  private originX = 0;
  private _onResize!: () => void;
  private _last = 0;
  private _t = 0;
  private _raf = 0;
  private _reducedMotion = false;
  private _visible = true;
  private _io: IntersectionObserver | null = null;

  // dino-derived px constants (set in tune())
  private BASE_SPEED = 0;
  private MAX_SPEED = 0;
  private ACCEL = 0;
  private WORLD_SECS = 0;

  // exact Chrome T-Rex jump constants (in dino units / per-frame @60fps)
  private readonly DINO_GROUND_Y = 93; // Trex rest yPos (150 - HEIGHT 47 - BOTTOM_PAD 10)
  private readonly DINO_MIN_JUMP_Y = 63; // groundY - MIN_JUMP_HEIGHT(30)
  private readonly DINO_MAX_JUMP_Y = 30; // MAX_JUMP_HEIGHT
  private readonly DINO_GRAV = 0.6;
  private readonly DINO_INIT_JV = -10; // INITIAL_JUMP_VELOCITY
  private readonly DINO_DROP_V = -5; // DROP_VELOCITY
  private readonly DINO_SPEED_DROP = 3; // SPEED_DROP_COEFFICIENT

  // terrain
  private hills1: number[] = [];
  private hills2: number[] = [];
  private clouds: Cloud[] = [];

  // run state
  private speed = 0;
  private worldX = 0;
  private char!: Char;
  private obstacles: Obstacle[] = [];
  private particles: Particle[] = [];
  private _nextSpawnX = 0;
  private _lastWasDrone = false;
  private _jumpBufferUntil = 0;
  private _landSquash = 0;

  // game feel (presentation only — physics untouched)
  private _freeze = 0; // hit-stop timer on death
  private _pendingDeath = false;
  private _shake = 0; // shake time remaining
  private _shakeMag = 0; // px at S=1
  private _deadAt = -1; // _t when the overlay appeared (dino GAMEOVER_CLEAR_TIME)
  private _closeT = 0; // near-miss "CLOSE" flash timer
  private _lastMilestone = 0;

  // render caches (rebuilt on palette epoch / dimension / resize)
  private _settled = true; // palette lerp converged
  private _skyGrad: CanvasGradient | null = null;
  private _washGrad: CanvasGradient | null = null;
  private _grainPattern: CanvasPattern | null = null;
  private _grainTick = 0;
  private _wm: HTMLCanvasElement | null = null; // dimension-name watermark
  private _labelCache = new Map<string, HTMLCanvasElement>();
  private _monoFamily = "monospace";
  private _sansFamily = "sans-serif";
  private _lastScoreShown = -1;
  private _lastBestShown = -1;

  // runner trail ring buffer (feet-Y samples)
  private _trail = new Float32Array(12);
  private _trailIdx = 0;
  private _trailTick = 0;

  // world rotation + art-direction colour lerp
  private worldOrder: number[] = [];
  private worldPos = -1;
  private _worldT = 0;
  private curWords: string[] = [];
  private curScene: SceneFn | null = null;
  private curDim: Dimension | null = null;
  private visited: Dimension[] = [];
  private _lastShownIdx = -1;
  private _firstWorld = true;
  // portal transition between dimensions
  private _portalActive = false;
  private _portalT = 0;
  private readonly PORTAL_DUR = 0.5;
  private _pendingDim: Dimension | null = null;
  private _pendingApplied = false;
  private cur = { paper: [253, 251, 247], ink: [10, 10, 10], accent: [10, 10, 10], player: [10, 10, 10] };
  private tgt = { paper: [253, 251, 247], ink: [10, 10, 10], accent: [10, 10, 10], player: [10, 10, 10] };

  // audio
  private _ac: AudioContext | null = null;

  // input handlers
  private _kd!: (e: KeyboardEvent) => void;
  private _ku!: (e: KeyboardEvent) => void;
  private _pd!: (e: PointerEvent) => void;
  private _pu!: () => void;
  private _touchDuck = false;

  private DEATHS: [string, string][] = [
    ["CAUGHT BY THE HYPE", "The hype caught up."],
    ["TRIPPED ON A BUZZWORD", "Synergy got you."],
    ["DEPLOY FAILED", "Shipping interrupted."],
  ];

  constructor(props: VibeRunnerProps) {
    super(props);
    this.state = {
      phase: "idle",
      sound: false,
      world: null,
      finalScore: "0",
      bestScore: "0",
      deadKicker: "CAUGHT BY THE HYPE",
      deadTitle: "Shipping interrupted.",
      discovered: [],
      visitedNames: [],
    };
  }

  onToggleSound = () => {
    this.ensureAudio();
    if (this._ac && this._ac.state === "suspended") this._ac.resume();
    this.setState({ sound: !this.state.sound });
  };
  onRestart = () => this.restart();

  componentDidMount() {
    const cv = this.canvasRef.current!;
    // Opaque + desynchronized: the bg is repainted every frame, so no alpha is
    // needed; desynchronized lowers input latency where supported.
    this.ctx = (cv.getContext("2d", { alpha: false, desynchronized: true }) ?? cv.getContext("2d"))!;
    try {
      this._reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      this._reducedMotion = false;
    }
    // ctx.font cannot resolve CSS var() strings — resolve the real families once.
    try {
      const cs = getComputedStyle(document.body);
      this._monoFamily = cs.getPropertyValue("--font-geist-mono").trim() || "monospace";
      this._sansFamily = cs.getPropertyValue("--font-geist-sans").trim() || "sans-serif";
    } catch {
      /* keep fallbacks */
    }
    this.buildGrain();
    this._onResize = () => this.resize();
    window.addEventListener("resize", this._onResize);
    this.resize();
    try {
      this.best = parseInt(localStorage.getItem("vibeco_runner_best") || "0", 10) || 0;
    } catch {
      this.best = 0;
    }
    this.reset();
    this.bindInput();
    this._last = performance.now();
    this._io = new IntersectionObserver(
      (entries) => {
        this._visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    this._io.observe(cv);
    this._raf = requestAnimationFrame((t) => this.loop(t));
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._raf);
    if (this._io) this._io.disconnect();
    window.removeEventListener("resize", this._onResize);
    this.unbind();
    if (this._ac) {
      this._ac.close().catch(() => {});
      this._ac = null;
    }
  }

  // ---------- sizing / dino-scaled tuning ----------
  resize() {
    const cv = this.canvasRef.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    this.W = Math.max(320, r.width);
    this.H = Math.max(260, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(this.W * dpr);
    cv.height = Math.round(this.H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // S maps the canvas onto the dino's ~620-unit play width so the difficulty
    // (approach time, gaps, jump arc) matches the real T-Rex runner.
    this.S = Math.max(0.7, Math.min(1.85, this.W / 700));
    this.tune();
    this.groundY = this.H - Math.max(54, this.H * 0.12);
    this.originX = Math.max(60, this.W * 0.16);
    if (this.char) this.char.x = this.originX;
    this.genHills();
    // size-dependent caches
    this._skyGrad = null;
    this._washGrad = null;
    if (this.curDim) {
      this.buildWatermark(this.curDim);
      this._labelCache.clear(); // px scale changed — rebuild at the new size
      this.buildLabels(this.curDim);
    }
  }

  tune() {
    const S = this.S;
    const FPS = 60;
    this.BASE_SPEED = 6 * FPS * S; // dino SPEED 6 px/frame
    this.MAX_SPEED = 13 * FPS * S; // dino MAX_SPEED 13
    this.ACCEL = 0.001 * FPS * FPS * S * 0.85; // dino ACCELERATION, mildly eased crank-up
    this.WORLD_SECS = 6; // short: see several worlds per run
  }

  // ---------- render caches ----------
  buildGrain() {
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
    this._grainPattern = this.ctx.createPattern(tile, "repeat");
  }
  // giant editorial watermark of the dimension name, pre-rendered once
  buildWatermark(d: Dimension) {
    const size = Math.round(Math.max(64, this.H * 0.2));
    const cnv = document.createElement("canvas");
    const cc = cnv.getContext("2d");
    if (!cc) return;
    const font = `800 ${size}px ${this._sansFamily}`;
    cc.font = font;
    const w = Math.ceil(cc.measureText(d.name).width) + 8;
    cnv.width = Math.max(8, w);
    cnv.height = Math.round(size * 1.24);
    cc.font = font; // reset after resize
    cc.textBaseline = "top";
    const ink = this.hexToRgb(d.ink);
    cc.fillStyle = `rgb(${ink[0]},${ink[1]},${ink[2]})`;
    cc.fillText(d.name, 4, size * 0.08);
    this._wm = cnv;
  }
  // obstacle word labels pre-rendered (rotated fillText per frame is costly).
  // The cache is additive: obstacles from the previous dimension are still on
  // screen after a portal, so their words must keep resolving (cleared in reset).
  buildLabels(d: Dimension) {
    const accent = this.hexToRgb(d.accent);
    const px = Math.max(8, Math.round(9 * this.S));
    for (const word of d.words) {
      if (this._labelCache.has(word)) continue;
      const cnv = document.createElement("canvas");
      const cc = cnv.getContext("2d");
      if (!cc) continue;
      const font = `500 ${px}px ${this._monoFamily}`;
      cc.font = font;
      const w = Math.ceil(cc.measureText(word).width) + 4;
      cnv.width = Math.max(8, w);
      cnv.height = px + 4;
      cc.font = font;
      cc.textBaseline = "top";
      cc.fillStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},0.95)`;
      cc.fillText(word, 2, 2);
      this._labelCache.set(word, cnv);
    }
  }

  genHills() {
    this.hills1 = [];
    this.hills2 = [];
    for (let i = 0; i < 60; i++) {
      this.hills1.push((30 + Math.random() * 46) * this.S);
      this.hills2.push((16 + Math.random() * 26) * this.S);
    }
    this.clouds = [];
    for (let i = 0; i < 6; i++)
      this.clouds.push({ x: Math.random() * 2000, y: this.H * (0.16 + Math.random() * 0.34), s: 0.5 + Math.random() * 0.6 });
  }

  reset() {
    this.score = 0;
    this.worldOrder = this.shuffle(DIMENSIONS.map((_, i) => i));
    // variety: never open on the dimension the previous run ended on
    if (this.worldOrder.length > 1 && this.worldOrder[0] === this._lastShownIdx) {
      const t0 = this.worldOrder[0];
      this.worldOrder[0] = this.worldOrder[1];
      this.worldOrder[1] = t0;
    }
    this.worldPos = -1;
    this._worldT = 0;
    this.curWords = ["HYPE", "SYNERGY", "BUZZWORD"];
    this.curScene = null;
    this.curDim = null;
    this.visited = [];
    this._firstWorld = true;
    this._portalActive = false;
    this._pendingDim = null;
    this.setColours(HOME_DA, true);
    this.speed = this.BASE_SPEED;
    this.worldX = 0;
    this.char = { x: this.originX, jy: this.DINO_GROUND_Y, jv: 0, jumping: false, reachedMinHeight: false, speedDrop: false, ducking: false };
    this.obstacles = [];
    this.particles = [];
    this._nextSpawnX = this.W + 200;
    this._lastWasDrone = false;
    // presentation state
    this._freeze = 0;
    this._pendingDeath = false;
    this._shake = 0;
    this._closeT = 0;
    this._lastMilestone = 0;
    this._lastScoreShown = -1;
    this._lastBestShown = -1;
    this._trail.fill(0);
    this._wm = null;
    this._labelCache.clear();
  }

  // ---------- audio ----------
  ensureAudio() {
    if (this._ac) return;
    try {
      const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this._ac = Ctx ? new Ctx() : null;
    } catch {
      this._ac = null;
    }
  }
  blip(freq: number, dur?: number, type?: OscillatorType, when = 0, endFreq?: number) {
    if (!this.state.sound || !this._ac) return;
    const ac = this._ac;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const t0 = ac.currentTime + when;
    const d = dur || 0.09;
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
  // dimension-change arpeggio: root + major third + fifth of the world's "key"
  arpeggio(root: number) {
    this.blip(root, 0.09, "sine", 0);
    this.blip(root * 1.26, 0.09, "sine", 0.07);
    this.blip(root * 1.5, 0.14, "sine", 0.14);
  }
  // dino-style two-tone milestone beep
  milestoneBeep() {
    this.blip(988, 0.08, "square", 0);
    this.blip(1319, 0.12, "square", 0.09);
  }
  // low death thud
  thud() {
    this.blip(90, 0.28, "sine", 0, 42);
    this.blip(140, 0.12, "sawtooth", 0);
  }

  // ---------- input ----------
  startOrJump() {
    if (this.state.phase === "idle") {
      this.beginPlay();
      return;
    }
    if (this.state.phase === "dead") {
      // dino GAMEOVER_CLEAR_TIME: the jump key restarts once 750ms have passed
      if (this._deadAt >= 0 && this._t - this._deadAt > 0.75) this.restart();
      return;
    }
    const c = this.char;
    if (!c.jumping && !c.ducking) this.startJump();
    else if (c.jumping) this._jumpBufferUntil = this._t + 0.14; // buffer a press near landing
  }
  // exact Trex.startJump
  startJump() {
    const c = this.char;
    if (c.jumping || c.ducking) return;
    const vd = this.speed / (60 * this.S);
    c.jv = this.DINO_INIT_JV - vd / 10; // jumpVelocity = -(10 + speed/10)
    c.jumping = true;
    c.reachedMinHeight = false;
    c.speedDrop = false;
    this._landSquash = 0;
    this.spawnDust();
    this.blip(520, 0.08, "square");
  }
  // exact Trex.endJump — key release caps the rise
  endJump() {
    const c = this.char;
    if (c.reachedMinHeight && c.jv < this.DINO_DROP_V) c.jv = this.DINO_DROP_V;
  }
  // exact Trex.setSpeedDrop — Down while airborne snaps the runner down
  setSpeedDrop() {
    this.char.speedDrop = true;
    this.char.jv = 1;
  }
  setDuck(on: boolean) {
    if (this.state.phase !== "running") return;
    const c = this.char;
    if (on) {
      if (c.jumping) this.setSpeedDrop();
      else c.ducking = true;
    } else {
      c.speedDrop = false;
      c.ducking = false;
    }
  }
  beginPlay() {
    this.ensureAudio();
    // Drop focus so the score/sound button can't swallow the Space key.
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) document.activeElement.blur();
    this.setChrome(true);
    // generous clear runway before the first obstacle (dino CLEAR_TIME)
    this._nextSpawnX = this.worldX + this.W + this.BASE_SPEED * 1.2;
    this._jumpBufferUntil = 0;
    this.setState({ phase: "running" });
    this.nextWorld();
  }
  restart() {
    this.reset();
    this.beginPlay();
  }

  // death happens in two beats: a hit-stop freeze-frame + shake, then the overlay
  die() {
    this.thud();
    if (this._reducedMotion) {
      this.finishDeath();
      return;
    }
    this._freeze = 0.09;
    this._pendingDeath = true;
    this._shake = 0.32;
    this._shakeMag = 6;
  }
  finishDeath() {
    if (this.score > this.best) {
      this.best = Math.round(this.score);
      try {
        localStorage.setItem("vibeco_runner_best", String(this.best));
      } catch {
        /* storage unavailable */
      }
    }
    const d = this.DEATHS[Math.floor(Math.random() * this.DEATHS.length)];
    this._deadAt = this._t;
    const discovered: DiscoveredDim[] = this.visited.map((dm) => ({ name: dm.name, url: dm.url, logo: dm.logo, accent: dm.accent, external: dm.external }));
    this.setState({ phase: "dead", finalScore: String(Math.round(this.score)), bestScore: String(this.best), deadKicker: d[0], deadTitle: d[1], discovered });
  }

  bindInput() {
    this._kd = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        // While playing, jump always wins — never swallowed by a focused link/button.
        if (this.state.phase === "running") {
          e.preventDefault();
          this.startOrJump();
          return;
        }
        if (e.target instanceof Element && e.target.closest("a, button")) return;
        e.preventDefault();
        this.startOrJump();
      } else if (e.code === "ArrowDown") {
        if (this.state.phase === "running") {
          e.preventDefault();
          this.setDuck(true);
        }
      }
    };
    this._ku = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        if (this.state.phase === "running") e.preventDefault(); // keep ↓ captive during play (no page scroll)
        this.setDuck(false);
      } else if ((e.code === "Space" || e.code === "ArrowUp") && this.state.phase === "running") this.endJump();
    };
    this._pd = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest("a, button")) return;
      const r = this.canvasRef.current!.getBoundingClientRect();
      const localY = e.clientY - r.top;
      if (localY > r.height * 0.62 && this.state.phase === "running") {
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
    const cv = this.canvasRef.current!;
    window.addEventListener("keydown", this._kd);
    window.addEventListener("keyup", this._ku);
    cv.addEventListener("pointerdown", this._pd);
    window.addEventListener("pointerup", this._pu);
    window.addEventListener("pointercancel", this._pu);
  }
  unbind() {
    window.removeEventListener("keydown", this._kd);
    window.removeEventListener("keyup", this._ku);
    window.removeEventListener("pointerup", this._pu);
    window.removeEventListener("pointercancel", this._pu);
    const cv = this.canvasRef.current;
    if (cv) cv.removeEventListener("pointerdown", this._pd);
  }

  spawnDust() {
    for (let i = 0; i < 6; i++)
      this.particles.push({ x: this.char.x - 4, y: this.groundY, vx: (-40 - Math.random() * 80) * this.S, vy: (-20 - Math.random() * 60) * this.S, life: 0.4 + Math.random() * 0.3 });
  }

  // ---------- worlds + colour lerp ----------
  hexToRgb(h: string) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  setColours(da: { paper: string; ink: string; accent: string; player: string }, instant: boolean) {
    this.tgt = { paper: this.hexToRgb(da.paper), ink: this.hexToRgb(da.ink), accent: this.hexToRgb(da.accent), player: this.hexToRgb(da.player) };
    if (instant) this.cur = { paper: [...this.tgt.paper], ink: [...this.tgt.ink], accent: [...this.tgt.accent], player: [...this.tgt.player] };
    this._settled = instant;
    this._skyGrad = null;
    this._washGrad = null;
  }
  shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  nextWorld() {
    this._worldT = 0;
    this.worldPos = (this.worldPos + 1) % this.worldOrder.length;
    const idx = this.worldOrder[this.worldPos];
    this._lastShownIdx = idx;
    const d = DIMENSIONS[idx];
    const first = this._firstWorld;
    this._firstWorld = false;
    if (first || this._reducedMotion) {
      // first dimension of the run / reduced motion: apply with no wipe
      this.applyDimension(d, this._reducedMotion);
      return;
    }
    // start a portal transition; the dimension is applied at the midpoint
    this._pendingDim = d;
    this._pendingApplied = false;
    this._portalActive = true;
    this._portalT = 0;
  }
  applyDimension(d: Dimension, instantColour: boolean) {
    this.curDim = d;
    this.curScene = SCENE_DRAW[d.scene];
    this.curWords = d.words;
    this.setColours(d, instantColour);
    this.buildWatermark(d);
    this.buildLabels(d);
    this.arpeggio(d.tag === "BACKED BY" ? 523 : d.tag === "PRODUCT" ? 440 : 392);
    if (!this.visited.includes(d)) this.visited.push(d);
    this.setState({
      world: { tag: d.tag, name: d.name, line: d.line, ink: d.ink, accent: d.accent, paper: d.paper, url: d.url, logo: d.logo, linkLabel: d.linkLabel, external: d.external },
      visitedNames: this.visited.map((v) => v.name),
    });
  }

  // ---------- update ----------
  loop(t: number) {
    if (!this._visible) {
      this._last = t;
      this._raf = requestAnimationFrame((tt) => this.loop(tt));
      return;
    }
    const dt = Math.min(0.034, (t - this._last) / 1000) || 0.016;
    this._last = t;
    this._t += dt;
    // decay presentation timers (shake / near-miss flash) even during freeze
    if (this._shake > 0) this._shake = Math.max(0, this._shake - dt);
    if (this._closeT > 0) this._closeT = Math.max(0, this._closeT - dt);
    const idleStill = this._reducedMotion && this.state.phase === "idle";
    if (!this.props.pauseMotion && !idleStill) this.update(dt);
    this.draw();
    this._raf = requestAnimationFrame((tt) => this.loop(tt));
  }

  update(dt: number) {
    // hit-stop: freeze the whole sim for a beat, then show the death overlay
    if (this._freeze > 0) {
      this._freeze -= dt;
      if (this._freeze <= 0 && this._pendingDeath) {
        this._pendingDeath = false;
        this.finishDeath();
      }
      return;
    }
    // colour lerp toward the current world's art direction; snap + skip once converged
    if (!this._settled) {
      const lr = Math.min(1, dt * 3.4);
      let maxD = 0;
      for (const k of ["paper", "ink", "accent", "player"] as const) {
        const c = this.cur[k],
          g = this.tgt[k];
        c[0] += (g[0] - c[0]) * lr;
        c[1] += (g[1] - c[1]) * lr;
        c[2] += (g[2] - c[2]) * lr;
        for (let i = 0; i < 3; i++) {
          const d = Math.abs(g[i] - c[i]);
          if (d > maxD) maxD = d;
        }
      }
      if (maxD < 0.5) {
        for (const k of ["paper", "ink", "accent", "player"] as const) {
          this.cur[k][0] = this.tgt[k][0];
          this.cur[k][1] = this.tgt[k][1];
          this.cur[k][2] = this.tgt[k][2];
        }
        this._settled = true;
      }
      this._skyGrad = null; // palette moved -> rebuild cached gradients
      this._washGrad = null;
    }
    // clouds drift always
    for (const cl of this.clouds) {
      cl.x -= (8 + cl.s * 10) * dt * this.S * (this.state.phase === "running" ? 1 : 0.4);
      if (cl.x < -200) cl.x = this.W + 100 + Math.random() * 300;
    }
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * this.S * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.state.phase !== "running") return;

    // dino: continuous acceleration toward max speed
    this.speed = Math.min(this.MAX_SPEED, this.speed + this.ACCEL * dt);
    this.worldX += this.speed * dt;
    this.score += (this.speed / this.S) * dt * 0.025; // dino DISTANCE_COEFFICIENT

    // HUD (imperative — see invariant note); write only when the integer changes
    const scoreInt = Math.round(this.score);
    if (scoreInt !== this._lastScoreShown) {
      this._lastScoreShown = scoreInt;
      const hud = this.wrapRef.current;
      if (hud) {
        const sc = hud.querySelector('[data-hud="score"]');
        if (sc) sc.textContent = String(scoreInt);
        const bestInt = Math.max(this.best, scoreInt);
        if (bestInt !== this._lastBestShown) {
          this._lastBestShown = bestInt;
          const bs = hud.querySelector('[data-hud="best"]');
          if (bs) bs.textContent = String(bestInt);
        }
        // dino-authentic milestone: every 100 pts, flash the score + two-tone beep
        const m = Math.floor(scoreInt / 100);
        if (m > this._lastMilestone) {
          this._lastMilestone = m;
          this.milestoneBeep();
          const sc2 = hud.querySelector('[data-hud="score"]') as HTMLElement | null;
          if (sc2 && typeof sc2.animate === "function" && !this._reducedMotion) {
            sc2.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 240, iterations: 3 });
          }
        }
      }
    }

    // runner trail: sample feet height a few times per second (ring buffer)
    this._trailTick += dt;
    if (this._trailTick > 0.033) {
      this._trailTick = 0;
      this._trail[this._trailIdx] = this.char.jy;
      this._trailIdx = (this._trailIdx + 1) % this._trail.length;
    }

    // char physics — authentic dino jump (variable height + speed drop)
    const c = this.char;
    if (this._landSquash > 0) this._landSquash = Math.max(0, this._landSquash - dt);
    if (c.jumping) {
      const fe = dt * 60; // frames elapsed @ 60fps
      c.jy += (c.speedDrop ? c.jv * this.DINO_SPEED_DROP : c.jv) * fe;
      c.jv += this.DINO_GRAV * fe;
      if (c.jy < this.DINO_MIN_JUMP_Y || c.speedDrop) c.reachedMinHeight = true;
      if (c.jy < this.DINO_MAX_JUMP_Y || c.speedDrop) this.endJump();
      if (c.jy > this.DINO_GROUND_Y) {
        // landed
        if (c.speedDrop && !this._reducedMotion) {
          // reward the ↓ slam with a tiny impact shake
          this._shake = 0.08;
          this._shakeMag = 2;
        }
        c.jy = this.DINO_GROUND_Y;
        c.jv = 0;
        c.jumping = false;
        c.speedDrop = false;
        this.spawnDust();
        this._landSquash = 0.1;
        if (this._t <= this._jumpBufferUntil) {
          this._jumpBufferUntil = 0;
          this.startJump();
        }
      }
    }

    // worlds: switch every WORLD_SECS
    this._worldT += dt;
    if (this._worldT >= this.WORLD_SECS) this.nextWorld();

    // portal transition: swap the dimension behind the wipe at its midpoint
    if (this._portalActive) {
      this._portalT += dt;
      if (!this._pendingApplied && this._portalT >= this.PORTAL_DUR / 2) {
        this._pendingApplied = true;
        if (this._pendingDim) this.applyDimension(this._pendingDim, false);
        this._pendingDim = null;
      }
      if (this._portalT >= this.PORTAL_DUR) this._portalActive = false;
    }

    // spawn obstacles — exact dino gap formula (no artificial floor)
    if (this.worldX + this.W > this._nextSpawnX) {
      const vd = this.speed / (60 * this.S); // dino units per frame
      // pterodactyls appear once warmed up (dino minSpeed 8.5, lowered so a
      // homepage run actually reaches them), at two heights: duck or jump.
      const allowBird = vd > 6.3 && !this._lastWasDrone && Math.random() < 0.42;
      let owUnits: number, minGapUnits: number;
      if (allowBird) {
        owUnits = 46;
        minGapUnits = 150;
        const high = Math.random() < 0.5; // high bird -> duck under; low bird -> jump over
        this.obstacles.push({ kind: "bird", x: this._nextSpawnX, w: 46 * this.S, h: 26 * this.S, cy: this.groundY - (high ? 46 : 20) * this.S, word: this.curWords[Math.floor(Math.random() * this.curWords.length)] });
        this._lastWasDrone = true;
      } else {
        const seg = 1 + Math.floor(Math.random() * 3);
        owUnits = 17 + (seg > 2 ? 8 : 0);
        minGapUnits = 120;
        this.obstacles.push({ kind: "cactus", x: this._nextSpawnX, w: owUnits * this.S, h: (32 + seg * 8) * this.S, cy: 0, word: this.curWords[Math.floor(Math.random() * this.curWords.length)] });
        this._lastWasDrone = false;
      }
      // exact dino getGap: minGap = round(width*speed + minGap*0.6); maxGap = minGap*1.5
      const minGap = Math.round(owUnits * vd + minGapUnits * 0.6);
      const maxGap = Math.round(minGap * 1.5);
      const gapUnits = minGap + Math.random() * (maxGap - minGap);
      this._nextSpawnX += gapUnits * this.S;
    }

    // collision
    const cx = c.x;
    const feetY = this.groundY - (this.DINO_GROUND_Y - c.jy) * this.S;
    const charTop = c.ducking ? feetY - 22 * this.S : feetY - 40 * this.S;
    const charBot = feetY;
    const charL = cx - 11 * this.S,
      charR = cx + 13 * this.S;
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
      if (charR - inset > oL + inset && charL + inset < oR - inset && charBot - inset > oT + inset && charTop + inset < oB - inset) {
        this.die();
        return;
      }
      // near-miss (presentation only): measure clearance as the obstacle
      // crosses the runner's center — the moment the dodge actually happens
      if (!o.counted && sx <= cx) {
        o.counted = true;
        const overGap = oT - charBot; // runner above (jumped over)
        const underGap = charTop - oB; // runner below (ducked under)
        const clr = overGap >= 0 ? overGap : underGap >= 0 ? underGap : -1;
        if (clr >= 0 && clr < 8 * this.S) {
          this._closeT = 0.7;
          this.blip(1480, 0.06, "square");
        }
      }
    }
    this.obstacles = this.obstacles.filter((o) => o.x - this.worldX > -160 * this.S);
  }

  // ---------- draw ----------
  rgb(a: number[], alpha?: number) {
    return alpha === undefined ? `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})` : `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${alpha})`;
  }
  draw() {
    const ctx = this.ctx,
      W = this.W,
      H = this.H,
      S = this.S;
    const paper = this.cur.paper,
      ink = this.cur.ink,
      acc = this.cur.accent;
    // per-frame colour strings, built once (dozens of call sites below)
    const paperStr = this.rgb(paper);
    const inkStr = this.rgb(ink);
    const accStr = this.rgb(acc, 1);

    // screen shake (presentation only)
    const shaking = this._shake > 0 && !this._reducedMotion;
    if (shaking) {
      const m = this._shakeMag * Math.min(1, this._shake * 6) * S;
      ctx.save();
      ctx.translate((Math.random() * 2 - 1) * m, (Math.random() * 2 - 1) * m);
    }

    // opaque bg (overscan a little so the shake never reveals edges)
    ctx.fillStyle = paperStr;
    ctx.fillRect(-16, -16, W + 32, H + 32);

    // sky: a whisper of the dimension's accent falling from the top (cached)
    if (!this._skyGrad) {
      const sg = ctx.createLinearGradient(0, 0, 0, this.groundY * 0.72);
      sg.addColorStop(0, this.rgb(acc, 0.055));
      sg.addColorStop(1, this.rgb(acc, 0));
      this._skyGrad = sg;
    }
    ctx.fillStyle = this._skyGrad;
    ctx.fillRect(0, 0, W, this.groundY * 0.72);

    // accent wash near the ground (cached)
    if (!this._washGrad) {
      const gg = ctx.createLinearGradient(0, this.groundY - 150 * S, 0, this.groundY);
      gg.addColorStop(0, this.rgb(acc, 0));
      gg.addColorStop(1, this.rgb(acc, 0.14));
      this._washGrad = gg;
    }
    ctx.fillStyle = this._washGrad;
    ctx.fillRect(0, this.groundY - 150 * S, W, 150 * S);

    // giant editorial watermark of the dimension name, drifting slowly
    if (this._wm) {
      const span = this._wm.width + W;
      const wx = W - ((this.worldX * 0.06) % span);
      ctx.globalAlpha = 0.05;
      ctx.drawImage(this._wm, wx, 34 * S);
      ctx.globalAlpha = 1;
    }

    // bespoke per-dimension scenery (above the ground band)
    if (this.curScene) this.curScene(ctx, this.worldX, this._t, S, W, this.groundY, this.cur, this._reducedMotion, this._monoFamily);

    // speed lines — the dino crank-up made visible
    const sp = this.speed / this.MAX_SPEED;
    if (this.state.phase === "running" && sp > 0.55 && !this._reducedMotion) {
      const k = (sp - 0.55) / 0.45;
      const count = 3 + Math.floor(k * 7);
      ctx.strokeStyle = this.rgb(acc, 0.1 + 0.16 * k);
      ctx.lineWidth = 1.2;
      for (let i = 0; i < count; i++) {
        const len = (40 + (i % 3) * 30) * S * (0.7 + k);
        const period = W + len;
        const lx = period - ((this.worldX * (1.1 + (i % 4) * 0.15) + i * 613) % period) - len;
        const ly = (30 * S + i * 57.7 * S) % Math.max(1, this.groundY - 60 * S);
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + len, ly);
        ctx.stroke();
      }
    }

    // clouds (faint arcs)
    ctx.strokeStyle = this.rgb(ink, 0.12);
    ctx.lineWidth = 1.5;
    for (const cl of this.clouds) {
      ctx.beginPath();
      ctx.arc(cl.x, cl.y, 22 * cl.s * S, Math.PI * 0.15, Math.PI * 0.95, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cl.x + 26 * cl.s * S, cl.y + 4 * S, 16 * cl.s * S, Math.PI * 0.1, Math.PI, true);
      ctx.stroke();
    }

    // parallax hills
    this.drawRidge(this.hills2, 0.18, 0.66, this.rgb(ink, 0.09));
    this.drawRidge(this.hills1, 0.42, 0.74, this.rgb(ink, 0.16));

    // ground
    const gY = this.groundY;
    ctx.fillStyle = this.rgb(ink, 0.03);
    ctx.fillRect(0, gY, W, H - gY);
    ctx.strokeStyle = accStr;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(W, gY);
    ctx.stroke();
    ctx.strokeStyle = this.rgb(ink, 0.18);
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

    // obstacles (labels are pre-rendered canvases — no per-frame text shaping)
    for (const o of this.obstacles) {
      const sx = o.x - this.worldX;
      if (sx < -80 || sx > W + 80) continue;
      const lbl = this._labelCache.get(o.word);
      ctx.fillStyle = inkStr;
      if (o.kind === "cactus") {
        const bx = sx - o.w / 2,
          by = gY - o.h;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, o.w, o.h, [4 * S, 4 * S, 0, 0]);
        else ctx.rect(bx, by, o.w, o.h);
        ctx.fill();
        if (lbl) {
          ctx.save();
          ctx.translate(sx + o.w / 2 + 9 * S, by + o.h - 2 * S);
          ctx.rotate(-Math.PI / 2);
          ctx.drawImage(lbl, 0, -lbl.height / 2);
          ctx.restore();
        }
      } else {
        // pterodactyl — body + head/beak (facing the runner) + flapping wing
        const up = Math.sin(this._t * 14) > 0;
        ctx.fillStyle = inkStr;
        ctx.beginPath();
        ctx.ellipse(sx, o.cy, o.w * 0.28, o.h * 0.34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx - o.w * 0.28, o.cy - S, 3.2 * S, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx - o.w * 0.28 - 2 * S, o.cy - S);
        ctx.lineTo(sx - o.w * 0.55, o.cy);
        ctx.lineTo(sx - o.w * 0.28, o.cy + 2.5 * S);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        if (up) {
          ctx.moveTo(sx - o.w * 0.1, o.cy - 2 * S);
          ctx.lineTo(sx + o.w * 0.5, o.cy - o.h * 0.7);
          ctx.lineTo(sx + o.w * 0.12, o.cy - S);
        } else {
          ctx.moveTo(sx - o.w * 0.1, o.cy + 2 * S);
          ctx.lineTo(sx + o.w * 0.5, o.cy + o.h * 0.7);
          ctx.lineTo(sx + o.w * 0.12, o.cy + S);
        }
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx - o.w * 0.3, o.cy - 1.5 * S, S, 0, Math.PI * 2);
        ctx.fillStyle = paperStr;
        ctx.fill();
        if (lbl) ctx.drawImage(lbl, sx - lbl.width / 2, o.cy - o.h / 2 - 12 * S - lbl.height / 2);
      }
    }

    // particles
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 * S, 0, Math.PI * 2);
      ctx.fillStyle = this.rgb(ink, Math.max(0, p.life));
      ctx.fill();
    }

    // runner trail: fading afterimages at speed / mid-air
    if (this.state.phase === "running" && !this._reducedMotion && (this.char.jumping || sp > 0.6)) {
      const playerStr = this.rgb(this.cur.player);
      const n = this._trail.length;
      for (let k = 3; k >= 1; k--) {
        const jy = this._trail[(this._trailIdx - k * 3 + n * 3) % n];
        if (jy <= 0) continue;
        const fy = this.groundY - (this.DINO_GROUND_Y - jy) * S;
        ctx.globalAlpha = 0.16 - k * 0.045;
        ctx.fillStyle = playerStr;
        ctx.beginPath();
        ctx.ellipse(this.char.x - k * 13 * S, fy - 17 * S, 10 * S, 15 * S, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    this.drawChar();

    // near-miss flash
    if (this._closeT > 0 && this.state.phase === "running") {
      const a = this._closeT / 0.7;
      const fy = this.groundY - (this.DINO_GROUND_Y - this.char.jy) * S;
      ctx.fillStyle = this.rgb(acc, Math.min(1, a + 0.15));
      ctx.font = `700 ${Math.round(10 * S)}px ${this._monoFamily}`;
      ctx.textAlign = "center";
      ctx.fillText("CLOSE!", this.char.x + 2 * S, fy - (52 + (1 - a) * 16) * S);
    }

    // portal wipe — an accent sweep on top while transitioning between dimensions
    if (this._portalActive && !this._reducedMotion) {
      const p = this._portalT / this.PORTAL_DUR;
      const cxp = p * (W + W * 0.4) - W * 0.2;
      const half = W * 0.22;
      const grad = ctx.createLinearGradient(cxp - half, 0, cxp + half, 0);
      grad.addColorStop(0, this.rgb(acc, 0));
      grad.addColorStop(0.5, this.rgb(acc, 0.85));
      grad.addColorStop(1, this.rgb(acc, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    if (shaking) ctx.restore();

    // film grain — one pattern fill, jittered a step every few frames
    if (this._grainPattern) {
      if (!this._reducedMotion) this._grainTick = (this._grainTick + 1) % 6;
      const jx = (this._grainTick * 53) % 160;
      const jy2 = (this._grainTick * 31) % 160;
      ctx.save();
      ctx.globalAlpha = 0.025;
      ctx.translate(-jx, -jy2);
      ctx.fillStyle = this._grainPattern;
      ctx.fillRect(0, 0, W + 160, H + 160);
      ctx.restore();
    }
  }

  drawRidge(arr: number[], parallax: number, baseFrac: number, color: string) {
    const ctx = this.ctx,
      W = this.W,
      H = this.H,
      S = this.S;
    const seg = 80 * S;
    const off = (this.worldX * parallax) % seg;
    const base = H * baseFrac;
    ctx.beginPath();
    ctx.moveTo(0, H);
    let x = -seg - off,
      i = 0;
    ctx.lineTo(x, base);
    while (x < W + seg) {
      const h = arr[i % arr.length];
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

  drawChar() {
    const ctx = this.ctx,
      c = this.char,
      S = this.S;
    const feetY = this.groundY - (this.DINO_GROUND_Y - c.jy) * S;
    const player = this.rgb(this.cur.player);
    const paper = this.rgb(this.cur.paper);
    const run = Math.sin(this._t * (this.state.phase === "running" ? 18 : 4));
    const air = c.jumping;
    const sq = this._landSquash > 0 ? this._landSquash / 0.1 : 0; // 1 -> 0 on land
    ctx.save();
    ctx.translate(c.x, feetY);
    ctx.scale(S * (1 + sq * 0.18), S * (1 - sq * 0.22));
    ctx.fillStyle = player;
    if (c.ducking && !air) {
      ctx.beginPath();
      ctx.ellipse(2, -9, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(18, -11);
      ctx.lineTo(28, -9);
      ctx.lineTo(18, -6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(11, -11, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = paper;
      ctx.fill();
    } else {
      const stretch = air ? 1.12 : 1;
      const bodyH = 18 * stretch;
      ctx.beginPath();
      ctx.ellipse(0, -bodyH, 12, bodyH, 0, 0, Math.PI * 2);
      ctx.fillStyle = player;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, -bodyH - 11, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(13, -bodyH - 12);
      ctx.lineTo(23, -bodyH - 10);
      ctx.lineTo(13, -bodyH - 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -bodyH - 13, 1.9, 0, Math.PI * 2);
      ctx.fillStyle = paper;
      ctx.fill();
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

  // ---------- imperative chrome (marketing fade) ----------
  setChrome(hidden: boolean) {
    const w = this.wrapRef.current;
    if (!w) return;
    const m = w.querySelector('[data-ui="marketing"]') as HTMLElement | null;
    if (m) {
      m.style.transition = "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      m.style.opacity = hidden ? "0" : "1";
      m.style.transform = hidden ? "translateY(-16px)" : "translateY(0)";
      m.style.pointerEvents = hidden ? "none" : "auto";
    }
  }

  render() {
    const { phase, sound, world, finalScore, bestScore, deadKicker, deadTitle, discovered, visitedNames } = this.state;
    const isIdle = phase === "idle";
    const isDead = phase === "dead";
    const soundIcon = sound ? "♪" : "⊘";
    const hudColor = world ? world.ink : "var(--foreground)";

    return (
      <div ref={this.wrapRef} style={{ position: "relative", width: "100%", height: "clamp(560px, 86vh, 880px)", overflow: "hidden", borderBottom: "2px solid var(--foreground)" }}>
        <canvas
          ref={this.canvasRef}
          role="img"
          aria-label="Playable endless-runner game; press Space or tap to play and travel through The Vibe Company's worlds. All headline copy and links are also available as text on the page."
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", touchAction: "manipulation", cursor: "pointer" }}
        />

        {/* Marketing block — existing homepage hero tone; fades out on play.
            pointer-events stay off the block so canvas taps pass through to start;
            only the CTA opts in, and only while idle. */}
        <div data-ui="marketing" style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 2, padding: "clamp(76px, 12vh, 132px) clamp(20px, 6vw, 80px) 0", pointerEvents: "none" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid var(--foreground)", padding: "6px 14px", fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--foreground)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", animation: "vc-pulse 2s infinite" }} />
                Open to projects · Built with AI
              </span>
            </div>
            <h1 style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.92, fontSize: "clamp(40px, 7vw, 104px)", color: "var(--foreground)" }}>
              <span style={{ display: "block" }}>AI-native agency.</span>
              <span style={{ display: "block", WebkitTextStroke: "1.5px var(--foreground)", color: "transparent" }}>Everything way faster.</span>
            </h1>
            <p style={{ margin: "20px 0 0", maxWidth: 540, fontSize: "clamp(15px, 1.7vw, 19px)", lineHeight: 1.5, color: "var(--foreground)", opacity: 0.62 }}>
              A small team of AI specialists. We build products, automate ops, and train teams. Our agency itself runs on AI.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginTop: 26, pointerEvents: isIdle ? "auto" : "none" }}>
              <a href="mailto:founders@thevibecompany.co" style={{ display: "inline-flex", alignItems: "center", gap: 12, border: "2px solid var(--foreground)", background: "var(--foreground)", color: "var(--background)", padding: "14px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Book a discovery call <span aria-hidden="true">→</span>
              </a>
              <span style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--foreground)", opacity: 0.55 }}>↑ Space — discover our worlds</span>
            </div>
          </div>
        </div>

        {/* Score / sound HUD — always visible, coloured by the current world */}
        <div style={{ position: "absolute", top: "clamp(76px, 12vh, 132px)", right: "clamp(20px, 6vw, 80px)", zIndex: 3, textAlign: "right", fontFamily: MONO, pointerEvents: "auto", color: hudColor }}>
          <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.55 }}>Shipped</div>
          <div data-hud="score" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>0</div>
          <div style={{ fontSize: 11, letterSpacing: "0.06em", opacity: 0.55, marginTop: 4 }}>Best <span data-hud="best">0</span></div>
          {/* discovery progress — one dot per dimension, filled once visited */}
          {!isIdle && (
            <div style={{ display: "flex", gap: 5, justifyContent: "flex-end", marginTop: 10 }} aria-label={`${visitedNames.length} of ${DIMENSIONS.length} dimensions discovered`}>
              {DIMENSIONS.map((d) => (
                <span
                  key={d.name}
                  title={visitedNames.includes(d.name) ? d.name : undefined}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: visitedNames.includes(d.name) ? d.accent : "transparent",
                    border: visitedNames.includes(d.name) ? "1px solid transparent" : "1px solid currentColor",
                    opacity: visitedNames.includes(d.name) ? 1 : 0.35,
                  }}
                />
              ))}
            </div>
          )}
          <button onClick={this.onToggleSound} title="Toggle sound" aria-label="Toggle sound" style={{ marginTop: 12, width: 30, height: 30, borderRadius: 9999, border: "1px solid currentColor", background: "transparent", color: "currentColor", cursor: "pointer", fontSize: 13, opacity: 0.8 }}>{soundIcon}</button>
        </div>

        {/* Dimension card — persistent product card revealing this facet of TVC */}
        {world && !isIdle && !isDead && (
          <div style={{ position: "absolute", left: "clamp(20px,6vw,80px)", top: "clamp(76px,12vh,120px)", zIndex: 4, pointerEvents: "none", display: "flex", alignItems: "stretch", gap: 14, maxWidth: 540 }}>
            <span style={{ width: 4, borderRadius: 4, flex: "none", background: world.accent }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {world.logo ? (
                  <LogoImg src={world.logo} size={22} />
                ) : (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: world.accent }} />
                )}
                <span style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: world.ink, opacity: 0.7 }}>{world.tag}</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: "clamp(28px, 4.4vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginTop: 8, color: world.ink }}>{world.name}</div>
              <div style={{ fontSize: "clamp(14px, 1.6vw, 18px)", lineHeight: 1.45, marginTop: 8, color: world.ink, opacity: 0.7, maxWidth: 420 }}>{world.line}</div>
              <a
                href={world.url}
                target={world.external ? "_blank" : undefined}
                rel={world.external ? "noopener noreferrer" : undefined}
                style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", color: world.accent, textDecoration: "none", borderBottom: `1px solid ${world.accent}`, paddingBottom: 1 }}
              >
                {world.linkLabel ?? `visit ${world.name}`} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}

        {/* Controls hint while playing */}
        {!isIdle && !isDead && (
          <div style={{ position: "absolute", right: "clamp(20px,6vw,80px)", bottom: "clamp(20px,4vh,40px)", zIndex: 4, pointerEvents: "none", fontFamily: MONO, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: world ? world.ink : "var(--foreground)", opacity: 0.5 }}>
            {"Space / tap — jump   ·   ↓ / hold-low — duck"}
          </div>
        )}

        {/* Idle prompt */}
        {isIdle && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(20px,5vh,52px)", zIndex: 4, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <div data-ui="prompt" style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--foreground)", opacity: 0.6, animation: "vc-bob 1.7s ease-in-out infinite" }}>
              {"↑  Space — discover our worlds  ↑"}
            </div>
          </div>
        )}

        {/* Dead overlay */}
        {isDead && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 28, background: "rgba(10,10,10,0.68)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", color: "#fafaf7" }}>
            <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.55, marginBottom: 14 }}>
              {"// "}
              {deadKicker}
            </div>
            <h2 style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.95, fontSize: "clamp(36px, 6.5vw, 76px)" }}>{deadTitle}</h2>
            <div style={{ display: "flex", gap: 32, margin: "24px 0 26px", fontFamily: MONO }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{finalScore}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: 4 }}>Shipped</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{bestScore}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: 4 }}>Best</div>
              </div>
            </div>
            {discovered.length > 0 && (
              <div style={{ marginBottom: 24, maxWidth: 580 }}>
                <div style={{ fontFamily: MONO, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.55, marginBottom: 12 }}>Dimensions you discovered</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {discovered.map((dm) => (
                    <a
                      key={dm.name}
                      href={dm.url}
                      target={dm.external ? "_blank" : undefined}
                      rel={dm.external ? "noopener noreferrer" : undefined}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid rgba(250,250,247,0.22)", borderRadius: 8, color: "#fafaf7", textDecoration: "none", fontSize: 13 }}
                    >
                      {dm.logo && <LogoImg src={dm.logo} size={16} />}
                      <span style={{ fontWeight: 600 }}>{dm.name}</span>
                      <span aria-hidden="true" style={{ color: dm.accent }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <button onClick={this.onRestart} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", border: 0, background: "#fafaf7", color: "#0a0a0a", fontFamily: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Ship again <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#0a0a0a", color: "#fafaf7", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>↻</span>
              </button>
              <a href="mailto:founders@thevibecompany.co" style={{ display: "inline-flex", alignItems: "center", padding: "14px 24px", border: "1px solid rgba(250,250,247,0.3)", color: "#fafaf7", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Book a call →
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

// Small decorative product logo (alt="" — the dimension name is the label).
function LogoImg({ src, size }: { src: string; size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} style={{ display: "block", borderRadius: size > 18 ? 5 : 4 }} />
  );
}
