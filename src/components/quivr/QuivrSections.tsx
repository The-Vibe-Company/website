import { getTranslations } from "next-intl/server";

import { bookingLocation } from "@/lib/booking";
import {
  QUIVR_BOOKING_URL,
  QUIVR_FAQ_KEYS,
  QUIVR_MEDIAGEN_SOURCE,
  QUIVR_SERVICE_KEYS,
  QUIVR_SERVICES_ID,
} from "@/lib/quivr";

import { QuivrBento } from "./QuivrBento";
import { BrandSquare } from "@/components/BrandSquare";

/**
 * What the Quivr project page adds under the shared project template: how the
 * engine works (a feature grid, QuivrBento) on the paper the template's
 * product shot sits on, what The Vibe Company does around it in an ink band
 * lit in orange, and the FAQ back on paper. Same rail and kickers (opened by
 * the orange square) as the template above it. Every fact comes from the
 * Quivr README or docs.quivr.thevibecompany.co.
 */

const RAIL = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${RAIL} py-20 md:py-28 lg:py-32`;
const KICKER = "mb-6 block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground";
const H2 =
  "m-0 max-w-[18ch] font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
const PROSE = "m-0 max-w-[620px] text-[15px] leading-[1.6] text-muted-foreground md:text-base";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

export async function QuivrSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "quivr" });

  return (
    <>
      {/* Continues the paper of the product shot above. */}
      <div data-surface="paper">
        <section className={`${BAND} border-t border-border`}>
          <span className={KICKER}>
            <BrandSquare />
            {t("features.kicker")}
          </span>
          <h2 className={H2}>{t("features.title")}</h2>
          <p className={`${PROSE} mt-6`}>{t("features.caption")}</p>
          <div className="mt-12 md:mt-16">
            <QuivrBento locale={locale} />
          </div>
          {/* The one line naming MediaGen and AFP, with its source. */}
          <p className="m-0 mt-6 max-w-[720px] text-[15px] leading-[1.6] text-muted-foreground">
            {t("features.mediagen.text")}{" "}
            <a
              href={QUIVR_MEDIAGEN_SOURCE[locale === "en" ? "en" : "fr"]}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
            >
              {t("features.mediagen.link")}
            </a>
          </p>
        </section>
      </div>

      {/* What we do around it: an ink band in the orange light, each offer
          under its lamp. */}
      <section id={QUIVR_SERVICES_ID} className="relative scroll-mt-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)",
          }}
        />
        <div className={`relative ${BAND}`}>
          <span className={KICKER}>
            <BrandSquare />
            {t("services.kicker")}
          </span>
          <h2 className={H2}>{t("services.title")}</h2>
          <p className={`${PROSE} mt-6`}>{t("services.intro")}</p>

          <ol className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-16 md:grid-cols-3">
            {QUIVR_SERVICE_KEYS.map((key, i) => (
              <li key={key} className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9">
                <span aria-hidden="true" className={LAMP} />
                <span className="relative text-lit text-[56px] font-bold leading-none tracking-[-0.05em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative m-0 mt-10 text-[clamp(1.5rem,2vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                  {t(`services.items.${key}.title`)}
                </h3>
                <p className="relative m-0 mt-3 text-[15px] leading-[1.55] text-soft-foreground">
                  {t(`services.items.${key}.caption`)}
                </p>
              </li>
            ))}
          </ol>

          <a
            href={QUIVR_BOOKING_URL}
            {...bookingLocation("quivr_services")}
            className="mt-12 inline-flex items-center gap-3 rounded-[2px] border border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-colors duration-300 hover:border-soft-foreground hover:bg-soft-foreground md:px-7 md:py-5 md:text-[17px]"
          >
            {t("services.cta")}
            <span aria-hidden="true" className="text-lg leading-none">
              →
            </span>
          </a>
        </div>
      </section>

      {/* Plain <details>, so every answer is in the HTML and works without
          JavaScript. */}
      <div data-surface="paper">
        <section className={BAND}>
          <span className={KICKER}>
            <BrandSquare />
            FAQ
          </span>
          <h2 className={H2}>{t("faq.title")}</h2>
          <div className="mt-12 border-t border-border md:mt-16">
            {QUIVR_FAQ_KEYS.map((key) => (
              <details key={key} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground marker:hidden md:py-7 md:text-[22px] [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.${key}.q`)}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-border-strong font-mono text-lg leading-none transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="m-0 max-w-[72ch] pb-7 text-base leading-[1.6] text-muted-foreground">
                  {t(`faq.items.${key}.a`)}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
