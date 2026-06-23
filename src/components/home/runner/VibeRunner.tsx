"use client";

import React from "react";

/*
 * VibeRunner — the playable-runner hero (pill nav + canvas + HUD overlays).
 *
 * Ported from the Claude Design "The Vibe Co. (Homepage)" .dc.html. The original
 * ran on a custom DCLogic/x-dc runtime; here it is a plain React class component
 * (DCLogic's setState/lifecycle map 1:1 onto React.Component). The canvas engine
 * is kept verbatim apart from TypeScript types.
 *
 * INVARIANT — imperative HUD/theme writes: the game loop writes score/best/level
 * and recolors the overlay directly via wrapRef.current.querySelector(...). Those
 * target [data-hud]/[data-ui] nodes that are rendered ONCE with static defaults
 * and never bound to changing state, so React never reconciles over the engine's
 * writes. Do not bind their text/colour to state or move them inside a conditional.
 */

const MONO = "var(--font-geist-mono), monospace";

type Phase = "idle" | "intro" | "running" | "dead";

interface LevelFlash {
  n: string;
  label: string;
}
interface Reveal {
  kicker: string;
  title: string;
}

interface VibeRunnerProps {
  liveliness?: number;
  worldSeconds?: number;
  pauseMotion?: boolean;
}

interface VibeRunnerState {
  phase: Phase;
  dark: boolean;
  sound: boolean;
  introLine: string;
  levelFlashOn: boolean;
  levelFlash: LevelFlash;
  reveal: Reveal | null;
  revealOn: boolean;
  caption: string;
  finalScore: string;
  bestScore: string;
  deadKicker: string;
  deadTitle: string;
}

interface Char {
  x: number;
  y: number;
  vy: number;
  grounded: boolean;
  ducking: boolean;
}
interface Obstacle {
  kind: "cactus" | "drone";
  x: number;
  w: number;
  h: number;
  cy: number;
  word: string;
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
interface World {
  type: string;
  name: string;
  line: string;
  accent: string;
  words: string[];
  yc?: boolean;
}

export class VibeRunner extends React.Component<VibeRunnerProps, VibeRunnerState> {
  static defaultProps: Required<VibeRunnerProps> = {
    liveliness: 1,
    worldSeconds: 18,
    pauseMotion: false,
  };

  private canvasRef = React.createRef<HTMLCanvasElement>();
  private wrapRef = React.createRef<HTMLDivElement>();

  // scoring
  private score = 0;
  private best = 0;

  // world rotation
  private accentRGB: number[] | null = null;
  private worldOrder: number[] = [];
  private worldPos = -1;

  // canvas / loop
  private ctx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private groundY = 0;
  private originX = 0;
  private _onResize!: () => void;
  private _last = 0;
  private _t = 0;
  private _raf = 0;
  private _revealRaf = 0;
  private _dark = false;
  private _reducedMotion = false;
  private _visible = true;
  private _io: IntersectionObserver | null = null;

  // tune() constants
  private GRAV = 0;
  private JUMP = 0;
  private DUCK_GRAV = 0;
  private BASE_SPEED = 0;
  private MAX_SPEED = 0;
  private ACCEL = 0;
  private DRONE_MIN = 0;
  private GAP_COEFF = 0;
  private LEVEL_STEP = 0;
  private NIGHT_EVERY = 0;
  private WORLD_SECS = 0;
  private LV_LABELS: string[] = [];
  private INTRO_LINES: string[] = [];

  // terrain
  private hills1: number[] = [];
  private hills2: number[] = [];
  private clouds: Cloud[] = [];

  // mutable run state
  private _worldT = 0;
  private curWords: string[] = [];
  private speed = 0;
  private worldX = 0;
  private dayPhase = 0;
  private dayTarget = 0;
  private char!: Char;
  private obstacles: Obstacle[] = [];
  private particles: Particle[] = [];
  private _nextSpawnX = 0;
  private _lastWasDrone = false;
  private level = 1;
  private _lastLevel = 1;
  private _introT = 0;
  private _introStep = -1;

  // audio
  private _ac: AudioContext | null = null;

  // input handlers
  private _kd!: (e: KeyboardEvent) => void;
  private _ku!: (e: KeyboardEvent) => void;
  private _pd!: (e: PointerEvent) => void;
  private _pu!: () => void;
  private _touchDuck = false;

  // timers
  private _lvT: ReturnType<typeof setTimeout> | undefined;
  private _revealT: ReturnType<typeof setTimeout> | undefined;

  private WORLDS: World[] = [
    { type: "PROJECT", name: "vanish.sh", line: "Temporary uploads, auto-expiring.", accent: "#10b981", words: ["BLOAT", "FOREVER", "STORAGE", "LEAKS"] },
    { type: "PROJECT", name: "The Companion", line: "Agent workflows, no slideware.", accent: "#f97316", words: ["SLIDEWARE", "HANDOFF", "TICKETS", "STANDUP"] },
    { type: "PROJECT", name: "vibedrift.dev", line: "Dev activity becomes real metrics.", accent: "#eab308", words: ["VANITY KPI", "BURNOUT", "FRICTION", "GUESSWORK"] },
    { type: "PROJECT", name: "Granite", line: "The personal OS your agent runs on.", accent: "#14b8a6", words: ["SILOS", "LOST NOTES", "SPRAWL", "CHAOS"] },
    { type: "WHAT WE DO", name: "Agent workflows", line: "Orchestration that ships, not slideware.", accent: "#6366f1", words: ["MANUAL", "COPY-PASTE", "QUEUES", "BACKLOG"] },
    { type: "WHAT WE DO", name: "Operations design", line: "Operating surfaces for teams and agents.", accent: "#0ea5e9", words: ["DASHBOARDS", "SWIVEL-CHAIR", "TOIL", "REVIEWS"] },
    { type: "WHAT WE DO", name: "Vibe coding", line: "Disciplined intuition. Magic that ships.", accent: "#a855f7", words: ["WATERFALL", "SCOPE CREEP", "TECH DEBT", "SPECS"] },
    { type: "CLIENT", name: "A fintech, shipping weekly", line: "Six dashboards became one agent.", accent: "#ef4444", words: ["COMPLIANCE", "LEDGERS", "FRAUD", "LATENCY"] },
    { type: "CLIENT", name: "A health startup", line: "Care ops, automated end-to-end.", accent: "#ec4899", words: ["PAPERWORK", "INTAKE", "NO-SHOWS", "FAXES"] },
    { type: "CLIENT", name: "Your logo here", line: "Booking Q3 2026 — brief us.", accent: "#64748b", words: ["HYPE", "SYNERGY", "ROADMAP", "MEETINGS"] },
    { type: "BACKED BY", name: "Y Combinator", line: "W24. Built by the Quivr team.", accent: "#f26625", yc: true, words: ["PITCH DECK", "TAM", "MOAT", "RUNWAY"] },
  ];

  private DEATHS: [string, string][] = [
    ["CAUGHT BY THE HYPE", "The hype caught up."],
    ["TRIPPED ON A BUZZWORD", "Synergy got you."],
    ["DEPLOY FAILED", "Shipping interrupted."],
  ];

  constructor(props: VibeRunnerProps) {
    super(props);
    this.state = {
      phase: "idle",
      dark: false,
      sound: false,
      introLine: "We build with AI.",
      levelFlashOn: false,
      levelFlash: { n: "02", label: "FASTER" },
      reveal: null,
      revealOn: false,
      caption: "Most AI agencies have a landing page. We shipped a game.",
      finalScore: "0",
      bestScore: "0",
      deadKicker: "CAUGHT BY THE HYPE",
      deadTitle: "Shipping interrupted.",
    };
  }

  // ---------- bound handlers ----------
  onToggleSound = () => {
    this.ensureAudio();
    if (this._ac && this._ac.state === "suspended") this._ac.resume();
    this.setState({ sound: !this.state.sound });
  };
  onRestart = () => this.restart();

  componentDidMount() {
    this.tune();
    const cv = this.canvasRef.current!;
    this.ctx = cv.getContext("2d")!;
    try {
      this._reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      this._reducedMotion = false;
    }
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
    this._t = 0;
    this._dark = false;
    this.applyTheme(false);
    // Skip the draw loop while the hero is scrolled off-screen (background tabs
    // are already throttled by the browser's rAF).
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
    if (this._revealRaf) cancelAnimationFrame(this._revealRaf);
    window.removeEventListener("resize", this._onResize);
    this.unbind();
    if (this._io) this._io.disconnect();
    if (this._lvT) clearTimeout(this._lvT);
    if (this._revealT) clearTimeout(this._revealT);
    if (this._ac) {
      this._ac.close().catch(() => {});
      this._ac = null;
    }
  }

  tune() {
    const lv = this.props.liveliness || 1;
    this.GRAV = 2900;
    this.JUMP = 1020 * Math.sqrt(lv);
    this.DUCK_GRAV = 3400;
    this.BASE_SPEED = 360 * lv; // dino SPEED 6 px/frame -> 360 px/s
    this.MAX_SPEED = 780 * lv; // dino MAX_SPEED 13 -> 780 px/s
    this.ACCEL = 3.6 * lv; // dino ACCELERATION 0.001/frame -> 3.6 px/s^2 (~2min to max)
    this.DRONE_MIN = 510 * lv; // dino pterodactyl minSpeed 8.5 -> 510 px/s
    this.GAP_COEFF = 0.6; // dino GAP_COEFFICIENT
    this.LEVEL_STEP = 220; // score per cosmetic level milestone
    this.NIGHT_EVERY = 240; // score per day/night flip
    this.WORLD_SECS = this.props.worldSeconds || 18;
    this.LV_LABELS = ["FASTER", "DENSER", "RELENTLESS", "NO BRAKES", "SHIP OR DIE", "LUDICROUS", "UNREASONABLE"];
    this.INTRO_LINES = ["We build with AI.", "We ship fast.", "We show everything.", "Now — keep up."];
  }

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
    this.groundY = this.H * 0.8;
    this.originX = Math.max(70, this.W * 0.18);
    if (this.char) this.char.x = this.originX;
    this.genHills();
  }

  genHills() {
    this.hills1 = [];
    this.hills2 = [];
    for (let i = 0; i < 60; i++) {
      this.hills1.push(40 + Math.random() * 50);
      this.hills2.push(20 + Math.random() * 30);
    }
    this.clouds = [];
    for (let i = 0; i < 6; i++)
      this.clouds.push({ x: Math.random() * 2000, y: this.H * (0.18 + Math.random() * 0.28), s: 0.4 + Math.random() * 0.5 });
  }

  reset() {
    this.score = 0;
    this.accentRGB = null;
    this.worldOrder = this.shuffle(this.WORLDS.map((_, i) => i));
    this.worldPos = -1;
    this._worldT = 0;
    this.curWords = ["HYPE", "SYNERGY", "BUZZWORD"];
    this.speed = this.BASE_SPEED;
    this.worldX = 0;
    this.dayPhase = 0;
    this.dayTarget = 0;
    this.char = { x: this.originX, y: this.groundY, vy: 0, grounded: true, ducking: false };
    this.obstacles = [];
    this.particles = [];
    this._nextSpawnX = this.W + 200;
    this._lastWasDrone = false;
    this.level = 1;
    this._lastLevel = 1;
    this._introT = 0;
    this._introStep = -1;
  }

  // ---------- audio ----------
  ensureAudio() {
    if (this._ac) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this._ac = Ctx ? new Ctx() : null;
    } catch {
      this._ac = null;
    }
  }
  blip(freq: number, dur?: number, type?: OscillatorType) {
    if (!this.state.sound || !this._ac) return;
    const ac = this._ac;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type || "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.06, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (dur || 0.09));
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + (dur || 0.09));
  }

  // ---------- input ----------
  startOrJump() {
    if (this.state.phase === "idle") {
      this.startIntro();
      return;
    }
    if (this.state.phase === "intro") {
      this.beginPlay();
      return;
    }
    if (this.state.phase === "dead") return;
    const c = this.char;
    if (c.grounded) {
      c.vy = -this.JUMP;
      c.grounded = false;
      this.spawnDust();
      this.blip(520, 0.08, "square");
    }
  }
  setDuck(on: boolean) {
    if (this.state.phase !== "running") return;
    this.char.ducking = on;
  }
  startIntro() {
    this._dark = false;
    this.applyTheme(false);
    this.setChrome(true);
    this._introT = 0;
    this._introStep = -1;
    this.setState({ phase: "intro", revealOn: false, introLine: this.INTRO_LINES[0] });
  }
  beginPlay() {
    this.ensureAudio();
    this._dark = false;
    this.applyTheme(false);
    this.setChrome(true);
    this.level = 1;
    this._lastLevel = 1;
    this._nextSpawnX = this.worldX + this.W + 160;
    this.setState({ phase: "running", revealOn: false, levelFlashOn: false });
    this.nextWorld();
  }
  restart() {
    this.reset();
    this.beginPlay();
  }

  onLevelUp() {
    this.blip(980, 0.12, "square");
    const label = this.LV_LABELS[(this.level - 2) % this.LV_LABELS.length] || "FASTER";
    const n = (this.level < 10 ? "0" : "") + this.level;
    if (this._lvT) clearTimeout(this._lvT);
    this.setState({ levelFlashOn: true, levelFlash: { n: n, label: label } });
    this._lvT = setTimeout(() => {
      try {
        this.setState({ levelFlashOn: false });
      } catch {
        /* unmounted */
      }
    }, 1300);
  }

  die() {
    if (this.score > this.best) {
      this.best = Math.round(this.score);
      try {
        localStorage.setItem("vibeco_runner_best", String(this.best));
      } catch {
        /* storage unavailable */
      }
    }
    const d = this.DEATHS[Math.floor(Math.random() * this.DEATHS.length)];
    this.blip(140, 0.3, "sawtooth");
    this.setState({
      phase: "dead",
      finalScore: String(Math.round(this.score)),
      bestScore: String(this.best),
      deadKicker: d[0],
      deadTitle: d[1],
    });
  }

  bindInput() {
    this._kd = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest("a, button")) return;
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        this.startOrJump();
      } else if (e.code === "ArrowDown") {
        // Only swallow ArrowDown while playing, so it scrolls the page otherwise.
        if (this.state.phase === "running") {
          e.preventDefault();
          this.setDuck(true);
        }
      }
    };
    this._ku = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") this.setDuck(false);
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
      this.particles.push({
        x: this.char.x - 4,
        y: this.groundY,
        vx: -40 - Math.random() * 80,
        vy: -20 - Math.random() * 60,
        life: 0.4 + Math.random() * 0.3,
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
    // Reduced motion: hold the idle hero still; once the user explicitly starts
    // (intro/running) they have opted in, so the engine runs normally.
    const idleStill = this._reducedMotion && this.state.phase === "idle";
    if (!this.props.pauseMotion && !idleStill) this.update(dt);
    this.draw();
    this._raf = requestAnimationFrame((tt) => this.loop(tt));
  }

  update(dt: number) {
    // clouds drift always (alive in idle too)
    for (const cl of this.clouds) {
      cl.x -= (8 + cl.s * 10) * dt * (this.state.phase === "running" ? 1 : 0.4);
      if (cl.x < -200) cl.x = this.W + 100 + Math.random() * 300;
    }
    // particles
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.state.phase === "intro") {
      this._introT += dt;
      this.speed = 110 + (this.BASE_SPEED - 110) * Math.min(1, this._introT / 4.4);
      this.worldX += this.speed * dt;
      this.char.y = this.groundY;
      this.char.grounded = true;
      const step = Math.min(this.INTRO_LINES.length - 1, Math.floor(this._introT / 1.05));
      if (step !== this._introStep) {
        this._introStep = step;
        this.setState({ introLine: this.INTRO_LINES[step] });
      }
      if (this._introT > 4.4) this.beginPlay();
      return;
    }
    if (this.state.phase !== "running") {
      return;
    }

    // dino-style: gentle continuous acceleration toward max speed
    this.speed = Math.min(this.MAX_SPEED, this.speed + this.ACCEL * dt);
    this.worldX += this.speed * dt;
    this.score += this.speed * dt * 0.05;
    // cosmetic level milestones (do NOT affect speed)
    this.level = 1 + Math.floor(this.score / this.LEVEL_STEP);
    if (this.level > this._lastLevel) {
      this._lastLevel = this.level;
      this.onLevelUp();
    }

    // HUD (imperative — see invariant note at top of file)
    const hud = this.wrapRef.current;
    if (hud) {
      const sc = hud.querySelector('[data-hud="score"]');
      if (sc) sc.textContent = String(Math.round(this.score));
      const bs = hud.querySelector('[data-hud="best"]');
      if (bs) bs.textContent = String(Math.max(this.best, Math.round(this.score)));
      const lvn = hud.querySelector('[data-hud="level"]');
      if (lvn) lvn.textContent = String(this.level);
      const bar = hud.querySelector('[data-hud="lvbar"]') as HTMLElement | null;
      if (bar) bar.style.width = Math.round(((this.score % this.LEVEL_STEP) / this.LEVEL_STEP) * 100) + "%";
    }

    // char physics
    const c = this.char;
    const g = !c.grounded && c.ducking ? this.DUCK_GRAV : this.GRAV;
    c.vy += g * dt;
    c.y += c.vy * dt;
    if (c.y >= this.groundY) {
      if (!c.grounded) {
        this.spawnDust();
      }
      c.y = this.groundY;
      c.vy = 0;
      c.grounded = true;
    }

    // day / night
    this.dayTarget = Math.floor(this.score / this.NIGHT_EVERY) % 2 === 1 ? 1 : 0;
    this.dayPhase += (this.dayTarget - this.dayPhase) * Math.min(1, dt * 1.6);
    const isDarkNow = this.dayPhase > 0.5;
    if (isDarkNow !== this._dark) {
      this._dark = isDarkNow;
      this.applyTheme(isDarkNow);
    }

    // worlds: every ~N seconds you enter a new world
    this._worldT += dt;
    if (this._worldT >= this.WORLD_SECS) this.nextWorld();

    // spawn obstacles
    if (this.worldX + this.W > this._nextSpawnX) {
      const allowDrone = this.speed > this.DRONE_MIN && !this._lastWasDrone && Math.random() < 0.35;
      let ow: number, typeMinGap: number;
      if (allowDrone) {
        ow = 34;
        typeMinGap = 150;
        this.obstacles.push({
          kind: "drone",
          x: this._nextSpawnX,
          w: ow,
          h: 16,
          cy: this.groundY - 34 - Math.random() * 8,
          word: this.curWords[Math.floor(Math.random() * this.curWords.length)],
        });
        this._lastWasDrone = true;
      } else {
        const seg = 1 + Math.floor(Math.random() * 3);
        const h = 22 + seg * 12;
        ow = 12 + (seg > 2 ? 14 : 0);
        typeMinGap = 120;
        this.obstacles.push({
          kind: "cactus",
          x: this._nextSpawnX,
          w: ow,
          h,
          cy: 0,
          word: this.curWords[Math.floor(Math.random() * this.curWords.length)],
        });
        this._lastWasDrone = false;
      }
      // dino getGap: round(width * speedPerFrame + minGap * GAP_COEFF), random up to x1.5
      const speedPF = this.speed / 60;
      const minGap = Math.round(ow * speedPF + typeMinGap * this.GAP_COEFF);
      const base = Math.max(minGap, this.speed * 0.72); // floor: single-jump clearance
      const gap = base + Math.random() * (base * 0.5);
      this._nextSpawnX += gap;
    }
    // cull + score-pass + collision
    const cx = c.x;
    const charTop = c.ducking ? this.groundY - 18 : c.y - 30;
    const charBot = c.y;
    const charL = cx - 10,
      charR = cx + 12;
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
      // forgiving inset
      if (charR - 3 > oL + 2 && charL + 3 < oR - 2 && charBot - 2 > oT + 2 && charTop + 2 < oB - 2) {
        this.die();
        return;
      }
    }
    this.obstacles = this.obstacles.filter((o) => o.x - this.worldX > -120);
  }

  // ---------- draw ----------
  lerpC(a: number[], b: number[], t: number) {
    return (
      "rgb(" +
      Math.round(a[0] + (b[0] - a[0]) * t) +
      "," +
      Math.round(a[1] + (b[1] - a[1]) * t) +
      "," +
      Math.round(a[2] + (b[2] - a[2]) * t) +
      ")"
    );
  }
  draw() {
    const ctx = this.ctx,
      W = this.W,
      H = this.H;
    const d = this.dayPhase || 0;
    const CREAM = [250, 250, 247],
      INK = [10, 10, 10];
    const bg = this.lerpC(CREAM, INK, d);
    const ink = this.lerpC(INK, CREAM, d);
    const inkA = (a: number) =>
      this.lerpC(INK, CREAM, d).replace("rgb(", "rgba(").replace(")", "," + a + ")");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const acc = this.accentRGB;
    const accStr = (a: number) =>
      acc ? "rgba(" + acc[0] + "," + acc[1] + "," + acc[2] + "," + a + ")" : "rgba(0,0,0,0)";
    if (acc) {
      const gg = ctx.createLinearGradient(0, this.groundY - 150, 0, this.groundY);
      gg.addColorStop(0, accStr(0));
      gg.addColorStop(1, accStr(0.16));
      ctx.fillStyle = gg;
      ctx.fillRect(0, this.groundY - 150, W, 150);
    }

    // sun / moon
    const cycleT = (this.score % this.NIGHT_EVERY) / this.NIGHT_EVERY;
    const sunX = W * 0.78;
    const sunY = H * 0.26 + Math.sin(cycleT * Math.PI) * -10;
    ctx.save();
    if (d < 0.5) {
      ctx.beginPath();
      ctx.arc(sunX, sunY, 26, 0, Math.PI * 2);
      ctx.strokeStyle = acc ? accStr(0.85) : inkA(0.5);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
      ctx.fillStyle = inkA(0.9);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sunX + 8, sunY - 6, 22, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
    }
    ctx.restore();

    // clouds (faint arcs)
    ctx.strokeStyle = inkA(0.12);
    ctx.lineWidth = 1.5;
    for (const cl of this.clouds) {
      ctx.beginPath();
      ctx.arc(cl.x, cl.y, 22 * cl.s, Math.PI * 0.15, Math.PI * 0.95, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cl.x + 26 * cl.s, cl.y + 4, 16 * cl.s, Math.PI * 0.1, Math.PI, true);
      ctx.stroke();
    }

    // parallax hills (hairline)
    this.drawRidge(this.hills2, 0.18, 0.62, inkA(0.1));
    this.drawRidge(this.hills1, 0.42, 0.7, inkA(0.18));

    // ground
    const gY = this.groundY;
    ctx.fillStyle = inkA(0.03);
    ctx.fillRect(0, gY, W, H - gY);
    ctx.strokeStyle = acc ? accStr(1) : ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(W, gY);
    ctx.stroke();
    // ticks + pebbles
    ctx.strokeStyle = inkA(0.18);
    ctx.lineWidth = 1;
    const st = Math.floor(this.worldX / 58) * 58;
    for (let n = 0; n < W / 58 + 2; n++) {
      const sx = st + n * 58 - this.worldX;
      if (sx < 0 || sx > W) continue;
      ctx.beginPath();
      ctx.moveTo(sx, gY + 4);
      ctx.lineTo(sx, gY + 10);
      ctx.stroke();
    }

    // obstacles
    for (const o of this.obstacles) {
      const sx = o.x - this.worldX;
      if (sx < -60 || sx > W + 60) continue;
      ctx.fillStyle = ink;
      if (o.kind === "cactus") {
        const bw = o.w,
          bx = sx - bw / 2,
          by = gY - o.h;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, bw, o.h, [4, 4, 0, 0]);
        else ctx.rect(bx, by, bw, o.h);
        ctx.fill();
        ctx.fillStyle = acc ? accStr(0.85) : inkA(0.34);
        ctx.font = "500 10px " + MONO;
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(sx + bw / 2 + 9, by + o.h - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(o.word, 0, 0);
        ctx.restore();
      } else {
        const bx = sx - o.w / 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, o.cy - o.h / 2, o.w, o.h, 8);
        else ctx.rect(bx, o.cy - o.h / 2, o.w, o.h);
        ctx.fill();
        // rotor ticks
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx - 6, o.cy - o.h / 2 - 5);
        ctx.lineTo(sx + 6, o.cy - o.h / 2 - 5);
        ctx.stroke();
        ctx.fillStyle = acc ? accStr(0.85) : inkA(0.34);
        ctx.font = "500 9px " + MONO;
        ctx.textAlign = "center";
        ctx.fillText(o.word, sx, o.cy - o.h / 2 - 12);
      }
    }

    // particles
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = inkA(Math.max(0, p.life));
      ctx.fill();
    }

    // character
    this.drawChar(ink, bg);
  }

  drawRidge(arr: number[], parallax: number, baseFrac: number, color: string) {
    const ctx = this.ctx,
      W = this.W,
      H = this.H;
    const off = (this.worldX * parallax) % 80;
    const base = H * baseFrac;
    ctx.beginPath();
    ctx.moveTo(0, H);
    let x = -80 - off,
      i = 0;
    ctx.lineTo(x, base);
    while (x < W + 80) {
      const h = arr[i % arr.length];
      x += 80;
      ctx.lineTo(x - 40, base - h);
      ctx.lineTo(x, base);
      i++;
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawChar(ink: string, bg: string) {
    const ctx = this.ctx,
      c = this.char;
    const x = c.x,
      baseY = c.y;
    const run = Math.sin(this._t * (this.state.phase === "running" ? 18 : 4));
    const air = !c.grounded;
    ctx.save();
    ctx.translate(x, baseY);
    ctx.fillStyle = ink;
    if (c.ducking && !air) {
      // flattened
      ctx.beginPath();
      ctx.ellipse(2, -9, 17, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(17, -11);
      ctx.lineTo(26, -9);
      ctx.lineTo(17, -6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(10, -11, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
    } else {
      const stretch = air ? 1.12 : 1;
      const bodyH = 17 * stretch;
      // body
      ctx.beginPath();
      ctx.ellipse(0, -bodyH, 11, bodyH, 0, 0, Math.PI * 2);
      ctx.fillStyle = ink;
      ctx.fill();
      // head
      ctx.beginPath();
      ctx.arc(4, -bodyH - 10, 8, 0, Math.PI * 2);
      ctx.fill();
      // beak
      ctx.beginPath();
      ctx.moveTo(11, -bodyH - 11);
      ctx.lineTo(20, -bodyH - 9);
      ctx.lineTo(11, -bodyH - 6);
      ctx.closePath();
      ctx.fill();
      // eye
      ctx.beginPath();
      ctx.arc(6, -bodyH - 12, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
      // legs
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      if (air) {
        ctx.beginPath();
        ctx.moveTo(-3, -3);
        ctx.lineTo(-6, 0);
        ctx.moveTo(3, -3);
        ctx.lineTo(7, -1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-2, -2);
        ctx.lineTo(-2 + run * 6, 0);
        ctx.moveTo(4, -2);
        ctx.lineTo(4 - run * 6, 0);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  hexToRgb(h: string) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
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
    this.enterWorld(this.WORLDS[this.worldOrder[this.worldPos]]);
  }

  enterWorld(wld: World) {
    this.accentRGB = wld.accent ? this.hexToRgb(wld.accent) : null;
    this.curWords = wld.words || ["HYPE", "SYNERGY", "BUZZWORD"];
    this.blip(wld.yc ? 880 : 720, 0.12, "sine");
    const title = wld.name + " — " + wld.line;
    if (this._revealT) clearTimeout(this._revealT);
    this.setState({ caption: title, reveal: { kicker: wld.type, title: title }, revealOn: true });
    const accent = wld.accent || (this._dark ? "#fafaf7" : "#0a0a0a");
    this._revealRaf = requestAnimationFrame(() => {
      const w = this.wrapRef.current;
      if (!w) return;
      const dot = w.querySelector('[data-ui="revealDot"]') as HTMLElement | null;
      if (dot) dot.style.setProperty("background", accent, "important");
      const bar = w.querySelector('[data-ui="revealBar"]') as HTMLElement | null;
      if (bar) bar.style.setProperty("background", accent, "important");
      this.applyTheme(this._dark);
    });
    this._revealT = setTimeout(() => {
      try {
        this.setState({ revealOn: false });
      } catch {
        /* unmounted */
      }
    }, 4200);
  }

  setChrome(hidden: boolean) {
    const w = this.wrapRef.current;
    if (!w) return;
    const m = w.querySelector('[data-ui="marketing"]') as HTMLElement | null;
    if (m) {
      m.style.transition =
        "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
      m.style.opacity = hidden ? "0" : "1";
      m.style.transform = hidden ? "translateY(-18px)" : "translateY(0)";
      m.style.pointerEvents = hidden ? "none" : "auto";
    }
  }

  applyTheme(dark: boolean) {
    const w = this.wrapRef.current;
    if (!w) return;
    const ink = dark ? "#fafaf7" : "#0a0a0a";
    const content = w.querySelector('[data-ui="content"]') as HTMLElement | null;
    if (!content) return;
    content.style.setProperty("color", ink, "important");
    content.querySelectorAll("*").forEach((el) => {
      const t = el.getAttribute("data-ui");
      if (t === "revealDot" || t === "revealBar") return;
      if (el.closest('[data-ui="cta"]')) return;
      (el as HTMLElement).style.setProperty("color", ink, "important");
    });
    const prompt = w.querySelector('[data-ui="prompt"]') as HTMLElement | null;
    if (prompt) prompt.style.setProperty("color", ink, "important");
  }

  render() {
    const { phase, sound, introLine, levelFlashOn, levelFlash, caption, finalScore, bestScore, deadKicker, deadTitle } =
      this.state;
    const isIdle = phase === "idle";
    const isIntro = phase === "intro";
    const isDead = phase === "dead";
    const revealOn = this.state.revealOn;
    const reveal = this.state.reveal ?? { kicker: "", title: "" };
    const soundIcon = sound ? "♪" : "⊘";

    return (
      <div ref={this.wrapRef} style={{ position: "relative", width: "100%" }}>
        {/* NAV */}
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 0,
            right: 0,
            zIndex: 60,
            display: "flex",
            justifyContent: "center",
            padding: "0 18px",
            pointerEvents: "none",
          }}
        >
          <nav
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "#0a0a0a",
              color: "#fafaf7",
              padding: "6px 6px 6px 18px",
              borderRadius: 9999,
              boxShadow: "0 8px 30px rgba(10,10,10,0.16)",
              maxWidth: "calc(100vw - 28px)",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em", marginRight: 10, whiteSpace: "nowrap" }}>
              The Vibe Co.
            </span>
            <a href="#work" className="vibe-nav-link" style={navLink}>
              Work
            </a>
            <a href="#method" className="vibe-nav-link" style={navLink}>
              Method
            </a>
            <a href="#studio" className="vibe-nav-link" style={navLink}>
              Studio
            </a>
            <a
              href="mailto:founders@thevibecompany.co"
              style={{
                padding: "8px 16px",
                borderRadius: 9999,
                background: "#fafaf7",
                color: "#0a0a0a",
                fontSize: 13,
                fontWeight: 600,
                marginLeft: 4,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Brief us →
            </a>
          </nav>
        </div>

        {/* HERO — playable runner */}
        <header style={{ position: "relative", width: "100%", height: "clamp(640px, 96vh, 940px)", overflow: "hidden" }}>
          <canvas
            ref={this.canvasRef}
            role="img"
            aria-label="Playable endless-runner game; press Space or tap to start. All headline copy, links, and navigation are also available as text below the game."
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", touchAction: "manipulation", cursor: "pointer" }}
          />

          <div
            data-ui="content"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(96px, 13vh, 150px) clamp(24px, 6vw, 80px) clamp(26px, 4vh, 48px)",
              pointerEvents: "none",
              transition: "color 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* top row: status + score */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div data-ui="marketing" style={{ maxWidth: 880 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid currentColor",
                    padding: "5px 12px",
                    borderRadius: 9999,
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    opacity: 0.8,
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                  }}
                >
                  <span style={{ width: 6, height: 6, background: "currentColor", borderRadius: "50%", animation: "vc-pulse 2s infinite" }} />
                  BUILDING IN PUBLIC · BOOKING Q3 2026
                </span>
                <h1 style={{ margin: "22px 0 0", fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 0.92, fontSize: "clamp(42px, 8vw, 104px)" }}>
                  We ship. We show.
                  <br />
                  We <em style={{ fontStyle: "italic", fontWeight: 400 }}>vibe.</em>
                </h1>
                <p style={{ margin: "20px 0 0", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.5, color: "currentColor", opacity: 0.6, maxWidth: 500 }}>
                  An AI-native agency from the team behind Quivr. Most agencies wrote a landing page. We shipped a game — and a company worth running it
                  for.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, pointerEvents: "auto" }}>
                  <a
                    href="mailto:founders@thevibecompany.co"
                    data-ui="cta"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "15px 24px",
                      borderRadius: 9999,
                      background: "#0a0a0a",
                      color: "#fafaf7",
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.6s",
                    }}
                  >
                    Start a brief{" "}
                    <span
                      data-ui="ctaArrow"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#fafaf7",
                        color: "#0a0a0a",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.6s",
                      }}
                    >
                      →
                    </span>
                  </a>
                  <a
                    href="#work"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "15px 24px",
                      borderRadius: 9999,
                      border: "1px solid currentColor",
                      color: "currentColor",
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    See the work
                  </a>
                </div>
              </div>

              <div style={{ textAlign: "right", fontFamily: MONO, pointerEvents: "auto" }}>
                <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.55 }}>Shipped</div>
                <div data-hud="score" style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  0
                </div>
                <div style={{ fontSize: 11, letterSpacing: "0.06em", opacity: 0.55, marginTop: 4 }}>
                  Best <span data-hud="best">0</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "flex-end", marginTop: 12 }}>
                  <span style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.55 }}>LV</span>
                  <span data-hud="level" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em" }}>
                    1
                  </span>
                </div>
                <div style={{ width: 116, height: 4, border: "1px solid currentColor", borderRadius: 9999, margin: "6px 0 0 auto", overflow: "hidden", opacity: 0.7 }}>
                  <div data-hud="lvbar" style={{ height: "100%", width: "0%", background: "currentColor" }} />
                </div>
                <button
                  onClick={this.onToggleSound}
                  title="Sound"
                  style={{
                    marginTop: 12,
                    width: 30,
                    height: 30,
                    borderRadius: 9999,
                    border: "1px solid currentColor",
                    background: "transparent",
                    color: "currentColor",
                    cursor: "pointer",
                    fontSize: 13,
                    opacity: 0.8,
                  }}
                >
                  {soundIcon}
                </button>
              </div>
            </div>

            {/* bottom row: caption + controls hint */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>
              <div key={caption} style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", opacity: 0.7, minHeight: 18 }}>
                <span style={{ display: "inline-block", animation: "vc-fade 0.4s ease" }}>{caption}</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.45 }}>
                {"Space / tap — jump  ·  ↓ / hold-low — duck"}
              </div>
            </div>

            {revealOn && (
              <div
                style={{
                  position: "absolute",
                  left: "clamp(24px,6vw,80px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 4,
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "stretch",
                  gap: 14,
                  maxWidth: 560,
                  animation: "vc-fade 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <span data-ui="revealBar" style={{ width: 4, borderRadius: 4, flex: "none" }} />
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6, display: "flex", alignItems: "center", gap: 8 }}>
                    <span data-ui="revealDot" style={{ width: 8, height: 8, borderRadius: "50%" }} />
                    {reveal.kicker}
                  </div>
                  <div style={{ fontSize: "clamp(22px, 3.4vw, 36px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 6 }}>
                    {reveal.title}
                  </div>
                </div>
              </div>
            )}

            {levelFlashOn && (
              <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.82, fontSize: "clamp(120px, 25vw, 340px)", animation: "vc-pop 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                  {levelFlash.n}
                </div>
                <div style={{ fontFamily: MONO, fontSize: "clamp(13px,1.8vw,18px)", textTransform: "uppercase", letterSpacing: "0.28em", marginTop: 2, opacity: 0.75 }}>
                  Level {levelFlash.n} · {levelFlash.label}
                </div>
              </div>
            )}
          </div>

          {/* IDLE prompt */}
          {isIdle && (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(108px, 20vh, 220px)", zIndex: 4, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
              <div data-ui="prompt" style={{ fontFamily: MONO, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.7, animation: "vc-bob 1.7s ease-in-out infinite" }}>
                {"↑  Space to ship  ↑"}
              </div>
            </div>
          )}

          {/* INTRO overlay */}
          {isIntro && (
            <div style={{ position: "absolute", inset: 0, zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none", padding: "0 24px" }}>
              <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#0a0a0a", opacity: 0.5, marginBottom: 18 }}>
                Let us show you what we do
              </div>
              <div key={introLine} style={{ fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, fontSize: "clamp(40px, 8vw, 96px)", color: "#0a0a0a" }}>
                <span style={{ display: "inline-block", animation: "vc-fade 0.5s cubic-bezier(0.16,1,0.3,1)" }}>{introLine}</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#0a0a0a", opacity: 0.45, marginTop: 26, animation: "vc-bob 1.7s ease-in-out infinite" }}>
                space / tap to skip ↑
              </div>
            </div>
          )}

          {/* DEAD overlay */}
          {isDead && (
            <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 28, background: "rgba(10,10,10,0.66)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", color: "#fafaf7" }}>
              <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.55, marginBottom: 14 }}>
                {"// "}
                {deadKicker}
              </div>
              <h2 style={{ margin: 0, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 0.95, fontSize: "clamp(36px, 6.5vw, 76px)" }}>{deadTitle}</h2>
              <div style={{ display: "flex", gap: 32, margin: "24px 0 26px", fontFamily: MONO }}>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{finalScore}</div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: 4 }}>Shipped</div>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{bestScore}</div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: 4 }}>Best</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={this.onRestart}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 24px",
                    borderRadius: 9999,
                    border: 0,
                    background: "#fafaf7",
                    color: "#0a0a0a",
                    fontFamily: "inherit",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Ship again{" "}
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#0a0a0a", color: "#fafaf7", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>↻</span>
                </button>
                <a
                  href="mailto:founders@thevibecompany.co"
                  style={{ display: "inline-flex", alignItems: "center", padding: "14px 24px", borderRadius: 9999, border: "1px solid rgba(250,250,247,0.3)", color: "#fafaf7", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
                >
                  Brief us →
                </a>
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}

const navLink: React.CSSProperties = {
  padding: "8px 13px",
  borderRadius: 9999,
  fontSize: 13,
  color: "rgba(250,250,247,0.65)",
  textDecoration: "none",
  whiteSpace: "nowrap",
};
