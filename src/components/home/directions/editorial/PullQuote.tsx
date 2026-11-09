"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { clientLogoSize } from "@/lib/client-logos";
import { SERIF } from "./fonts";

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

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={token.em ? "text-brand" : undefined}>
        {token.word}
      </motion.span>{" "}
    </>
  );
}

/**
 * Monka's line, set across the page in the serif italic. The words light up
 * one after another as the quote scrolls through the screen, as if read aloud;
 * with reduced motion it is simply all there.
 */
export function PullQuote() {
  const t = useTranslations("quote");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const tokens = tokenize(t.raw("text") as string);

  return (
    <section ref={ref} className="relative mx-auto max-w-[90rem] overflow-hidden px-6 md:px-10 lg:px-16">
      <div className="border-t border-border py-24 md:py-32 lg:py-40">
        <figure className="relative m-0 lg:pl-[15.5rem]">
          <span
            aria-hidden="true"
            className={`${SERIF} pointer-events-none absolute -top-16 left-0 select-none text-[180px] leading-none text-brand md:-top-24 md:text-[260px] lg:left-[9rem]`}
          >
            “
          </span>
          <blockquote className={`${SERIF} relative m-0 text-[clamp(34px,5.2vw,86px)] leading-[1.04] tracking-[-0.02em] text-foreground`}>
            {reduce ? (
              <span>{t.rich("text", { em: (chunks) => <span className="text-brand">{chunks}</span> })}</span>
            ) : (
              <>
                <span className="sr-only">{t.rich("text", { em: (chunks) => chunks })}</span>
                <span aria-hidden="true">
                  {tokens.map((token, i) => {
                    const start = (i / tokens.length) * 0.85;
                    return (
                      <Word
                        key={`${token.word}-${i}`}
                        token={token}
                        progress={scrollYProgress}
                        range={[start, start + 0.15]}
                      />
                    );
                  })}
                </span>
              </>
            )}
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-12 bg-border-strong" />
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
      </div>
    </section>
  );
}
