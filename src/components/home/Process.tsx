"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Step {
  n: string;
  day: string;
  label: string;
  title: string;
  desc: string;
  status: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    day: "DAY 0",
    label: "BRIEF",
    title: "We meet, we listen, we scope.",
    desc: "30-min call. You explain the problem, we explain how we'd build it. If there's a fit, we send a fixed-scope proposal within 48 hours.",
    status: "AVAILABLE",
  },
  {
    n: "02",
    day: "DAY 1–5",
    label: "DESIGN",
    title: "Prototype before we commit.",
    desc: "We design the agent flow, the surfaces, the data model, the evals. By Friday you have a clickable prototype and a build plan.",
    status: "STANDARD",
  },
  {
    n: "03",
    day: "WEEK 2–N",
    label: "BUILD",
    title: "Ship every week. In public.",
    desc: "Working software at the end of every week. Loom demo on Friday, deploy on Monday. You see the code, the bugs, and the fixes as they happen.",
    status: "STANDARD",
  },
  {
    n: "04",
    day: "POST-LAUNCH",
    label: "OPERATE",
    title: "Hand off — or stay on.",
    desc: "We can hand the codebase to your team with full docs and runbooks. Or we keep operating it on a monthly retainer. Your call.",
    status: "OPTIONAL",
  },
];

export function Process() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="process"
      className="border-y-2 border-foreground bg-foreground text-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-14 border-b border-white/15 pb-8 md:mb-20">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-white/55">
            // 02 — HOW WE WORK
          </span>
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-12">
            <h2
              className="m-0 font-bold text-background"
              style={{
                fontSize: "clamp(44px, 6vw, 88px)",
                lineHeight: 0.92,
                letterSpacing: "-0.045em",
              }}
            >
              From brief
              <br />
              to production
              <br />
              in 6 weeks.
            </h2>
            <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] text-white/65 md:justify-self-end">
              First deploy in week 2. Working software every week after that.
            </p>
          </div>
        </div>

        <ol className="m-0 flex list-none flex-col p-0">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 gap-6 border-t border-white/15 py-8 md:grid-cols-[200px_1fr_auto] md:gap-12 md:py-9"
            >
              <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                <span className="text-5xl font-bold leading-none tracking-[-0.05em] text-background md:text-[64px]">
                  {step.n}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {step.day}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
                  {step.label}
                </span>
                <h3 className="m-0 max-w-[540px] text-[26px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[32px]">
                  {step.title}
                </h3>
                <p className="m-0 max-w-[540px] text-base leading-[1.55] text-white/70">
                  {step.desc}
                </p>
              </div>

              <div className="flex md:justify-end md:pt-2">
                <span className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"
                  />
                  {step.status}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
