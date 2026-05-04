"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Product {
  name: string;
  desc: string;
  url: string;
  stars?: string;
}

const PRODUCTS: Product[] = [
  {
    name: "Companion",
    desc: "Web & Mobile UI for Claude Code & Codex. Launch sessions, stream responses, approve tools.",
    url: "https://github.com/The-Vibe-Company/companion",
    stars: "2.3k",
  },
  {
    name: "vibe-drift-tracker",
    desc: "VS Code extension that integrates with Claude Code. Check your AI drift in real time.",
    url: "https://github.com/The-Vibe-Company/vibe-drift-tracker",
  },
  {
    name: "Granite",
    desc: "Local-first knowledge compiler for humans and agents. Plain markdown, CLI + MCP server.",
    url: "https://github.com/The-Vibe-Company/Granite",
  },
  {
    name: "vanish",
    desc: "Upload files, get temporary public URLs. Dead simple.",
    url: "https://github.com/The-Vibe-Company/vanish",
  },
];

const MORE_REPOS = [
  "captuto",
  "bestiary",
  "la-compagnie-des-jeux",
  "Garden",
  "GoalDigger",
  "Road-To-Mastock",
  "voidline",
  "ticket-enricher",
  "mintlify-docs",
  "docs",
];

const ORG_URL = "https://github.com/The-Vibe-Company";

export function Proof() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="proof"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-14 md:grid-cols-[1.4fr_1fr] md:gap-12">
          <div>
            <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {'// 03 — RECEIPTS'}
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
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.55] text-muted-foreground md:justify-self-end">
            Tools, agents, prototypes. We ship a lot, and most of it is on
            GitHub.
          </p>
        </div>

        <div className="mb-5 flex items-center justify-between border-b border-border pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="font-semibold text-foreground">
            BUILT BY US · ON GITHUB
          </span>
          <span>4 OF 14 PUBLIC</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col gap-3 overflow-hidden border border-foreground bg-background p-6 no-underline transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  GITHUB
                </span>
                <span aria-hidden="true" className="text-lg text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <h3 className="m-0 font-mono text-2xl font-bold tracking-[-0.03em] text-foreground">
                  {p.name}
                </h3>
                {p.stars && (
                  <span className="font-mono text-xs text-orange-500" aria-label={`${p.stars} stars on GitHub`}>
                    ★ {p.stars}
                  </span>
                )}
              </div>
              <p className="m-0 min-h-[60px] text-sm leading-[1.5] text-muted-foreground">
                {p.desc}
              </p>
            </motion.a>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs leading-[1.7] text-muted-foreground">
          + {MORE_REPOS.length} more on GitHub:{" "}
          {MORE_REPOS.map((r, i) => (
            <span key={r}>
              <a
                href={`${ORG_URL}/${r}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {r}
              </a>
              {i < MORE_REPOS.length - 1 && (
                <span aria-hidden="true" className="px-1.5">·</span>
              )}
            </span>
          ))}
        </p>

        <div className="mt-10 flex justify-start">
          <a
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border-2 border-orange-500 bg-orange-500 px-7 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
          >
            Browse all on GitHub
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
