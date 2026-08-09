export const VIBE_GAME_WORLDS = ["build", "operate", "advise"] as const;

export type VibeGameWorld = (typeof VIBE_GAME_WORLDS)[number];
export type VibeGamePhase = "idle" | "running" | "dead";

export interface VibeGameSnapshot {
  phase: VibeGamePhase;
  world: VibeGameWorld;
  worldIndex: number;
  score: number;
  best: number;
  progress: number;
  visited: VibeGameWorld[];
}

export function createInitialGameSnapshot(best = 0): VibeGameSnapshot {
  return {
    phase: "idle",
    world: "build",
    worldIndex: 0,
    score: 0,
    best,
    progress: 0,
    visited: [],
  };
}

export function clampWorldIndex(index: number) {
  return Math.max(0, Math.min(VIBE_GAME_WORLDS.length - 1, index));
}

export function worldIndexForDistance(distance: number, worldSpan: number) {
  return Math.floor(Math.max(0, distance) / worldSpan) % VIBE_GAME_WORLDS.length;
}

interface CollisionBounds {
  obstacleX: number;
  playerX: number;
  playerY: number;
  ducking: boolean;
  obstacleKind: "ground" | "overhead";
  phase: VibeGamePhase;
  visitedCount: number;
}

export function hasRunnerCollision({
  obstacleX,
  playerX,
  playerY,
  ducking,
  obstacleKind,
  phase,
  visitedCount,
}: CollisionBounds) {
  if (
    phase !== "running" ||
    visitedCount < VIBE_GAME_WORLDS.length ||
    Math.abs(obstacleX - playerX) > 0.72
  ) return false;

  const playerBottom = 0.16 + playerY;
  const playerTop = playerY + (ducking ? 0.88 : 1.82);
  const obstacleBottom = obstacleKind === "ground" ? 0 : 1.03;
  const obstacleTop = obstacleKind === "ground" ? 1.28 : 1.72;
  return playerTop > obstacleBottom + 0.05 && playerBottom < obstacleTop - 0.04;
}

interface GameKeyContext {
  code: string;
  focusInsideGame: boolean;
  gameFocused: boolean;
  phase: VibeGamePhase;
}

export function shouldHandleGameKey({ code, focusInsideGame, gameFocused, phase }: GameKeyContext) {
  if (code === "Escape") return phase !== "idle" && focusInsideGame;
  if (code === "ArrowDown") return phase === "running" && gameFocused;
  if (code === "Space" || code === "ArrowUp") return gameFocused;
  return false;
}
