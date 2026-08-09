"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { captureEvent } from "@/lib/posthog";
import styles from "./VibeWorlds.module.css";

const WORLDS = ["build", "operate", "advise"] as const;
type World = (typeof WORLDS)[number];

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const WORLD_ASSETS: Record<World, { src: string; altKey: string; className: string; sizes: string }[]> = {
  build: [
    { src: "/images/clients/monka/monka-mobile.png", altKey: "buildMobile", className: styles.mobileSheet, sizes: "(max-width: 767px) 22vw, 12vw" },
    { src: "/images/clients/monka/lifeline.png", altKey: "buildDesktop", className: styles.desktopSheet, sizes: "(max-width: 767px) 58vw, 32vw" },
  ],
  operate: [
    { src: "/projects/compagnon-home.png", altKey: "operateCompanion", className: styles.operateMain, sizes: "(max-width: 767px) 68vw, 38vw" },
    { src: "/projects/vanish-home.png", altKey: "operateVanish", className: styles.operateSide, sizes: "(max-width: 767px) 36vw, 20vw" },
  ],
  advise: [
    { src: "/projects/vibedrift-home.png", altKey: "adviseVibeDrift", className: styles.adviseMain, sizes: "(max-width: 767px) 68vw, 38vw" },
    { src: "/projects/vibedeck-home.png", altKey: "adviseVibeDeck", className: styles.adviseSide, sizes: "(max-width: 767px) 36vw, 20vw" },
  ],
};

export function VibeWorlds() {
  const t = useTranslations("vibeWorlds");
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => true
  );
  const storyRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeWorld = WORLDS[activeIndex];

  useEffect(() => {
    const steps = stepRefs.current.filter((step): step is HTMLDivElement => Boolean(step));
    if (steps.length !== WORLDS.length) return;
    let frame = 0;
    const updateFromScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        steps.forEach((step, index) => {
          const bounds = step.getBoundingClientRect();
          const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        setActiveIndex(nearestIndex);
      });
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, []);

  const goToWorld = useCallback((index: number, source: "button" | "keyboard") => {
    const nextIndex = Math.max(0, Math.min(WORLDS.length - 1, index));
    setActiveIndex(nextIndex);
    captureEvent("home_world_selected", { world: WORLDS[nextIndex], source });
    const target = stepRefs.current[nextIndex];
    if (target) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY + 1,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    goToWorld(activeIndex + (event.key === "ArrowRight" ? 1 : -1), "keyboard");
  };

  return (
    <section
      ref={storyRef}
      id="vibe-worlds"
      className={styles.story}
      aria-label={t("regionLabel")}
      aria-describedby={reduceMotion ? undefined : "vibe-worlds-instruction"}
      tabIndex={reduceMotion ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stage}>
        <div className={styles.topRule} aria-hidden="true">
          <span>{t("edition")}</span>
          <span>{String(activeIndex + 1).padStart(2, "0")} / 03</span>
        </div>

        <div className={styles.stageGrid}>
          <div className={styles.intro}>
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
          </div>

          <div className={styles.visualWorkshop} data-world={activeWorld} aria-hidden="true">
            <div className={styles.cameraGrid} />
            <div className={styles.axisLabel}>{t(`worlds.${activeWorld}.axis`)}</div>
            {WORLDS.map((world, index) => (
              <div
                key={world}
                className={`${styles.worldScene} ${index === activeIndex ? styles.worldSceneActive : ""}`}
                style={{ "--scene-index": index } as CSSProperties}
              >
                {world === activeWorld && WORLD_ASSETS[world].map((asset) => (
                  <div key={asset.src} className={`${styles.workObject} ${asset.className}`}>
                    <Image
                      src={asset.src}
                      alt=""
                      fill
                      priority={world === "build"}
                      sizes={asset.sizes}
                      className={styles.objectImage}
                    />
                    <span>{t(`assets.${asset.altKey}`)}</span>
                  </div>
                ))}
                <div className={styles.sceneStamp}>{t(`worlds.${world}.stamp`)}</div>
              </div>
            ))}
            <div className={styles.crosshair}><span /><span /></div>
          </div>

          <div className={styles.copyDeck}>
            {WORLDS.map((world, index) => (
              <article
                key={world}
                id={`world-panel-${world}`}
                className={`${styles.worldCopy} ${index === activeIndex ? styles.worldCopyActive : ""}`}
                aria-hidden={!reduceMotion && index !== activeIndex ? true : undefined}
              >
                <div className={styles.worldNumber}>0{index + 1}</div>
                <div>
                  <p className={styles.worldLabel}>{t(`worlds.${world}.label`)}</p>
                  <h2>{t(`worlds.${world}.title`)}</h2>
                  <p>{t(`worlds.${world}.description`)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.chapterRail} aria-label={t("chapterNavigation") }>
          <p id="vibe-worlds-instruction" className={styles.instruction}>{t("instruction")}</p>
          <div className={styles.chapterButtons} role="group">
            {WORLDS.map((world, index) => (
              <button
                key={world}
                type="button"
                aria-current={index === activeIndex ? "step" : undefined}
                aria-controls={`world-panel-${world}`}
                onClick={() => goToWorld(index, "button")}
                className={index === activeIndex ? styles.chapterActive : ""}
              >
                <span>0{index + 1}</span>
                {t(`worlds.${world}.label`)}
              </button>
            ))}
          </div>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ transform: `scaleX(${(activeIndex + 1) / WORLDS.length})` }} />
          </div>
        </div>

        <p className="sr-only" aria-live={reduceMotion ? "off" : "polite"} aria-atomic="true">
          {t("activeAnnouncement", {
            current: activeIndex + 1,
            total: WORLDS.length,
            world: t(`worlds.${activeWorld}.label`),
          })}
        </p>
      </div>

      <div className={styles.scrollTrack} aria-hidden="true">
        {WORLDS.map((world, index) => (
          <div
            key={world}
            ref={(element) => { stepRefs.current[index] = element; }}
            data-world-index={index}
            className={styles.scrollStep}
          />
        ))}
      </div>
    </section>
  );
}
