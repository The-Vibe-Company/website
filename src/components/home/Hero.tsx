"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink, LinkRim } from "@/components/kit";
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
 * The mascot's head as a white clay bead: the black swept-back pattern painted
 * on top, a soft specular, and the orange rim light along its far edge. Pure
 * decoration, drawn here because it exists nowhere else on the site. Gradient
 * ids carry a prefix so they never meet another inline svg's.
 */
function Bead({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 340 360" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hb-bd" gradientUnits="userSpaceOnUse" cx="129" cy="101" r="232">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".42" stopColor="#f8f8f6" />
          <stop offset=".8" stopColor="#e2e2de" />
          <stop offset="1" stopColor="#cdcdc8" />
        </radialGradient>
        <linearGradient id="hb-lac" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#202022" />
          <stop offset=".6" stopColor="#0a0a0b" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id="hb-spec">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hb-cs">
          <stop offset="0" stopColor="#141416" stopOpacity=".26" />
          <stop offset="1" stopColor="#141416" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hb-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a1f" stopOpacity="0" />
          <stop offset=".3" stopColor="#ff7a1f" />
          <stop offset=".62" stopColor="#ffb46e" />
          <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
        </linearGradient>
        <clipPath id="hb-clip">
          <circle cx="170" cy="165" r="145" />
        </clipPath>
        <filter id="hb-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="184" cy="326" rx="122" ry="14" fill="url(#hb-cs)" />
      <circle cx="170" cy="165" r="145" fill="url(#hb-bd)" />
      <g clipPath="url(#hb-clip)">
        <path
          fill="url(#hb-lac)"
          d="M-10 -10 H350 V40 L320 42 Q312 38 306 36 Q302 72 286 98 Q274 80 260 70 Q252 106 232 132 Q216 108 200 96 Q192 132 170 158 Q148 132 140 96 Q124 108 108 132 Q88 106 80 70 Q66 80 54 98 Q38 72 34 36 Q28 38 20 42 L-10 40 Z"
        />
        <g fill="none" stroke="url(#hb-bd)" strokeWidth="7" strokeLinecap="round">
          <path d="M190 -4 Q196 50 200 96" />
          <path d="M150 -4 Q144 50 140 96" />
          <path d="M212 -4 Q248 30 260 70" />
          <path d="M128 -4 Q92 30 80 70" />
          <path d="M236 -6 Q292 8 306 36" />
          <path d="M104 -6 Q48 8 34 36" />
        </g>
      </g>
      <g clipPath="url(#hb-clip)">
        <ellipse cx="116" cy="74" rx="58" ry="26" transform="rotate(-28 116 74)" fill="url(#hb-spec)" opacity=".55" />
        <ellipse cx="108" cy="66" rx="15" ry="7" transform="rotate(-28 108 66)" fill="#fff" opacity=".75" />
      </g>
      <path
        d="M242 40.3 A144 144 0 0 1 98 289.7"
        fill="none"
        stroke="url(#hb-rim)"
        strokeWidth="7"
        opacity=".45"
        filter="url(#hb-soft)"
      />
      <path d="M242 40.3 A144 144 0 0 1 98 289.7" fill="none" stroke="url(#hb-rim)" strokeWidth="2.4" />
    </svg>
  );
}

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
      {/* Marks the page as the one with the phone booking bar: the kit keeps
          focus and in-page jumps clear of it from this id. */}
      <span id="hero-mobile" hidden />
      <div className="wrap">
        <div
          className="clay rim rim-warm relative overflow-hidden rounded-[28px] px-5 pb-6 pt-7 md:rounded-slab md:px-14 md:pb-12 md:pt-14"
          style={{ "--rim-angle": "118deg" } as React.CSSProperties}
        >
          <Bead className="pointer-events-none absolute right-3.5 top-3.5 h-[110px] w-[104px] md:right-[60px] md:top-[34px] md:h-[318px] md:w-[300px]" />

          <p className="kicker">
            <span aria-hidden="true" className="dot dot-rim" />
            <span>{tFooter("openToProjects")}</span>
          </p>
          <h1 className="display d-xl rise m-0 mt-[92px] max-w-[760px] md:mt-[34px]">
            {t("titleLine1")}
          </h1>
          <p className="rise m-0 mt-4 max-w-[820px] text-[22px] font-medium leading-[1.12] tracking-[-0.018em] text-ink md:mt-[26px] md:text-[36px]">
            {t("titleLine2")}
          </p>

          <div className="mt-7 grid gap-[22px] md:mt-[52px] lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end lg:gap-10">
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
        <div aria-hidden={canRun ? undefined : true} className="mt-4 hidden lg:block lg:min-h-[264px]">
          {canRun ? <HeroRunner items={runnerItems} /> : null}
        </div>

        <ul className="m-0 mt-2.5 grid list-none gap-2.5 p-0 md:grid-cols-3 md:gap-4 lg:mt-4">
          {QUICK_ITEMS.map((item) => (
            <li
              key={item.n}
              className="clay-quiet flex items-start gap-4 rounded-piece p-[18px] md:px-6 md:py-[22px]"
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
