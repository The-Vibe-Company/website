import { getTranslations } from "next-intl/server";

import { bookingLocation } from "@/lib/booking";
import {
  QUIVR_BOOKING_URL,
  QUIVR_FAQ_KEYS,
  QUIVR_SERVICE_KEYS,
  QUIVR_SERVICES_ID,
} from "@/lib/quivr";

import { FlowDiagram } from "./QuivrDiagrams";

/**
 * What the Quivr project page adds under the shared project template: how the
 * engine works (one animated diagram), what The Vibe Company does around it,
 * and the FAQ. Same rail and `//` kickers as the template above it. Every
 * fact comes from the Quivr README or docs.quivr.thevibecompany.co.
 */

const RAIL = "mx-auto max-w-[80rem] px-6 md:px-12";
const KICKER = "mb-6 block font-mono text-xs uppercase tracking-[0.2em]";
const H2 =
  "m-0 max-w-[22ch] text-[34px] font-bold leading-[0.95] tracking-[-0.04em] md:text-[52px]";

export async function QuivrSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "quivr" });

  return (
    <>
      <section className="border-t border-border">
        <div className={`${RAIL} py-16 md:py-20`}>
          <span className={`${KICKER} text-muted-foreground`}>
            {`// ${t("diagrams.flow.kicker")}`}
          </span>
          <h2 className={`${H2} text-foreground`}>{t("diagrams.flow.title")}</h2>
          <p className="m-0 mt-4 max-w-[560px] text-base leading-[1.6] text-muted-foreground">
            {t("diagrams.flow.caption")}
          </p>
          <div className="mt-10 md:mt-14">
            <FlowDiagram />
          </div>
        </div>
      </section>

      <section
        id={QUIVR_SERVICES_ID}
        data-surface="inverse"
        className="scroll-mt-16 bg-foreground text-background"
      >
        <div className={`${RAIL} py-16 md:py-20`}>
          <span className={`${KICKER} text-white/55`}>{`// ${t("services.kicker")}`}</span>
          <h2 className={`${H2} text-background`}>{t("services.title")}</h2>
          <p className="m-0 mt-4 max-w-[560px] text-base leading-[1.6] text-white/70">
            {t("services.intro")}
          </p>

          <ol className="m-0 mt-10 grid list-none grid-cols-1 gap-px border border-white/15 bg-white/15 p-0 md:mt-12 md:grid-cols-3">
            {QUIVR_SERVICE_KEYS.map((key, i) => (
              <li key={key} className="bg-foreground p-6 md:p-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 mt-4 text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[24px]">
                  {t(`services.items.${key}.title`)}
                </h3>
                <p className="m-0 mt-2 text-[15px] leading-[1.5] text-white/65">
                  {t(`services.items.${key}.caption`)}
                </p>
              </li>
            ))}
          </ol>

          <a
            href={QUIVR_BOOKING_URL}
            {...bookingLocation("quivr_services")}
            className="mt-10 inline-flex items-center gap-3 border-2 border-background bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(255,255,255,0.35)]"
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
      <section className={`${RAIL} py-16 md:py-20`}>
        <span className={`${KICKER} text-muted-foreground`}>{"// FAQ"}</span>
        <h2 className={`${H2} text-foreground`}>{t("faq.title")}</h2>
        <div className="mt-10 border-t-2 border-foreground md:mt-12">
          {QUIVR_FAQ_KEYS.map((key) => (
            <details key={key} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground marker:hidden md:text-[20px] [&::-webkit-details-marker]:hidden">
                {t(`faq.items.${key}.q`)}
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground font-mono text-lg leading-none transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="m-0 max-w-[72ch] pb-6 text-base leading-[1.6] text-muted-foreground">
                {t(`faq.items.${key}.a`)}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
