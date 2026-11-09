"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, type CSSProperties } from "react";
import { clientLogoSize } from "@/lib/client-logos";

type Token = { word: string; em: boolean };

/** "a <em>b c</em> d" → one token per word, flagged when inside <em>. */
function tokenize(raw: string): Token[] {
  return raw.split(/(<em>.*?<\/em>)/).flatMap((part) => {
    const em = part.startsWith("<em>");
    const text = em ? part.slice(4, -5) : part;
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, em }));
  });
}

/**
 * Monka's line in a dark room. As it scrolls through the screen a light
 * travels along it and the words come out of the dark one after another; the
 * words that sum the work up catch fire. With reduced motion it is all lit.
 */
export function NightQuote() {
  const t = useTranslations("quote");
  const tokens = tokenize(t.raw("text") as string);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!reduce) ref.current?.style.setProperty("--p", String(p));
  });

  const n = tokens.length;

  return (
    <section
      ref={ref}
      // Reduced motion: every word lit, by CSS, so the markup never differs.
      className="relative overflow-hidden bg-[#070707] py-28 [--p:0] motion-reduce:[--p:1] md:py-40"
      style={{ "--n": n } as CSSProperties}
    >
      {/* The light travelling along the line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 420px at calc(8% + var(--p) * 84%) 55%, rgb(242 115 19 / 0.16), rgb(242 115 19 / 0.05) 45%, transparent 75%)",
        }}
      />
      <figure className="relative m-0 mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <span
          aria-hidden="true"
          className="block font-[800] leading-[0.6] text-[#ff9a45] text-[clamp(6rem,14vw,12rem)] [text-shadow:0_0_40px_rgb(242_115_19/0.75),0_0_110px_rgb(242_115_19/0.4)]"
        >
          “
        </span>
        <blockquote className="m-0 mt-2 max-w-[22ch] text-[clamp(2rem,4.6vw,4.4rem)] font-[700] leading-[1.06] tracking-[-0.035em] md:max-w-[24ch]">
          {tokens.map((tok, i) => (
            <span key={i}>
              <span
                className={tok.em ? "text-[#ffb36b] [text-shadow:0_0_28px_rgb(242_115_19/0.55)]" : "text-foreground"}
                style={{
                  opacity: `clamp(0.2, calc(var(--p) * (var(--n) + 4) - ${i} + 0.5), 1)`,
                }}
              >
                {tok.word}
              </span>{" "}
            </span>
          ))}
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span aria-hidden="true" className="h-px w-10 bg-[#ffb36b]/60" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/clients/monka.webp"
            alt=""
            aria-hidden="true"
            {...clientLogoSize("/images/clients/monka.webp")}
            className="h-[22px] w-auto brightness-0 invert"
            loading="lazy"
            decoding="async"
          />
          {t("author")}
        </figcaption>
      </figure>
    </section>
  );
}
