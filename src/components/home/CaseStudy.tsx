"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Case {
  client: string;
  logo: string;
  sector: string;
  metric: string;
  metricLabel: string;
  story: string;
  points: string[];
}

const CASES: Case[] = [
  {
    client: "Monka",
    logo: "/images/clients/monka-color.webp",
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
    logo: "/images/clients/locservice.png",
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
  {
    client: "AFP",
    logo: "/images/clients/afp.svg",
    sector: "News · Journalism",
    metric: "90M documents",
    metricLabel: "of text, image, and video, made searchable by AI",
    story:
      "AFP is one of the world's largest news agencies. As part of a France 2030 project, we're building AI tools that help their journalists work faster, on top of a corpus of 90 million documents: articles, images, video, and wires.",
    points: [
      "Multimodal search: ask a question, get every relevant article, image, and video across the archive.",
      "Topic watch that follows a subject and surfaces what matters.",
      "A writing assistant for documentary research, fact-checking, and feedback.",
    ],
  },
  {
    client: "Coup de Pâtes",
    logo: "/images/clients/coup-de-pates.svg",
    sector: "Food · Design review",
    metric: "At a glance",
    metricLabel: "which catalog feedback was applied, which wasn't",
    story:
      "Coup de Pâtes reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note was actually applied was slow and tedious. We built them AI skills that surface it all in a few glances.",
    points: [
      "See applied vs. missed feedback instantly, plus requested changes and typos.",
      "Re-annotate and re-export the new round of feedback as a PDF.",
      "A second tool highlights the differences between two specific documents, like two labels or two specs.",
    ],
  },
];

const ARROW_CLASS =
  "hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-center border border-foreground text-lg text-foreground transition-colors hover:bg-foreground hover:text-background sm:flex";

export function CaseStudy() {
  const reduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const showArrows = CASES.length > 2;

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
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CASES.map((c, i) => (
              <motion.article
                key={c.client}
                data-card
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex w-[86%] shrink-0 snap-start flex-col border border-foreground bg-background p-7 sm:w-[70%] md:w-[calc(50%-10px)] md:p-8"
              >
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="m-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.logo}
                      alt={c.client}
                      className="h-7 w-auto object-contain md:h-8"
                      loading="lazy"
                      decoding="async"
                    />
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
