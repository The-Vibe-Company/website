"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { captureEvent } from "@/lib/posthog";
import { VibeGame } from "./VibeGame";
import type { VibeGamePhase, VibeGameWorld } from "./vibe-game-engine";
import styles from "./VibeWorlds.module.css";

const WORLDS = ["build", "operate", "advise"] as const;

export function VibeWorlds() {
  const t = useTranslations("vibeWorlds");
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<VibeGamePhase>("idle");
  const activeWorld = WORLDS[activeIndex];

  const handleWorldChange = useCallback((_world: VibeGameWorld, index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePhaseChange = useCallback((nextPhase: VibeGamePhase) => {
    setPhase(nextPhase);
  }, []);

  const selectWorld = (index: number) => {
    if (phase !== "idle") return;
    setActiveIndex(index);
    captureEvent("home_world_selected", {
      world: WORLDS[index],
      source: "chapter_button",
    });
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
              <span aria-hidden="true">↑</span> {t("game.invitation")}
            </p>
          </header>

          <div className={styles.gameFrame}>
            <VibeGame
              onWorldChange={handleWorldChange}
              onPhaseChange={handlePhaseChange}
              requestedWorld={activeIndex}
            />
          </div>
        </div>

        <div className={styles.chapterSection}>
          <div className={styles.chapterHeading}>
            <p>{t("chapterNavigation")}</p>
            <span>{phase === "idle" ? t("instruction") : t("game.controls")}</span>
          </div>
          <ol className={styles.worldList}>
            {WORLDS.map((world, index) => (
              <li key={world} id={`world-${world}`}>
                <button
                  type="button"
                  onClick={() => selectWorld(index)}
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
            total: WORLDS.length,
            world: t(`worlds.${activeWorld}.label`),
          })}
        </p>
      </div>
    </section>
  );
}
