"use client";

import { useEffect, useId, useRef } from "react";

/*
 * VeeBee's head as a glazed clay bead. The cap and the face are painted on the
 * sphere and turn with the head; the light (shading, specular, orange rim)
 * stays where the studio lamp is. The head looks toward the pointer, sways on
 * its own when nobody points (touch screens, idle mouse), blinks now and then,
 * and holds still, facing forward, under prefers-reduced-motion.
 */

const CX = 170;
const CY = 165;
const MAX_YAW = (36 * Math.PI) / 180;
const MAX_PITCH = (15 * Math.PI) / 180;
const IDLE_AFTER_MS = 3500;

export function Bead({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `bead-${name}-${uid}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const head = headRef.current;
    const eyes = eyesRef.current;
    if (!svg || !head || !eyes) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = true;
    let last = performance.now();
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let pointedAt = -Infinity;
    let nextBlink = last + 2500 + Math.random() * 2500;
    let blinkStart = -Infinity;

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = svg.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height * 0.46);
      targetYaw = Math.max(-1, Math.min(1, dx / 460)) * MAX_YAW;
      targetPitch = Math.max(-1, Math.min(1, dy / 380)) * MAX_PITCH;
      pointedAt = performance.now();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (now - pointedAt > IDLE_AFTER_MS) {
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

      if (now >= nextBlink) {
        blinkStart = now;
        nextBlink = now + (Math.random() < 0.2 ? 260 : 2800 + Math.random() * 3600);
      }
      const b = (now - blinkStart) / 150;
      const lid = b >= 0 && b < 1 ? 1 - Math.sin(b * Math.PI) * 0.92 : 1;
      eyes.setAttribute("transform", `translate(0 206) scale(1 ${lid}) translate(0 -206)`);

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

  return (
    <svg ref={svgRef} className={className} viewBox="0 0 340 360" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id("bd")} gradientUnits="userSpaceOnUse" cx="129" cy="101" r="232">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".42" stopColor="#f8f8f6" />
          <stop offset=".8" stopColor="#e2e2de" />
          <stop offset="1" stopColor="#cdcdc8" />
        </radialGradient>
        <linearGradient id={id("lac")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#202022" />
          <stop offset=".6" stopColor="#0a0a0b" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id={id("eye")} cx=".42" cy=".38" r=".7">
          <stop offset="0" stopColor="#4a2c1a" />
          <stop offset=".45" stopColor="#1c120c" />
          <stop offset="1" stopColor="#050505" />
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
        <filter id={id("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="184" cy="326" rx="122" ry="14" fill={`url(#${id("cs")})`} />
      <circle cx={CX} cy={CY} r="145" fill={`url(#${id("bd")})`} />
      <g clipPath={`url(#${id("clip")})`}>
        <g ref={headRef}>
          <path
            fill={`url(#${id("lac")})`}
            d="M-260 -10 H600 V40 L320 42 Q312 38 306 36 Q302 72 286 98 Q274 80 260 70 Q252 106 232 132 Q216 108 200 96 Q192 132 170 158 Q148 132 140 96 Q124 108 108 132 Q88 106 80 70 Q66 80 54 98 Q38 72 34 36 Q28 38 20 42 L-260 40 Z"
          />
          <g fill="none" stroke="#f4f4f1" strokeWidth="7" strokeLinecap="round">
            <path d="M190 -4 Q196 50 200 96" />
            <path d="M150 -4 Q144 50 140 96" />
            <path d="M212 -4 Q248 30 260 70" />
            <path d="M128 -4 Q92 30 80 70" />
            <path d="M236 -6 Q292 8 306 36" />
            <path d="M104 -6 Q48 8 34 36" />
          </g>
          <g ref={eyesRef}>
            {[122, 218].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy="206" rx="24" ry="28" fill={`url(#${id("eye")})`} />
                <ellipse cx={x - 8} cy="195" rx="8.5" ry="9.5" fill="#fff" opacity=".95" />
                <circle cx={x + 9} cy="217" r="3.4" fill="#fff" opacity=".8" />
                <path
                  d={`M${x + 4} 231 Q${x + 16} 227 ${x + 21} 216`}
                  fill="none"
                  stroke="#ff7a1f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity=".55"
                />
              </g>
            ))}
          </g>
          <path
            d="M154 250 Q170 263 186 250"
            fill="none"
            stroke="#141416"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
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
