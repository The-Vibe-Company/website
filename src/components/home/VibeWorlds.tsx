"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { captureEvent } from "@/lib/posthog";
import { VibeGame } from "./VibeGame";
import type { VibeGamePhase, VibeGameWorld } from "./vibe-game-engine";
import { VIBE_GAME_WORLDS } from "./vibe-game-state";
import styles from "./VibeWorlds.module.css";

export function VibeWorlds() {
  const t = useTranslations("vibeWorlds");
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<VibeGamePhase>("idle");
  const [playable, setPlayable] = useState(false);
  const activeWorld = VIBE_GAME_WORLDS[activeIndex];

  const handleWorldChange = useCallback((_world: VibeGameWorld, index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePhaseChange = useCallback((nextPhase: VibeGamePhase) => {
    setPhase(nextPhase);
  }, []);

  const handlePlayableChange = useCallback((nextPlayable: boolean) => {
    setPlayable(nextPlayable);
  }, []);

  const selectWorld = (index: number) => {
    if (phase !== "idle") return;
    setActiveIndex(index);
    captureEvent("home_world_selected", {
      world: VIBE_GAME_WORLDS[index],
      source: "chapter_button",
    });
  };

  const handleChapterKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + VIBE_GAME_WORLDS.length) % VIBE_GAME_WORLDS.length;
    else if (event.key === "ArrowRight") nextIndex = (index + 1) % VIBE_GAME_WORLDS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = VIBE_GAME_WORLDS.length - 1;
    if (nextIndex === null || phase !== "idle") return;
    event.preventDefault();
    selectWorld(nextIndex);
    document.getElementById(`world-button-${VIBE_GAME_WORLDS[nextIndex]}`)?.focus();
  };

  return (
    <section id="vibe-worlds" className={styles.story} aria-label={t("regionLabel") }>
      <div className={styles.stage}>
        <div className={styles.topRule} aria-hidden="true">
          <span>{t("edition")}</span>
          <span>THREE.JS / WEBGL</span>
        </div>

        <div className={styles.heroGrid}>
          <header className={styles.intro}>
            <p className={styles.kicker}>{t("kicker")}</p>
            <h1>{t("title")}</h1>
            <p className={styles.promise}>{t("promise")}</p>
            <div className={styles.actions}>
              <a
                href="https://cal.com/stangirard/30min"
                onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
                className={styles.primaryAction}
              >
                {t("bookCall")} <span aria-hidden="true">↗</span>
              </a>
              <a
                href="#client-proof"
                onClick={() => captureEvent("see_what_we_do_clicked", { location: "vibe_worlds_hero" })}
                className={styles.secondaryAction}
              >
                {t("seeWork")} <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={styles.gameInvitation}>
              <span aria-hidden="true">↑</span>{" "}
              {t(playable ? "game.invitation" : "game.staticInvitation")}
            </p>
          </header>

          <div className={styles.gameFrame}>
            <VibeGame
              onWorldChange={handleWorldChange}
              onPhaseChange={handlePhaseChange}
              onPlayableChange={handlePlayableChange}
              requestedWorld={activeIndex}
            />
          </div>
        </div>

        <div className={styles.chapterSection}>
          <div className={styles.chapterHeading}>
            <p>{t("chapterNavigation")}</p>
            <span>
              {phase === "idle"
                ? t(playable ? "instruction" : "staticInstruction")
                : t("game.controls")}
            </span>
          </div>
          <ol className={styles.worldList}>
            {VIBE_GAME_WORLDS.map((world, index) => (
              <li key={world} id={`world-${world}`}>
                <button
                  type="button"
                  id={`world-button-${world}`}
                  onClick={() => selectWorld(index)}
                  onKeyDown={(event) => handleChapterKeyDown(event, index)}
                  aria-current={index === activeIndex ? "step" : undefined}
                  aria-controls="vibe-game-canvas"
                  disabled={phase !== "idle"}
                  className={index === activeIndex ? styles.worldActive : ""}
                >
                  <span className={styles.worldNumber}>0{index + 1}</span>
                  <span className={styles.worldCopy}>
                    <span className={styles.worldLabel}>{t(`worlds.${world}.label`)}</span>
                    <strong>{t(`worlds.${world}.title`)}</strong>
                    <span>{t(`worlds.${world}.description`)}</span>
                  </span>
                  <span className={styles.worldStamp} aria-hidden="true">{t(`worlds.${world}.stamp`)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {t("activeAnnouncement", {
            current: activeIndex + 1,
            total: VIBE_GAME_WORLDS.length,
            world: t(`worlds.${activeWorld}.label`),
          })}
        </p>
      </div>
    </section>
  );
}
