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
      eyes.setAttribute("transform", `translate(0 212) scale(1 ${lid}) translate(0 -212)`);

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
        <radialGradient id={id("eye")} cx=".5" cy=".68" r=".62">
          <stop offset="0" stopColor="#9a6a3e" />
          <stop offset=".45" stopColor="#4a2a15" />
          <stop offset="1" stopColor="#120b06" />
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
          {/* The cap: black over the crown and down the sides, the white face
              rising in two lobes with the black point between them. */}
          <path
            fill={`url(#${id("lac")})`}
            d="M-260 -20 H600 V96 C470 104 362 160 318 232 C304 196 288 150 262 118 C244 94 214 90 200 108 C188 122 178 136 170 154 C162 136 152 122 140 108 C126 90 96 94 78 118 C52 150 36 196 22 232 C-22 160 -130 104 -260 96 Z"
          />
          {/* Swept-back stripes, tapered, curving from the crown down the
              sides (mirrored right). */}
          <g fill="#f3f3f0">
            <path d="M163 30 C122 40 84 66 62 106 C50 130 42 156 38 182 C50 158 60 134 74 112 C96 78 126 56 165 44 Z" />
            <path d="M152 18 C104 22 64 46 42 86 C34 100 29 116 26 132 C36 114 47 98 58 85 C84 54 114 36 155 30 Z" />
            <path d="M177 30 C218 40 256 66 278 106 C290 130 298 156 302 182 C290 158 280 134 266 112 C244 78 214 56 175 44 Z" />
            <path d="M188 18 C236 22 276 46 298 86 C306 100 311 116 314 132 C304 114 293 98 282 85 C256 54 226 36 185 30 Z" />
          </g>
          {/* The short black brows, ends of the side bands, above the eyes. */}
          <g fill="none" stroke="#0b0b0c" strokeWidth="4.5" strokeLinecap="round">
            <path d="M96 174 Q116 160 142 166" />
            <path d="M244 174 Q224 160 198 166" />
          </g>
          <g ref={eyesRef}>
            {[122, 218].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy="212" rx="27" ry="31" fill={`url(#${id("eye")})`} stroke="#0b0b0c" strokeWidth="2.5" />
                <ellipse cx={x} cy="214" rx="13" ry="15" fill="#060606" />
                <ellipse cx={x - 9} cy="199" rx="9.5" ry="10.5" fill="#fff" opacity=".96" />
                <circle cx={x + 10} cy="225" r="3.8" fill="#fff" opacity=".85" />
                <path
                  d={`M${x + 3} 240 Q${x + 17} 236 ${x + 23} 222`}
                  fill="none"
                  stroke="#ff7a1f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity=".5"
                />
              </g>
            ))}
          </g>
          <path
            d="M152 258 Q170 271 188 258"
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
