"use client";

import React from "react";
import { VibeEngine, WORLDS, type EngineState, type World } from "./runner-engine";

/*
 * VibeRunner V2 — the cinematic playable endless-runner hero, embedded inside the
 * existing warm-paper homepage (TopNav + sections + Footer are provided by the page).
 *
 * Ported from the Claude Design handoff "Vibe Runner V2.dc.html": the DCLogic
 * component maps 1:1 onto React.Component. All rendering lives in the canvas engine
 * (./runner-engine); this component just loads it, mirrors a little state for the
 * React overlay (marketing hero, HUD, world card, dead overlay), and fades the
 * marketing block out on play.
 *
 * Difficulty mirrors the Chrome/Firefox T-Rex runner (dino jump state machine,
 * SPEED 6 -> MAX 13 px/frame, ACCEL 0.001, GRAVITY 0.6). Each run cycles our
 * "worlds" (products, services, the YC backing); every world is its own universe —
 * sky, celestial body, parallax silhouettes, motif — revealed through a warp.
 *
 * INVARIANT — the score/best HUD is written imperatively via wrapRef querySelector
 * each frame; those [data-hud] nodes render once with static defaults and never sit
 * inside a conditional, so React never reconciles over the engine's writes.
 *
 * FONT GOTCHA — ctx.font cannot resolve `var(--font-geist-*)`; the assignment
 * silently no-ops. We resolve the concrete (hashed) next/font family names once at
 * mount and hand them to the engine constructor.
 */

const MONO = "var(--font-geist-mono), monospace";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";

type Phase = "idle" | "running" | "dead";

interface VibeRunnerState {
  phase: Phase;
  sound: boolean;
  world: World | null;
  finalScore: string;
  bestScore: string;
  deadKicker: string;
  deadTitle: string;
  discovered: World[];
}

export class VibeRunner extends React.Component<Record<string, never>, VibeRunnerState> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private wrapRef = React.createRef<HTMLDivElement>();
  private engine: VibeEngine | null = null;

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      phase: "idle",
      sound: false,
      world: null,
      finalScore: "0",
      bestScore: "0",
      deadKicker: "CAUGHT BY THE HYPE",
      deadTitle: "The hype caught up.",
      discovered: [],
    };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    // ctx.font can't resolve CSS var() strings — resolve the real families once.
    let mono = "monospace";
    let sans = "system-ui, sans-serif";
    try {
      const cs = getComputedStyle(document.body);
      mono = cs.getPropertyValue("--font-geist-mono").trim() || mono;
      sans = cs.getPropertyValue("--font-geist-sans").trim() || sans;
    } catch {
      /* keep fallbacks */
    }
    this.engine = new VibeEngine(
      canvas,
      {
        onState: (s: EngineState) => {
          this.setState({
            phase: s.phase,
            world: s.world,
            finalScore: s.finalScore,
            bestScore: s.bestScore,
            deadKicker: s.deadKicker,
            deadTitle: s.deadTitle,
            discovered: s.discovered,
            sound: s.sound,
          });
          this.syncMarketing(s.phase);
        },
        onScore: (score, best) => {
          const w = this.wrapRef.current;
          if (!w) return;
          const sc = w.querySelector('[data-hud="score"]');
          if (sc) sc.textContent = String(score);
          const bs = w.querySelector('[data-hud="best"]');
          if (bs) bs.textContent = String(best);
        },
        onMilestone: () => {
          const w = this.wrapRef.current;
          const sc = w && (w.querySelector('[data-hud="score"]') as HTMLElement | null);
          if (sc && typeof sc.animate === "function") {
            sc.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 240, iterations: 3 });
          }
        },
      },
      { mono, sans }
    );
  }

  componentWillUnmount() {
    if (this.engine) this.engine.destroy();
    this.engine = null;
  }

  // Fade the marketing hero out on play, back in when idle (imperative — the block
  // renders once and is never reconciled by React).
  syncMarketing(phase: Phase) {
    const w = this.wrapRef.current;
    if (!w) return;
    const m = w.querySelector('[data-marketing="1"]') as HTMLElement | null;
    if (!m) return;
    const hidden = phase !== "idle";
    m.style.opacity = hidden ? "0" : "1";
    m.style.transform = hidden ? "translateY(-16px)" : "translateY(0)";
    m.style.pointerEvents = hidden ? "none" : "auto";
  }

  onToggleSound = () => {
    if (this.engine) this.engine.toggleSound();
  };
  onRestart = () => {
    if (this.engine) this.engine.restart();
  };

  render() {
    const { phase, sound, world, finalScore, bestScore, deadKicker, deadTitle, discovered } = this.state;
    const isIdle = phase === "idle";
    const isDead = phase === "dead";
    const isRunning = phase === "running";
    const soundIcon = sound ? "♪" : "⊘";
    const hudColor = world && !isIdle ? world.ink : "var(--foreground)";
    const showCard = !!world && isRunning;
    const visited = discovered;

    return (
      <div
        ref={this.wrapRef}
        style={{ position: "relative", width: "100%", height: "clamp(560px, 88vh, 940px)", minHeight: 560, overflow: "hidden", background: "var(--background)", borderBottom: "2px solid var(--foreground)" }}
      >
        <canvas
          ref={this.canvasRef}
          tabIndex={0}
          role="application"
          aria-label="Playable endless-runner game; press Space or tap to play and travel through The Vibe Company's worlds. All headline copy and links are also available as text on the page."
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", touchAction: "manipulation", cursor: "pointer" }}
        />

        {/* Marketing hero — existing homepage tone; fades out on play (imperative).
            pointer-events stay off the block so canvas taps pass through to start;
            only the CTA opts in. */}
        <div
          data-marketing="1"
          style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 2, padding: "clamp(56px, 10vh, 110px) clamp(20px, 6vw, 80px) 0", pointerEvents: "none", transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div style={{ maxWidth: 780 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid var(--foreground)", padding: "6px 14px", fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--foreground)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", animation: "vc-pulse 2s infinite" }} />
              Open to projects · Built with AI
            </span>
            <h1 style={{ margin: "18px 0 0", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.92, fontSize: "clamp(40px, 7vw, 104px)", color: "var(--foreground)" }}>
              <span style={{ display: "block" }}>AI-native agency.</span>
              <span style={{ display: "block", WebkitTextStroke: "1.5px var(--foreground)", color: "transparent" }}>Everything way faster.</span>
            </h1>
            <p style={{ margin: "20px 0 0", maxWidth: 540, fontSize: "clamp(15px, 1.7vw, 19px)", lineHeight: 1.5, color: "var(--foreground)", opacity: 0.62 }}>
              A small team of AI specialists. We build products, automate ops, and train teams. Our agency itself runs on AI.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginTop: 26 }}>
              <a href="mailto:founders@thevibecompany.co" style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: 12, border: "2px solid var(--foreground)", background: "var(--foreground)", color: "var(--background)", padding: "14px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Book a discovery call <span aria-hidden="true">→</span>
              </a>
              <span style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--foreground)", opacity: 0.55 }}>↑ Space — discover our worlds</span>
            </div>
          </div>
        </div>

        {/* Score / sound HUD — always visible, coloured by the current world */}
        <div style={{ position: "absolute", top: "clamp(56px, 10vh, 110px)", right: "clamp(20px, 6vw, 80px)", zIndex: 3, textAlign: "right", fontFamily: MONO, pointerEvents: "auto", color: hudColor, transition: "color 0.5s" }}>
          <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.55 }}>Shipped</div>
          <div data-hud="score" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>0</div>
          <div style={{ fontSize: 11, letterSpacing: "0.06em", opacity: 0.55, marginTop: 4 }}>Best <span data-hud="best">0</span></div>
          {/* discovery progress — one dot per world, filled once visited */}
          {!isIdle && (
            <div style={{ display: "flex", gap: 5, justifyContent: "flex-end", marginTop: 10 }} aria-label={`${visited.length} of ${WORLDS.length} worlds discovered`}>
              {WORLDS.map((d) => {
                const hit = visited.includes(d);
                return (
                  <span
                    key={d.name}
                    title={hit ? d.name : undefined}
                    style={{ width: 7, height: 7, borderRadius: "50%", background: hit ? d.accent : "transparent", border: hit ? "1px solid transparent" : "1px solid currentColor", opacity: hit ? 1 : 0.35 }}
                  />
                );
              })}
            </div>
          )}
          <button onClick={this.onToggleSound} title="Toggle sound" aria-label="Toggle sound" style={{ marginTop: 12, width: 30, height: 30, borderRadius: 9999, border: "1px solid currentColor", background: "transparent", color: "currentColor", cursor: "pointer", fontSize: 13, opacity: 0.8, fontFamily: "inherit" }}>
            {soundIcon}
          </button>
        </div>

        {/* World card — persistent card revealing this facet of TVC */}
        {showCard && world && (
          <div style={{ position: "absolute", left: "clamp(20px, 6vw, 80px)", top: "clamp(56px, 10vh, 110px)", zIndex: 4, pointerEvents: "none", display: "flex", alignItems: "stretch", gap: 14, maxWidth: 560, animation: "vc-in 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            <span style={{ width: 4, borderRadius: 4, flex: "none", background: world.accent }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: world.accent }} />
                <span style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: world.ink, opacity: 0.7 }}>{world.tag}</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: "clamp(28px, 4.4vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, marginTop: 8, color: world.ink }}>{world.name}</div>
              <div style={{ fontSize: "clamp(14px, 1.6vw, 18px)", lineHeight: 1.45, marginTop: 8, color: world.ink, opacity: 0.7, maxWidth: 420 }}>{world.line}</div>
              <a
                href={world.url}
                target={world.external ? "_blank" : undefined}
                rel={world.external ? "noopener noreferrer" : undefined}
                style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", color: world.accent, textDecoration: "none", borderBottom: `1px solid ${world.accent}`, paddingBottom: 1 }}
              >
                {world.linkLabel ?? `visit ${world.name}`} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}

        {/* Controls hint while playing */}
        {isRunning && (
          <div style={{ position: "absolute", right: "clamp(20px, 6vw, 80px)", bottom: "clamp(20px, 4vh, 40px)", zIndex: 4, pointerEvents: "none", fontFamily: MONO, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: hudColor, opacity: 0.5 }}>
            {"Space / tap — jump   ·   ↓ / hold-low — duck"}
          </div>
        )}

        {/* Idle prompt */}
        {isIdle && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(20px, 5vh, 52px)", zIndex: 4, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(10,10,10,0.6)", animation: "vc-bob 1.7s ease-in-out infinite" }}>{"↑  Space — discover our worlds  ↑"}</div>
          </div>
        )}

        {/* Dead overlay */}
        {isDead && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 28, background: "rgba(5,5,5,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", color: "#fafaf7", animation: "vc-in 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.55, marginBottom: 14 }}>
              {"// "}
              {deadKicker}
            </div>
            <h2 style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.95, fontSize: "clamp(36px, 6.5vw, 76px)" }}>{deadTitle}</h2>
            <div style={{ display: "flex", gap: 32, margin: "24px 0 26px", fontFamily: MONO }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{finalScore}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: 4 }}>Shipped</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{bestScore}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: 4 }}>Best</div>
              </div>
            </div>
            {visited.length > 0 && (
              <div style={{ marginBottom: 24, maxWidth: 580 }}>
                <div style={{ fontFamily: MONO, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.55, marginBottom: 12 }}>Worlds you discovered</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {visited.map((dm) => (
                    <a
                      key={dm.name}
                      href={dm.url}
                      target={dm.external ? "_blank" : undefined}
                      rel={dm.external ? "noopener noreferrer" : undefined}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid rgba(250,250,247,0.22)", borderRadius: 8, color: "#fafaf7", textDecoration: "none", fontSize: 13 }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dm.accent }} />
                      <span style={{ fontWeight: 600 }}>{dm.name}</span>
                      <span aria-hidden="true" style={{ color: dm.accent }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <button onClick={this.onRestart} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", border: 0, background: "#fafaf7", color: "#0a0a0a", fontFamily: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Ship again <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#0a0a0a", color: "#fafaf7", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>↻</span>
              </button>
              <a href="mailto:founders@thevibecompany.co" style={{ display: "inline-flex", alignItems: "center", padding: "14px 24px", border: "1px solid rgba(250,250,247,0.3)", color: "#fafaf7", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Book a call →
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}
