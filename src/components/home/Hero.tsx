"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { captureEvent } from "@/lib/posthog";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
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

export function Hero({ runnerItems }: { runnerItems: RunnerItem[] }) {
  // Server-side this is false, so the chunk is never even requested on a phone.
  const canRun = useSyncExternalStore(
    subscribeRunnerMedia,
    () => window.matchMedia(RUNNER_MEDIA).matches,
    () => false,
  );
  const reduceMotion = useReducedMotion() ?? false;
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b-2 border-foreground bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[100rem] px-6 pb-14 pt-12 md:px-12 md:pb-16 md:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="m-0 flex max-w-[18ch] flex-col font-bold text-foreground"
          style={{
            fontSize: "clamp(48px, 7.4vw, 124px)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
          }}
        >
          <span className="block">
            {t("titleLine1")}
          </span>
          <span
            className="mt-4 block max-w-[30ch] md:mt-6 md:max-w-[40ch]"
            style={{
              fontSize: "clamp(1.25rem, 2.4vw, 2.25rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
            }}
          >
            {t("titleLine2")}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-12 grid grid-cols-1 items-end gap-10 md:mt-14 md:grid-cols-[1.4fr_1fr] md:gap-12"
        >
          <div>
            <p className="m-0 max-w-[620px] text-lg leading-[1.5] text-foreground md:text-[19px]">
              {t("subtitle")}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
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
          </div>

          <div className="flex flex-col items-start gap-3">
            <a
              href="https://cal.com/stangirard/30min"
              onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
              className="inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>
            <a
              href="#services"
              onClick={() => captureEvent("see_what_we_do_clicked")}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {t("seeWhatWeDo")}
            </a>
          </div>
        </motion.div>

        {canRun ? (
          <HeroRunner items={runnerItems} />
        ) : (
          /* Holds the panel's place from the server HTML so the game drops into
             a gap that already exists. Mounting it client-side only, with no
             placeholder, pushed the rest of the hero down after hydration. */
          <div aria-hidden="true" className="mt-8 hidden lg:block lg:mt-10 lg:h-[254px]" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-8 grid grid-cols-1 border-t border-border md:mt-10 md:grid-cols-3"
        >
          {QUICK_ITEMS.map((item) => (
            <div
              key={item.n}
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
        </motion.div>
      </div>

    </section>
  );
}
