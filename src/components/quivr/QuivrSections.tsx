import { getTranslations } from "next-intl/server";

import { ButtonLink, Groove, Kicker, SectionTitle } from "@/components/kit";
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
 * engine works (one animated diagram), what The Vibe Company does around it
 * (the page's one dark piece), and the FAQ. Same wrap and kickers as the
 * template above it. Every fact comes from the Quivr README or
 * docs.quivr.thevibecompany.co.
 */

/**
 * A title in two lines, the second in grey clay: split after the first
 * sentence ("Tout entre. / Rien ne se perd."), or in the middle of the words.
 */
function twoLines(title: string): [string, string?] {
  const sentence = title.match(/^(.+?[.!?])\s+(.+)$/);
  if (sentence) return [sentence[1], sentence[2]];
  const words = title.split(" ");
  if (words.length < 2) return [title];
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export async function QuivrSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "quivr" });
  const tCta = await getTranslations({ locale, namespace: "finalCta" });
  const [flow1, flow2] = twoLines(t("diagrams.flow.title"));
  const [services1, services2] = twoLines(t("services.title"));
  const [faq1, faq2] = twoLines(t("faq.title"));

  return (
    <>
      <section className="section">
        <div className="wrap">
          <SectionTitle
            kicker={t("diagrams.flow.kicker")}
            line1={flow1}
            line2={flow2}
            size="sm"
          >
            <p className="m-0">{t("diagrams.flow.caption")}</p>
          </SectionTitle>
          <div className="mt-10 md:mt-14">
            <FlowDiagram />
          </div>
        </div>
      </section>

      <section id={QUIVR_SERVICES_ID} className="section scroll-mt-24">
        <div className="wrap">
          <div
            data-surface="inverse"
            className="lacquer rim rounded-[28px] px-5 py-8 [--rim-angle:122deg] md:rounded-slab md:px-14 md:py-14"
          >
            <Kicker>{t("services.kicker")}</Kicker>
            <h2 className="display d-sm m-0 mt-5">
              {services1}
              {services2 ? (
                <>
                  <br />
                  <span className="text-on-lacquer-muted">{services2}</span>
                </>
              ) : null}
            </h2>
            <p className="m-0 mt-6 max-w-[54ch] text-[17px] leading-[1.5] text-on-lacquer-muted md:text-lg">
              {t("services.intro")}
            </p>

            <ol className="m-0 mt-10 grid list-none grid-cols-1 p-0 md:mt-12 md:grid-cols-3">
              {QUIVR_SERVICE_KEYS.map((key, i) => (
                <li
                  key={key}
                  className="border-t border-white/15 py-6 md:py-7 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-orange-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display m-0 mt-3 text-[24px] leading-[1.05] md:text-[28px]">
                    {t(`services.items.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-2 max-w-[34ch] text-[15px] leading-[1.5] text-on-lacquer-muted">
                    {t(`services.items.${key}.caption`)}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-4 md:mt-6">
              <ButtonLink
                href={QUIVR_BOOKING_URL}
                size="lg"
                arrow
                className="w-full md:w-auto"
                {...bookingLocation("quivr_services")}
              >
                {tCta("bookCall")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Plain <details>, so every answer is in the HTML and works without
          JavaScript. */}
      <section className="section">
        <div className="wrap">
          <SectionTitle kicker="FAQ" line1={faq1} line2={faq2} size="sm" />
          <Groove className="mt-10 md:mt-12" />
          <div className="rows">
            {QUIVR_FAQ_KEYS.map((key) => (
              <details key={key} className="group">
                <summary className="group/q flex list-none items-center justify-between gap-6 py-5 text-[18px] font-semibold leading-[1.25] tracking-[-0.01em] text-foreground marker:hidden md:text-[20px] [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.${key}.q`)}
                  <span
                    aria-hidden="true"
                    className="well grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition duration-300 group-open:rotate-45 group-hover/q:bg-clay"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <path
                        d="M12 5v14M5 12h14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="m-0 max-w-[60ch] pb-6 text-base leading-[1.6] text-muted-foreground">
                  {t(`faq.items.${key}.a`)}
                </p>
              </details>
            ))}
          </div>
          <Groove />
        </div>
      </section>
    </>
  );
}
