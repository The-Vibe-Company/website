"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandSquare } from "@/components/BrandSquare";
import { clientLogoSize } from "@/lib/client-logos";
import { getCustomers } from "@/lib/customers";
import { cn } from "@/lib/design-system";
import { FitText } from "../FitText";

/** Grid placement: the two biggest stories get the wide benches. */
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

/**
 * The client work as lit benches: each case under its own warm lamp, the
 * figure first, the lamp turning up when you point at it.
 */
export function Workbench() {
  const t = useTranslations("caseStudy");
  const locale = useLocale() === "en" ? "en" : "fr";
  const reduceMotion = useReducedMotion() ?? false;
  const cases = getCustomers(locale).slice(0, 5);

  return (
    <section aria-labelledby="cas-clients-title" className="bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h2
              id="cas-clients-title"
              className="m-0 mt-6 text-[clamp(2.75rem,6.4vw,6rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground"
            >
              {t("titleLine1")}
              <br />
              <span className="text-lit">{t("titleLine2")}</span>
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
          >
            {t("seeAll")} →
          </Link>
        </div>

        <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-6">
          {cases.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(SPANS[i], i === 0 && "md:col-span-2 lg:col-span-3")}
            >
              <Link
                href={`/case-studies/${c.slug}?from=home`}
                className={cn("group relative flex h-full min-h-[22rem] flex-col overflow-hidden border border-border p-7 no-underline transition-colors hover:border-brand/50 md:p-9 lamp-card")}
              >
                {/* The lamp itself, a small warm bulb at the top edge. */}
                <span aria-hidden="true" className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]" />
                <div className="relative flex items-start justify-between gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.logo}
                    alt={c.client}
                    {...clientLogoSize(c.logo)}
                    className={`h-7 w-auto object-contain md:h-8 logo-tone`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="max-w-[14rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                    {c.sector}
                  </span>
                </div>
                <div className="relative mt-auto pt-14">
                  {/* One line whatever its length: the figure is fitted to the
                      card's width, capped so a short one does not balloon. */}
                  <p className="m-0 font-bold leading-[0.95] text-foreground [container-type:inline-size]">
                    <FitText max={88} trackingEm={-0.05} className="transition-none">
                      {c.metric ?? ""}
                    </FitText>
                  </p>
                  <p className="m-0 mt-3 max-w-[28rem] text-[15px] leading-[1.5] text-soft-foreground">{c.metricLabel}</p>
                  <span className="mt-7 inline-flex font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                    {t("readCase")}
                    <span aria-hidden="true" className="ml-2 text-brand transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
