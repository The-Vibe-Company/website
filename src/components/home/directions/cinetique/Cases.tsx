"use client";

import { motion, useScroll, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";
import { DISPLAY } from "./font";

type T = (key: string) => string;

/**
 * One case as a full-height poster. On wide screens every poster pins under
 * the nav and the next one slides up over it, while the ones underneath shrink
 * back and darken, so the cases pile up like a stack of prints. Phones and
 * reduced motion get the same posters as a plain list.
 */
function CasePoster({
  c,
  index,
  total,
  progress,
  t,
}: {
  c: Customer;
  index: number;
  total: number;
  progress: MotionValue<number>;
  t: T;
}) {
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index - 1) * 0.045]);
  const shade = useTransform(progress, [start, Math.min(start + 1 / total, 1), 1], [0, 0.35, 0.6]);
  // The figure unfolds on the width axis as its poster slides into place.
  const metricStretch = useTransform(
    progress,
    [Math.max(start - 1 / total, 0), Math.max(start, 0.0001)],
    index === 0 ? ["64%", "64%"] : ["40%", "64%"],
  );

  return (
    <div className="md:sticky md:top-[84px] md:h-[calc(100vh-84px)] md:motion-reduce:static md:motion-reduce:h-auto">
      <motion.article
        style={{ scale, "--stack": `${index * 22}px` } as MotionStyle}
        className="relative mx-auto flex h-full origin-top motion-reduce:transform-none! md:top-[var(--stack)] md:motion-reduce:top-0 flex-col overflow-hidden border border-border bg-card md:max-h-[640px] md:translate-y-[4vh]"
      >
        {/* The posters underneath darken as the stack grows over them. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 z-10 bg-background motion-reduce:opacity-0!"
        />
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 md:px-10 md:py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={c.client}
            {...clientLogoSize(c.logo)}
            className="h-7 w-auto object-contain brightness-0 invert md:h-9"
            loading="lazy"
            decoding="async"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-8 px-6 py-7 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-14 md:px-10 md:py-10">
          <div className="flex min-w-0 flex-col justify-between gap-6">
            <span className="w-fit border border-border-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-soft-foreground">
              {c.sector}
            </span>
            {c.metric ? (
              <div className="[container-type:inline-size]">
                <motion.p
                  className={`${DISPLAY} m-0 text-balance text-[min(24cqw,240px)] font-extrabold uppercase leading-[0.8] tracking-[-0.02em] text-foreground motion-reduce:[font-stretch:64%]!`}
                  style={{ fontStretch: metricStretch }}
                >
                  {c.metric}
                </motion.p>
                <p className="m-0 mt-4 max-w-[34ch] text-[15px] leading-[1.45] text-muted-foreground md:text-base">
                  {c.metricLabel}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col justify-end gap-6 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <p className="m-0 text-[15px] leading-[1.6] text-foreground">{c.summary}</p>
            <ul className="m-0 hidden list-none flex-col gap-2.5 p-0 lg:flex">
              {c.points.slice(0, 3).map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-[1.5] text-muted-foreground">
                  <span aria-hidden="true" className="font-mono text-brand">→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/case-studies/${c.slug}?from=home`}
              className="group inline-flex w-fit items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground no-underline"
            >
              <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">{t("readCase")}</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Cases({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("caseStudy") as T;
  const customers = getCustomers(locale);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="cases" className="relative scroll-mt-24 bg-background">
      <div className="mx-auto max-w-[90rem] px-6 pt-20 md:px-10 md:pt-32 lg:px-16">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <BrandSquare />
          {t("kicker")}
        </span>
        <h2
          className={`${DISPLAY} m-0 mt-6 font-extrabold uppercase leading-[0.84] tracking-[-0.02em] text-foreground`}
          style={{ fontSize: "clamp(48px, 9vw, 150px)", fontStretch: "60%" }}
        >
          {t("titleLine1")}
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--foreground)] md:[-webkit-text-stroke:2px_var(--foreground)]">
            {t("titleLine2")}
          </span>
        </h2>
      </div>

      <div
        ref={ref}
        className="mx-auto mt-12 flex max-w-[90rem] flex-col gap-5 px-6 pb-20 md:mt-16 md:gap-0 md:px-10 md:pb-[12vh] lg:px-16 md:motion-reduce:gap-5"
      >
        {customers.map((c, i) => (
          <CasePoster key={c.slug} c={c} index={i} total={customers.length} progress={scrollYProgress} t={t} />
        ))}
      </div>

      <div className="mx-auto max-w-[90rem] px-6 pb-20 md:px-10 md:pb-28 lg:px-16">
        <Link
          href="/case-studies"
          className="group inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-brand no-underline"
        >
          {t("seeAll")}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    </section>
  );
}
