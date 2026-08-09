"use client";

import { Link } from "@/i18n/navigation";
import { captureEvent } from "@/lib/posthog";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  VibeGameEngine,
  VibeGamePhase,
  VibeGameWorld,
} from "./vibe-game-engine";
import { createInitialGameSnapshot } from "./vibe-game-state";
import styles from "./VibeWorlds.module.css";

type RendererStatus = "checking" | "ready" | "unavailable" | "reduced";

const INITIAL_SNAPSHOT = createInitialGameSnapshot();

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface VibeGameProps {
  onWorldChange: (world: VibeGameWorld, index: number) => void;
  onPhaseChange: (phase: VibeGamePhase) => void;
  requestedWorld: number;
}

export function VibeGame({ onWorldChange, onPhaseChange, requestedWorld }: VibeGameProps) {
  const t = useTranslations("vibeWorlds");
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => false
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VibeGameEngine | null>(null);
  const requestedWorldRef = useRef(requestedWorld);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressMeterRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const duckTimeoutRef = useRef<number | null>(null);
  const duckPressHandledRef = useRef(false);
  const [rendererStatus, setRendererStatus] = useState<RendererStatus>("checking");
  const [snapshot, setSnapshot] = useState(INITIAL_SNAPSHOT);
  requestedWorldRef.current = requestedWorld;

  useEffect(() => {
    const resetToStaticJourney = () => {
      setSnapshot((current) => createInitialGameSnapshot(current.best));
      onPhaseChange("idle");
    };

    if (reduceMotion) {
      setRendererStatus("reduced");
      resetToStaticJourney();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let engine: VibeGameEngine | null = null;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      engine?.destroy();
      engine = null;
      engineRef.current = null;
      setRendererStatus("unavailable");
      resetToStaticJourney();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    import("./vibe-game-engine")
      .then(({ VibeGameEngine: Engine }) => {
        if (cancelled) return;
        try {
          engine = new Engine(canvas, {
            onState: (nextSnapshot) => {
              setSnapshot(nextSnapshot);
              onPhaseChange(nextSnapshot.phase);
            },
            onScore: (score, best, progress) => {
              if (scoreRef.current) scoreRef.current.textContent = String(score).padStart(4, "0");
              if (bestRef.current) bestRef.current.textContent = String(best).padStart(4, "0");
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${Math.max(0.015, progress)})`;
              }
              progressMeterRef.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
            },
            onWorld: (world, index, phase) => {
              onWorldChange(world, index);
              if (phase === "running") {
                captureEvent("home_game_world_entered", { world, world_index: index });
              }
            },
          });
          engineRef.current = engine;
          engine.previewWorld(requestedWorldRef.current);
          setRendererStatus("ready");
        } catch {
          engine?.destroy();
          engine = null;
          engineRef.current = null;
          setRendererStatus("unavailable");
          resetToStaticJourney();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRendererStatus("unavailable");
          resetToStaticJourney();
        }
      });

    return () => {
      cancelled = true;
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      engine?.destroy();
      engineRef.current = null;
    };
  }, [onPhaseChange, onWorldChange, reduceMotion]);

  useEffect(() => {
    engineRef.current?.previewWorld(requestedWorld);
  }, [requestedWorld]);

  useEffect(() => {
    if (snapshot.phase === "dead") restartButtonRef.current?.focus({ preventScroll: true });
  }, [snapshot.phase]);

  useEffect(() => () => {
    if (duckTimeoutRef.current !== null) window.clearTimeout(duckTimeoutRef.current);
  }, []);

  const startOrJump = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const isStart = snapshot.phase !== "running";
    engine.startOrJump();
    canvasRef.current?.focus({ preventScroll: true });
    captureEvent(isStart ? "home_game_started" : "home_game_jumped", {
      input: "button",
      world: snapshot.world,
    });
  }, [snapshot.phase, snapshot.world]);

  const restart = useCallback(() => {
    engineRef.current?.restart();
    canvasRef.current?.focus({ preventScroll: true });
    captureEvent("home_game_restarted", { score: snapshot.score });
  }, [snapshot.score]);

  const setDuck = useCallback((active: boolean) => {
    if (!active && duckTimeoutRef.current !== null) {
      window.clearTimeout(duckTimeoutRef.current);
      duckTimeoutRef.current = null;
    }
    engineRef.current?.setDuck(active);
  }, []);

  const pulseDuck = useCallback(() => {
    if (snapshot.phase !== "running") return;
    if (duckTimeoutRef.current !== null) window.clearTimeout(duckTimeoutRef.current);
    engineRef.current?.setDuck(true);
    duckTimeoutRef.current = window.setTimeout(() => {
      engineRef.current?.setDuck(false);
      duckTimeoutRef.current = null;
    }, 460);
  }, [snapshot.phase]);

  const handleDuckClick = useCallback(() => {
    if (duckPressHandledRef.current) {
      duckPressHandledRef.current = false;
      return;
    }
    pulseDuck();
  }, [pulseDuck]);

  const rendererReady = rendererStatus === "ready";
  const worldLabel = t(`worlds.${snapshot.world}.label`);
  const phaseLabel = t(`game.phases.${snapshot.phase}`);

  return (
    <div
      className={styles.game}
      data-vibe-game="true"
      data-game-phase={snapshot.phase}
      data-world={snapshot.world}
      data-renderer={rendererReady ? "three-webgl" : rendererStatus}
    >
      <canvas
        id="vibe-game-canvas"
        ref={canvasRef}
        className={styles.canvas}
        aria-label={t("game.canvasLabel")}
        role="application"
        tabIndex={rendererReady && snapshot.phase !== "dead" ? 0 : -1}
      />

      <div
        className={`${styles.staticScene} ${rendererReady ? styles.staticSceneHidden : ""}`}
        data-world={requestedWorld === 0 ? "build" : requestedWorld === 1 ? "operate" : "advise"}
        aria-hidden="true"
      >
        <div className={styles.staticGround} />
        <div className={styles.staticFrameA} />
        <div className={styles.staticFrameB} />
        <div className={styles.staticPlayer}><span /></div>
      </div>

      {rendererReady && (
        <div className={styles.sceneReadout}>
          <span>{t("game.liveRenderer")}</span>
          <span>{phaseLabel}</span>
        </div>
      )}

      {rendererReady && (
        <div className={styles.hud} role="group" aria-label={t("game.hudLabel") }>
          <div className={styles.hudWorld}>
            <span>{t("game.world")}</span>
            <strong>{worldLabel}</strong>
          </div>
          <div className={styles.hudScore}>
            <span>{t("game.score")}</span>
            <strong ref={scoreRef}>{String(snapshot.score).padStart(4, "0")}</strong>
          </div>
          <div className={styles.hudBest}>
            <span>{t("game.best")}</span>
            <strong ref={bestRef}>{String(snapshot.best).padStart(4, "0")}</strong>
          </div>
          <div
            ref={progressMeterRef}
            className={styles.worldProgress}
            role="progressbar"
            aria-label={t("game.progressLabel", { world: worldLabel })}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(snapshot.progress * 100)}
          >
            <span ref={progressRef} style={{ transform: `scaleX(${Math.max(0.015, snapshot.progress)})` }} />
          </div>
        </div>
      )}

      {rendererReady && snapshot.phase !== "dead" && (
        <div className={styles.gameControls} role="group" aria-label={t("game.controlsLabel") }>
          <button
            type="button"
            className={styles.jumpControl}
            onClick={startOrJump}
            aria-label={snapshot.phase === "idle" ? t("game.playLabel") : t("game.jumpLabel")}
          >
            <span>{snapshot.phase === "idle" ? t("game.play") : t("game.jump")}</span>
            <kbd>{snapshot.phase === "idle" ? "SPACE" : "↑"}</kbd>
          </button>
          <button
            type="button"
            className={styles.duckControl}
            disabled={snapshot.phase !== "running"}
            onPointerDown={() => {
              duckPressHandledRef.current = true;
              setDuck(true);
            }}
            onPointerUp={() => setDuck(false)}
            onPointerCancel={() => {
              duckPressHandledRef.current = false;
              setDuck(false);
            }}
            onPointerLeave={() => {
              duckPressHandledRef.current = false;
              setDuck(false);
            }}
            onKeyDown={(event) => {
              if ((event.code === "Space" || event.code === "Enter") && !event.repeat) {
                event.preventDefault();
                duckPressHandledRef.current = true;
                setDuck(true);
              }
            }}
            onKeyUp={(event) => {
              if (event.code === "Space" || event.code === "Enter") {
                event.preventDefault();
                setDuck(false);
              }
            }}
            onBlur={() => {
              duckPressHandledRef.current = false;
              setDuck(false);
            }}
            onClick={handleDuckClick}
            aria-label={t("game.duckLabel")}
          >
            <span>{t("game.duck")}</span>
            <kbd>↓</kbd>
          </button>
        </div>
      )}

      {(rendererStatus === "unavailable" || rendererStatus === "reduced") && (
        <div className={styles.fallbackNotice} role="status">
          <span>{rendererStatus === "reduced" ? t("game.reducedTitle") : t("game.unavailableTitle")}</span>
          <p>{rendererStatus === "reduced" ? t("game.reducedDescription") : t("game.unavailableDescription")}</p>
        </div>
      )}

      {snapshot.phase === "dead" && (
        <div className={styles.deathOverlay} role="dialog" aria-modal="false" aria-labelledby="game-over-title">
          <p className={styles.deathKicker}>{t("game.deathKicker")}</p>
          <h2 id="game-over-title">{t("game.deathTitle")}</h2>
          <div className={styles.deathStats}>
            <div><strong>{snapshot.score}</strong><span>{t("game.score")}</span></div>
            <div><strong>{snapshot.best}</strong><span>{t("game.best")}</span></div>
            <div><strong>{snapshot.visited.length}/3</strong><span>{t("game.worldsVisited")}</span></div>
          </div>
          <div className={styles.discoveredWorlds}>
            <p>{t("game.discoveredTitle")}</p>
            <div>
              {snapshot.visited.map((world) => (
                <a key={world} href={`#world-${world}`}>{t(`worlds.${world}.label`)}</a>
              ))}
            </div>
          </div>
          <div className={styles.deathActions}>
            <button ref={restartButtonRef} type="button" onClick={restart}>{t("game.restart")} <span aria-hidden="true">↻</span></button>
            <a href="https://cal.com/stangirard/30min" onClick={() => captureEvent("discovery_call_clicked", { location: "game_over" })}>
              {t("bookCall")} <span aria-hidden="true">↗</span>
            </a>
            <Link href="/portfolio">{t("seeWork")} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {t("game.liveAnnouncement", {
          phase: phaseLabel,
          world: worldLabel,
        })}
      </p>
    </div>
  );
}
