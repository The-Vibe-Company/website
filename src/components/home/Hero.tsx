"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Marquee } from "@/components/Marquee";
import { cn, typography } from "@/lib/design-system";

const TOP_STRIP = [
  { text: "THE VIBE CO." },
  { text: "AI-NATIVE AGENCY" },
  { text: "YC W24", accent: true },
  { text: "PARIS" },
  { text: "BUILDING SINCE 2023" },
];

const QUICK_ITEMS = [
  {
    n: "01",
    label: "Build",
    desc: "AI products and internal tools, end-to-end.",
  },
  {
    n: "02",
    label: "Operate",
    desc: "Agents inside your company. Sales, support, admin, content.",
  },
  {
    n: "03",
    label: "Advise",
    desc: "Strategy, training, and the AI playbook for your team.",
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b-2 border-foreground bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      />

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-background/60 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur md:px-8">
        {TOP_STRIP.map((item, i) => (
          <span
            key={item.text}
            className="inline-flex items-center gap-3 last:after:content-none"
          >
            <span className={item.accent ? "text-orange-500" : undefined}>
              {item.text}
            </span>
            {i < TOP_STRIP.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "h-1 w-1 rounded-full",
                  item.accent || TOP_STRIP[i + 1]?.accent
                    ? "bg-orange-500"
                    : "bg-current opacity-60"
                )}
              />
            )}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-[100rem] px-6 pb-14 pt-12 md:px-12 md:pb-16 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-wrap gap-3 md:mb-10"
        >
          <span className="inline-flex items-center gap-2.5 border border-foreground bg-background px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
            />
            Open to projects · Built with AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="m-0 flex max-w-[16ch] flex-col font-bold text-foreground"
          style={{
            fontSize: "clamp(48px, 7.4vw, 124px)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
          }}
        >
          <span className="block">
            AI-native agency.
          </span>
          <span
            className="block"
            style={{
              WebkitTextStroke: "1.5px var(--foreground)",
              color: "transparent",
            }}
          >
            Everything 50–100× faster.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-1 items-end gap-10 md:mt-14 md:grid-cols-[1.4fr_1fr] md:gap-12"
        >
          <p className="m-0 max-w-[620px] text-lg leading-[1.5] text-foreground md:text-[19px]">
            A small team of AI specialists. We build products, automate ops,
            and train teams. Our agency itself runs on AI. That&apos;s the
            compound.
          </p>

          <div className="flex flex-col items-start gap-3">
            <a
              href="mailto:founders@thevibecompany.co"
              className="inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
            >
              Book a discovery call
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              See what we do
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-1 border-t border-border md:mt-16 md:grid-cols-3"
        >
          {QUICK_ITEMS.map((item) => (
            <div
              key={item.n}
              className="flex items-start gap-4 border-b border-border py-5 pr-6 last:border-b-0 md:border-b-0"
            >
              <span className="pt-1 font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                {item.n}
              </span>
              <div>
                <div className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                  {item.label}
                </div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative bg-foreground text-background">
        <Marquee>
          <span
            className={cn(
              typography.label.mono,
              "inline-flex items-center gap-3 px-6 py-3"
            )}
          >
            <span aria-hidden="true">▓</span> AI-NATIVE AGENCY{" "}
            <span aria-hidden="true">·</span> 50–100× FASTER{" "}
            <span aria-hidden="true">·</span> BUILT WITH CLAUDE + CODEX{" "}
            <span aria-hidden="true">·</span> OUR AGENCY RUNS ON AI{" "}
            <span aria-hidden="true">·</span> AI SPECIALISTS{" "}
            <span aria-hidden="true">·</span> 4 LIVE PRODUCTS{" "}
            <span aria-hidden="true">·</span> 12+ AI BUILDS{" "}
            <span aria-hidden="true">·</span>
          </span>
        </Marquee>
      </div>
    </section>
  );
}
