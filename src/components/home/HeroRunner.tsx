"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { captureEvent } from "@/lib/posthog";

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
  // Apex is v²/2g = 110px, which uses the taller band without ever pushing the
  // mark off the top of the canvas.
  jumpVelocity: -756,
  playerX: 104,
  playerSize: 32,
  duckHeight: 18,
  startSpeed: 300,
  maxSpeed: 620,
  // Speed gains acceleration × 10 px/s per second, so this reaches top speed
  // in roughly 50s instead of the 8s that made the run unplayable on arrival.
  acceleration: 0.6,
  spawnGapMin: 440,
  spawnGapMax: 760,
  /** Flying slabs hang at head height: they clip a standing mark and miss a
   *  ducking one. Both numbers are relative to the ground line. */
  flyOffset: 42,
  flyHeight: 18,
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

type Obstacle = {
  x: number;
  width: number;
  height: number;
  flying: boolean;
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
    obstacles: [],
    nextSpawn: 620,
  };
}

function spawnObstacle(world: World, width: number): void {
  // Flying slabs only appear once the run has some speed, so the opening
  // seconds stay readable for someone who just landed on the page.
  const flying = world.speed > 460 * world.scale && Math.random() > 0.75;

  world.obstacles.push(
    flying
      ? { x: width + 40, width: 54, height: WORLD.flyHeight, flying: true }
      : { x: width + 40, width: 18, height: 34 + Math.random() * 18, flying: false },
  );

  const pressure =
    (world.speed / world.scale - WORLD.startSpeed) / (WORLD.maxSpeed - WORLD.startSpeed);
  world.nextSpawn = Math.max(
    340,
    WORLD.spawnGapMin + Math.random() * (WORLD.spawnGapMax - WORLD.spawnGapMin) - pressure * 70,
  );
}

function obstacleY(obstacle: Obstacle): number {
  return obstacle.flying ? WORLD.groundY - WORLD.flyOffset : WORLD.groundY - obstacle.height;
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
  } else {
    world.grounded = false;
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

type Palette = { ink: string; paper: string; accent: string };

// --- decor ---------------------------------------------------------------
// Five silhouettes drawn behind the ground line, one every DECOR_PERIOD
// seconds, cross-fading into each other so the run feels like it crosses
// worlds. They scroll at a third of the world speed: enough parallax to read
// as distance, quiet enough never to compete with the obstacles.
const WORLDS = ["city", "hills", "forest", "sea", "night"] as const;
const DECOR_PERIOD = 10;
const DECOR_FADE = 1.4;
const DECOR_PARALLAX = 0.32;

/** Deterministic per-column pseudo-random, so a skyline never flickers. */
function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function drawCity(ctx: CanvasRenderingContext2D, width: number, offset: number): void {
  const step = 34;
  const first = Math.floor(offset / step);
  for (let i = 0; i <= Math.ceil(width / step) + 1; i++) {
    const column = first + i;
    const x = column * step - offset;
    const h = 26 + hash(column) * 54;
    ctx.fillRect(Math.round(x), WORLD.groundY - h, step - 8, h);
    // A couple of lit windows, the only detail these buildings get.
    if (hash(column * 3.7) > 0.55) {
      ctx.clearRect(Math.round(x) + 6, WORLD.groundY - h + 10, 5, 5);
    }
  }
}

function drawHills(ctx: CanvasRenderingContext2D, width: number, offset: number): void {
  const step = 190;
  const first = Math.floor(offset / step);
  for (let i = 0; i <= Math.ceil(width / step) + 1; i++) {
    const column = first + i;
    const x = column * step - offset;
    const h = 58 + hash(column) * 46;
    ctx.beginPath();
    ctx.moveTo(x - step * 0.55, WORLD.groundY);
    ctx.lineTo(x, WORLD.groundY - h);
    ctx.lineTo(x + step * 0.55, WORLD.groundY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawForest(ctx: CanvasRenderingContext2D, width: number, offset: number): void {
  const step = 30;
  const first = Math.floor(offset / step);
  for (let i = 0; i <= Math.ceil(width / step) + 1; i++) {
    const column = first + i;
    const x = column * step - offset;
    const h = 34 + hash(column) * 30;
    ctx.beginPath();
    ctx.moveTo(x - 11, WORLD.groundY);
    ctx.lineTo(x, WORLD.groundY - h);
    ctx.lineTo(x + 11, WORLD.groundY);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 1.5, WORLD.groundY - 6, 3, 6);
  }
}

function drawSea(ctx: CanvasRenderingContext2D, width: number, offset: number): void {
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
}

function drawNight(ctx: CanvasRenderingContext2D, width: number, offset: number): void {
  const step = 46;
  const first = Math.floor(offset / step);
  for (let i = 0; i <= Math.ceil(width / step) + 1; i++) {
    const column = first + i;
    const x = column * step - offset;
    const y = 18 + hash(column) * 96;
    const r = hash(column * 5.1) > 0.8 ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // One moon, parked far away so it barely drifts.
  const moonX = width - ((offset * 0.25) % (width + 220)) + 110;
  ctx.beginPath();
  ctx.arc(moonX, 46, 17, 0, Math.PI * 2);
  ctx.fill();
}

const DECOR_PAINTERS = [drawCity, drawHills, drawForest, drawSea, drawNight];

function drawDecorLayer(
  ctx: CanvasRenderingContext2D,
  index: number,
  width: number,
  distance: number,
  alpha: number,
  palette: Palette,
  label: string | undefined,
): void {
  if (alpha <= 0.01) return;
  const painter = DECOR_PAINTERS[index % DECOR_PAINTERS.length];

  ctx.save();
  // Never let a silhouette cross the ground line.
  ctx.beginPath();
  ctx.rect(0, 0, width, WORLD.groundY);
  ctx.clip();
  ctx.globalAlpha = alpha * 0.22;
  ctx.fillStyle = palette.paper;
  ctx.strokeStyle = palette.paper;
  painter(ctx, width, distance * DECOR_PARALLAX + index * 900);
  ctx.restore();

  if (!label) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.5;
  ctx.fillStyle = palette.paper;
  ctx.font = '600 10px ui-monospace, "SF Mono", Menlo, monospace';
  ctx.letterSpacing = "2px";
  ctx.fillText(label.toUpperCase(), 2, 18);
  ctx.restore();
}

function drawDecor(
  ctx: CanvasRenderingContext2D,
  world: World,
  width: number,
  palette: Palette,
  labels: string[],
): void {
  const index = Math.floor(world.t / DECOR_PERIOD);
  const elapsed = world.t - index * DECOR_PERIOD;
  const entering = Math.min(1, elapsed / DECOR_FADE);

  if (index > 0 && entering < 1) {
    drawDecorLayer(ctx, index - 1, width, world.distance, 1 - entering, palette, undefined);
  }
  drawDecorLayer(ctx, index, width, world.distance, entering, palette, labels[index % labels.length]);
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

function draw(
  ctx: CanvasRenderingContext2D,
  world: World,
  width: number,
  palette: Palette,
  labels: string[],
): void {
  ctx.clearRect(0, 0, width, WORLD.height);

  drawDecor(ctx, world, width, palette, labels);


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

  for (const obstacle of world.obstacles) {
    const y = obstacleY(obstacle);
    ctx.fillStyle = obstacle.flying ? palette.accent : palette.paper;
    ctx.fillRect(Math.round(obstacle.x), Math.round(y), obstacle.width, obstacle.height);
  }

  drawBird(ctx, world, playerBox(world), palette, world.phase === "over");
}

function pad(score: number): string {
  return String(Math.min(score, 99999)).padStart(4, "0");
}

export function HeroRunner() {
  const t = useTranslations("runner");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World>(createWorld());
  const widthRef = useRef(960);
  // Assume on-screen until the observer says otherwise: the band is above the
  // fold on arrival, and a first frame spent frozen would be visible.
  const visibleRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  const labelsRef = useRef<string[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const best = Number(useSyncExternalStore(subscribeBest, readBest, () => "0")) || 0;

  useEffect(() => {
    labelsRef.current = WORLDS.map((world) => t(`worlds.${world}`));
  }, [t]);

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
    if (world.phase !== "running" || !world.grounded) return;
    world.playerVY = WORLD.jumpVelocity;
    world.grounded = false;
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
    if (shown < rect.height * 0.5) return false;

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
      const width = container.clientWidth;
      const zoom = width < 640 ? 0.8 : 1;
      const cssHeight = Math.round(WORLD.height * zoom);
      // The world stays in logical units; only the scale of the view changes.
      widthRef.current = width / zoom;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${width}px`;
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
    };

    let last = performance.now();
    let accumulator = 0;
    let lastScore = -1;

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const world = worldRef.current;

      // A backgrounded tab hands back a huge delta; clamp it so nobody comes
      // back to a run that was silently played out without them.
      accumulator += Math.min((now - last) / 1000, 0.25);
      last = now;

      if (world.phase === "running" && !visibleRef.current) {
        // Scrolled out of sight: hold the run exactly where it is.
        accumulator = 0;
        draw(ctx, world, widthRef.current, palette, labelsRef.current);
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

      draw(ctx, world, widthRef.current, palette, labelsRef.current);
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
      className="relative mt-8 bg-foreground text-background md:mt-10"
    >
      <h2 id="runner-heading" className="sr-only">
        {t("heading")}
      </h2>

      {/* Readout row, inside the panel: controls left, score right. */}
      <div className="flex items-baseline justify-between gap-3 px-5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-background/55 md:gap-4 md:px-7 md:text-[11px] md:tracking-[0.2em]">
        <p className="m-0 hidden sm:block">{t("hint")}</p>
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
                <>
                  <span className="hidden sm:inline">{t("start")}</span>
                  <span className="sm:hidden">{t("startTouch")}</span>
                </>
              ) : (
                <>
                  <span className="text-orange-500">{t("over")}</span>{" "}
                  <span aria-hidden="true">·</span>{" "}
                  <span className="hidden sm:inline">{t("restart")}</span>
                  <span className="sm:hidden">{t("restartTouch")}</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Touch controls: a tap anywhere jumps, ducking is the one move the
          band cannot infer on its own. */}
      <div className="flex items-center justify-between gap-3 px-5 pb-5 sm:hidden">
        <button
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            setDucking(true);
          }}
          onPointerUp={() => setDucking(false)}
          onPointerLeave={() => setDucking(false)}
          className="flex-1 border border-background/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-background active:bg-background active:text-foreground"
        >
          {t("duck")}
        </button>
        <button
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            if (phase === "running") jump();
            else start();
          }}
          className="flex-1 bg-background px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground"
        >
          {t("jump")}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {phase === "over" ? t("announce", { score }) : ""}
      </p>
    </section>
  );
}
