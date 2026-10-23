"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Fragment, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Bead, ButtonLink, LinkRim } from "@/components/kit";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
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

/**
 * The home hero, one layout from phone to desktop: the main piece of the page
 * (a clay slab with the orange rim light), then the runner on a black lacquer
 * band where there is a keyboard, then the three ways in as quiet pieces.
 */
export function Hero({ runnerItems }: { runnerItems: RunnerItem[] }) {
  // Server-side this is false, so the chunk is never even requested on a phone.
  const canRun = useSyncExternalStore(
    subscribeRunnerMedia,
    () => window.matchMedia(RUNNER_MEDIA).matches,
    () => false,
  );
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");

  return (
    <section id="hero" className="pt-3.5 md:pt-[22px]">
      <div className="wrap">
        <div
          className="clay rim rim-warm relative overflow-hidden rounded-[28px] px-5 pb-6 pt-7 md:rounded-slab md:px-14 md:pb-12 md:pt-14"
          style={{ "--rim-angle": "118deg", "--bead": "clamp(180px, 22vw, 300px)" } as React.CSSProperties}
        >
          {/* On a phone the bead floats in the top corner, so the kicker and the
              title run beside it instead of starting under it; a word with no
              room beside it drops below, never under the bead. */}
          <Bead className="rise pointer-events-none float-right -mr-1.5 -mt-3.5 mb-2 ml-2.5 h-auto w-[clamp(88px,27vw,104px)] [animation-delay:160ms] [animation-duration:900ms] md:absolute md:right-[clamp(32px,4.7vw,60px)] md:top-[34px] md:float-none md:m-0 md:w-[var(--bead)]" />

          <p className="kicker rise">
            <span aria-hidden="true" className="dot dot-rim" />
            <span>{tFooter("openToProjects")}</span>
          </p>
          {/* The title and the line under it stay off the bead: they take the
              room it leaves, and wrap word by word (never inside "IA-First")
              when there is less of it. */}
          {/* The page's one h1 carries both lines, the name and what we do,
              each set in its own size. */}
          <h1 className="m-0">
            <span className="display d-xl rise block [animation-delay:70ms] mt-5 max-w-[760px] md:mt-[34px] md:max-w-[min(760px,calc(100%-var(--bead)-24px))]">
              {t("titleLine1")
                .split(" ")
                .map((word, i) => (
                  <Fragment key={i}>
                    {i > 0 ? " " : null}
                    <span className="whitespace-nowrap">{word}</span>
                  </Fragment>
                ))}
            </span>
            <span className="rise mt-4 block [animation-delay:150ms] max-w-[820px] md:max-w-[min(820px,calc(100%-var(--bead)-24px))] text-[22px] font-medium leading-[1.12] tracking-[-0.018em] text-ink md:mt-[26px] md:text-[36px]">
              {t("titleLine2")}
            </span>
          </h1>

          <div className="rise mt-7 grid gap-[22px] [animation-delay:240ms] md:mt-[52px] lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end lg:gap-10">
            <p className="lede-bar m-0 text-[16.5px] md:text-[18.5px]">{t("subtitle")}</p>

            <div className="flex gap-2">
              <a
                href="https://www.ycombinator.com/companies/quivr"
                target="_blank"
                rel="noopener noreferrer"
                className="well inline-flex h-11 items-center whitespace-nowrap rounded-2xl px-1.5 transition-[filter] duration-200 hover:brightness-105 md:h-[52px] md:px-2"
              >
                <Image
                  src="/images/partners/y-combinator.svg"
                  alt="Y Combinator W24"
                  width={154}
                  height={38}
                  className="h-8 w-auto rounded-lg md:h-9"
                />
              </a>
              <span className="well inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl pl-1.5 pr-3 md:h-[52px] md:gap-2.5 md:pl-2 md:pr-4">
                <Image
                  src="/images/partners/france-2030.svg"
                  alt=""
                  width={34}
                  height={34}
                  className="h-[30px] w-[30px] md:h-[34px] md:w-[34px]"
                />
                <span className="text-[13.5px] font-semibold leading-none">France 2030</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 lg:flex-col lg:items-end lg:justify-start lg:gap-1">
              <ButtonLink
                href={BOOKING_URL}
                size="lg"
                arrow
                {...bookingLocation("hero")}
                onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
                className="min-w-[210px] flex-1 lg:flex-none"
              >
                {t("bookCall")}
              </ButtonLink>
              <LinkRim
                href="/case-studies"
                arrow={false}
                onClick={() => captureEvent("see_what_we_do_clicked")}
              >
                {t("seeWhatWeDo")}
              </LinkRim>
            </div>
          </div>
        </div>

        {/* The panel's place is held from the server HTML, and kept while the
            game's chunk loads: the wrapper never goes away, so the game drops
            into a gap that already exists instead of pulling the page up and
            pushing it back down. */}
        <div aria-hidden={canRun ? undefined : true} className="rise mt-4 hidden [animation-delay:320ms] lg:block lg:min-h-[264px]">
          {canRun ? <HeroRunner items={runnerItems} /> : null}
        </div>

        <ul className="m-0 mt-2.5 grid list-none gap-2.5 p-0 md:grid-cols-3 md:gap-4 lg:mt-4">
          {QUICK_ITEMS.map((item, i) => (
            <li
              key={item.n}
              style={{ animationDelay: `${380 + i * 90}ms` }}
              className="rise clay-quiet flex items-start gap-4 rounded-piece p-[18px] md:px-6 md:py-[22px]"
            >
              <span className="num">{item.n}</span>
              <div className="min-w-0">
                <p className="m-0 text-[22px] font-semibold leading-tight tracking-[-0.02em]">
                  {t(`items.${item.key}.label`)}
                </p>
                <p className="m-0 mt-1 text-[15px] leading-[1.45] text-muted-foreground">
                  {t(`items.${item.key}.desc`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
