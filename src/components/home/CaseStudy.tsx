"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Case {
  client: string;
  sector: string;
  metric: string;
  metricLabel: string;
  story: string;
  points: string[];
}

const CASES: Case[] = [
  {
    client: "Monka",
    sector: "Healthcare · Caregiver support",
    metric: "2 months",
    metricLabel: "from scratch to live on iOS and Android",
    story:
      "Monka helps people who care for a loved one. They were years into their product, with heavy tech debt and a deadline they could not miss. We rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, in two months.",
    points: [
      "A 150-question caregiver assessment that turns into a prioritized to-do list, plus a directory of health professionals.",
      "Lifeline, a dashboard for the coordinating nurses: appointments, follow-up reports, shared documents.",
      "Further in two months than the product's previous four years.",
    ],
  },
  {
    client: "LocService",
    sector: "Rentals · Customer support",
    metric: "87%",
    metricLabel: "of support tickets answered with our AI drafts",
    story:
      "LocService handles several hundred support tickets a day. We read all their past tickets and internal docs to draft the answer for each new one, tailored to the customer's profile and history.",
    points: [
      "Connected to their internal APIs to pull real customer context.",
      "Classification rules so the same question gets the right answer per customer type.",
      "Hundreds of tickets a day, our drafts used on 87% of them.",
    ],
  },
];

export function CaseStudy() {
  const reduceMotion = useReducedMotion() ?? false;

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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CASES.map((c, i) => (
            <motion.article
              key={c.client}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col border border-foreground bg-background p-7 md:p-8"
            >
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
                <h3 className="m-0 text-[26px] font-bold tracking-[-0.03em] text-foreground md:text-[30px]">
                  {c.client}
                </h3>
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
                {c.story}
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
