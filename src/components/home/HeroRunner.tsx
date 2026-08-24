"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { captureEvent } from "@/lib/posthog";

/**
 * A hairline runner band sitting right under the hero — the site's own take on
 * the Chrome offline dino. Deliberately reads as an instrument strip (ruler
 * ticks, mono readouts, ink slabs) rather than a game widget, so it belongs to
 * the warm-paper grid instead of interrupting it.
 *
 * Space / ArrowUp jumps, ArrowDown ducks. Everything is drawn on one canvas at
 * a fixed 60Hz timestep, so the difficulty curve is identical on every display.
 */

// --- world constants, in CSS pixels of the canvas -----------------------------
const WORLD = {
  height: 140,
  groundY: 112,
  gravity: 2600,
  // Apex is v²/2g ≈ 80px: high enough to clear any slab, low enough that the
  // player never leaves the (deliberately short) band.
  jumpVelocity: -645,
  playerX: 96,
  playerSize: 26,
  duckHeight: 14,
  /** Flying slabs hang at head height: they clip a standing player and miss a
   *  ducking one. Both numbers are relative to the ground line. */
  flyOffset: 34,
  flyHeight: 16,
  startSpeed: 340,
  maxSpeed: 780,
  acceleration: 7,
  spawnGapMin: 320,
  spawnGapMax: 620,
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
  /** Flying slabs sit above the ground and can only be ducked under. */
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
  squash: number;
  obstacles: Obstacle[];
  nextSpawn: number;
  flash: number;
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
    squash: 0,
    obstacles: [],
    nextSpawn: 420,
    flash: 0,
  };
}

/** Deterministic-ish spread of obstacle shapes, weighted towards the easy ones. */
function spawnObstacle(world: World, width: number): void {
  const roll = Math.random();
  // Flying slabs only show up once the run has some speed, so the first
  // seconds stay readable for someone who just landed on the page.
  const flying = world.speed > 420 * world.scale && roll > 0.72;

  world.obstacles.push(
    flying
      ? {
          x: width + 40,
          width: 46 + Math.random() * 34,
          height: WORLD.flyHeight,
          flying: true,
        }
      : {
          x: width + 40,
          width: 14 + Math.random() * 16,
          height: 26 + Math.random() * 20,
          flying: false,
        },
  );

  const pressure =
    (world.speed / world.scale - WORLD.startSpeed) / (WORLD.maxSpeed - WORLD.startSpeed);
  const gap =
    WORLD.spawnGapMin +
    Math.random() * (WORLD.spawnGapMax - WORLD.spawnGapMin) -
    pressure * 90;
  world.nextSpawn = Math.max(220, gap);
}

function obstacleY(obstacle: Obstacle): number {
  return obstacle.flying
    ? WORLD.groundY - WORLD.flyOffset
    : WORLD.groundY - obstacle.height;
}

function playerBox(world: World) {
  const height = world.ducking && world.grounded ? WORLD.duckHeight : WORLD.playerSize;
  const width = world.ducking && world.grounded ? WORLD.playerSize + 14 : WORLD.playerSize;
  return { x: WORLD.playerX, y: world.playerY - height, width, height };
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
  if (world.flash > 0) world.flash = Math.max(0, world.flash - dt * 4);

  // Gravity. Ducking mid-air drops you faster, which is the whole trick of the
  // original dino and the only "advanced" move here.
  const gravity = WORLD.gravity * (world.ducking && !world.grounded ? 1.8 : 1);
  world.playerVY += gravity * dt;
  world.playerY += world.playerVY * dt;

  if (world.playerY >= WORLD.groundY) {
    if (!world.grounded) world.squash = 1;
    world.playerY = WORLD.groundY;
    world.playerVY = 0;
    world.grounded = true;
  } else {
    world.grounded = false;
  }
  if (world.squash > 0) world.squash = Math.max(0, world.squash - dt * 6);

  world.nextSpawn -= world.speed * dt;
  if (world.nextSpawn <= 0) spawnObstacle(world, width);

  const player = playerBox(world);
  for (const obstacle of world.obstacles) {
    obstacle.x -= world.speed * dt;

    const oy = obstacleY(obstacle);
    // A couple of forgiving pixels: pixel-exact hitboxes feel unfair here.
    const hit =
      player.x + player.width - 3 > obstacle.x &&
      player.x + 3 < obstacle.x + obstacle.width &&
      player.y + player.height - 3 > oy &&
      player.y + 3 < oy + obstacle.height;

    if (hit) {
      world.phase = "over";
      world.flash = 1;
      return true;
    }
  }
  world.obstacles = world.obstacles.filter((o) => o.x + o.width > -40);
  return false;
}

type Palette = { ink: string; paper: string; muted: string; accent: string };

function draw(
  ctx: CanvasRenderingContext2D,
  world: World,
  width: number,
  palette: Palette,
): void {
  ctx.clearRect(0, 0, width, WORLD.height);

  // Ruler ticks scrolling with the world: the only speed cue, and the detail
  // that makes the band read as an instrument rather than a toy.
  ctx.strokeStyle = palette.muted;
  ctx.globalAlpha = 0.32;
  ctx.lineWidth = 1;
  const tickSpacing = 24;
  const offset = world.distance % tickSpacing;
  for (let x = -offset; x < width; x += tickSpacing) {
    const long = Math.round((x + world.distance) / tickSpacing) % 5 === 0;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, WORLD.groundY + 6);
    ctx.lineTo(Math.round(x) + 0.5, WORLD.groundY + (long ? 16 : 10));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Ground
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, WORLD.groundY + 1);
  ctx.lineTo(width, WORLD.groundY + 1);
  ctx.stroke();

  // Obstacles
  for (const obstacle of world.obstacles) {
    const y = obstacleY(obstacle);
    ctx.fillStyle = obstacle.flying ? palette.accent : palette.ink;
    ctx.fillRect(Math.round(obstacle.x), Math.round(y), obstacle.width, obstacle.height);
  }

  // Player: a solid ink slab that squashes on landing.
  const player = playerBox(world);
  const squash = world.squash * 5;
  ctx.fillStyle = world.phase === "over" ? palette.accent : palette.ink;
  ctx.fillRect(
    Math.round(player.x - squash / 2),
    Math.round(player.y + squash),
    player.width + squash,
    player.height - squash,
  );

  if (world.flash > 0) {
    ctx.globalAlpha = world.flash * 0.14;
    ctx.fillStyle = palette.accent;
    ctx.fillRect(0, 0, width, WORLD.height);
    ctx.globalAlpha = 1;
  }
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

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const best = Number(useSyncExternalStore(subscribeBest, readBest, () => "0")) || 0;

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
    if (containerRef.current?.contains(active)) return true;
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
      widthRef.current = width;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(WORLD.height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${WORLD.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      ink: styles.getPropertyValue("--foreground").trim() || "#0a0a0a",
      paper: styles.getPropertyValue("--background").trim() || "#fdfbf7",
      muted: styles.getPropertyValue("--muted-foreground").trim() || "#525252",
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
        draw(ctx, world, widthRef.current, palette);
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
        if (world.flash > 0) world.flash = Math.max(0, world.flash - 0.016 * 4);
      }

      draw(ctx, world, widthRef.current, palette);
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
      className="relative mt-12 border-t border-border md:mt-14"
    >
      <h2 id="runner-heading" className="sr-only">
        {t("heading")}
      </h2>

      <div>
        {/* Readout row — mono, uppercase, the same register as the nav labels. */}
        <div className="flex items-baseline justify-between gap-3 pb-2 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground md:gap-4 md:text-[11px] md:tracking-[0.2em]">
          <p className="m-0 flex items-center gap-2">
            <span className="hidden sm:inline">{t("hint")}</span>
            <span className="sm:hidden">{t("hintTouch")}</span>
          </p>
          <p className="m-0 flex shrink-0 items-center gap-2 tabular-nums md:gap-4">
            <span className={isNewBest ? "text-orange-500" : undefined}>
              {t("score")} {pad(score)}
            </span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span>
              {t("best")} {pad(best)}
            </span>
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative -mx-6 cursor-pointer select-none px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground md:-mx-12 md:px-12"
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
              <p className="m-0 border-2 border-foreground bg-background px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-foreground md:text-xs">
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

        {/* Touch controls: a tap anywhere jumps, this is the only move the
            band cannot infer on its own. */}
        <div className="flex items-center justify-between gap-3 pt-2 sm:hidden">
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              setDucking(true);
            }}
            onPointerUp={() => setDucking(false)}
            onPointerLeave={() => setDucking(false)}
            className="flex-1 border-2 border-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground active:bg-foreground active:text-background"
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
            className="flex-1 border-2 border-foreground bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-background"
          >
            {t("jump")}
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {phase === "over" ? t("announce", { score }) : ""}
      </p>
    </section>
  );
}
