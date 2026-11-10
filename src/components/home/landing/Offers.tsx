"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandSquare } from "@/components/BrandSquare";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";

const KEYS = ["build", "operate", "advise"] as const;

/**
 * The three offers side by side, read at the reader's own pace: no pinned
 * scroll, no pictures, each offer under the same warm lamp as the cases.
 */
export function Offers() {
  const t = useTranslations("services");
  const tParis = useTranslations("agencyParis");
  const locale = useLocale();
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="offres" aria-labelledby="offres-title" className="bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          <BrandSquare />
          {t("kicker")}
        </span>
        <h2
          id="offres-title"
          className="m-0 mt-6 text-[clamp(2.75rem,6.4vw,6rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground"
        >
          {t("titleLine1")}
          <br />
          <span className="text-lit">{t("titleLine2")}</span>
        </h2>

        <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-3">
          {KEYS.map((k, i) => {
            const bullets = t.raw(`items.${k}.bullets`) as string[];
            return (
              <motion.li
                key={k}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                // Side by side, the cards share the row tracks (header, title,
                // intro, list), so a longer intro no longer pushes one card's
                // rule and list below its neighbours'.
                className="relative flex flex-col overflow-hidden border border-border p-7 md:p-9 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-0 lamp-card"
              >
                <span aria-hidden="true" className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]" />
                <div className="relative flex items-baseline justify-between gap-4">
                  <span className="text-[56px] font-bold leading-none tracking-[-0.05em] text-lit">0{i + 1}</span>
                  <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t(`items.${k}.tag`)}
                  </span>
                </div>
                <h3 className="relative m-0 mt-10 text-[clamp(1.6rem,2.2vw,2.1rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                  {t(`items.${k}.title`)}
                </h3>
                <p className="relative m-0 mt-4 text-[16px] leading-[1.6] text-soft-foreground">{t(`items.${k}.desc`)}</p>
                <ul className="relative m-0 mt-7 flex list-none flex-col gap-2.5 border-t border-border p-0 pt-6">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[14px] leading-[1.5] text-muted-foreground">
                      <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-brand" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>

        {/* Tells search engines which page carries the "agency in Paris" query. */}
        <Link
          href={splitPath(AGENCY_PARIS_PATHS, locale)}
          className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
        >
          {tParis("homeLink")} →
        </Link>
      </div>
    </section>
  );
}
