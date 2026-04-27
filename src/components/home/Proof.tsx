"use client";

import { motion, useReducedMotion } from "framer-motion";

const STATS = [
  { v: "12+", l: "AI builds / shipped since 2023" },
  { v: "4", l: "Products / of our own" },
  { v: "6 wk", l: "Brief → prod" },
  { v: "20×", l: "Faster than traditional delivery" },
];

const PRODUCTS = [
  {
    name: "vanish.sh",
    desc: "Disposable browser sessions for agents",
    accent: "#10b981",
    status: "LIVE",
  },
  {
    name: "The Companion",
    desc: "Always-on agent for solo founders",
    accent: "#f97316",
    status: "BETA",
  },
  {
    name: "vibedrift.",
    desc: "Vibe-coding playground + leaderboard",
    accent: "#facc15",
    status: "LIVE",
  },
  {
    name: "Granite",
    desc: "Production-grade memory for agents",
    accent: "#62D1AF",
    status: "SHIPPING",
  },
];

export function Proof() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="proof"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 md:mb-14">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            // 03 — RECEIPTS
          </span>
          <h2
            className="m-0 font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            We build for clients.
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
              }}
            >
              And we build for ourselves.
            </span>
          </h2>
        </div>

        <div className="mb-16 grid grid-cols-2 border-y-2 border-foreground md:mb-20 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-border px-5 py-7 [&:not(:last-child)]:border-r md:px-6 md:py-8"
            >
              <div className="text-5xl font-bold leading-none tracking-[-0.04em] text-foreground md:text-[64px]">
                {s.v}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between border-b border-border pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="font-semibold text-foreground">
            OWN PRODUCTS · IN PRODUCTION
          </span>
          <span>04 / 04 LIVE</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden border border-foreground bg-background p-6 transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: p.accent }}
              />
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: p.accent }}
                  />
                  {p.status}
                </span>
                <span aria-hidden="true" className="text-lg text-muted-foreground">
                  ↗
                </span>
              </div>
              <h3 className="m-0 mt-3 font-mono text-2xl font-bold tracking-[-0.03em] text-foreground">
                {p.name}
              </h3>
              <p className="m-0 min-h-[42px] text-sm leading-[1.5] text-muted-foreground">
                {p.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
