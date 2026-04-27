"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Service {
  n: string;
  title: string;
  tag: string;
  time: string;
  desc: string;
  bullets: string[];
}

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Product builds",
    tag: "BUILD-FOR-HIRE",
    time: "4–12 WEEKS",
    desc: "We design and ship your product end-to-end — leaning on AI for the parts that don't need a human: code, design, evals, ops. Things that used to take a quarter now take weeks.",
    bullets: [
      "Discovery, architecture, production-grade code",
      "Built with Claude + Codex + agents in the loop",
      "Evals + observability shipped from day one",
      "Full handoff with docs — or we keep operating it",
    ],
  },
  {
    n: "02",
    title: "Agent ops",
    tag: "EMBED + OPERATE",
    time: "ONGOING",
    desc: "We deploy agents inside your company to take over the ops nobody wants to do — sales, support, content, internal tools. Wherever your team is burning hours on the same task every week.",
    bullets: [
      "Workflow audit + ROI map",
      "Build, deploy, tune",
      "Train your team to run them",
      "Monthly engagement, no lock-in",
    ],
  },
  {
    n: "03",
    title: "Strategy & training",
    tag: "ADVISORY + TRAINING",
    time: "2–4 WEEKS",
    desc: "Short engagements for leaders who need a real answer to \"what should we actually do with AI?\" We map your stack, prioritize the opportunities, and train your team so they don't need us forever.",
    bullets: [
      "Stack audit + opportunity mapping",
      "Build vs. buy recommendations",
      "Roadmap with cost + time estimates",
      "Hands-on training for your team",
      "Optional implementation handoff",
    ],
  },
];

export function Services() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="services"
      className="mx-auto max-w-[100rem] scroll-mt-24 px-6 py-24 md:px-12 md:py-28"
    >
      <div className="mb-12 border-b border-border pb-8 md:mb-16">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          // 01 — WHAT WE DO
        </span>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-12">
          <h2
            className="m-0 font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            Three ways
            <br />
            to work together.
          </h2>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] text-muted-foreground md:justify-self-end">
            We're a small team of engineers and designers who build with AI all
            day, every day. Pick the engagement that fits — or talk to us and
            we'll figure it out.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SERVICES.map((service, i) => (
          <motion.article
            key={service.n}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: reduceMotion ? 0 : i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group flex flex-col border border-foreground bg-background p-7 transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
          >
            <div className="mb-8 flex items-start justify-between gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                {service.n}
              </span>
              <div className="flex flex-col items-end gap-1">
                <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  {service.tag}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {service.time}
                </span>
              </div>
            </div>

            <h3 className="m-0 mb-3 text-[32px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[36px]">
              {service.title}
            </h3>
            <p className="m-0 mb-6 text-[15px] leading-[1.5] text-muted-foreground md:min-h-[90px]">
              {service.desc}
            </p>

            <ul className="m-0 flex flex-1 flex-col gap-2 p-0">
              {service.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-2.5 text-sm leading-[1.4] text-foreground"
                >
                  <span aria-hidden="true" className="font-mono text-muted-foreground">
                    —
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-end border-t border-border pt-4">
              <a
                href="mailto:founders@thevibecompany.co"
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition-opacity hover:opacity-70"
              >
                Inquire
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
