"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

/** One word of the quote, lit as the reading line reaches it. */
function Word({
  word,
  index,
  total,
  progress,
  emphasis,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  emphasis: boolean;
}) {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={`motion-reduce:opacity-100! ${emphasis ? "text-brand" : ""}`}>
      {word}{" "}
    </motion.span>
  );
}

/**
 * The client quote, read at the pace of the scroll: every word starts as a
 * ghost and lights up as the page carries it past, the phrase that sums the
 * work up in orange. Reduced motion shows it lit from the start (CSS).
 */
export function Quote() {
  const t = useTranslations("quote");
  const ref = useRef<HTMLQuoteElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });

  // "a <em>b c</em> d" -> words tagged with whether they sit inside the emphasis.
  const raw = t.raw("text") as string;
  const words = raw
    .split(/(<em>|<\/em>)/)
    .reduce<{ emphasis: boolean; words: { word: string; emphasis: boolean }[] }>(
      (acc, part) => {
        if (part === "<em>") return { ...acc, emphasis: true };
        if (part === "</em>") return { ...acc, emphasis: false };
        part
          .split(/\s+/)
          .filter(Boolean)
          .forEach((word) => acc.words.push({ word, emphasis: acc.emphasis }));
        return acc;
      },
      { emphasis: false, words: [] },
    ).words;

  return (
    <section className="border-y border-border bg-background">
      <figure className="mx-auto m-0 max-w-[90rem] px-6 py-20 md:px-10 md:py-32 lg:px-16">
        <blockquote
          ref={ref}
          className="m-0 max-w-[24ch] text-[clamp(30px,4.6vw,72px)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground"
        >
          <span aria-hidden="true" className="font-mono text-brand">« </span>
          {words.map(({ word, emphasis }, i) => (
            <Word key={i} word={word} index={i} total={words.length} progress={scrollYProgress} emphasis={emphasis} />
          ))}
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/clients/monka.webp"
            alt=""
            aria-hidden="true"
            width={600}
            height={210}
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
