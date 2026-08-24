"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { captureEvent } from "@/lib/posthog";
import type { RunnerItem } from "@/lib/runner-worlds";

/**
 * The hero's runner band: the site's own take on the Chrome offline dino.
 *
 * It is an inverted ink panel inside the warm-paper hero, so it reads as a
 * screen cut into the page rather than a widget floating on it. The player is
 * a small paper bird whose wing beats while it runs.
 *
 * Space / ArrowUp jumps, ArrowDown ducks, tap plays on touch. One canvas, one
 * fixed 60Hz timestep, so the difficulty curve is identical on every display.
 */

// --- world constants, in CSS pixels of the canvas -----------------------------
const WORLD = {
  height: 200,
  // 30px of ink below the line reads as ground thickness; more is dead space.
  groundY: 170,
  gravity: 2600,
  // Apex is v²/2g = 78px. The second jump adds ~50px on top, for a 128px
  // ceiling that still leaves the bird inside the band.
  jumpVelocity: -637,
  /** The second jump tops the bird up to exactly this height above the line,
   *  whenever it is pressed. Adding a fixed impulse instead would either be
   *  wasted right after take-off or overshoot the roof near the apex. */
  doubleJumpPeak: 130,
  playerX: 104,
  playerSize: 32,
  duckHeight: 18,
  startSpeed: 365,
  // No plateau: the run has to end eventually, so the speed keeps climbing
  // for a minute and a half and the gaps keep tightening after that.
  maxSpeed: 780,
  // Speed gains acceleration × 10 px/s per second: about 80s to top speed.
  acceleration: 0.5,
  /** Gaps are seconds, not pixels. A pixel gap that is comfortable at 365 px/s
   *  becomes unclearable at 620 — the bird is still in the air from the last
   *  jump. In time, the rhythm holds and speed alone tightens the reaction
   *  window, which is where the difficulty should come from. */
  spawnGapMin: 0.85,
  spawnGapMax: 1.6,
  /** Time between the two slabs of a twin: inside a single jump's 0.49s hang
   *  time, so one well-placed jump clears both. */
  twinGap: 0.4,
  /** Ceiling bars stop this far above the ground: under a ducking bird
   *  (18px), over nothing else. */
  ceilingGap: 24,
  /** Head-height flyer: clips a standing bird, misses a ducking one. */
  flyerHighY: 44,
  flyerHighHeight: 18,
  /** Ground-height flyer: ducking is not enough, it has to be jumped. */
  flyerLowY: 26,
  flyerLowHeight: 20,
  /** A single jump peaks at 78px, a double at ~128px, so these two bands are
   *  what separate "jump" from "double jump". */
  lowHeight: [34, 52],
  highHeight: [88, 104],
  /** Widths, deliberately slim: a thick slab reads as scenery, not a hurdle. */
  lowWidth: 12,
  highWidth: 10,
  /** How long a ceiling bar keeps you down, in seconds. Expressed in time and
   *  converted to pixels at the current speed, so a long bar stays a long duck
   *  at 780 px/s instead of flicking past. */
  ceilingDuration: [0.25, 0.85],
  flyerWidth: 30,
} as const;

const STEP = 1 / 60;
const BEST_KEY = "tvc-runner-best";

type Phase = "idle" | "running" | "over";

// --- best score, kept in localStorage and read through an external store ------
// A plain effect + setState would flag as a cascading render, and a lazy
// useState initialiser would disagree with the server-rendered "0000".
const bestListeners = new Set<() => void>();

function subscribeBest(onChange: () => void): () => void {
  bestListeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === BEST_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    bestListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function readBest(): string {
  try {
    return window.localStorage.getItem(BEST_KEY) ?? "0";
  } catch {
    return "0";
  }
}

function writeBest(score: number): void {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Private mode, quota, blocked storage: the run still counts on screen.
  }
  bestListeners.forEach((listener) => listener());
}

/**
 * `low`       — a single jump clears it.
 * `high`      — a barrier only a double jump clears.
 * `ceiling`   — hangs from the roof to head height: no way over it, duck.
 * `flyerHigh` — a predator at head height: duck under it.
 * `flyerLow`  — a predator skimming the ground: ducking is not enough, jump.
 *
 * Colour states the move, not the object: paper to jump, orange to double
 * jump, cyan to duck. Shape says what it is, colour says what to do.
 */
type ObstacleKind = "low" | "high" | "ceiling" | "flyerHigh" | "flyerLow";

function isFlyer(kind: ObstacleKind): boolean {
  return kind === "flyerHigh" || kind === "flyerLow";
}

/** Which move gets you past it — and therefore what colour it is. */
function movesUnder(kind: ObstacleKind): "jump" | "double" | "duck" {
  if (kind === "high") return "double";
  if (kind === "ceiling" || kind === "flyerHigh") return "duck";
  return "jump";
}

type Obstacle = {
  x: number;
  width: number;
  height: number;
  kind: ObstacleKind;
  /** Wing beat offset, so a flock never flaps in unison. */
  phase: number;
};

type World = {
  phase: Phase;
  /** Narrow canvases run slower so reaction time stays comparable. */
  scale: number;
  t: number;
  speed: number;
  distance: number;
  score: number;
  playerY: number;
  playerVY: number;
  ducking: boolean;
  grounded: boolean;
  /** 0 on the ground, 1 after the first jump, 2 once the double is spent. */
  jumps: number;
  /** Little burst of paper dots marking where the second jump fired. */
  puff: { x: number; y: number; life: number } | null;
  obstacles: Obstacle[];
  nextSpawn: number;
};

function speedScale(width: number): number {
  return Math.max(0.68, Math.min(1, width / 900));
}

function createWorld(scale = 1): World {
  return {
    phase: "idle",
    scale,
    t: 0,
    speed: WORLD.startSpeed * scale,
    distance: 0,
    score: 0,
    playerY: WORLD.groundY,
    playerVY: 0,
    ducking: false,
    grounded: true,
    jumps: 0,
    puff: null,
    obstacles: [],
    // A beat before the first slab, so the run does not open mid-obstacle.
    nextSpawn: WORLD.startSpeed * scale * 1.9,
  };
}

/**
 * The run has to end eventually, so nothing here settles: every kind's weight
 * keeps climbing with time, which means the share of plain slabs keeps
 * shrinking and the track never turns into a rhythm you can hold forever.
 * Each kind is introduced alone, far enough apart to be learned.
 */
function kindWeights(t: number): [ObstacleKind, number][] {
  const ramp = (from: number, rate: number, cap: number) =>
    t < from ? 0 : Math.min(cap, (t - from) * rate);
  return [
    ["low", 1],
    ["high", ramp(5, 0.06, 0.55)],
    ["ceiling", ramp(10, 0.05, 0.45)],
    ["flyerHigh", ramp(24, 0.04, 0.4)],
    ["flyerLow", ramp(34, 0.04, 0.35)],
  ];
}

function pickKind(world: World): ObstacleKind {
  const weights = kindWeights(world.t);
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [kind, weight] of weights) {
    roll -= weight;
    if (roll <= 0) return kind;
  }
  return "low";
}

function obstacleHeight(kind: ObstacleKind): number {
  if (kind === "ceiling") return WORLD.groundY - WORLD.ceilingGap;
  if (kind === "flyerHigh") return WORLD.flyerHighHeight;
  if (kind === "flyerLow") return WORLD.flyerLowHeight;
  const [min, max] = kind === "high" ? WORLD.highHeight : WORLD.lowHeight;
  return min + Math.random() * (max - min);
}

function obstacleWidth(kind: ObstacleKind, speed: number): number {
  if (kind === "ceiling") {
    const [min, max] = WORLD.ceilingDuration;
    return speed * (min + Math.random() * (max - min));
  }
  if (isFlyer(kind)) return WORLD.flyerWidth;
  return kind === "high" ? WORLD.highWidth : WORLD.lowWidth;
}

function spawnObstacle(world: World, width: number): void {
  const kind = pickKind(world);
  const obstacleSpan = obstacleWidth(kind, world.speed);
  world.obstacles.push({
    x: width + 40,
    width: obstacleSpan,
    height: obstacleHeight(kind),
    kind,
    phase: Math.random() * Math.PI * 2,
  });

  // Twin slabs: two low blocks close enough that a single well-timed jump
  // clears both, and a late one lands between them. The run's real trap.
  if (kind === "low" && world.t > 16 && Math.random() > 0.7) {
    world.obstacles.push({
      x: width + 40 + WORLD.twinGap * world.speed,
      width: WORLD.lowWidth,
      height: obstacleHeight("low"),
      kind: "low",
      phase: 0,
    });
  }

  // Gaps keep closing after the speed has topped out — that late squeeze is
  // what finally ends a long run. The floor is generous after anything that
  // needed a double jump or a duck, which take longer to recover from.
  const tighten = Math.min(0.5, world.t * 0.005);
  // A long ceiling bar is still going past when the next thing would spawn, so
  // its own length is added to the recovery the gap has to leave.
  const floor =
    (kind === "low" ? 0.62 : 0.8) +
    (kind === "ceiling" ? obstacleSpan / world.speed : 0);
  const seconds =
    WORLD.spawnGapMin + Math.random() * (WORLD.spawnGapMax - WORLD.spawnGapMin) - tighten;
  world.nextSpawn = world.speed * Math.max(floor, seconds);
}

function obstacleY(obstacle: Obstacle): number {
  switch (obstacle.kind) {
    // A ceiling bar grows down from the roof.
    case "ceiling":
      return 0;
    case "flyerHigh":
      return WORLD.groundY - WORLD.flyerHighY;
    case "flyerLow":
      return WORLD.groundY - WORLD.flyerLowY;
    // Everything else stands on the line.
    default:
      return WORLD.groundY - obstacle.height;
  }
}

function playerBox(world: World) {
  const ducking = world.ducking && world.grounded;
  const height = ducking ? WORLD.duckHeight : WORLD.playerSize;
  return { x: WORLD.playerX, y: world.playerY - height, width: WORLD.playerSize, height };
}

/** Advances one fixed tick. Returns true when the run just ended. */
function step(world: World, dt: number, width: number): boolean {
  world.t += dt;
  world.speed = Math.min(
    WORLD.maxSpeed * world.scale,
    world.speed + WORLD.acceleration * world.scale * dt * 10,
  );
  world.distance += world.speed * dt;
  world.score = Math.floor(world.distance / 24);

  // Ducking mid-air drops you faster: the one trick borrowed from the original.
  const gravity = WORLD.gravity * (world.ducking && !world.grounded ? 1.8 : 1);
  world.playerVY += gravity * dt;
  world.playerY += world.playerVY * dt;

  if (world.playerY >= WORLD.groundY) {
    world.playerY = WORLD.groundY;
    world.playerVY = 0;
    world.grounded = true;
    world.jumps = 0;
  } else {
    world.grounded = false;
  }

  if (world.puff) {
    world.puff.life -= dt * 2.6;
    if (world.puff.life <= 0) world.puff = null;
  }

  world.nextSpawn -= world.speed * dt;
  if (world.nextSpawn <= 0) spawnObstacle(world, width);

  const player = playerBox(world);
  for (const obstacle of world.obstacles) {
    obstacle.x -= world.speed * dt;

    const oy = obstacleY(obstacle);
    // A couple of forgiving pixels: pixel-exact hitboxes feel unfair here.
    const hit =
      player.x + player.width - 4 > obstacle.x &&
      player.x + 4 < obstacle.x + obstacle.width &&
      player.y + player.height - 4 > oy &&
      player.y + 4 < oy + obstacle.height;

    if (hit) {
      world.phase = "over";
      return true;
    }
  }
  world.obstacles = world.obstacles.filter((o) => o.x + o.width > -40);
  return false;
}

type Palette = {
  ink: string;
  paper: string;
  accent: string;
  /** Reserved for everything that has to be ducked under. */
  duck: string;
  sans: string;
};

// --- decor ---------------------------------------------------------------
// Six scenes, each with its own tint, cycling every DECOR_PERIOD seconds with
// a cross-fade. They scroll at a third of the world speed: enough parallax to
// read as distance, quiet enough never to compete with the obstacles. Every
// column comes from a deterministic hash, so a skyline can never flicker.
const DECOR_PERIOD = 10;
const DECOR_FADE = 1.4;
/** The name is an announcement, not a permanent label: it lands, holds, and
 *  clears out well before the world it belongs to does. */
const NAME_IN = 0.55;
const NAME_HOLD = 3.6;
const NAME_OUT = 1;
const DECOR_PARALLAX = 0.32;
const DECOR_ALPHA = 0.3;

function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

type Painter = (ctx: CanvasRenderingContext2D, width: number, offset: number) => void;

/** Walks the columns of a repeating motif that scrolls with `offset`. */
function columns(
  width: number,
  offset: number,
  step: number,
  paint: (x: number, column: number) => void,
): void {
  const first = Math.floor(offset / step);
  for (let i = 0; i <= Math.ceil(width / step) + 1; i++) {
    const column = first + i;
    paint(column * step - offset, column);
  }
}

const paintCity: Painter = (ctx, width, offset) => {
  columns(width, offset, 34, (x, column) => {
    const h = 26 + hash(column) * 54;
    ctx.fillRect(Math.round(x), WORLD.groundY - h, 26, h);
    // Two lit windows, the only detail these towers get.
    if (hash(column * 3.7) > 0.5) {
      ctx.clearRect(Math.round(x) + 6, WORLD.groundY - h + 10, 5, 5);
      ctx.clearRect(Math.round(x) + 15, WORLD.groundY - h + 22, 5, 5);
    }
  });
};

const paintDesert: Painter = (ctx, width, offset) => {
  // Dunes: two rows of flattened arcs, the back row barely moving.
  for (let row = 0; row < 2; row++) {
    const shift = offset * (1 - row * 0.4);
    const rise = 24 + row * 15;
    ctx.beginPath();
    ctx.moveTo(0, WORLD.groundY);
    for (let x = 0; x <= width; x += 8) {
      const y = WORLD.groundY - rise - Math.sin((x + shift) / (90 + row * 50)) * 14;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, WORLD.groundY);
    ctx.closePath();
    ctx.fill();
  }
  // A cactus every so often, sitting on the line.
  columns(width, offset, 150, (x, column) => {
    if (hash(column * 2.3) < 0.45) return;
    const h = 26 + hash(column) * 16;
    ctx.fillRect(x, WORLD.groundY - h, 7, h);
    ctx.fillRect(x - 9, WORLD.groundY - h * 0.72, 9, 5);
    ctx.fillRect(x - 9, WORLD.groundY - h * 0.72, 5, 14);
    ctx.fillRect(x + 7, WORLD.groundY - h * 0.86, 9, 5);
    ctx.fillRect(x + 12, WORLD.groundY - h * 0.86, 5, 18);
  });
};

const paintForest: Painter = (ctx, width, offset) => {
  columns(width, offset, 30, (x, column) => {
    const h = 34 + hash(column) * 30;
    ctx.beginPath();
    ctx.moveTo(x - 11, WORLD.groundY);
    ctx.lineTo(x, WORLD.groundY - h);
    ctx.lineTo(x + 11, WORLD.groundY);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 1.5, WORLD.groundY - 6, 3, 6);
  });
};

const paintSea: Painter = (ctx, width, offset) => {
  for (let row = 0; row < 3; row++) {
    const y = WORLD.groundY - 20 - row * 16;
    const shift = offset * (1 - row * 0.18);
    ctx.beginPath();
    for (let x = 0; x <= width; x += 6) {
      const wave = Math.sin((x + shift) / 34 + row) * 5;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

const paintMountains: Painter = (ctx, width, offset) => {
  columns(width, offset, 190, (x, column) => {
    const h = 62 + hash(column) * 48;
    ctx.beginPath();
    ctx.moveTo(x - 105, WORLD.groundY);
    ctx.lineTo(x, WORLD.groundY - h);
    ctx.lineTo(x + 105, WORLD.groundY);
    ctx.closePath();
    ctx.fill();
    // Snow cap: the same silhouette, brighter.
    const capAlpha = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, capAlpha * 2.4);
    ctx.beginPath();
    ctx.moveTo(x - 22, WORLD.groundY - h + 21);
    ctx.lineTo(x, WORLD.groundY - h);
    ctx.lineTo(x + 22, WORLD.groundY - h + 21);
    ctx.lineTo(x + 9, WORLD.groundY - h + 15);
    ctx.lineTo(x - 4, WORLD.groundY - h + 22);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = capAlpha;
  });
};

const paintNight: Painter = (ctx, width, offset) => {
  columns(width, offset, 46, (x, column) => {
    const y = 18 + hash(column) * 96;
    ctx.beginPath();
    ctx.arc(x, y, hash(column * 5.1) > 0.8 ? 2.4 : 1.4, 0, Math.PI * 2);
    ctx.fill();
  });
  // One moon, parked far away so it barely drifts.
  const moonX = width - ((offset * 0.25) % (width + 220)) + 110;
  ctx.beginPath();
  ctx.arc(moonX, 46, 17, 0, Math.PI * 2);
  ctx.fill();
};

interface Scene {
  key: string;
  /** Each world is tinted rather than plain paper — the only colour in the
   *  panel besides the orange accent. */
  tint: string;
  paint: Painter;
}

const SCENES: Scene[] = [
  { key: "city", tint: "#9db4cf", paint: paintCity },
  { key: "desert", tint: "#e0a566", paint: paintDesert },
  { key: "forest", tint: "#7cba8d", paint: paintForest },
  { key: "sea", tint: "#5fb4c6", paint: paintSea },
  { key: "mountains", tint: "#b1abd8", paint: paintMountains },
  { key: "night", tint: "#8d94e2", paint: paintNight },
];

export const SCENE_KEYS = SCENES.map((scene) => scene.key);

/** Who the world being crossed is about. */
export interface WorldCard {
  kind: string;
  name: string;
  detail: string;
}

/**
 * The name of whoever this world belongs to, set as a giant hollow word across
 * the sky.
 *
 * This is why the game is on the page: it tours our clients, projects and
 * backers one world at a time. So the name is not a label on top of the game,
 * it is part of the scenery — outlined rather than filled so obstacles stay
 * readable through it, and sized to the panel so a long name shrinks instead
 * of running off the edge of a phone. Above it, a single mono kicker says who
 * they are; nothing else competes.
 */
function nameAlpha(elapsed: number, idle: boolean): number {
  if (idle) return 1;
  if (elapsed < NAME_IN) return elapsed / NAME_IN;
  const held = elapsed - NAME_IN;
  if (held < NAME_HOLD) return 1;
  return Math.max(0, 1 - (held - NAME_HOLD) / NAME_OUT);
}

function drawWorldName(
  ctx: CanvasRenderingContext2D,
  card: WorldCard | undefined,
  scene: Scene,
  alpha: number,
  width: number,
  palette: Palette,
): void {
  if (!card || !card.name || alpha <= 0.01) return;
  const name = card.name.toUpperCase();
  const x = width / 2;

  // Rises into place on the way in, keeps drifting up on the way out.
  const drift = (1 - alpha) * 12;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Kicker above the name, magazine style: what they are and what they do, on
  // one quiet line, so the big word underneath can just be the name.
  ctx.globalAlpha = alpha * 0.65;
  ctx.fillStyle = scene.tint;
  ctx.letterSpacing = "4px";
  ctx.font = `600 10px ui-monospace, "SF Mono", Menlo, monospace`;
  const kicker = card.detail
    ? `${card.kind.toUpperCase()} — ${card.detail.toUpperCase()}`
    : card.kind.toUpperCase();
  ctx.fillText(kicker, x, 26 - drift);

  // Fit the word to the panel: short names get the full 68px, long ones shrink
  // rather than run off the edges of a phone.
  let size = 68;
  ctx.letterSpacing = "5px";
  ctx.font = `700 ${size}px ${palette.sans}`;
  const maxWidth = width * 0.66;
  const measured = ctx.measureText(name).width;
  if (measured > maxWidth) size = Math.max(26, (size * maxWidth) / measured);
  ctx.font = `700 ${size}px ${palette.sans}`;

  const baseline = 86 - drift;

  // A whisper of fill gives the letters body without hiding what runs behind.
  ctx.globalAlpha = alpha * 0.08;
  ctx.fillStyle = scene.tint;
  ctx.fillText(name, x, baseline);

  ctx.globalAlpha = alpha * 0.8;
  ctx.strokeStyle = scene.tint;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  ctx.strokeText(name, x, baseline);
  ctx.restore();
}

function drawDecorLayer(
  ctx: CanvasRenderingContext2D,
  index: number,
  width: number,
  distance: number,
  alpha: number,
  palette: Palette,
  card: WorldCard | undefined,
  cardAlpha = alpha,
): void {
  if (alpha <= 0.01) return;
  const scene = SCENES[index % SCENES.length];

  ctx.save();
  // Never let a silhouette cross the ground line.
  ctx.beginPath();
  ctx.rect(0, 0, width, WORLD.groundY);
  ctx.clip();
  ctx.globalAlpha = alpha * DECOR_ALPHA;
  ctx.fillStyle = scene.tint;
  ctx.strokeStyle = scene.tint;
  scene.paint(ctx, width, distance * DECOR_PARALLAX + index * 900);
  ctx.restore();

  drawWorldName(ctx, card, scene, cardAlpha, width, palette);
}

function drawDecor(
  ctx: CanvasRenderingContext2D,
  world: World,
  width: number,
  palette: Palette,
  cards: WorldCard[],
): void {
  const index = Math.floor(world.t / DECOR_PERIOD);
  const elapsed = world.t - index * DECOR_PERIOD;
  // The first world is already there — fading it in from nothing left the
  // panel blank before the run starts, which is when it is most looked at.
  const entering = index === 0 ? 1 : Math.min(1, elapsed / DECOR_FADE);
  const cardAt = (i: number) => (cards.length ? cards[i % cards.length] : undefined);

  if (index > 0 && entering < 1) {
    drawDecorLayer(ctx, index - 1, width, world.distance, 1 - entering, palette, undefined);
  }
  drawDecorLayer(
    ctx,
    index,
    width,
    world.distance,
    entering,
    palette,
    cardAt(index),
    Math.min(entering, nameAlpha(elapsed, world.phase !== "running")),
  );
}

/**
 * The player: a small paper bird. Everything is expressed as a fraction of its
 * box, so the same drawing squashes into the ducking silhouette without any
 * second set of numbers. The wing beats while running and stays raised in the
 * air, which doubles as the "am I airborne?" cue.
 */
function drawBird(
  ctx: CanvasRenderingContext2D,
  world: World,
  box: { x: number; y: number; width: number; height: number },
  palette: Palette,
  crashed: boolean,
): void {
  const { x, y, width: w, height: h } = box;
  const px = (fx: number, fy: number): [number, number] => [x + fx * w, y + fy * h];

  const beat = world.grounded ? Math.sin(world.t * 14) : 1;
  // Kept inside the silhouette: a wing that leaves the body reads as a hole.
  const wingTip = 0.32 - beat * 0.13;

  ctx.save();
  ctx.fillStyle = crashed ? palette.accent : palette.paper;
  ctx.strokeStyle = crashed ? palette.accent : palette.paper;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Tail, body and head in one silhouette.
  ctx.beginPath();
  ctx.moveTo(...px(0.02, 0.34));
  ctx.lineTo(...px(0.24, 0.52));
  ctx.bezierCurveTo(...px(0.3, 0.98), ...px(0.7, 1.0), ...px(0.76, 0.62));
  ctx.bezierCurveTo(...px(0.82, 0.5), ...px(0.88, 0.42), ...px(0.86, 0.3));
  ctx.bezierCurveTo(...px(0.84, 0.12), ...px(0.6, 0.08), ...px(0.5, 0.24));
  ctx.bezierCurveTo(...px(0.42, 0.36), ...px(0.2, 0.36), ...px(0.02, 0.34));
  ctx.closePath();
  ctx.fill();

  // Beak: a small wedge, the detail that makes it read as a bird at 32px.
  ctx.beginPath();
  ctx.moveTo(...px(0.85, 0.22));
  ctx.lineTo(...px(1.0, 0.3));
  ctx.lineTo(...px(0.85, 0.36));
  ctx.closePath();
  ctx.fill();

  // Wing: a filled crescent cut out of the body. A stroke reads as a frown at
  // this size; a shape reads as a wing.
  ctx.fillStyle = crashed ? palette.paper : palette.ink;
  ctx.beginPath();
  ctx.moveTo(...px(0.3, 0.62));
  ctx.quadraticCurveTo(...px(0.45, wingTip), ...px(0.62, 0.52));
  ctx.quadraticCurveTo(...px(0.48, 0.6), ...px(0.4, 0.72));
  ctx.quadraticCurveTo(...px(0.34, 0.68), ...px(0.3, 0.62));
  ctx.closePath();
  ctx.fill();

  // Eye.
  ctx.fillStyle = crashed ? palette.paper : palette.ink;
  ctx.beginPath();
  ctx.arc(...px(0.7, 0.26), Math.max(1.2, h * 0.045), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Solid depth of a ceiling bar's lower edge. */
const CEILING_LIP = 26;

function moveColour(kind: ObstacleKind, palette: Palette): string {
  const move = movesUnder(kind);
  if (move === "double") return palette.accent;
  if (move === "duck") return palette.duck;
  return palette.paper;
}

/**
 * A flying predator: all beak and wings, drawn from the same fractions-of-its-
 * box idea as the player so it stays readable at 30px. It beats its wings out
 * of phase with its neighbours and rides a slow bob, which is what separates a
 * living thing from a slab at a glance.
 */
function drawFlyer(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  t: number,
  palette: Palette,
): void {
  const w = obstacle.width;
  const h = obstacle.height;
  const x = obstacle.x;
  const y = obstacleY(obstacle) + Math.sin(t * 3 + obstacle.phase) * 2;
  const px = (fx: number, fy: number): [number, number] => [x + fx * w, y + fy * h];
  const beat = Math.sin(t * 11 + obstacle.phase);

  ctx.save();
  ctx.fillStyle = moveColour(obstacle.kind, palette);

  // Body: beak to the left, tail to the right, so it reads as coming at you.
  ctx.beginPath();
  ctx.moveTo(...px(0, 0.5));
  ctx.lineTo(...px(0.28, 0.3));
  ctx.lineTo(...px(0.8, 0.34));
  ctx.quadraticCurveTo(...px(0.99, 0.5), ...px(0.8, 0.66));
  ctx.lineTo(...px(0.28, 0.7));
  ctx.closePath();
  ctx.fill();

  // Open jaw.
  ctx.beginPath();
  ctx.moveTo(...px(-0.06, 0.4));
  ctx.lineTo(...px(0.26, 0.5));
  ctx.lineTo(...px(-0.04, 0.68));
  ctx.closePath();
  ctx.fill();

  // Tail fin.
  ctx.beginPath();
  ctx.moveTo(...px(0.82, 0.36));
  ctx.lineTo(...px(1.04, 0.02));
  ctx.lineTo(...px(0.98, 0.48));
  ctx.closePath();
  ctx.fill();

  // The wing sweeps well above the body and back down through it. It leaves
  // the hit box on the way up, which only ever works in the player's favour:
  // the box stays smaller than the drawing, never larger.
  ctx.beginPath();
  ctx.moveTo(...px(0.34, 0.4));
  ctx.lineTo(...px(0.58, 0.2 - beat * 0.75));
  ctx.lineTo(...px(0.78, 0.44));
  ctx.closePath();
  ctx.fill();

  // Eye, punched out of the body.
  ctx.fillStyle = palette.ink;
  ctx.beginPath();
  ctx.arc(...px(0.24, 0.5), Math.max(1.1, h * 0.08), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Standing and hanging obstacles. Corners are rounded only on the edges facing
 * the bird, so each one still points the way it hangs, and anything that needs
 * a move other than a plain jump wears diagonal hazard stripes.
 */
function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  t: number,
  palette: Palette,
): void {
  if (isFlyer(obstacle.kind)) {
    drawFlyer(ctx, obstacle, t, palette);
    return;
  }

  const x = Math.round(obstacle.x);
  const y = Math.round(obstacleY(obstacle));
  const w = obstacle.width;
  const h = obstacle.height;
  const striped = obstacle.kind !== "low";

  ctx.save();
  // Held as a Path2D rather than the context's current path: the curtain below
  // draws its own paths, which would otherwise clobber the shape this has to
  // be clipped to — and silently drop the hazard stripes.
  const shape = new Path2D();
  // [top-left, top-right, bottom-right, bottom-left]
  const radii: [number, number, number, number] =
    obstacle.kind === "ceiling" ? [0, 0, 3, 3] : [3, 3, 0, 0];
  shape.roundRect(x, y, w, h, radii);
  const colour = moveColour(obstacle.kind, palette);

  if (obstacle.kind === "ceiling") {
    // A long bar is a wall of colour if it is filled to the roof. Only the
    // business end — the part your head meets — is solid; the rest is a
    // curtain, which still says "no way over this" without the mass.
    ctx.save();
    ctx.clip(shape);
    // The curtain is drawn as hanging threads rather than a filled block: a
    // solid tint went muddy against the ink, and threads read as something
    // suspended from the roof.
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    for (let tx = x + 5; tx < x + w; tx += 11) {
      ctx.beginPath();
      ctx.moveTo(Math.round(tx) + 0.5, y);
      ctx.lineTo(Math.round(tx) + 0.5, y + h - CEILING_LIP);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = colour;
    ctx.fillRect(x, y + h - CEILING_LIP, w, CEILING_LIP);
    ctx.restore();
  } else {
    ctx.fillStyle = colour;
    ctx.fill(shape);
  }
  ctx.clip(shape);

  if (striped) {
    const bandTop = obstacle.kind === "ceiling" ? y + h - CEILING_LIP : y;
    const bandHeight = obstacle.kind === "ceiling" ? CEILING_LIP : h;
    const band = new Path2D();
    band.rect(x, bandTop, w, bandHeight);
    ctx.clip(band);
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 5;
    for (let offset = -bandHeight; offset < w + bandHeight; offset += 13) {
      ctx.beginPath();
      ctx.moveTo(x + offset, bandTop + bandHeight);
      ctx.lineTo(x + offset + bandHeight, bandTop);
      ctx.stroke();
    }
  } else {
    // A thin shaded edge down the leading side gives the slab some thickness.
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = palette.ink;
    ctx.fillRect(x + w - 2.5, y, 2.5, h);
  }
  ctx.restore();
}

function draw(
  ctx: CanvasRenderingContext2D,
  world: World,
  width: number,
  palette: Palette,
  cards: WorldCard[],
): void {
  ctx.clearRect(0, 0, width, WORLD.height);

  drawDecor(ctx, world, width, palette, cards);


  // Ground: one hairline, nothing else. The panel already frames the game, so
  // any extra texture would just be noise.
  ctx.strokeStyle = palette.paper;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, WORLD.groundY + 0.5);
  ctx.lineTo(width, WORLD.groundY + 0.5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  for (const obstacle of world.obstacles) drawObstacle(ctx, obstacle, world.t, palette);

  if (world.puff) {
    ctx.save();
    ctx.globalAlpha = world.puff.life * 0.7;
    ctx.fillStyle = palette.paper;
    const spread = (1 - world.puff.life) * 14;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(world.puff.x + i * spread, world.puff.y + spread * 0.5, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawBird(ctx, world, playerBox(world), palette, world.phase === "over");

  // Not playing — lost, or not started yet: drop a near-solid veil over the
  // world so the only things left to read are the score above the canvas and
  // the call to action on top of it.
  if (world.phase !== "running") {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = palette.ink;
    ctx.fillRect(0, 0, width, WORLD.height);
    ctx.restore();
  }
}

function pad(score: number): string {
  return String(Math.min(score, 99999)).padStart(4, "0");
}

export function HeroRunner({ items }: { items: RunnerItem[] }) {
  const t = useTranslations("runner");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World>(createWorld());
  const widthRef = useRef(960);
  // Assume on-screen until the observer says otherwise: the band is above the
  // fold on arrival, and a first frame spent frozen would be visible.
  const visibleRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  const cardsRef = useRef<WorldCard[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const best = Number(useSyncExternalStore(subscribeBest, readBest, () => "0")) || 0;

  useEffect(() => {
    // One card per world: the scene name plus the client, project or badge it
    // features. Both lists cycle, so their pairing keeps shifting.
    // Shuffled per visit: the roster is a tour, not a fixed playlist, and the
    // first world is not always the same client.
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const count = Math.max(SCENE_KEYS.length, shuffled.length) * SCENE_KEYS.length;
    cardsRef.current = Array.from({ length: count }, (_, index) => {
      const item = shuffled[index % shuffled.length];
      return {
        kind: item ? t(`kinds.${item.kind}`) : "",
        name: item?.name ?? "",
        detail: item?.detail ?? "",
      };
    });
  }, [items, t]);

  const start = useCallback(() => {
    const world = createWorld(speedScale(widthRef.current));
    world.phase = "running";
    worldRef.current = world;
    setScore(0);
    setPhase("running");
    captureEvent("hero_runner_started");
  }, []);

  const jump = useCallback(() => {
    const world = worldRef.current;
    if (world.phase !== "running") return;

    if (world.grounded) {
      world.playerVY = WORLD.jumpVelocity;
      world.grounded = false;
      world.jumps = 1;
      return;
    }
    // Second press mid-air: top the bird up to a fixed peak, and puff so the
    // move is legible.
    if (world.jumps >= 2) return;
    const climbed = WORLD.groundY - world.playerY;
    const remaining = Math.max(0, WORLD.doubleJumpPeak - climbed);
    world.playerVY = -Math.sqrt(2 * WORLD.gravity * remaining);
    world.jumps = 2;
    world.puff = {
      x: WORLD.playerX + WORLD.playerSize / 2,
      y: world.playerY,
      life: 1,
    };
  }, []);

  const setDucking = useCallback((ducking: boolean) => {
    const world = worldRef.current;
    if (world.phase === "running") world.ducking = ducking;
  }, []);

  /** Space and the arrows do double duty as page controls — only take them
   *  over while the band is genuinely on screen and nothing else has focus.
   *  Measured synchronously: an observer callback can lag a frame behind a
   *  scroll, and a swallowed first keypress is the worst possible first
   *  impression for a game that is supposed to answer instantly. */
  const shouldCaptureKeys = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    const rect = container.getBoundingClientRect();
    const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

    // Off screen entirely: space belongs to the page.
    if (shown <= 0) return false;
    // Mid-run, any sliver of the band on screen means the key is the player's
    // — a short window used to drop the band under a 50% threshold and
    // silently hand the space bar back to the scroller mid-game.
    if (worldRef.current.phase !== "running" && shown < rect.height * 0.3) return false;

    const active = document.activeElement;
    if (!active || active === document.body) return true;
    if (container.contains(active)) return true;
    return !active.matches("input, textarea, select, button, a, [contenteditable]");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isJump = event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW";
      const isDuck = event.code === "ArrowDown" || event.code === "KeyS";
      if (!isJump && !isDuck) return;
      if (!shouldCaptureKeys()) return;

      event.preventDefault();
      if (isJump) {
        if (worldRef.current.phase === "running") jump();
        else start();
        return;
      }
      if (worldRef.current.phase === "running") setDucking(true);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowDown" || event.code === "KeyS") setDucking(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [jump, setDucking, shouldCaptureKeys, start]);

  // Canvas sizing (DPR aware) + visibility tracking.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Measure the canvas, not the container: clientWidth includes the
      // container's horizontal padding, which made the canvas overhang the
      // panel on the right and leak decor outside the ink.
      const width = canvas.clientWidth;
      if (width === 0) return;
      const zoom = width < 640 ? 0.8 : 1;
      const cssHeight = Math.round(WORLD.height * zoom);
      // The world stays in logical units; only the scale of the view changes.
      widthRef.current = width / zoom;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.height = `${cssHeight}px`;
      ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: [0, 0.1] },
    );
    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  // Fixed-timestep loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(canvas);
    const palette: Palette = {
      // The panel is inverted: the page's foreground is the band's surface and
      // the page's background is what gets drawn on it.
      ink: styles.getPropertyValue("--foreground").trim() || "#0a0a0a",
      paper: styles.getPropertyValue("--background").trim() || "#fdfbf7",
      accent: "#f97316",
      // Yellow with black stripes: the universal "watch your head". Its
      // position tells it apart from the orange barriers — this hangs or
      // flies, orange always stands on the ground.
      duck: "#e9dd52",
      // The panel inherits the page font; the title card borrows it so the
      // names are set in the same voice as the hero above them.
      sans: styles.fontFamily || "system-ui, sans-serif",
    };

    let last = performance.now();
    let accumulator = 0;
    let lastScore = -1;

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      // Below md the panel is display:none, so there is nothing to advance and
      // nothing to draw. Bail before doing either.
      if (canvas.clientWidth === 0) {
        last = now;
        return;
      }
      const world = worldRef.current;

      // A backgrounded tab hands back a huge delta; clamp it so nobody comes
      // back to a run that was silently played out without them.
      accumulator += Math.min((now - last) / 1000, 0.25);
      last = now;

      if (world.phase === "running" && !visibleRef.current) {
        // Scrolled out of sight: hold the run exactly where it is.
        accumulator = 0;
        draw(ctx, world, widthRef.current, palette, cardsRef.current);
        return;
      }

      if (world.phase === "running") {
        let crashed = false;
        while (accumulator >= STEP && !crashed) {
          crashed = step(world, STEP, widthRef.current);
          accumulator -= STEP;
        }

        if (world.score !== lastScore) {
          lastScore = world.score;
          setScore(world.score);
        }

        if (crashed) {
          setPhase("over");
          if (world.score > Number(readBest())) writeBest(world.score);
          captureEvent("hero_runner_game_over", { score: world.score });
        }
      } else {
        accumulator = 0;
      }

      draw(ctx, world, widthRef.current, palette, cardsRef.current);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isNewBest = phase === "over" && score > 0 && score >= best;

  return (
    <section
      aria-labelledby="runner-heading"
      className="relative mt-8 hidden bg-foreground text-background md:mt-10 md:block"
    >
      <h2 id="runner-heading" className="sr-only">
        {t("heading")}
      </h2>

      {/* Readout row, inside the panel: controls left, score right. */}
      <div className="flex items-baseline justify-between gap-3 px-5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-background/55 md:gap-4 md:px-7 md:text-[11px] md:tracking-[0.2em]">
        <p className="m-0">{t("hint")}</p>
        <p className="m-0 ml-auto flex shrink-0 items-center gap-2 tabular-nums md:gap-4">
          <span className={isNewBest ? "text-orange-500" : "text-background"}>
            {t("score")} {pad(score)}
          </span>
          <span aria-hidden="true" className="text-background/25">
            /
          </span>
          <span>
            {t("best")} {pad(best)}
          </span>
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative cursor-pointer select-none px-5 pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-background md:px-7 md:pb-4"
        role="button"
        tabIndex={0}
        aria-label={t("aria")}
        onPointerDown={(event) => {
          event.preventDefault();
          if (phase === "running") jump();
          else start();
        }}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />

        {phase !== "running" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="m-0 border border-background/30 bg-foreground px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-background md:text-xs">
              {phase === "idle" ? (
                t("start")
              ) : (
                <>
                  <span className="text-orange-500">{t("over")}</span>{" "}
                  <span aria-hidden="true">·</span> {t("restart")}
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {phase === "over" ? t("announce", { score }) : ""}
      </p>
    </section>
  );
}
