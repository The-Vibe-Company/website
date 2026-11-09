"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { Backers } from "../../Backers";
import { FitText } from "../../FitText";
import { drawDust, makeDust, type Mote } from "./dust";
import s from "./lantern.module.css";

const MASCOT = "/images/home/mascot-cutout.webp";
const RATIO = 672 / 488;
const TRACKING = -0.05;

/** Elements whose light is drawn in their own coordinates: they carry their offset in the stage. */
function placeConsumer(el: HTMLElement | null, stage: DOMRect) {
  if (!el) return;
  const b = el.getBoundingClientRect();
  el.style.setProperty("--ox", `${b.left - stage.left}px`);
  el.style.setProperty("--oy", `${b.top - stage.top}px`);
}

/**
 * The hero as a dark room with one light in it. A lantern floats beside the
 * mascot's face; on a mouse it follows the pointer, and everything it reaches
 * is relit live: the mascot's warm side and its shade, its shadow thrown on
 * the wall behind, the headline (white-hot near the flame, stone grey far
 * from it), and the dust hanging in the air, which only shows inside the
 * light. Without a mouse the lantern wanders the room on its own; with
 * reduced motion it stays at rest and nothing moves.
 */
export function LanternHero() {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const poster = t.raw("poster") as string[];
  const fr = useLocale() === "fr";
  const reduce = useReducedMotion() ?? false;

  const stageRef = useRef<HTMLElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLImageElement>(null);
  const figureRef = useRef<HTMLImageElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const posterRef = useRef<HTMLSpanElement>(null);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const mascot = mascotRef.current;
    const canvas = canvasRef.current;
    if (!stage || !mascot || !canvas) return;
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let dpr = 1;
    let box = { x: 0, y: 0, w: 0, h: 0 };
    let rest = { x: 0, y: 0 };
    let motes: Mote[] = [];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const measure = () => {
      const r = stage.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const m = mascot.getBoundingClientRect();
      box = { x: m.left - r.left, y: m.top - r.top, w: m.width, h: m.height };
      // Beside the face, at eye level, a little in front of it.
      rest = { x: box.x + box.w * (w < 768 ? 0.12 : -0.03), y: box.y + box.h * 0.35 };
      placeConsumer(mascot, r);
      placeConsumer(titleRef.current, r);
      placeConsumer(posterRef.current, r);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (motes.length === 0) motes = makeDust(w < 768 ? 46 : 110, w, h);
    };

    let pos = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let pointerInside = false;

    const apply = (lx: number, ly: number, time: number) => {
      stage.style.setProperty("--lx", `${lx}px`);
      stage.style.setProperty("--ly", `${ly}px`);
      const orb = `translate3d(${lx}px, ${ly}px, 0)`;
      if (orbRef.current) orbRef.current.style.transform = orb;
      if (raysRef.current) raysRef.current.style.transform = orb;
      // The shadow falls away from the light and grows as the light comes close.
      const cx = box.x + box.w / 2;
      const cy = box.y + box.h * 0.4;
      const dx = cx - lx;
      const dy = cy - ly;
      const dist = Math.max(120, Math.hypot(dx, dy));
      const grow = 1 + Math.min(0.55, 260 / dist) * 0.5;
      if (shadowRef.current) {
        shadowRef.current.style.transform = `translate3d(${dx * 0.42}px, ${dy * 0.3}px, 0) scale(${grow})`;
        shadowRef.current.style.opacity = String(Math.min(0.92, 0.45 + 200 / dist));
      }
      // The mascot turns a hair toward the light.
      if (figureRef.current) {
        const tilt = Math.max(-2.2, Math.min(2.2, ((lx - cx) / box.w) * 2.2));
        mascot.style.transform = `rotate(${tilt}deg)`;
      }
      if (ctx) drawDust(ctx, motes, { w, h, dpr, lx, ly, time, still: reduce });
    };

    measure();
    pos = { ...rest };
    target = { ...rest };
    apply(rest.x, rest.y, 0);

    const ro = new ResizeObserver(() => {
      measure();
      if (!pointerInside) {
        pos = { ...rest };
        target = { ...rest };
      }
      apply(pos.x, pos.y, performance.now() / 1000);
    });
    ro.observe(stage);
    document.fonts?.ready.then(() => {
      measure();
      apply(pos.x, pos.y, performance.now() / 1000);
    });

    if (reduce) {
      return () => ro.disconnect();
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      target = {
        x: Math.max(24, Math.min(w - 24, e.clientX - r.left)),
        y: Math.max(24, Math.min(h - 24, e.clientY - r.top)),
      };
      pointerInside = true;
      setMoved(true);
    };
    const onLeave = () => {
      pointerInside = false;
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    let visible = true;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = now / 1000;
      if (!pointerInside) {
        if (finePointer) {
          target = rest;
        } else {
          // No mouse: the lantern wanders the room by itself.
          target = {
            x: w * 0.5 + Math.sin(time * 0.23) * w * 0.36,
            y: h * 0.5 + Math.sin(time * 0.31 + 1.2) * h * 0.36,
          };
        }
      }
      const k = 1 - Math.exp(-dt * (pointerInside ? 4.2 : 1.6));
      pos = { x: pos.x + (target.x - pos.x) * k, y: pos.y + (target.y - pos.y) * k };
      // It never quite holds still: a slow hover, like something carried.
      const bx = Math.sin(time * 1.1) * 5 + Math.sin(time * 2.7) * 1.5;
      const by = Math.cos(time * 0.9) * 7;
      apply(pos.x + bx, pos.y + by, time);
    };
    frame = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <section
      id="hero"
      ref={stageRef}
      data-lantern-stage
      className="relative isolate overflow-hidden bg-[#070707] lg:min-h-[calc(100svh-84px)]"
      style={{ "--lx": "70%", "--ly": "45%" } as CSSProperties}
    >
      {/* The lantern's haze on the back wall. */}
      <div
        ref={hazeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px circle at var(--lx) var(--ly), rgb(242 115 19 / 0.26), rgb(242 115 19 / 0.1) 32%, rgb(242 115 19 / 0.03) 58%, transparent 78%)",
        }}
      />
      <div ref={raysRef} aria-hidden="true" className={s.rays} />

      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      <div ref={orbRef} aria-hidden="true" className={`${s.orb} z-30`} />

      <div className="relative z-10 mx-auto max-w-[90rem] px-6 pb-4 pt-8 md:px-10 md:pb-20 md:pt-14 lg:px-16 lg:pb-24 lg:pt-[72px]">
        <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
          <p className="m-0 inline-flex items-center">
            <span aria-hidden="true" className={s.ember} />
            {tFooter("openToProjects")}
          </p>
          <p
            aria-hidden="true"
            className={`m-0 hidden items-center gap-2 text-muted-foreground transition-opacity duration-700 motion-reduce:!hidden [@media(hover:hover)_and_(pointer:fine)]:md:inline-flex ${moved ? "opacity-0" : "opacity-100"}`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ffb36b] shadow-[0_0_8px_2px_rgb(242_115_19/0.8)]" />
            {fr ? "Bougez la souris, la lanterne suit" : "Move the mouse, the lantern follows"}
          </p>
        </div>

        <h1 className="m-0 font-[800] text-foreground">
          {/* Phones: the poster, two lines that fill the width. */}
          <span ref={posterRef} className="relative mt-8 block leading-[0.86] [container-type:inline-size] md:hidden">
            <span aria-hidden="true" className={s.litBloom}>
              <span className={`${s.litBloomInner} [container-type:inline-size]`}>
                <FitText trackingEm={TRACKING} className="transition-none">{poster[0]}</FitText>
                <FitText trackingEm={TRACKING} className="transition-none">{poster[1]}</FitText>
              </span>
            </span>
            <span className={`${s.litText} ${s.litRoom}`}>
              <FitText trackingEm={TRACKING} className="transition-none">{poster[0]}</FitText>
              <FitText trackingEm={TRACKING} className="transition-none">{poster[1]}</FitText>
            </span>
          </span>
          {/* From 768px: one line across the room. */}
          <span ref={titleRef} className="relative mt-10 hidden leading-[0.86] [container-type:inline-size] md:block lg:mt-12">
            <span aria-hidden="true" className={s.litBloom}>
              <span className={`${s.litBloomInner} [container-type:inline-size]`}>
                <FitText trackingEm={TRACKING} className="-ml-[0.04em] transition-none">
                  {t("titleLine1")}
                </FitText>
              </span>
            </span>
            <span className={`${s.litText} ${s.litRoom}`}>
              <FitText trackingEm={TRACKING} className="-ml-[0.04em] transition-none">
                {t("titleLine1")}
              </FitText>
            </span>
          </span>
          <span className="mt-8 block max-w-[17ch] text-[clamp(1.4rem,2.5vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.03em] md:mt-14 lg:mt-16">
            {t("titleLine2")}
          </span>
        </h1>

        <div className="max-w-[34rem]">
          <p className="m-0 mt-5 text-[17px] leading-[1.6] text-[#a7a49d] md:mt-7 md:text-[19px]">{t("subtitle")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-11">
            <a
              href={BOOKING_URL}
              {...bookingLocation("hero")}
              onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
              className="group inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-foreground px-6 text-[15px] font-medium text-background shadow-[0_0_0_1px_rgb(255_190_120/0.25),0_18px_60px_-14px_rgb(242_115_19/0.7)] transition-[background-color,box-shadow] hover:bg-[#fff4e6] hover:shadow-[0_0_0_1px_rgb(255_190_120/0.5),0_18px_70px_-10px_rgb(242_115_19/0.95)]"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#cases"
              onClick={() => captureEvent("see_what_we_do_clicked")}
              className="text-[15px] font-medium text-foreground underline decoration-1 underline-offset-[7px] transition-colors hover:text-[#ffb36b]"
            >
              {t("seeWhatWeDo")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-border pt-7 md:mt-14">
            <Backers />
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">{t("response")}</span>
          </div>
        </div>
      </div>

      {/* The mascot, its wall shadow, and the light laid over it. */}
      <div
        ref={mascotRef}
        aria-hidden="true"
        className="pointer-events-none relative z-[2] mx-auto -mb-[22vw] mt-0 w-[86vw] max-w-[440px] [transform-origin:50%_60%] md:absolute md:right-[2vw] md:top-[300px] md:mx-0 md:mb-0 md:mt-0 md:w-[min(44vw,560px)] md:max-w-none lg:top-[268px]"
        style={{ aspectRatio: `${1 / RATIO}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={shadowRef} src={MASCOT} alt="" className={s.wallShadow} style={{ transformOrigin: "50% 40%" }} />
        <Image
          ref={figureRef}
          src={MASCOT}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 560px, 78vw"
          className="object-contain"
        />
        <div className={`${s.mascotPass} ${s.shadePass}`} />
        <div className={`${s.mascotPass} ${s.warmPass}`} />
        <div className={`${s.mascotPass} ${s.hotPass}`} />
      </div>

      {/* Its lower half sinks into the dark. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[16%] bg-gradient-to-t md:h-[34%] from-[#070707] via-[#070707]/80 to-transparent"
      />
    </section>
  );
}
