"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CUSTOMERS } from "@/lib/customers";

const ARROW_CLASS =
  "hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-center border border-foreground text-lg text-foreground transition-colors hover:bg-foreground hover:text-background sm:flex";

export function CaseStudy() {
  const reduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const showArrows = CUSTOMERS.length > 2;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const gap = 20;
    const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section id="cases" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 md:mb-14">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {"// CLIENT WORK"}
          </span>
          <h2
            className="m-0 font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            Built for clients,
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
              }}
            >
              live in production.
            </span>
          </h2>
        </div>

        <div className="flex items-stretch gap-3 md:gap-4">
          {showArrows && (
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous case"
              className={ARROW_CLASS}
            >
              &larr;
            </button>
          )}

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scroll-p-2 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CUSTOMERS.map((c, i) => (
              <motion.div
                key={c.slug}
                data-card
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-[86%] shrink-0 snap-start sm:w-[70%] md:w-[calc(50%-10px)]"
              >
                <Link
                  href={`/case-studies/${c.slug}?from=home`}
                  className="group flex h-full flex-col border border-foreground bg-background p-7 no-underline transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)] md:p-8"
                >
                  <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.logo}
                      alt={c.client}
                      className="h-7 w-auto object-contain md:h-8"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="max-w-full border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground md:shrink-0">
                      {c.sector}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-border pt-6">
                    <div className="text-[44px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[52px]">
                      {c.metric}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {c.metricLabel}
                    </div>
                  </div>

                  <p className="m-0 mt-6 text-[15px] leading-[1.55] text-foreground">
                    {c.summary}
                  </p>

                  <ul className="m-0 mt-6 flex list-none flex-col gap-2.5 p-0">
                    {c.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-[1.5] text-muted-foreground"
                      >
                        <span aria-hidden="true" className="pt-0.5 font-mono text-orange-500">
                          →
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                    <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">
                      Read the case
                    </span>
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {showArrows && (
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next case"
              className={ARROW_CLASS}
            >
              &rarr;
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
