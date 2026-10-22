"use client";

import { useEffect, useId, useRef } from "react";

/*
 * VeeBee's head as a glazed clay bead. The Vibe Co. mark is its cap, and the
 * cap and the face are painted on the sphere, so they turn with the head; the
 * light (shading, specular, orange rim) stays where the studio lamp is.
 *
 * The head looks toward the pointer, sways on its own when nobody points
 * (touch screens, idle mouse) and blinks now and then. Its face changes too:
 * it beams when the pointer comes close, and from time to time, on its own,
 * winks, beams or looks surprised. Under prefers-reduced-motion it holds still,
 * facing forward, with its quiet smile.
 */

const CX = 170;
const CY = 165;
const EYE_Y = 214;
const EYES = [104, 236] as const;
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
      brows.style.transform = expression === "surprise" ? "translateY(-9px)" : "none";
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
      for (const o of open) {
        o?.setAttribute("transform", `translate(0 ${EYE_Y}) scale(1 ${lid}) translate(0 ${-EYE_Y})`);
      }

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
          <stop offset=".35" stopColor="#ff8a2a" stopOpacity="0" />
          <stop offset=".8" stopColor="#ff8a2a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffc07a" />
        </linearGradient>
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
          <path d="M142 256 Q170 298 198 256 Q170 267 142 256 Z" />
        </clipPath>
        <filter id={id("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="184" cy="326" rx="122" ry="14" fill={`url(#${id("cs")})`} />
      <circle cx={CX} cy={CY} r="145" fill={`url(#${id("bd")})`} />
      <g clipPath={`url(#${id("clip")})`}>
        <g ref={headRef}>
          {/* The Vibe Co. mark worn as the cap: a black crown, the V coming
              down to a point on the forehead, and on each side three thick
              rounded strokes nested in arcs, the lowest ending just above
              the eye like a brow. */}
          <path fill="#0c0c0d" d="M-260 -20 H600 V30 C420 30 300 26 170 22 C40 26 -80 30 -260 30 Z" />
          <path fill="#0c0c0d" d="M138 16 C150 66 160 110 170 152 C180 110 190 66 202 16 Z" />
          <g fill="none" stroke="#0c0c0d" strokeWidth="26" strokeLinecap="round">
            <path d="M132 26 C84 34 46 70 30 128" />
            <path d="M141 60 C98 66 66 98 54 148" />
            <path d="M208 26 C256 34 294 70 310 128" />
            <path d="M199 60 C242 66 274 98 286 148" />
            <g ref={browsRef} style={{ transition: "transform 220ms cubic-bezier(.2,.8,.2,1)" }}>
              <path d="M145 96 C113 100 91 122 81 156" />
              <path d="M195 96 C227 100 249 122 259 156" />
            </g>
          </g>

          {/* Big glossy black eyes set in a white rim, warm at the bottom
              where the orange light catches them; closed, a black crescent. */}
          {EYES.map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={EYE_Y} r="41" fill={`url(#${id("socket")})`} stroke="#0c0c0d" strokeOpacity=".1" strokeWidth="1.5" />
              <g
                ref={(el) => {
                  openRefs.current[i] = el;
                }}
                style={fade}
              >
                <circle cx={x} cy={EYE_Y} r="35" fill="#060607" />
                <circle cx={x} cy={EYE_Y + 2} r="28" fill="none" stroke={`url(#${id("glow")})`} strokeWidth="6" />
                <circle cx={x} cy={EYE_Y - 3} r="21" fill="#020203" />
                <ellipse cx={x + 12} cy={EYE_Y - 14} rx="10" ry="11.5" fill="#fff" />
                <circle cx={x - 14} cy={EYE_Y + 11} r="4" fill="#fff" opacity=".85" />
              </g>
              <path
                ref={(el) => {
                  closedRefs.current[i] = el;
                }}
                d={`M${x - 27} ${EYE_Y + 6} Q${x} ${EYE_Y - 22} ${x + 27} ${EYE_Y + 6}`}
                fill="none"
                stroke="#0c0c0d"
                strokeWidth="10"
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
            <path d="M148 262 Q170 282 192 262 Q170 271 148 262 Z" fill="#1a1a1b" stroke="#1a1a1b" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          <g
            ref={(el) => {
              mouthRefs.current.joy = el;
            }}
            style={{ ...fade, opacity: 0 }}
          >
            <path d="M142 256 Q170 298 198 256 Q170 267 142 256 Z" fill="#1a1a1b" stroke="#1a1a1b" strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="170" cy="283" rx="13" ry="7" fill="#e0603a" clipPath={`url(#${id("mouth")})`} />
          </g>
          <g
            ref={(el) => {
              mouthRefs.current.surprise = el;
            }}
            style={{ ...fade, opacity: 0 }}
          >
            <ellipse cx="170" cy="268" rx="9.5" ry="12" fill="#1a1a1b" />
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
