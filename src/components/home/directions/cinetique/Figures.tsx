"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { cn } from "@/lib/design-system";
import { DISPLAY } from "./font";

/** Which published result to blow up, by case and position in its results. */
const PICKS = [
  { slug: "monka", index: 0 },
  { slug: "locservice", index: 0 },
  { slug: "afp", index: 2 },
  { slug: "afp", index: 0 },
] as const;

const COPY = {
  fr: { kicker: "EN CHIFFRES", title: "Ce qui est déjà en production." },
  en: { kicker: "BY THE NUMBERS", title: "What is already in production." },
};

/**
 * One figure across the full width. As it scrolls into view it unfolds along
 * the width axis, from squeezed to wide, and comes up out of the dark.
 */
function Figure({
  value,
  label,
  client,
  align,
}: {
  value: string;
  label: string;
  client: string;
  align: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const stretch = useTransform(scrollYProgress, [0, 1], ["52%", "122%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.12, 0.6, 1]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 border-t border-border py-8 md:flex-row md:items-end md:justify-between md:gap-10 md:py-12",
        align === "right" && "md:flex-row-reverse",
      )}
    >
      <motion.p
        style={{ fontStretch: stretch, opacity }}
        className={`${DISPLAY} m-0 whitespace-nowrap motion-reduce:opacity-100! motion-reduce:[font-stretch:110%]! text-[clamp(64px,13vw,210px)] font-extrabold leading-[0.8] tracking-[-0.03em] text-foreground`}
      >
        {value}
      </motion.p>
      <div className={cn("max-w-[22rem] md:pb-3", align === "right" ? "md:text-left" : "md:text-right")}>
        <p className="m-0 text-base leading-[1.45] text-soft-foreground md:text-lg">{label}</p>
        <p className="m-0 mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{client}</p>
      </div>
    </div>
  );
}

export function Figures({ locale }: { locale: ContentLocale }) {
  const customers = getCustomers(locale);
  const copy = COPY[locale];
  const figures = PICKS.flatMap(({ slug, index }) => {
    const customer = customers.find((c) => c.slug === slug);
    const stat = customer?.results[index];
    return customer && stat ? [{ key: `${slug}-${index}`, client: customer.client, ...stat }] : [];
  });

  return (
    <section aria-labelledby="cinetique-figures" className="overflow-hidden bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mb-10 flex items-baseline justify-between gap-6 md:mb-14">
          <h2 id="cinetique-figures" className="m-0 text-[22px] font-bold tracking-[-0.03em] text-foreground md:text-[32px]">
            {copy.title}
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">
            <span aria-hidden="true" className="mr-3 inline-block h-2 w-2 bg-brand" />
            {copy.kicker}
          </span>
        </div>
        {figures.map((f, i) => (
          <Figure key={f.key} value={f.value} label={f.label} client={f.client} align={i % 2 === 0 ? "left" : "right"} />
        ))}
        <div aria-hidden="true" className="border-t border-border" />
      </div>
    </section>
  );
}
