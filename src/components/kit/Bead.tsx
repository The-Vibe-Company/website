"use client";

import { useEffect, useId, useRef } from "react";
import { HAIR_PATHS, HAIR_TRANSFORM } from "./veebee-hair";

/*
 * VeeBee's head as a glazed clay bead: black hair with The Vibe Co. mark in
 * white running through it, small brows, big glossy eyes warm at the bottom, a
 * smile. Hair and face are painted on the sphere, so they turn with the head;
 * the light (shading, specular, orange rim) stays where the studio lamp is.
 *
 * The head looks toward the pointer, sways on its own when nobody points
 * (touch screens, idle mouse) and blinks now and then. Its face changes too:
 * it beams when the pointer comes close, and from time to time, on its own,
 * winks, beams or looks surprised. Under prefers-reduced-motion it holds still,
 * facing forward, with its quiet smile.
 */

const CX = 170;
const CY = 165;
const EYES = [
  { x: 79, y: 179 },
  { x: 230, y: 194 },
] as const;
const EYE_RX = 35;
const EYE_RY = 41;
const BROWS = ["M71.2 123.6 Q84 110.4 96.7 121.2", "M216.2 135.5 Q233.6 124.7 251.3 134.7"];
const MOUTH_SMILE = "M123 236 Q130 243 149 244 Q166 243 174 238 Q168 257 149 258 Q130 256 123 236 Z";
const MOUTH_JOY = "M119 233 Q130 242 149 243 Q168 242 179 235 Q172 267 149 268 Q126 266 119 233 Z";
const MAX_YAW = (36 * Math.PI) / 180;
const MAX_PITCH = (15 * Math.PI) / 180;
const IDLE_AFTER_MS = 3500;

type Expression = "smile" | "joy" | "surprise" | "wink";
const MOODS: readonly Expression[] = ["joy", "wink", "surprise"];

export function Bead({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `bead-${name}-${uid}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const browsRef = useRef<SVGGElement>(null);
  const openRefs = useRef<(SVGGElement | null)[]>([]);
  const closedRefs = useRef<(SVGPathElement | null)[]>([]);
  const mouthRefs = useRef<Partial<Record<"smile" | "joy" | "surprise", SVGGElement | null>>>({});

  useEffect(() => {
    const svg = svgRef.current;
    const head = headRef.current;
    const brows = browsRef.current;
    const open = openRefs.current;
    const closed = closedRefs.current;
    const mouths = mouthRefs.current;
    if (!svg || !head || !brows) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = true;
    let last = performance.now();
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let pointedAt = -Infinity;
    let near = false;
    let nextBlink = last + 2500 + Math.random() * 2500;
    let blinkStart = -Infinity;
    let mood: Expression = "smile";
    let moodUntil = 0;
    let nextMood = last + 5000 + Math.random() * 4000;
    let shown: Expression | null = null;
    let eyeScale = 1;

    const setEye = (i: number, isOpen: boolean) => {
      const o = open[i];
      const c = closed[i];
      if (o) o.style.opacity = isOpen ? "1" : "0";
      if (c) c.style.opacity = isOpen ? "0" : "1";
    };

    const show = (expression: Expression) => {
      if (expression === shown) return;
      shown = expression;
      setEye(0, expression !== "joy");
      setEye(1, expression !== "joy" && expression !== "wink");
      const mouth = expression === "joy" ? "joy" : expression === "surprise" ? "surprise" : "smile";
      for (const key of ["smile", "joy", "surprise"] as const) {
        const m = mouths[key];
        if (m) m.style.opacity = key === mouth ? "1" : "0";
      }
      eyeScale = expression === "surprise" ? 1.1 : 1;
      brows.style.transform =
        expression === "surprise" ? "translateY(-8px)" : expression === "joy" ? "translateY(-3px)" : "none";
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = svg.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height * 0.46);
      targetYaw = Math.max(-1, Math.min(1, dx / 460)) * MAX_YAW;
      targetPitch = Math.max(-1, Math.min(1, dy / 380)) * MAX_PITCH;
      near = Math.hypot(dx, dy) < box.width * 0.85;
      pointedAt = performance.now();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (now - pointedAt > IDLE_AFTER_MS) {
        near = false;
        const t = now / 1000;
        targetYaw = Math.sin(t * 0.55) * MAX_YAW * 0.6;
        targetPitch = Math.sin(t * 0.37 + 1.2) * MAX_PITCH * 0.4;
      }
      const ease = 1 - Math.exp(-dt * 7);
      yaw += (targetYaw - yaw) * ease;
      pitch += (targetPitch - pitch) * ease;

      const dx = 118 * Math.sin(yaw);
      const dy = 104 * Math.sin(pitch);
      head.setAttribute(
        "transform",
        `translate(${CX + dx} ${CY + dy}) scale(${Math.cos(yaw)} ${Math.cos(pitch)}) translate(${-CX} ${-CY})`,
      );

      // The face: beaming while the pointer is close, otherwise a short mood
      // now and then, and back to the quiet smile.
      if (!near && now >= nextMood) {
        mood = MOODS[Math.floor(Math.random() * MOODS.length)];
        moodUntil = now + (mood === "wink" ? 750 : 1400);
        nextMood = moodUntil + 5500 + Math.random() * 5500;
      }
      show(near ? "joy" : now < moodUntil ? mood : "smile");

      // Blinks, on the eyes that are open.
      if (now >= nextBlink) {
        blinkStart = now;
        nextBlink = now + (Math.random() < 0.2 ? 260 : 2800 + Math.random() * 3600);
      }
      const b = (now - blinkStart) / 150;
      const lid = b >= 0 && b < 1 ? 1 - Math.sin(b * Math.PI) * 0.92 : 1;
      open.forEach((o, i) => {
        const { x, y } = EYES[i];
        o?.setAttribute("transform", `translate(${x} ${y}) scale(${eyeScale} ${lid * eyeScale}) translate(${-x} ${-y})`);
      });

      if (visible) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(svg);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const fade = { transition: "opacity 140ms ease-out" } as const;

  return (
    <svg ref={svgRef} className={className} viewBox="0 0 340 360" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id("bd")} gradientUnits="userSpaceOnUse" cx="129" cy="101" r="232">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".42" stopColor="#f8f8f6" />
          <stop offset=".8" stopColor="#e2e2de" />
          <stop offset="1" stopColor="#cdcdc8" />
        </radialGradient>
        <radialGradient id={id("socket")} cx=".38" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".7" stopColor="#f1f1ee" />
          <stop offset="1" stopColor="#d6d6d1" />
        </radialGradient>
        <linearGradient id={id("glow")} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".3" stopColor="#ff8a2a" stopOpacity="0" />
          <stop offset=".62" stopColor="#ff8a2a" stopOpacity=".85" />
          <stop offset=".85" stopColor="#ffb56a" />
          <stop offset="1" stopColor="#ffe2b8" />
        </linearGradient>
        <radialGradient id={id("amber")}>
          <stop offset="0" stopColor="#ff9a3c" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("turn")} gradientUnits="userSpaceOnUse" cx="150" cy="140" r="160">
          <stop offset=".55" stopColor="#141416" stopOpacity="0" />
          <stop offset="1" stopColor="#141416" stopOpacity=".2" />
        </radialGradient>
        <radialGradient id={id("spec")}>
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("cs")}>
          <stop offset="0" stopColor="#141416" stopOpacity=".26" />
          <stop offset="1" stopColor="#141416" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a1f" stopOpacity="0" />
          <stop offset=".3" stopColor="#ff7a1f" />
          <stop offset=".62" stopColor="#ffb46e" />
          <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <circle cx={CX} cy={CY} r="145" />
        </clipPath>
        <clipPath id={id("mouth")}>
          <path d={MOUTH_JOY} />
        </clipPath>
        <filter id={id("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="184" cy="326" rx="122" ry="14" fill={`url(#${id("cs")})`} />
      <circle cx={CX} cy={CY} r="145" fill={`url(#${id("bd")})`} />
      <g clipPath={`url(#${id("clip")})`}>
        <g ref={headRef}>
          {/* The hair behind and around the head, outside the sphere as seen
              from the front: it slides into view on the side the head turns
              away from, so the black wraps around instead of ending at the
              edge. */}
          <path fill="#0c0c0d" d="M-220 -60 H560 V40 C440 52 342 120 307.3 205 A143 143 0 1 0 32.7 205 C-2 120 -100 52 -220 40 Z" />
          <g transform={HAIR_TRANSFORM} fill="#0c0c0d">
            {HAIR_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </g>

          <g
            ref={browsRef}
            fill="none"
            stroke="#0c0c0d"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ transition: "transform 220ms cubic-bezier(.2,.8,.2,1)" }}
          >
            {BROWS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          {/* Big glossy eyes in a white rim: near-black, a large pupil, an
              amber glow along the bottom of the iris where the orange light
              catches it, a big highlight up right and two small ones;
              closed, rim and all give way to a black crescent. */}
          {EYES.map(({ x, y }, i) => (
            <g key={x}>
              <g
                ref={(el) => {
                  openRefs.current[i] = el;
                }}
                style={fade}
              >
                <ellipse
                  cx={x}
                  cy={y}
                  rx={EYE_RX + 6}
                  ry={EYE_RY + 6}
                  fill={`url(#${id("socket")})`}
                  stroke="#0c0c0d"
                  strokeOpacity=".14"
                  strokeWidth="1.5"
                />
                <ellipse cx={x} cy={y} rx={EYE_RX} ry={EYE_RY} fill="#0b0705" stroke="#050403" strokeWidth="2" />
                <ellipse
                  cx={x}
                  cy={y + 3}
                  rx={EYE_RX - 6}
                  ry={EYE_RY - 7}
                  fill="none"
                  stroke={`url(#${id("glow")})`}
                  strokeWidth="5"
                />
                <ellipse cx={x} cy={y + EYE_RY * 0.42} rx={EYE_RX * 0.62} ry={EYE_RY * 0.34} fill={`url(#${id("amber")})`} />
                <ellipse cx={x} cy={y - 2} rx={EYE_RX - 12} ry={EYE_RY - 14} fill="#000" />
                <circle cx={x + EYE_RX * 0.42} cy={y - EYE_RY * 0.38} r="7.5" fill="#fff" />
                <circle cx={x - EYE_RX * 0.5} cy={y} r="4.5" fill="#fff" opacity=".9" />
                <circle cx={x + EYE_RX * 0.5} cy={y + EYE_RY * 0.12} r="2.6" fill="#fff" opacity=".8" />
              </g>
              <path
                ref={(el) => {
                  closedRefs.current[i] = el;
                }}
                d={`M${x - 28} ${y + 6} Q${x} ${y - 22} ${x + 28} ${y + 6}`}
                fill="none"
                stroke="#0c0c0d"
                strokeWidth="9"
                strokeLinecap="round"
                style={{ ...fade, opacity: 0 }}
              />
            </g>
          ))}

          <g
            ref={(el) => {
              mouthRefs.current.smile = el;
            }}
            style={fade}
          >
            <path d={MOUTH_SMILE} fill="#1a1a1b" stroke="#1a1a1b" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          <g
            ref={(el) => {
              mouthRefs.current.joy = el;
            }}
            style={{ ...fade, opacity: 0 }}
          >
            <path d={MOUTH_JOY} fill="#1a1a1b" stroke="#1a1a1b" strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="149" cy="261" rx="14" ry="8" fill="#e0603a" clipPath={`url(#${id("mouth")})`} />
          </g>
          <g
            ref={(el) => {
              mouthRefs.current.surprise = el;
            }}
            style={{ ...fade, opacity: 0 }}
          >
            <ellipse cx="149" cy="249" rx="10" ry="12.5" fill="#1a1a1b" />
          </g>
        </g>
      </g>
      <circle cx={CX} cy={CY} r="145" fill={`url(#${id("turn")})`} />
      <g clipPath={`url(#${id("clip")})`}>
        <ellipse cx="116" cy="74" rx="58" ry="26" transform="rotate(-28 116 74)" fill={`url(#${id("spec")})`} opacity=".55" />
        <ellipse cx="108" cy="66" rx="15" ry="7" transform="rotate(-28 108 66)" fill="#fff" opacity=".75" />
      </g>
      <path
        d="M242 40.3 A144 144 0 0 1 98 289.7"
        fill="none"
        stroke={`url(#${id("rim")})`}
        strokeWidth="7"
        opacity=".45"
        filter={`url(#${id("soft")})`}
      />
      <path d="M242 40.3 A144 144 0 0 1 98 289.7" fill="none" stroke={`url(#${id("rim")})`} strokeWidth="2.4" />
    </svg>
  );
}
