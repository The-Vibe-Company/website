"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import dynamic from "next/dynamic";
import { Fragment, useSyncExternalStore, type CSSProperties } from "react";
import type { RunnerItem } from "@/lib/runner-worlds";

/**
 * The game is a desktop-only extra, so it is not part of the hero's bundle.
 * Statically imported it put ~1600 lines of game and audio into the homepage's
 * critical client chunk for every visitor, including the phones where it is
 * never shown.
 */
const HeroRunner = dynamic(() => import("./HeroRunner").then((m) => m.HeroRunner), {
  ssr: false,
});

/**
 * Width alone was the wrong gate: at the md breakpoint the panel appeared on
 * tablets, where the only touch control is jump — and ceiling bars, which
 * cannot be jumped, start arriving after eight seconds. Requiring a hovering
 * pointer as well keeps it to machines that have the keyboard it needs.
 */
const RUNNER_MEDIA = "(min-width: 1024px) and (hover: hover)";

function subscribeRunnerMedia(onChange: () => void): () => void {
  const query = window.matchMedia(RUNNER_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const QUICK_ITEMS = [
  { n: "01", key: "build" },
  { n: "02", key: "operate" },
  { n: "03", key: "advise" },
] as const;

/** Animation delay for the CSS entrance classes in globals.css. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Gap between two words of the title, and when the title starts. */
const WORD_STAGGER = 70;
const TITLE_START = 60;

export function Hero({ runnerItems }: { runnerItems: RunnerItem[] }) {
  // Server-side this is false, so the chunk is never even requested on a phone.
  const canRun = useSyncExternalStore(
    subscribeRunnerMedia,
    () => window.matchMedia(RUNNER_MEDIA).matches,
    () => false,
  );
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  // The entrance is CSS, so it plays from the server HTML: the title is in the
  // page, readable, before any JavaScript runs.
  const titleWords = t("titleLine1").split(" ");
  const claimDelay = TITLE_START + titleWords.length * WORD_STAGGER + 40;

  return (
    // Phones get HeroMobile, a poster layout, in its place.
    <section
      id="hero"
      className="relative hidden overflow-hidden border-b-2 border-foreground bg-background md:block"
    >
      <div aria-hidden="true" data-hero-aurora className="vc-aurora pointer-events-none absolute inset-0 overflow-hidden">
        <span />
        <span />
        <span />
      </div>
      {/* The grid, with a dot on every crossing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle, #b4ac9f 1.25px, transparent 1.75px), linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "-19.5px -19.5px, 0 0, 0 0",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[100rem] px-6 pb-14 pt-12 md:px-12 md:pb-16 md:pt-16">
        <div
          className="vc-rise mb-6 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:mb-8"
        >
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
          </span>
          {tFooter("openToProjects")}
        </div>

        <h1
          className="m-0 flex max-w-[18ch] flex-col font-bold text-foreground"
          style={{
            fontSize: "clamp(48px, 7.4vw, 124px)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
          }}
        >
          <span className="block">
            {titleWords.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="vc-blur-in inline-block" style={delay(TITLE_START + i * WORD_STAGGER)}>
                  {word}
                </span>
              </Fragment>
            ))}
          </span>
          <span
            className="vc-blur-in vc-glint relative mt-4 block max-w-[30ch] overflow-hidden md:mt-6 md:max-w-[40ch]"
            style={{
              ...delay(claimDelay),
              fontSize: "clamp(1.25rem, 2.4vw, 2.25rem)",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.025em",
            }}
          >
            {/* A low orange highlighter stroke under the words, cloned on each
                wrapped line so it reads the same whatever the copy. */}
            <span
              className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(249 115 22 / 0.28) 0.32em, transparent 0.32em)",
                padding: "0 0.08em",
              }}
            >
              {t("titleLine2")}
            </span>
          </span>
        </h1>

        <div
          className="vc-rise mt-10 grid grid-cols-1 items-center gap-10 md:mt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16"
          style={delay(claimDelay + 80)}
        >
          <div>
            <p className="m-0 max-w-[620px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 lg:justify-end">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  href="https://www.ycombinator.com/companies/quivr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex transition-opacity hover:opacity-70"
                >
                  <Image
                    src="/images/partners/y-combinator.svg"
                    alt="Y Combinator W24"
                    width={154}
                    height={38}
                    className="h-9 w-auto"
                  />
                </a>
                <Image
                  src="/images/partners/france-2030.svg"
                  alt="France 2030"
                  width={52}
                  height={52}
                  className="h-12 w-auto"
                />
              </div>
            <a
              href={BOOKING_URL}
              {...bookingLocation("hero")}
              onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
              className="vc-shine relative isolate inline-flex items-center gap-3 overflow-hidden border-2 border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>
            </div>
          </div>
        </div>

        <div className="mt-4 flex lg:justify-end">
          <a
            href="#services"
            onClick={() => captureEvent("see_what_we_do_clicked")}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {t("seeWhatWeDo")}
          </a>
        </div>

        {canRun ? (
          <HeroRunner items={runnerItems} />
        ) : (
          /* Holds the panel's place from the server HTML so the game drops into
             a gap that already exists. Mounting it client-side only, with no
             placeholder, pushed the rest of the hero down after hydration. */
          <div aria-hidden="true" className="mt-8 hidden lg:block lg:mt-10 lg:h-[254px]" />
        )}

        <div className="mt-8 grid grid-cols-1 border-t border-border md:mt-10 md:grid-cols-3">
          {QUICK_ITEMS.map((item, i) => (
            <div
              key={item.n}
              data-reveal=""
              style={{ "--reveal-delay": `${i * 70}ms` } as CSSProperties}
              className="flex items-start gap-4 border-b border-border py-5 pr-6 last:border-b-0 md:border-b-0"
            >
              <span className="pt-1 font-mono text-[11px] tracking-[0.2em] text-orange-500">
                {item.n}
              </span>
              <div>
                <div className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                  {t(`items.${item.key}.label`)}
                </div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {t(`items.${item.key}.desc`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
