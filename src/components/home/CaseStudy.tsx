"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";

const ARROW_CLASS =
  "hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-center border border-foreground text-lg text-foreground transition-colors hover:bg-foreground hover:text-background sm:flex";

// Loop arrows: just the glyph, no frame, in orange — a lighter cue that there
// are more projects to scroll to left and right.
const LOOP_ARROW =
  "hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-center text-3xl leading-none text-orange-500 transition-transform hover:scale-125 sm:flex";

type T = (key: string) => string;

/** The card body, shared by the default carousel and the infinite loop. */
function CaseStudyCard({ c, t }: { c: Customer; t: T }) {
  return (
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
        <div className="mt-2 text-sm text-muted-foreground">{c.metricLabel}</div>
      </div>

      <p className="m-0 mt-6 text-[15px] leading-[1.55] text-foreground">{c.summary}</p>

      <ul className="m-0 mt-6 flex list-none flex-col gap-2.5 p-0">
        {c.points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-[1.5] text-muted-foreground">
            <span aria-hidden="true" className="pt-0.5 font-mono text-orange-500">
              →
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
        <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">
          {t("readCase")}
        </span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

function SectionHeader({ t }: { t: T }) {
  return (
    <div className="mb-12 md:mb-14">
      <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {t("kicker")}
      </span>
      <h2
        className="m-0 font-bold text-foreground"
        style={{ fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.92, letterSpacing: "-0.045em" }}
      >
        {t("titleLine1")}
        <br />
        <span style={{ WebkitTextStroke: "1.5px var(--foreground)", color: "transparent" }}>
          {t("titleLine2")}
        </span>
      </h2>
    </div>
  );
}

// Two card widths for the loop: `peek` narrows the cards so the next one peeks
// in (a "there is more" cue); otherwise two cards sit flush with no overflow.
const CARD_WIDTH_PEEK = "w-[80%] shrink-0 sm:w-[62%] md:w-[calc(44%-10px)]";
const CARD_WIDTH_FLUSH = "w-[86%] shrink-0 sm:w-[70%] md:w-[calc(50%-10px)]";

/**
 * Same two-card format as the default, but the track loops forever: the user
 * scrolls it by hand (trackpad or arrows) and it wraps seamlessly in both
 * directions. Nothing auto-scrolls. Three identical copies give a full set of
 * buffer on each side; when the scroll position drifts past a copy, it jumps by
 * exactly one set width onto identical content, so the wrap is invisible.
 * `peek` decides whether the next card overflows into view or the cards sit flush.
 */
function CaseStudyLoop({ customers, t, peek }: { customers: Customer[]; t: T; peek: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setLen = customers.length;
  const cardWidth = peek ? CARD_WIDTH_PEEK : CARD_WIDTH_FLUSH;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const setWidth = () => {
      const cards = track.querySelectorAll<HTMLElement>("[data-card]");
      if (cards.length < setLen * 2) return 0;
      return cards[setLen].offsetLeft - cards[0].offsetLeft;
    };

    // Start in the middle copy so there is room to scroll left immediately.
    const init = () => {
      const w = setWidth();
      if (w > 0) track.scrollLeft = w;
    };
    init();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const w = setWidth();
        if (w > 0) {
          if (track.scrollLeft < w * 0.5) track.scrollLeft += w;
          else if (track.scrollLeft > w * 1.5) track.scrollLeft -= w;
        }
        ticking = false;
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", init);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", init);
    };
  }, [setLen]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const gap = 20;
    const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const loop = [0, 1, 2];

  return (
    <section id="cases" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <SectionHeader t={t} />

        <div className="flex items-stretch gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={t("prev")}
            className={LOOP_ARROW}
          >
            &larr;
          </button>

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 gap-5 overflow-x-auto scroll-p-2 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loop.flatMap((copy) =>
              customers.map((c) => (
                <div key={`${copy}-${c.slug}`} data-card className={cardWidth}>
                  <CaseStudyCard c={c} t={t} />
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={t("next")}
            className={LOOP_ARROW}
          >
            &rarr;
          </button>
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-orange-500 no-underline transition-colors hover:text-orange-600"
          >
            {t("seeAll")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CaseStudy({ variant = "default" }: { variant?: "default" | "peek" | "loop" }) {
  const reduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("caseStudy") as T;
  const locale = useLocale() as ContentLocale;
  const customers = getCustomers(locale);

  // Both loop variants share the infinite manual scroll; they differ only in
  // whether the next card overflows into view (`peek`) or the cards sit flush.
  if (variant === "peek" || variant === "loop") {
    return <CaseStudyLoop customers={customers} t={t} peek={variant === "peek"} />;
  }

  const showArrows = customers.length > 2;

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
        <SectionHeader t={t} />

        <div className="flex items-stretch gap-3 md:gap-4">
          {showArrows && (
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={t("prev")}
              className={ARROW_CLASS}
            >
              &larr;
            </button>
          )}

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scroll-p-2 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {customers.map((c, i) => (
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
                <CaseStudyCard c={c} t={t} />
              </motion.div>
            ))}
          </div>

          {showArrows && (
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={t("next")}
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
