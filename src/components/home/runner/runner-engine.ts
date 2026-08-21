// Vibe Arcade V3 engine — full redesign of the runner.
// Still an endless runner at heart (dino-derived physics), but rebuilt as a real
// arcade game:
//   • Volt the comet with trail, glow, squash & stretch
//   • double jump + air DASH with invulnerability frames
//   • collectible "sparks" arranged in arcs / waves / lines → combo multiplier x1..x8
//   • juice: screen shake, hit-stop, collect bursts, near-miss flashes, vignette+grain
//   • WebAudio synth SFX (collect pitch rises with combo, warp whoosh, death thud)
//   • per-world universes kept: sky gradient, celestial body, parallax silhouettes,
//     warp transitions with letterbox + world-name slam
//
// Font families are injected via the constructor (`fonts`) — ctx.font cannot resolve
// next/font hashed names or CSS vars.

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
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

// ---------------------------------------------------------------- gameplay entities

interface Spark {
  x: number;
  y: number;
  baseY: number;
  phase: number;
  taken: boolean;
  vx: number; // magnet velocity
  vy: number;
}

interface Obstacle {
  kind: "block" | "drone";
  x: number;
  w: number;
  h: number;
  cy: number; // centre y for drones (blocks sit on ground)
  word: string;
  seed: number;
  counted: boolean;
  grazed: boolean;
}

type PKind = "dust" | "ember" | "spark" | "shard";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  life: number;
  maxLife: number;
  size: number;
  kind: PKind;
}

interface FloatText {
  x: number;
  y: number;
  text: string;
  life: number;
  accent: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  r: number;
}

// deterministic rng so silhouettes don't flicker frame to frame
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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
  onCombo?: (mult: number) => void;
}

export interface EngineFonts {
  mono: string;
  sans: string;
}

// ---------------------------------------------------------------- constants

const SPEED0 = 5.4;
const SPEED_MAX = 11.5;
const ACCEL = 0.0007;
const GRAVITY = 0.62;
const JUMP_V = -11.2;
const JUMP_V2 = -9.4; // double jump
const DASH_TIME = 14; // frames of dash
const DASH_CD = 46; // frames cooldown after dash ends
const GROUND_FRAC = 0.82; // ground line as fraction of height
const PLAYER_X_FRAC = 0.16;

export class VibeEngine {
  cv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  hooks: EngineHooks;
  fonts: EngineFonts;
  W = 0;
  H = 0;
  dpr = 1;
  raf = 0;
  destroyed = false;

  // palette (lerped during warps)
  palFrom!: Palette;
  palTo!: Palette;
  palMix = 1;
  curWorld: World = WORLDS[0];

  // run state
  phase: "idle" | "running" | "dead" = "idle";
  speed = SPEED0;
  dist = 0;
  score = 0;
  best = 0;
  frame = 0;

  // player
  px = 0;
  py = 0; // y of feet
  jv = 0;
  jumps = 0;
  duck = false;
  squash = 1; // 1 = neutral; <1 stretched vertically on jump
  facingGlow = 0;
  trail: TrailPoint[] = [];

  // dash
  dashT = 0;
  dashCd = 0;

  // combo
  combo = 1;
  comboTimer = 0;
  sparksRun = 0;

  // entities
  obstacles: Obstacle[] = [];
  sparks: Spark[] = [];
  particles: Particle[] = [];
  floats: FloatText[] = [];
  nextObsX = 0;
  nextSparkX = 0;

  // fx
  shake = 0;
  shakeX = 0;
  shakeY = 0;
  hitStop = 0;
  flash = 0;
  vignettePulse = 0;

  // warp
  warpT = -1; // <0 inactive; counts up to WARP_LEN
  WARP_LEN = 92;
  pendingWorld: World | null = null;
  visited: World[] = [];
  worldsShown = 0;

  // world scroll offsets for parallax layers
  farOff = 0;
  midOff = 0;
  bgOff = 0;
  starSeed = Math.random() * 10000;

  // idle bob
  idleT = 0;

  // input bookkeeping
  keyDownHandler: (e: KeyboardEvent) => void;
  keyUpHandler: (e: KeyboardEvent) => void;
  pointerDownHandler: (e: PointerEvent) => void;
  pointerUpHandler: (e: PointerEvent) => void;
  resizeHandler: () => void;
  visibilityHandler: () => void;
  io: IntersectionObserver | null = null;
  visible = false;
  held = false;

  // audio
  audio: AudioContext | null = null;
  soundOn = false;
  masterGain: GainNode | null = null;

  state: EngineState = {
    phase: "idle",
    world: null,
    finalScore: "0",
    bestScore: "0",
    deadKicker: "",
    deadTitle: "",
    discovered: [],
    total: WORLDS.length,
    sound: false,
  };

  constructor(canvas: HTMLCanvasElement, hooks: EngineHooks, fonts: EngineFonts) {
    this.cv = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.hooks = hooks;
    this.fonts = fonts;
    try {
      this.best = parseInt(localStorage.getItem("vibeArcadeBest") || "0", 10) || 0;
    } catch {
      this.best = 0;
    }

    this.keyDownHandler = (e: KeyboardEvent) => {
      if (!this.visible) return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        if (this.phase !== "running") {
          e.preventDefault();
          if (!this.held) this.action();
        } else {
          e.preventDefault();
          if (!this.held && !e.repeat) this.jump();
        }
        this.held = true;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        this.duck = true;
      } else if ((e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyD") && !e.repeat) {
        e.preventDefault();
        this.tryDash();
      }
    };
    this.keyUpHandler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") this.held = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") this.duck = false;
    };
    this.pointerDownHandler = (e: PointerEvent) => {
      if (!this.visible) return;
      const rect = this.cv.getBoundingClientRect();
      const y = (e.clientY - rect.top) / rect.height;
      if (this.phase !== "running") {
        this.action();
        return;
      }
      if (y > 0.72) {
        // lower zone: hold to duck; quick tap = nothing special
        this.duck = true;
      } else {
        this.jump();
      }
    };
    this.pointerUpHandler = () => {
      this.duck = false;
    };
    this.resizeHandler = () => this.resize();
    this.visibilityHandler = () => {
      if (document.hidden && this.phase === "running") this.die(true);
    };

    window.addEventListener("keydown", this.keyDownHandler);
    window.addEventListener("keyup", this.keyUpHandler);
    canvas.addEventListener("pointerdown", this.pointerDownHandler);
    window.addEventListener("pointerup", this.pointerUpHandler);
    window.addEventListener("resize", this.resizeHandler);
    document.addEventListener("visibilitychange", this.visibilityHandler);

    this.io = new IntersectionObserver(
      (entries) => {
        this.visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.15 }
    );
    this.io.observe(canvas);

    this.setPalette(HOME, true);
    this.resize();
    this.resetIdle();
    // exposed for QA / debugging (harmless in prod)
    (window as unknown as { vibeEngine?: VibeEngine }).vibeEngine = this;
    this.loop();
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.keyDownHandler);
    window.removeEventListener("keyup", this.keyUpHandler);
    this.cv.removeEventListener("pointerdown", this.pointerDownHandler);
    window.removeEventListener("pointerup", this.pointerUpHandler);
    window.removeEventListener("resize", this.resizeHandler);
    document.removeEventListener("visibilitychange", this.visibilityHandler);
    this.io?.disconnect();
    try {
      this.audio?.close();
    } catch {
      /* noop */
    }
  }

  // ---------------------------------------------------------------- public api

  toggleSound() {
    this.soundOn = !this.soundOn;
    if (this.soundOn) this.ensureAudio();
    this.emitState();
  }

  restart() {
    if (this.phase !== "running") this.start();
  }

  // ---------------------------------------------------------------- setup / resize

  resize() {
    const rect = this.cv.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = Math.max(320, rect.width);
    this.H = Math.max(360, rect.height);
    this.cv.width = Math.round(this.W * this.dpr);
    this.cv.height = Math.round(this.H * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.phase === "idle") this.resetIdle();
  }

  resetIdle() {
    this.px = this.W * PLAYER_X_FRAC;
    this.py = this.H * GROUND_FRAC;
    this.trail = [];
    this.particles = [];
    this.obstacles = [];
    this.sparks = [];
    this.floats = [];
  }

  // ---------------------------------------------------------------- lifecycle

  action() {
    if (this.phase === "idle" || this.phase === "dead") this.start();
  }

  start() {
    this.ensureAudio();
    this.curWorld = WORLDS[0];
    this.setPalette(WORLDS[0]);
    this.phase = "running";
    this.speed = SPEED0;
    this.dist = 0;
    this.score = 0;
    this.frame = 0;
    this.jumps = 0;
    this.jv = 0;
    this.py = this.H * GROUND_FRAC;
    this.combo = 1;
    this.comboTimer = 0;
    this.sparksRun = 0;
    this.dashT = 0;
    this.dashCd = 0;
    this.obstacles = [];
    this.sparks = [];
    this.particles = [];
    this.floats = [];
    this.trail = [];
    this.visited = [];
    this.worldsShown = 1;
    this.visited.push(WORLDS[0]);
    this.nextObsX = this.W * 1.6;
    this.nextSparkX = this.W * 1.15;
    this.shake = 0;
    this.flash = 0;
    this.warpT = -1;
    this.pendingWorld = null;
    this.emitState();
    this.beep(520, 0.07, "square", 0.12);
  }

  die(silent = false) {
    if (this.phase !== "running") return;
    this.phase = "dead";
    this.hitStop = 10;
    this.shake = 22;
    this.flash = 0.55;
    if (!silent) this.thud();
    // burst shards
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 6;
      this.particles.push({
        x: this.px,
        y: this.py - 18,
        vx: Math.cos(a) * sp - this.speed * 0.3,
        vy: Math.sin(a) * sp - 2,
        g: 0.18,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        size: 1.5 + Math.random() * 3,
        kind: "shard",
      });
    }
    if (this.score > this.best) {
      this.best = this.score;
      try {
        localStorage.setItem("vibeArcadeBest", String(this.best));
      } catch {
        /* private mode */
      }
    }
    const deaths: [string, string][] = [
      ["CAUGHT BY THE HYPE", "The hype caught up."],
      ["TRIPPED ON A BUZZWORD", "Synergy got you."],
      ["DEPLOY FAILED", "Shipping interrupted."],
    ];
    const pick = deaths[Math.floor(Math.random() * deaths.length)];
    this.state.deadKicker = pick[0];
    this.state.deadTitle = pick[1];
    this.state.finalScore = String(this.score);
    this.state.bestScore = String(this.best);
    this.emitState();
  }

  emitState() {
    this.state.phase = this.phase;
    this.state.world = this.phase === "running" ? this.curWorld : this.state.world;
    this.state.discovered = [...this.visited];
    this.state.total = WORLDS.length;
    this.state.sound = this.soundOn;
    if (this.phase !== "running") {
      this.state.finalScore = String(this.score);
      this.state.bestScore = String(this.best);
    }
    this.hooks.onState?.({ ...this.state });
  }

  // ---------------------------------------------------------------- palette / worlds

  setPalette(w: World, instant = false) {
    const p: Palette = {
      sky0: hexToRgb(w.sky[0]),
      sky1: hexToRgb(w.sky[1]),
      sky2: hexToRgb(w.sky[2]),
      ink: hexToRgb(w.ink),
      accent: hexToRgb(w.accent),
      player: hexToRgb(w.player),
    };
    if (instant) {
      this.palFrom = p;
      this.palTo = p;
      this.palMix = 1;
    } else {
      this.palFrom = this.palTo;
      this.palTo = p;
      this.palMix = 0;
    }
    this.curWorld = w;
  }

  mix(a: number[], b: number[], t: number): number[] {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  col(a: keyof Palette, al?: number): string {
    const c = this.mix(this.palFrom[a], this.palTo[a], easeOut(this.palMix));
    return rgbStr(c, al);
  }

  triggerWarp(next: World) {
    this.pendingWorld = next;
    this.warpT = 0;
    this.whoosh();
  }

  // ---------------------------------------------------------------- input actions

  jump() {
    if (this.phase !== "running") return;
    if (this.jumps === 0) {
      this.jv = JUMP_V;
      this.jumps = 1;
      this.squash = 0.72;
      this.puff(this.px, this.py, 8, "dust");
      this.beep(340, 0.09, "square", 0.1);
    } else if (this.jumps === 1 && this.dashT <= 0) {
      this.jv = JUMP_V2;
      this.jumps = 2;
      this.squash = 0.75;
      this.puff(this.px, this.py - 20, 12, "ember");
      this.beep(480, 0.09, "square", 0.1);
      this.floats.push({ x: this.px, y: this.py - 44, text: "2×JUMP", life: 34, accent: true });
    }
  }

  tryDash() {
    if (this.phase !== "running" || this.dashT > 0 || this.dashCd > 0) return;
    this.dashT = DASH_TIME;
    this.squash = 1.35;
    this.flash = Math.max(this.flash, 0.18);
    this.shake = Math.max(this.shake, 6);
    this.beep(720, 0.14, "sawtooth", 0.12);
    this.zap();
  }

  zap() {
    for (let i = 0; i < 16; i++) {
      const a = Math.PI * (0.65 + Math.random() * 0.7); // backwards cone
      this.particles.push({
        x: this.px,
        y: this.py - 18,
        vx: Math.cos(a) * (4 + Math.random() * 7),
        vy: -Math.sin(a) * (2 + Math.random() * 5),
        g: 0.02,
        life: 18 + Math.random() * 14,
        maxLife: 32,
        size: 1 + Math.random() * 2.4,
        kind: "ember",
      });
    }
  }

  puff(x: number, y: number, n: number, kind: PKind) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y,
        vx: -(1 + Math.random() * 3),
        vy: -Math.random() * 2.4,
        g: 0.05,
        life: 24 + Math.random() * 20,
        maxLife: 44,
        size: 1.5 + Math.random() * 2.5,
        kind,
      });
    }
  }

  collectBurst(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        g: 0.04,
        life: 22 + Math.random() * 16,
        maxLife: 38,
        size: 1 + Math.random() * 2.2,
        kind: "spark",
      });
    }
  }

  // ---------------------------------------------------------------- audio

  ensureAudio() {
    if (this.audio) {
      if (this.audio.state === "suspended") this.audio.resume().catch(() => {});
      return;
    }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audio = new AC();
      this.masterGain = this.audio.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audio.destination);
    } catch {
      this.audio = null;
    }
  }

  beep(freq: number, dur: number, type: OscillatorType, vol: number) {
    if (!this.soundOn || !this.audio || !this.masterGain) return;
    const t = this.audio.currentTime;
    const o = this.audio.createOscillator();
    const g = this.audio.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.7), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.masterGain);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  whoosh() {
    if (!this.soundOn || !this.audio || !this.masterGain) return;
    const t = this.audio.currentTime;
    const len = 0.7;
    const buf = this.audio.createBuffer(1, this.audio.sampleRate * len, this.audio.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = this.audio.createBufferSource();
    src.buffer = buf;
    const f = this.audio.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(2400, t + len * 0.7);
    const g = this.audio.createGain();
    g.gain.value = 0.25;
    src.connect(f);
    f.connect(g);
    g.connect(this.masterGain);
    src.start(t);
  }

  thud() {
    if (!this.soundOn || !this.audio || !this.masterGain) return;
    this.beep(140, 0.3, "sawtooth", 0.28);
    this.beep(70, 0.42, "square", 0.24);
  }

  collectSound(n: number) {
    // pentatonic ladder rising with streak within current combo tier
    const scale = [0, 2, 4, 7, 9, 12, 14, 16];
    const step = scale[Math.min(scale.length - 1, n % scale.length)];
    this.beep(440 * Math.pow(2, step / 12), 0.08, "triangle", 0.12);
  }

  // ---------------------------------------------------------------- spawning

  spawnObstacle(x: number) {
    const droneOk = this.speed > 8;
    const isDrone = droneOk && Math.random() < 0.32;
    const word = this.curWorld.words[Math.floor(Math.random() * this.curWorld.words.length)];
    if (isDrone) {
      const h = 26;
      const cy = this.H * GROUND_FRAC - (60 + Math.random() * 70);
      this.obstacles.push({ kind: "drone", x, w: 52 + Math.random() * 26, h, cy, word, seed: Math.random(), counted: false, grazed: false });
    } else {
      const h = 28 + Math.random() * 22;
      const w = clamp(word.length * 11 + 26, 56, 150);
      this.obstacles.push({ kind: "block", x, w, h, cy: 0, word, seed: Math.random(), counted: false, grazed: false });
    }
  }

  spawnSparks(x: number) {
    const gy = this.H * GROUND_FRAC;
    const pattern = Math.floor(Math.random() * 3);
    const n = 4 + Math.floor(Math.random() * 4);
    const gap = 34;
    for (let i = 0; i < n; i++) {
      let y: number;
      if (pattern === 0) y = gy - 90 - Math.sin((i / (n - 1)) * Math.PI) * 80; // arc over jump
      else if (pattern === 1) y = gy - 40 - (i % 2) * 66; // zigzag low/high
      else y = gy - 120 + Math.sin(i * 0.9) * 36; // wave high
      this.sparks.push({ x: x + i * gap, y, baseY: y, phase: Math.random() * Math.PI * 2, taken: false, vx: 0, vy: 0 });
    }
  }

  // ---------------------------------------------------------------- main loop

  loop = () => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (this.hitStop > 0) {
      this.hitStop--;
      this.draw();
      return;
    }
    this.idleT++;
    if (this.visible) this.update();
    this.draw();
  };

  update() {
    this.frame++;

    // fx decay
    this.shake *= 0.86;
    this.shakeX = (Math.random() - 0.5) * this.shake * 2;
    this.shakeY = (Math.random() - 0.5) * this.shake * 1.4;
    this.flash *= 0.85;
    this.vignettePulse *= 0.94;
    this.facingGlow *= 0.9;
    if (Math.abs(this.shake) < 0.1) this.shake = 0;

    // palette lerp
    if (this.palMix < 1) this.palMix = Math.min(1, this.palMix + 0.03);

    // parallax scroll even when idle (slow drift) and running
    const drift = this.phase === "running" ? 1 : 0.25;
    this.bgOff += this.speed * 0.06 * drift;
    this.farOff += this.speed * 0.22 * drift;
    this.midOff += this.speed * 0.55 * drift;

    if (this.phase === "running") this.updateRunning();
    else this.updateAmbient();

    // particles always
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx - (this.phase === "running" ? this.speed * 0.35 : 0.4);
      p.y += p.vy;
      p.vy += p.g;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.y -= 0.9;
      f.life--;
      if (f.life <= 0) this.floats.splice(i, 1);
    }

    // combo decay
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0 && this.combo > 1) {
        this.combo = 1;
        this.sparksRun = 0;
        this.hooks.onCombo?.(1);
      }
    }
  }

  updateAmbient() {
    // idle: volt hovers & breathes
    this.py = this.H * GROUND_FRAC - 26 + Math.sin(this.idleT * 0.04) * 7;
    this.px = this.W * PLAYER_X_FRAC;
    if (this.idleT % 5 === 0) {
      this.trail.unshift({ x: this.px - 14, y: this.py - 20, r: 7 });
      if (this.trail.length > 14) this.trail.pop();
    }
    for (const t of this.trail) t.x -= this.phase === "running" ? this.speed : 1.1;
  }

  updateRunning() {
    this.speed = Math.min(SPEED_MAX, this.speed + ACCEL * this.frame);
    const dx = this.speed * (this.dashT > 0 ? 2.1 : 1);
    this.dist += dx;

    // score: distance + spark pickups
    this.score = Math.floor(this.dist / 10);
    this.hooks.onScore?.(this.score, this.best);

    // ---- player physics
    this.px = this.W * PLAYER_X_FRAC;
    if (this.dashT > 0) {
      this.dashT--;
      if (this.dashT === 0) this.dashCd = DASH_CD;
      this.jv = 0; // hover during dash
      if (this.frame % 2 === 0) this.zapLite();
    } else {
      if (this.dashCd > 0) this.dashCd--;
      this.jv += GRAVITY;
      this.py += this.jv;
      const gy = this.H * GROUND_FRAC;
      if (this.py >= gy) {
        if (this.jumps > 0) {
          this.puff(this.px, gy, 6, "dust");
          this.squash = 1.3;
        }
        this.py = gy;
        this.jv = 0;
        this.jumps = 0;
      }
    }
    // squash easing back to 1
    this.squash += (1 - this.squash) * 0.14;

    // trail
    if (this.frame % 2 === 0) {
      this.trail.unshift({ x: this.px - 12, y: this.py - 20, r: 8 });
      if (this.trail.length > 16) this.trail.pop();
    }
    for (const t of this.trail) t.x -= dx * 0.9;

    // running dust
    if (this.py >= this.H * GROUND_FRAC - 0.5 && this.frame % 6 === 0) this.puff(this.px, this.H * GROUND_FRAC, 2, "dust");

    // ---- spawn
    this.nextObsX -= dx;
    if (this.nextObsX <= this.W) {
      const gapMin = 430 + (SPEED_MAX - this.speed) * 40;
      this.spawnObstacle(this.W + 60 + Math.random() * 160);
      this.nextObsX = this.W + 60 + gapMin + Math.random() * 260;
    }
    this.nextSparkX -= dx;
    if (this.nextSparkX <= this.W) {
      this.spawnSparks(this.W + 40);
      this.nextSparkX = this.W + 420 + Math.random() * 500;
    }

    // ---- move & collide obstacles
    const pw = 30,
      phTop = this.py - (this.duck ? 14 : 38),
      phBot = this.py;
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i];
      o.x -= dx;
      if (o.kind === "drone") o.cy += Math.sin(this.frame * 0.05 + o.seed * 9) * 0.6;

      const oTop = o.kind === "block" ? this.H * GROUND_FRAC - o.h : o.cy - o.h / 2;
      const oBot = o.kind === "block" ? this.H * GROUND_FRAC : o.cy + o.h / 2;

      // offscreen
      if (o.x + o.w < -40) {
        this.obstacles.splice(i, 1);
        continue;
      }
      // score count
      if (!o.counted && o.x + o.w < this.px) {
        o.counted = true;
      }

      // collision (shrunk hitboxes feel fairer)
      const pad = this.dashT > 0 ? 999 : 7; // dash = invulnerable
      if (
        pad < 100 &&
        this.px + pw / 2 - pad > o.x + 4 &&
        this.px - pw / 2 + pad < o.x + o.w - 4 &&
        phBot - pad > oTop &&
        phTop + pad < oBot
      ) {
        this.die();
        return;
      }
      // near miss graze → tiny reward flash
      if (!o.grazed && Math.abs(o.x + o.w / 2 - this.px) < 26) {
        o.grazed = true;
        this.vignettePulse = 0.5;
        this.facingGlow = 1;
      }
    }

    // ---- sparks: move, magnet, collect
    const magnetR = 110;
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x -= dx;
      s.phase += 0.08;
      const cxp = s.x,
        cyp = s.y + Math.sin(s.phase) * 4;
      const pdy = this.py - 20;
      const ddx = this.px - cxp,
        ddy = pdy - cyp;
      const d = Math.hypot(ddx, ddy);
      if (d < magnetR) {
        s.vx += ddx * 0.012;
        s.vy += ddy * 0.012;
        s.x += s.vx;
        s.y += s.vy;
      }
      if (d < 26) {
        this.sparks.splice(i, 1);
        this.collectBurst(cxp, cyp);
        this.sparksRun++;
        const gain = 10 * this.combo;
        this.dist += gain; // feed score via distance
        this.comboTimer = 150;
        if (this.sparksRun % 5 === 0 && this.combo < 8) {
          this.combo++;
          this.floats.push({ x: this.px, y: this.py - 60, text: `COMBO ×${this.combo}`, life: 50, accent: true });
          this.beep(880, 0.12, "square", 0.1);
          this.hooks.onCombo?.(this.combo);
        }
        this.collectSound(this.sparksRun);
        continue;
      }
      if (s.x < -30) this.sparks.splice(i, 1);
    }

    // ---- milestone every 500
    if (Math.floor(this.score / 500) > Math.floor((this.score - dx / 10) / 500)) {
      this.flash = 0.25;
      this.hooks.onMilestone?.();
      this.beep(1040, 0.1, "triangle", 0.1);
    }

    // ---- world progression: every 1400 pts, warp to next world
    if (this.warpT < 0 && this.score >= this.worldsShown * 1400) {
      const next = WORLDS[this.worldsShown % WORLDS.length];
      this.triggerWarp(next);
    }

    // ---- warp progression
    if (this.warpT >= 0) {
      this.warpT++;
      if (this.warpT === Math.floor(this.WARP_LEN * 0.45)) {
        // swap world mid-warp
        if (this.pendingWorld) {
          this.setPalette(this.pendingWorld);
          if (!this.visited.includes(this.pendingWorld)) this.visited.push(this.pendingWorld);
          this.emitState();
          // clear hazards so the new universe starts clean
          this.obstacles = [];
          this.sparks = [];
          this.nextObsX = this.W + 320;
          this.nextSparkX = this.W + 180;
        }
      }
      if (this.warpT >= this.WARP_LEN) {
        this.warpT = -1;
        this.pendingWorld = null;
        this.worldsShown++;
      }
    }
  }

  zapLite() {
    this.particles.push({
      x: this.px - 10,
      y: this.py - 18 + (Math.random() - 0.5) * 14,
      vx: -(3 + Math.random() * 5),
      vy: (Math.random() - 0.5) * 2,
      g: 0,
      life: 12 + Math.random() * 8,
      maxLife: 20,
      size: 1 + Math.random() * 2,
      kind: "ember",
    });
  }

  // ================================================================ rendering

  draw() {
    const { ctx, W, H } = this;
    const gy = H * GROUND_FRAC;

    ctx.save();
    ctx.clearRect(0, 0, W, H);

    // camera shake
    if (this.shake > 0.1) ctx.translate(this.shakeX, this.shakeY);

    // --- sky
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, this.col("sky0"));
    g.addColorStop(0.55, this.col("sky1"));
    g.addColorStop(1, this.col("sky2"));
    ctx.fillStyle = g;
    ctx.fillRect(-30, -30, W + 60, H + 60);

    // --- stars
    const world = this.curWorld;
    if (world.stars) this.drawStars();

    // --- sun / moon
    if (world.sun) this.drawSun(world.sun);

    // --- far silhouettes
    this.drawSilhouettes(world.far, gy, 0.35, this.farOff, this.col("ink", 0.10));
    // --- buildings behind (mid layer)
    this.drawSilhouettes(world.mid, gy, 0.62, this.midOff, this.col("ink", 0.2));

    // --- horizon glow line
    const hg = ctx.createLinearGradient(0, gy - 60, 0, gy);
    hg.addColorStop(0, rgbStr(this.palTo.accent, 0));
    hg.addColorStop(1, rgbStr(this.palTo.accent, 0.16));
    ctx.fillStyle = hg;
    ctx.fillRect(0, gy - 60, W, 60);

    // --- sparks
    for (const s of this.sparks) this.drawSpark(s);

    // --- obstacles
    for (const o of this.obstacles) this.drawObstacle(o);

    // --- ground
    this.drawGround(gy);

    // --- particles behind player? draw before player
    for (const p of this.particles) this.drawParticle(p);

    // --- player
    if (this.phase !== "dead") this.drawPlayer();

    // --- float texts
    for (const f of this.floats) {
      ctx.globalAlpha = clamp(f.life / 24, 0, 1);
      ctx.font = `700 13px ${this.fonts.mono}`;
      ctx.textAlign = "center";
      ctx.fillStyle = f.accent ? this.col("accent") : this.col("ink");
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // --- post fx (no shake)
    this.drawWarp();
    this.drawPostFx();
  }

  drawStars() {
    const { ctx, W, H } = this;
    const rnd = mulberry(Math.floor(this.starSeed));
    ctx.fillStyle = "#ffffff";
    const n = 70;
    for (let i = 0; i < n; i++) {
      const x = rnd() * W;
      const y = rnd() * H * 0.62;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(this.idleT * 0.02 + i));
      ctx.globalAlpha = tw * (0.25 + rnd() * 0.5);
      const s = rnd() * 1.6 + 0.4;
      ctx.fillRect(((x - this.bgOff * 8) % W + W) % W, y, s, s);
    }
    ctx.globalAlpha = 1;
  }

  drawSun(sun: Sun) {
    const { ctx, W, H } = this;
    const x = sun.x * W;
    const y = sun.y * H;
    const r = sun.r * Math.min(W, H);
    const c = hexToRgb(sun.color);

    // halo
    const hg = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * (1.6 + sun.halo));
    hg.addColorStop(0, rgbStr(c, 0.5));
    hg.addColorStop(1, rgbStr(c, 0));
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.arc(x, y, r * (1.6 + sun.halo), 0, Math.PI * 2);
    ctx.fill();

    // disc with retro scanlines
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    const dg = ctx.createLinearGradient(0, y - r, 0, y + r);
    dg.addColorStop(0, rgbStr(c, 1));
    dg.addColorStop(1, rgbStr([c[0], c[1] * 0.55, c[2] * 0.6], 1));
    ctx.fillStyle = dg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.globalCompositeOperation = "destination-out";
    for (let sy = y; sy < y + r; sy += 6) {
      ctx.fillRect(x - r, sy, r * 2, 2 + (sy - y) / r * 3);
    }
    ctx.restore();
  }

  drawSilhouettes(kind: SilhouetteKind, gy: number, heightFrac: number, off: number, fill: string) {
    if (kind === "none") return;
    const { ctx, W, H } = this;
    const unit = Math.min(W, H * 1.4);
    const maxH = H * heightFrac;
    ctx.fillStyle = fill;

    const period = 260; // px per procedural chunk
    const startChunk = Math.floor(off / period) - 1;
    const chunks = Math.ceil(W / period) + 3;

    for (let ci = startChunk; ci < startChunk + chunks; ci++) {
      const rnd = mulberry(ci * 7919 + kind.length * 131 + Math.floor(heightFrac * 100));
      const bx = ci * period - off;
      const bh = maxH * (0.4 + rnd() * 0.6);
      switch (kind) {
        case "domes": {
          const w = period * (0.5 + rnd() * 0.4);
          ctx.beginPath();
          ctx.moveTo(bx, gy);
          ctx.quadraticCurveTo(bx + w / 2, gy - bh * 1.5, bx + w, gy);
          ctx.fill();
          break;
        }
        case "slabs": {
          let x = bx;
          while (x < bx + period) {
            const w = 30 + rnd() * 60;
            const h = bh * (0.4 + rnd() * 0.8);
            ctx.fillRect(x, gy - h, w, h);
            x += w + 8 + rnd() * 20;
          }
          break;
        }
        case "towers": {
          let x = bx;
          while (x < bx + period) {
            const w = 18 + rnd() * 34;
            const h = bh * (0.6 + rnd() * 1.1);
            ctx.fillRect(x, gy - h, w, h);
            // antenna
            if (rnd() > 0.6) ctx.fillRect(x + w / 2 - 1, gy - h - 14 - rnd() * 16, 2, 16);
            x += w + 10 + rnd() * 26;
          }
          break;
        }
        case "graph": {
          ctx.beginPath();
          ctx.moveTo(bx, gy);
          let x = bx;
          while (x < bx + period) {
            const nx = x + 40 + rnd() * 30;
            const ny = gy - bh * (0.15 + rnd() * 0.95);
            ctx.lineTo(nx, ny);
            x = nx;
          }
          ctx.lineTo(bx + period, gy);
          ctx.fill();
          break;
        }
        case "peaks": {
          ctx.beginPath();
          ctx.moveTo(bx, gy);
          ctx.lineTo(bx + period * 0.5, gy - bh * 1.3);
          ctx.lineTo(bx + period, gy);
          ctx.fill();
          break;
        }
        case "waves": {
          ctx.beginPath();
          ctx.moveTo(bx, gy);
          for (let x = 0; x <= period; x += 8) {
            const y = gy - bh * (0.5 + 0.45 * Math.sin(x * 0.03 + ci));
            ctx.lineTo(bx + x, y);
          }
          ctx.lineTo(bx + period, gy);
          ctx.fill();
          break;
        }
        case "crystals": {
          let x = bx;
          while (x < bx + period) {
            const w = 14 + rnd() * 26;
            const h = bh * (0.4 + rnd() * 1.2);
            ctx.beginPath();
            ctx.moveTo(x, gy);
            ctx.lineTo(x + w / 2, gy - h);
            ctx.lineTo(x + w, gy);
            ctx.fill();
            x += w + 12 + rnd() * 24;
          }
          break;
        }
        case "gears": {
          let x = bx;
          while (x < bx + period) {
            const r = 20 + rnd() * 34;
            const cyc = gy - r * 0.6;
            ctx.beginPath();
            const teeth = 7;
            for (let ti = 0; ti < teeth * 2; ti++) {
              const rr = ti % 2 === 0 ? r : r * 0.78;
              const a = (ti / (teeth * 2)) * Math.PI * 2 + this.bgOff * 0.01;
              ctx.lineTo(x + Math.cos(a) * rr, cyc + Math.sin(a) * rr);
            }
            ctx.closePath();
            ctx.fill();
            x += r * 2.4 + 20;
          }
          break;
        }
        case "crowd": {
          let x = bx;
          while (x < bx + period) {
            const h = 8 + rnd() * 22;
            const w = 6 + rnd() * 8;
            ctx.beginPath();
            ctx.arc(x + w / 2, gy - h, w / 2, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(x, gy - h, w, h);
            x += w + 6 + rnd() * 10;
          }
          break;
        }
      }
    }
    void unit;
  }

  drawGround(gy: number) {
    const { ctx, W } = this;
    // ground fill
    const gg = ctx.createLinearGradient(0, gy, 0, gy + 8);
    gg.addColorStop(0, this.col("accent", 0.35));
    gg.addColorStop(1, this.col("accent", 0));
    ctx.fillStyle = this.col("ink", 0.9);
    ctx.fillRect(0, gy, W, 3);
    ctx.fillStyle = gg;
    ctx.fillRect(0, gy + 3, W, 8);

    // scrolling ticks
    ctx.strokeStyle = this.col("ink", 0.22);
    ctx.lineWidth = 1;
    const tick = 64;
    const off = this.dist % tick;
    ctx.beginPath();
    for (let x = -off; x < W; x += tick) {
      ctx.moveTo(x, gy + 5);
      ctx.lineTo(x - 14, gy + 16);
    }
    ctx.stroke();
  }

  drawSpark(s: Spark) {
    const { ctx } = this;
    const pulse = 1 + Math.sin(s.phase * 2) * 0.15;
    const r = 6 * pulse;
    const c = this.palTo.accent;
    // glow
    const gg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.2);
    gg.addColorStop(0, rgbStr(c, 0.5));
    gg.addColorStop(1, rgbStr(c, 0));
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();
    // diamond core
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(Math.PI / 4 + s.phase * 0.4);
    ctx.fillStyle = rgbStr(c, 0.95);
    ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
    ctx.restore();
  }

  drawObstacle(o: Obstacle) {
    const { ctx } = this;
    const gy = this.H * GROUND_FRAC;
    const inkC = this.palTo.ink;
    const accC = this.palTo.accent;
    const dark = this.curWorld.dark;

    if (o.kind === "block") {
      const top = gy - o.h;
      // slab
      ctx.fillStyle = dark ? rgbStr(inkC, 0.92) : rgbStr(inkC, 0.88);
      ctx.fillRect(o.x, top, o.w, o.h);
      // accent edge
      ctx.fillStyle = rgbStr(accC, 1);
      ctx.fillRect(o.x, top, o.w, 3);
      // hazard stripes on side
      ctx.save();
      ctx.beginPath();
      ctx.rect(o.x + o.w - 8, top, 8, o.h);
      ctx.clip();
      ctx.fillStyle = rgbStr(accC, 0.85);
      for (let yy = top - 10; yy < gy + 10; yy += 12) {
        ctx.save();
        ctx.translate(o.x + o.w - 4, yy);
        ctx.rotate(-0.5);
        ctx.fillRect(-8, 0, 16, 4);
        ctx.restore();
      }
      ctx.restore();
      // label
      ctx.font = `700 10px ${this.fonts.mono}`;
      ctx.textAlign = "center";
      ctx.fillStyle = dark ? "#0a0a0a" : "#fafaf7";
      ctx.fillText(o.word, o.x + o.w / 2, top + o.h / 2 + 3);
    } else {
      // drone: hovering mine with rotor blur
      const x = o.x + o.w / 2;
      ctx.strokeStyle = rgbStr(inkC, 0.5);
      ctx.lineWidth = 2;
      // body
      ctx.fillStyle = rgbStr(inkC, 0.92);
      ctx.beginPath();
      ctx.moveTo(x, o.cy - 10);
      ctx.lineTo(x + 16, o.cy);
      ctx.lineTo(x, o.cy + 10);
      ctx.lineTo(x - 16, o.cy);
      ctx.closePath();
      ctx.fill();
      // eye
      ctx.fillStyle = rgbStr(accC, 1);
      ctx.beginPath();
      ctx.arc(x, o.cy, 3.4, 0, Math.PI * 2);
      ctx.fill();
      // rotors
      const rw = 10 + Math.sin(this.frame * 0.8 + o.seed * 9) * 4;
      ctx.strokeStyle = rgbStr(inkC, 0.4);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - 16 - rw / 2, o.cy - 12);
      ctx.lineTo(x - 16 + rw / 2, o.cy - 12);
      ctx.moveTo(x + 16 - rw / 2, o.cy - 12);
      ctx.lineTo(x + 16 + rw / 2, o.cy - 12);
      ctx.stroke();
      ctx.strokeStyle = rgbStr(inkC, 0.6);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 12, o.cy - 6);
      ctx.lineTo(x - 16, o.cy - 12);
      ctx.moveTo(x + 12, o.cy - 6);
      ctx.lineTo(x + 16, o.cy - 12);
      ctx.stroke();
      // label above
      ctx.font = `700 9px ${this.fonts.mono}`;
      ctx.textAlign = "center";
      ctx.fillStyle = rgbStr(accC, 0.85);
      ctx.fillText(o.word, x, o.cy - 18);
    }
  }

  drawParticle(p: Particle) {
    const { ctx } = this;
    const a = clamp(p.life / p.maxLife, 0, 1);
    if (p.kind === "spark") {
      ctx.fillStyle = rgbStr(this.palTo.accent, a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * a + 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.kind === "shard") {
      ctx.fillStyle = rgbStr(this.palTo.player, a);
      ctx.fillRect(p.x, p.y, p.size, p.size * 2);
    } else if (p.kind === "ember") {
      ctx.fillStyle = rgbStr(this.palTo.accent, a * 0.9);
      ctx.fillRect(p.x, p.y, p.size, p.size);
    } else {
      ctx.fillStyle = rgbStr(this.palTo.ink, a * 0.3);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1.4 - a * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlayer() {
    const { ctx } = this;
    const pr = 13;
    const stretchY = 1 / this.squash;
    const cx = this.px;
    const cy = this.py - 20;
    const pc = this.palTo.player;
    const ac = this.palTo.accent;

    // trail (comet tail) — drawn oldest first
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const t = this.trail[i];
      const k = 1 - i / this.trail.length;
      ctx.fillStyle = rgbStr(pc, k * 0.22);
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * k, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.squash, stretchY);

    // dash aura
    if (this.dashT > 0) {
      const ag = ctx.createRadialGradient(0, 0, pr * 0.5, 0, 0, pr * 3);
      ag.addColorStop(0, rgbStr(ac, 0.35));
      ag.addColorStop(1, rgbStr(ac, 0));
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.arc(0, 0, pr * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // glow
    const gg = ctx.createRadialGradient(0, 0, pr * 0.3, 0, 0, pr * 2.2);
    gg.addColorStop(0, rgbStr(pc, 0.55));
    gg.addColorStop(1, rgbStr(pc, 0));
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(0, 0, pr * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // body: circle head with comet point
    ctx.fillStyle = rgbStr(pc, 1);
    ctx.beginPath();
    ctx.arc(0, 0, pr, 0, Math.PI * 2);
    ctx.fill();
    // tail fin
    ctx.beginPath();
    ctx.moveTo(-pr * 0.7, -pr * 0.55);
    ctx.lineTo(-pr * 2.1, 0);
    ctx.lineTo(-pr * 0.7, pr * 0.55);
    ctx.closePath();
    ctx.fill();

    // eye
    ctx.fillStyle = this.curWorld.dark ? "#0a0a0a" : "#fdfbf7";
    ctx.beginPath();
    ctx.arc(pr * 0.38, -pr * 0.25, pr * 0.22, 0, Math.PI * 2);
    ctx.fill();
    // pupil
    ctx.fillStyle = rgbStr(pc, 1);
    ctx.beginPath();
    ctx.arc(pr * 0.45, -pr * 0.25, pr * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // face band (visor)
    ctx.strokeStyle = this.curWorld.dark ? "#0a0a0a" : "#fdfbf7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, pr * 0.62, -0.7, 0.7);
    ctx.stroke();

    ctx.restore();

    // combo ring around player
    if (this.combo > 1) {
      ctx.strokeStyle = rgbStr(ac, 0.8);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 5]);
      ctx.lineDashOffset = -this.frame * 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, pr + 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // dash ready pip under player
    if (this.phase === "running") {
      const ready = this.dashCd <= 0 && this.dashT <= 0;
      ctx.fillStyle = ready ? rgbStr(ac, 0.95) : rgbStr(this.palTo.ink, 0.3);
      ctx.beginPath();
      ctx.arc(cx, this.py + 8, ready ? 3 : 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawWarp() {
    if (this.warpT < 0) return;
    const { ctx, W, H } = this;
    const t = this.warpT / this.WARP_LEN;
    // intensity ramps up then down
    const inten = Math.sin(t * Math.PI);
    const accC = this.palTo.accent;
    const inkC = this.palTo.ink;

    // hyperspeed streaks
    const n = Math.floor(40 * inten);
    ctx.save();
    for (let i = 0; i < n; i++) {
      const rnd = mulberry(i * 97 + Math.floor(this.warpT / 2) * 13);
      const y = rnd() * H;
      const len = (60 + rnd() * 220) * inten;
      const x = W - ((this.warpT * (14 + rnd() * 26) + rnd() * W * 2) % (W + 300));
      ctx.strokeStyle = rnd() > 0.7 ? rgbStr(accC, 0.7 * inten) : rgbStr(inkC, 0.5 * inten);
      ctx.lineWidth = 1 + rnd() * 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
    ctx.restore();

    // letterbox bars
    const bar = Math.sin(t * Math.PI) * H * 0.14;
    ctx.fillStyle = "rgba(5,5,5,0.92)";
    ctx.fillRect(0, 0, W, bar);
    ctx.fillRect(0, H - bar, W, bar);

    // world name slam (second half)
    if (t > 0.45 && this.pendingWorld) {
      const k = clamp((t - 0.45) / 0.25, 0, 1);
      ctx.save();
      ctx.globalAlpha = clamp((t - 0.45) / 0.12, 0, 1) * clamp((0.98 - t) / 0.12, 0, 1);
      ctx.textAlign = "center";
      ctx.fillStyle = rgbStr(inkC, 1);
      ctx.font = `800 ${Math.round(H * 0.07)}px ${this.fonts.sans}`;
      const name = this.pendingWorld.name.toUpperCase();
      const scale = 1.6 - 0.6 * easeOut(k);
      ctx.translate(W / 2, H / 2 - bar);
      ctx.scale(scale, scale);
      ctx.fillText(name, 0, 0);
      ctx.fillStyle = rgbStr(accC, 1);
      ctx.font = `600 ${Math.round(H * 0.02)}px ${this.fonts.mono}`;
      ctx.fillText(`— ${this.pendingWorld.tag} —`, 0, H * 0.045);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  drawPostFx() {
    const { ctx, W, H } = this;
    // white/flash overlay
    if (this.flash > 0.02) {
      ctx.fillStyle = `rgba(250,250,247,${clamp(this.flash, 0, 0.6)})`;
      ctx.fillRect(0, 0, W, H);
    }
    // vignette (stronger on dark worlds, pulses on near-miss)
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.36, W / 2, H / 2, H * 0.85);
    const vAlpha = (this.curWorld.dark ? 0.32 : 0.14) + this.vignettePulse * 0.25;
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, `rgba(0,0,0,${clamp(vAlpha, 0, 0.7)})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // combo meter strip (top center) — drawn on canvas so it sits under React HUD
    if (this.phase === "running" && this.combo > 1) {
      const bw = 130;
      const bx = W / 2 - bw / 2;
      const by = 14;
      ctx.fillStyle = "rgba(10,10,10,0.35)";
      ctx.fillRect(bx, by, bw, 5);
      ctx.fillStyle = rgbStr(this.palTo.accent, 1);
      ctx.fillRect(bx, by, bw * (this.comboTimer / 150), 5);
      ctx.font = `700 11px ${this.fonts.mono}`;
      ctx.textAlign = "center";
      ctx.fillStyle = rgbStr(this.palTo.ink, 0.95);
      ctx.fillText(`×${this.combo}`, W / 2, by + 20);
    }
  }
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
void HOME;
