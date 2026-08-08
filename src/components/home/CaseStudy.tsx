"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";

// Loop arrows: grey frame, orange Lucide arrow (centers cleanly), fills orange
// on hover — a cue that there are more projects to scroll to left and right.
const ARROW_CLASS =
  "hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center self-center border-2 border-border text-orange-500 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-background sm:flex";

// Two cards fit flush, no overflow.
const CARD_WIDTH = "w-[86%] shrink-0 sm:w-[70%] md:w-[calc(50%-10px)]";

type T = (key: string) => string;

function CaseStudyCard({ c, t, clone = false }: { c: Customer; t: T; clone?: boolean }) {
  return (
    <Link
      href={`/case-studies/${c.slug}?from=home`}
      tabIndex={clone ? -1 : undefined}
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

/**
 * Two case-study cards, scrolled by hand (trackpad or arrows) in an infinite
 * loop that wraps seamlessly in both directions. Nothing auto-scrolls. Three
 * identical copies give a full set of buffer on each side; when the scroll
 * position drifts past a copy, it jumps by exactly one set width onto identical
 * content, so the wrap is invisible.
 */
export function CaseStudy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("caseStudy") as T;
  const locale = useLocale() as ContentLocale;
  const customers = getCustomers(locale);
  const setLen = customers.length;

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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
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
            className={ARROW_CLASS}
          >
            <ArrowLeft size={22} strokeWidth={2.25} aria-hidden="true" />
          </button>

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 gap-5 overflow-x-auto scroll-p-2 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loop.flatMap((copy) =>
              customers.map((c) => (
                <div
                  key={`${copy}-${c.slug}`}
                  data-card
                  aria-hidden={copy !== 1 || undefined}
                  inert={copy !== 1 || undefined}
                  className={CARD_WIDTH}
                >
                  <CaseStudyCard c={c} t={t} clone={copy !== 1} />
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={t("next")}
            className={ARROW_CLASS}
          >
            <ArrowRight size={22} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.2em] text-orange-500 no-underline transition-colors hover:text-orange-600 md:text-sm"
          >
            {t("seeAll")}
            <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
