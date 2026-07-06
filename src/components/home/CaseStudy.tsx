"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "2 months", label: "From first line to the App Store" },
  { value: "iOS + Android", label: "Live on the App Store" },
  { value: "Every day", label: "New caregivers onboarded" },
  { value: "Daily", label: "Used by health professionals" },
];

const DID: string[] = [
  "A caregiver app on iOS and Android: a 150-question assessment with a careful UX that turns into a prioritized to-do list, plus a directory of health professionals.",
  "Lifeline, a dashboard for the coordinating nurses who follow every caregiver: appointments, follow-up reports, shared documents, and messaging.",
  "Automated deployments and CI that check and ship every release.",
];

export function CaseStudy() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="cases" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 md:mb-14">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {"// CASE — MONKA"}
          </span>
          <h2
            className="m-0 font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            Two months to ship
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
              }}
            >
              what usually takes a year.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <span className="mb-5 inline-flex w-fit items-center border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
              Healthcare · Caregiver support
            </span>

            <p className="m-0 max-w-[620px] text-lg leading-[1.55] text-foreground">
              Monka helps people who care for a loved one in a difficult
              situation. They had spent years building their product and were
              carrying heavy tech debt, with a hard deadline they could not
              miss. In two months, we rebuilt their mobile app and their
              care-coordination tool from scratch, fully vibe-coded, keeping
              their existing API.
            </p>

            <ul className="m-0 mt-7 flex list-none flex-col gap-3 p-0">
              {DID.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[15px] leading-[1.5] text-muted-foreground"
                >
                  <span aria-hidden="true" className="pt-0.5 font-mono text-orange-500">
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="m-0 mt-7 max-w-[620px] text-[15px] leading-[1.55] text-foreground">
              In two months of vibe coding, we moved the product further than
              its previous four years of work.
            </p>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="m-0 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-1"
          >
            {STATS.map((stat) => (
              <div key={stat.value} className="flex flex-col gap-1 bg-background p-6">
                <dt className="text-[26px] font-bold leading-none tracking-[-0.03em] text-foreground md:text-[30px]">
                  {stat.value}
                </dt>
                <dd className="m-0 text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
