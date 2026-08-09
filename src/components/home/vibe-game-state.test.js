import { describe, expect, test } from "bun:test";
import {
  clampWorldIndex,
  createInitialGameSnapshot,
  hasRunnerCollision,
  shouldHandleGameKey,
  worldIndexForDistance,
} from "./vibe-game-state";

describe("Vibe Worlds deterministic state", () => {
  test("creates a fresh idle fallback snapshot without stale run state", () => {
    expect(createInitialGameSnapshot(42)).toEqual({
      phase: "idle",
      world: "build",
      worldIndex: 0,
      score: 0,
      best: 42,
      progress: 0,
      visited: [],
    });
  });

  test("clamps chapter previews and advances worlds at stable spans", () => {
    expect(clampWorldIndex(-1)).toBe(0);
    expect(clampWorldIndex(9)).toBe(2);
    expect(worldIndexForDistance(0, 42)).toBe(0);
    expect(worldIndexForDistance(42, 42)).toBe(1);
    expect(worldIndexForDistance(84, 42)).toBe(2);
    expect(worldIndexForDistance(126, 42)).toBe(0);
  });

  test("only captures gameplay keys after the canvas has focus", () => {
    expect(shouldHandleGameKey({ code: "Space", phase: "idle", gameFocused: false, focusInsideGame: false })).toBe(false);
    expect(shouldHandleGameKey({ code: "Space", phase: "idle", gameFocused: true, focusInsideGame: true })).toBe(true);
    expect(shouldHandleGameKey({ code: "ArrowDown", phase: "running", gameFocused: true, focusInsideGame: true })).toBe(true);
    expect(shouldHandleGameKey({ code: "Escape", phase: "running", gameFocused: false, focusInsideGame: true })).toBe(true);
    expect(shouldHandleGameKey({ code: "Escape", phase: "running", gameFocused: false, focusInsideGame: false })).toBe(false);
  });

  test("keeps the first three worlds discoverable, then applies jump and duck collision bounds", () => {
    const base = {
      obstacleX: -3.75,
      playerX: -3.75,
      playerY: 0,
      ducking: false,
      obstacleKind: "ground",
      phase: "running",
    };
    expect(hasRunnerCollision({ ...base, visitedCount: 2 })).toBe(false);
    expect(hasRunnerCollision({ ...base, visitedCount: 3 })).toBe(true);
    expect(hasRunnerCollision({ ...base, playerY: 1.5, visitedCount: 3 })).toBe(false);
    expect(hasRunnerCollision({ ...base, obstacleKind: "overhead", ducking: true, visitedCount: 3 })).toBe(false);
    expect(hasRunnerCollision({ ...base, obstacleKind: "overhead", visitedCount: 3 })).toBe(true);
  });
});
