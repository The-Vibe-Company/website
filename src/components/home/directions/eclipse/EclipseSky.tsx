"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * The sky of the hero, drawn by one hand-written fragment shader: an orange
 * sun with a boiling surface, a corona of slow streamers, a warm horizon and a
 * film grain. The sun is centred on an anchor element (the mascot's head) and
 * sized from it, so the head eclipses the disc and the corona burns around it.
 * `progress` (0 → 1) sets the sun: it sinks behind the mascot and reddens.
 *
 * It renders under its own CSS fallback (painted by the parent), fades in once
 * the first frame is drawn, never runs offscreen or in a hidden tab, caps the
 * resolution, and with reduced motion draws still frames only.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uSun;
uniform float uSet;
uniform float uScale;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float R = uSun.z;

  // Heat haze: the air under and around the sun shimmers sideways.
  float haze = smoothstep(uSun.y + R * 0.6, uSun.y - R * 1.8, frag.y);
  frag.x += (noise(vec2(frag.y * 0.018 / uScale, uTime * 0.55)) - 0.5) * 7.0 * uScale * haze;

  vec2 d = (frag - uSun.xy) / R;
  float r = length(d);
  float aa = 1.6 / R;

  vec3 ink = vec3(0.047, 0.047, 0.051);
  // Values above 1 are intended: the tone curve at the end rolls them off,
  // and pushing red hardest keeps the light orange instead of beige.
  vec3 hot = mix(vec3(2.6, 0.95, 0.22), vec3(1.7, 0.32, 0.07), uSet);
  vec3 coronaCol = mix(vec3(1.55, 0.6, 0.15), vec3(1.1, 0.2, 0.05), uSet);
  vec3 mid = mix(vec3(0.949, 0.451, 0.075), vec3(0.80, 0.18, 0.05), uSet);
  vec3 deep = mix(vec3(0.60, 0.16, 0.02), vec3(0.30, 0.03, 0.02), uSet);

  // The surface boils: two scales of noise drifting against each other.
  float pl = fbm(d * 3.0 + vec2(uTime * 0.035, -uTime * 0.025));
  float pl2 = fbm(d * 7.5 - vec2(uTime * 0.05, uTime * 0.03));
  vec3 surf = mix(deep, mid, smoothstep(0.2, 0.75, pl * 0.75 + pl2 * 0.45));
  // Only the rim of the disc shows around the head: make it the hottest part,
  // like the bright ring of a total eclipse.
  surf = mix(surf, hot, smoothstep(0.72, 0.99, r) * (0.6 + 0.4 * pl2));
  float disc = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);

  // Corona: streamers sampled on the circle so they wrap without a seam.
  vec2 dir = d / max(r, 1e-4);
  float rr = max(r - 1.0, 0.0);
  float st = fbm(dir * 3.2 + vec2(uTime * 0.02, -uTime * 0.017));
  float st2 = fbm(dir * 9.0 - vec2(uTime * 0.03, uTime * 0.021));
  float ray = pow(clamp(st * 0.8 + st2 * 0.35, 0.0, 1.0), 2.2);
  float corona = exp(-rr * (6.0 - 3.8 * ray)) * (0.45 + 1.5 * ray);
  float bloom = exp(-rr * 2.4) * 0.6 + exp(-rr * 0.85) * 0.07;

  vec3 col = ink;
  col += mid * bloom * (1.0 - uSet * 0.35);
  col += coronaCol * corona * (1.0 - disc) * (1.0 - uSet * 0.3);
  col = mix(col, surf, disc);

  // The horizon keeps the warmth of the sun after it has sunk.
  float horizon = smoothstep(uRes.y * 0.42, 0.0, frag.y);
  col += mid * horizon * (0.09 + 0.2 * uSet) * smoothstep(-2.2, 0.2, (uSun.y - frag.y) / R + 1.0);

  // Depth: the sky falls off to black away from the light.
  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - smoothstep(0.35, 0.95, length(uv * vec2(1.1, 1.3))) * 0.6;

  // Film grain.
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.04;

  // Soft shoulder so the hot core never clips flat.
  col = 1.0 - exp(-col * 1.35);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Ratio of the sun's radius to the anchor's half-width (the head). */
export const SUN_RATIO = 1.28;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function EclipseSky({
  anchors,
  progress,
  reduced,
  onReady,
  className,
}: {
  /** Candidate anchors (one per layout); the first one on screen is used. */
  anchors: RefObject<HTMLElement | null>[];
  progress: MotionValue<number>;
  reduced: boolean;
  onReady?: () => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uSun = gl.getUniformLocation(program, "uSun");
    const uSet = gl.getUniformLocation(program, "uSet");
    const uScale = gl.getUniformLocation(program, "uScale");

    // The picture is soft everywhere but the disc's edge: a little under the
    // device resolution is invisible and halves the fragment work.
    const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.75;
    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    resize();

    const start = performance.now();
    let frame = 0;
    let running = false;
    let visible = true;
    let drawn = false;

    const draw = (now: number) => {
      let a: DOMRect | null = null;
      for (const ref of anchors) {
        const r = ref.current?.getBoundingClientRect();
        if (r && r.width > 0) {
          a = r;
          break;
        }
      }
      if (!a) return;
      const c = canvas.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, progress.get()));
      const radius = (a.width / 2) * SUN_RATIO;
      // Sinks behind the mascot as the scene is scrolled.
      const cx = a.left + a.width / 2 - c.left;
      const cy = a.top + a.height / 2 - c.top + p * radius * 2.1;
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, reduced ? 12.0 : (now - start) / 1000);
      gl.uniform3f(uSun, cx * scale, height - cy * scale, radius * scale);
      gl.uniform1f(uSet, p);
      gl.uniform1f(uScale, scale);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!drawn) {
        drawn = true;
        setReady(true);
        onReady?.();
      }
    };

    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else stop();
    });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVisibility);

    // Still frames follow the scroll when the loop is off.
    const unsubscribe = progress.on("change", () => {
      if (!running) requestAnimationFrame((t) => draw(t));
    });

    draw(performance.now());
    play();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- anchors are stable refs
  }, [progress, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 900ms ease" }}
    />
  );
}
