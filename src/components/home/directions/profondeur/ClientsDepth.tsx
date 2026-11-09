"use client";

import { motion, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { clientLogoSize } from "@/lib/client-logos";
import { usePointer } from "./pointer";
import s from "./profondeur.module.css";

export interface DeepClient {
  name: string;
  src: string;
  className: string;
}

/** Three lanes, far to near: smaller, dimmer, blurrier and slower the further back. */
const LANES = [
  { scale: 0.46, opacity: 0.32, blur: 1.8, speed: 140, top: "8%", reverse: true, parallax: 6 },
  { scale: 0.72, opacity: 0.6, blur: 0.7, speed: 95, top: "34%", reverse: false, parallax: 16 },
  { scale: 1, opacity: 1, blur: 0, speed: 60, top: "60%", reverse: true, parallax: 34 },
];

/**
 * The clients as a field of logos at three depths, each lane drifting at the
 * pace its distance gives it: the parallax of a landscape seen from a train.
 */
export function ClientsDepth({ clients }: { clients: DeepClient[] }) {
  const t = useTranslations("clients");
  const { x: px } = usePointer();
  const shifts = [
    useTransform(px, (v) => v * -LANES[0].parallax),
    useTransform(px, (v) => v * -LANES[1].parallax),
    useTransform(px, (v) => v * -LANES[2].parallax),
  ];

  return (
    <section aria-labelledby="clients-title" className="relative z-10 py-16 md:py-24">
      <div className="mx-auto flex max-w-[90rem] items-baseline justify-between px-6 md:px-10 lg:px-16">
        <h2 id="clients-title" className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
          {t("trustedBy")}
        </h2>
        <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          {String(clients.length).padStart(2, "0")}
        </span>
      </div>
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.name}>{c.name}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="relative mt-8 h-[220px] overflow-hidden md:h-[280px]"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        {LANES.map((lane, k) => {
          // Each lane starts on a different logo so no column lines up.
          const order = [...clients.slice(k * 2), ...clients.slice(0, k * 2)];
          const row = [...order, ...order, ...order];
          return (
            <motion.div key={k} style={{ x: shifts[k], top: lane.top }} className="absolute left-0">
              <div
                className={s.lane}
                style={{
                  "--speed": `${lane.speed}s`,
                  animationDirection: lane.reverse ? "reverse" : "normal",
                  opacity: lane.opacity,
                  filter: lane.blur ? `blur(${lane.blur}px)` : undefined,
                } as CSSProperties}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {row.map((c, i) => (
                      <span
                        key={`${copy}-${i}`}
                        className="flex shrink-0 items-center"
                        style={{ marginInline: `${lane.scale * 56}px`, transform: `scale(${lane.scale})` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.src}
                          alt=""
                          {...clientLogoSize(c.src)}
                          className={`${c.className} w-auto object-contain brightness-0 invert`}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
        {/* The near lane stands on light: a faint orange floor glow under it. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(242_115_19/0.12),transparent)]" />
      </div>
    </section>
  );
}
