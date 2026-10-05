"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";
import { LOOP_ARROW_CLASS, LOOP_COPIES, useLoopCarousel } from "./useLoopCarousel";

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

const MONO = "font-mono text-[11px] uppercase tracking-[0.18em]";

/** How long each case stays on screen before the phone carousel moves on. */
const AUTOPLAY_MS = 4500;

/** Distance between two cards of a track, gap included, to the subpixel. */
function stepOf(track: HTMLElement) {
  const [first, second] = Array.from(track.children) as HTMLElement[];
  return first && second
    ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
    : track.clientWidth;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** One case as a card of the phone carousel. */
function CaseSlide({ c, t }: { c: Customer; t: T }) {
  return (
    <Link
      href={`/case-studies/${c.slug}?from=home`}
      className="group flex h-full flex-col border-2 border-foreground bg-background p-5 no-underline"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.logo} alt={c.client} className="h-[26px] w-auto self-start object-contain" loading="lazy" decoding="async" />
      {/* Two lines reserved whatever the sector's length, so every card's
          number sits at the same height as you swipe. */}
      <span className={`mt-5 line-clamp-2 min-h-[3em] text-muted-foreground ${MONO}`}>{c.sector}</span>
      {/* One size for every card's number, sized off the card's width so the
          longest word ("questions") still fits a 320px phone; a long figure
          wraps, balanced, rather than shrinking on its own. */}
      <div className="mt-3 [container-type:inline-size]">
        <p className="m-0 text-balance text-[length:min(60px,21cqw)] font-extrabold leading-[0.9] tracking-[-0.06em] text-foreground">
          {c.metric}
        </p>
      </div>
      <p className="m-0 mt-3 text-[15px] leading-[1.45] text-muted-foreground">{c.metricLabel}</p>
      <span className="mt-auto flex items-center justify-between pt-6 font-mono text-xs uppercase tracking-[0.16em] text-foreground">
        {t("readCase")}
        <span
          aria-hidden="true"
          className="grid h-11 w-11 place-items-center border-2 border-foreground text-lg transition-colors group-active:bg-foreground group-active:text-background"
        >
          →
        </span>
      </span>
    </Link>
  );
}

/**
 * Phones get the cases as stories: one card per screen width, moving on by
 * itself every few seconds while a segmented bar above fills up, one segment
 * per case. The movement is what shows the row can be swiped; the bar shows
 * how many cases there are and how long until the next one, and each segment
 * jumps to its case. A touch on the cards holds the timer, and it only runs
 * while the row is on screen, the tab is visible, and motion is welcome.
 */
function CaseCarousel({ customers }: { customers: Customer[] }) {
  const t = useTranslations("caseStudy");
  const count = customers.length;
  // Read through a store whose server value is false, so the first client
  // render matches the server HTML; the real setting lands right after
  // hydration. framer's hook answers on the very first client render, which
  // made the markup differ and broke hydration for reduced-motion visitors.
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);
  const elapsedRef = useRef(0);
  const autoplay = !paused && !reduceMotion;

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (track) track.scrollTo({ left: index * stepOf(track), behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion]
  );

  // The card at the left edge is the active one, however it got there.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const index = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / stepOf(track))));
      if (index === activeRef.current) return;
      activeRef.current = index;
      elapsedRef.current = 0;
      setActive(index);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !autoplay) return;

    let inView = false;
    let held = false;
    let last = 0;
    let frame = 0;

    // The loop only runs while the row is on screen and the tab is visible:
    // hidden on desktop or scrolled away, it costs nothing.
    const tick = (now: number) => {
      // A frame after a long gap (tab switched, phone locked) must not count
      // that gap as time on screen, or the row would jump on return.
      const dt = Math.min(now - last, 100);
      last = now;
      if (!inView || document.visibilityState !== "visible") {
        frame = 0;
        return;
      }
      if (!held) elapsedRef.current += dt;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(1, elapsedRef.current / AUTOPLAY_MS)})`;
      if (elapsedRef.current >= AUTOPLAY_MS) {
        elapsedRef.current = 0;
        goTo((activeRef.current + 1) % count);
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !inView || document.visibilityState !== "visible") return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        start();
      },
      { threshold: 0.6 }
    );
    observer.observe(track);
    document.addEventListener("visibilitychange", start);
    // Touch events rather than pointer events: a pointer is cancelled as soon
    // as the browser takes the gesture over to scroll, a touch is not.
    const hold = () => (held = true);
    const release = () => (held = false);
    const events = [
      ["touchstart", hold],
      ["touchend", release],
      ["touchcancel", release],
      ["focusin", hold],
      ["focusout", release],
    ] as const;
    events.forEach(([name, fn]) => track.addEventListener(name, fn, { passive: true }));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      events.forEach(([name, fn]) => track.removeEventListener(name, fn));
    };
  }, [autoplay, count, goTo]);

  return (
    <div className="pb-2 pt-14 md:hidden">
      <h2 className="m-0 mx-6 border-b-2 border-foreground pb-3.5 text-[15px] font-bold tracking-[-0.01em] text-foreground">
        {t("indexTitle")}
      </h2>

      <div className="mx-6 mt-2 flex items-center gap-2">
        {/* Always rendered, hidden by CSS under reduced motion, so the
            server and client markup never differ. */}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t("play") : t("pause")}
          className="-ml-3 grid h-11 w-11 shrink-0 place-items-center text-foreground motion-reduce:hidden"
        >
          {paused ? (
            <Play size={14} fill="currentColor" aria-hidden="true" />
          ) : (
            <Pause size={14} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <div className="flex flex-1 gap-1.5">
          {customers.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t("goTo", { client: c.client })}
              aria-current={i === active || undefined}
              className="relative h-11 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden bg-border">
                {/* Cases already seen are full, the current one fills over
                    its time on screen. Keyed on the active index so every
                    segment starts clean when the carousel moves, wrap included. */}
                <span
                  key={active}
                  ref={i === active ? fillRef : undefined}
                  className="absolute inset-0 origin-left bg-foreground"
                  style={{ transform: `scaleX(${i < active || (i === active && !autoplay) ? 1 : 0})` }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* The track runs edge to edge, and the gap between cards equals the
          page gutter, so at rest exactly one card is on screen. */}
      <ol
        ref={trackRef}
        className="m-0 mt-1 flex list-none snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {customers.map((c) => (
          <li key={c.slug} className="w-full shrink-0 snap-start">
            <CaseSlide c={c} t={t as T} />
          </li>
        ))}
      </ol>
      <Link
        href="/case-studies"
        className="mx-6 mt-2 flex min-h-14 items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-orange-500 no-underline"
      >
        {t("seeAll")}
        <span aria-hidden="true" className="text-base">
          →
        </span>
      </Link>
    </div>
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
 * loop that wraps seamlessly in both directions (see useLoopCarousel).
 */
export function CaseStudy() {
  const t = useTranslations("caseStudy") as T;
  const locale = useLocale() as ContentLocale;
  const customers = getCustomers(locale);
  const { trackRef, scrollByCard } = useLoopCarousel(customers.length);

  return (
    <section id="cases" className="border-b border-border bg-background">
      <CaseCarousel customers={customers} />

      <div className="mx-auto hidden max-w-[100rem] px-6 py-24 md:block md:px-12 md:py-28">
        <SectionHeader t={t} />

        <div className="flex items-stretch gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={t("prev")}
            className={LOOP_ARROW_CLASS}
          >
            <ArrowLeft size={22} strokeWidth={2.25} aria-hidden="true" />
          </button>

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 gap-5 overflow-x-auto scroll-p-2 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {LOOP_COPIES.flatMap((copy) =>
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
            className={LOOP_ARROW_CLASS}
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
