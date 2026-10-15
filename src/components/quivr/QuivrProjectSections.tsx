import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { bookingLocation } from "@/lib/booking";
import {
  formatStarsCompact,
  QUIVR_BENEFIT_KEYS,
  QUIVR_BOOKING_URL,
  QUIVR_DOCS_URL,
  QUIVR_EXAMPLE_STEPS,
  QUIVR_HELP_KEYS,
  QUIVR_QUICKSTART_URL,
  QUIVR_REPO_URL,
  QUIVR_SERVICES_ID,
  QUIVR_STORY_ARTICLE_PATH,
  QUIVR_TECH_KEYS,
  QUIVR_V1_URL,
} from "@/lib/quivr";

/**
 * The few sections the Quivr project page adds to the shared project
 * template (src/app/[locale]/portfolio/[slug]/page.tsx). Plain words first;
 * the technical vocabulary stays in the block at the bottom.
 */

const SECTION = "mx-auto max-w-[80rem] px-6 md:px-12";
const KICKER =
  "mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Three benefits and one usage example, right under the project header. */
export async function QuivrIntroSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "quivr" });

  return (
    <section className={`${SECTION} pt-16 md:pt-20`}>
      <span className={KICKER}>{t("benefits.kicker")}</span>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {QUIVR_BENEFIT_KEYS.map((key, i) => (
          <article key={key} className="flex flex-col border border-foreground bg-background p-7">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="m-0 mt-5 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[24px]">
              {t(`benefits.items.${key}.title`)}
            </h2>
            <p className={`${PROSE} mt-3`}>{t(`benefits.items.${key}.desc`)}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 border-t-2 border-foreground pt-8 md:mt-20 md:grid-cols-[minmax(0,280px)_1fr] md:gap-12">
        <div>
          <span className={KICKER}>{t("example.kicker")}</span>
          <h2 className="m-0 text-[28px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[32px]">
            {t("example.title")}
          </h2>
        </div>
        <ol className="m-0 list-none p-0">
          {QUIVR_EXAMPLE_STEPS.map((step, i) => (
            <li
              key={step}
              className="grid grid-cols-[32px_1fr] gap-3 border-b border-border py-4 first:pt-0 last:border-b-0 md:py-5"
            >
              <span className="pt-0.5 font-mono text-xs tracking-[0.1em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[16px] leading-[1.5] text-foreground md:text-[17px]">
                {t(`example.steps.${step}`)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** How we help, the honest status, V1, then the technical block. */
export async function QuivrDetailSections({
  locale,
  stars,
}: {
  locale: string;
  stars: number | null;
}) {
  const t = await getTranslations({ locale, namespace: "quivr" });

  return (
    <>
      <section
        id={QUIVR_SERVICES_ID}
        data-surface="inverse"
        className="scroll-mt-16 border-y-2 border-foreground bg-foreground text-background"
      >
        <div className={`${SECTION} py-16 md:py-20`}>
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-white/55">
            {t("help.kicker")}
          </span>
          <h2 className="m-0 max-w-[20ch] text-[clamp(30px,4.4vw,52px)] font-bold leading-[0.98] tracking-[-0.04em] text-background">
            {t("help.title")}
          </h2>
          <p className="m-0 mt-5 max-w-[640px] text-[15px] leading-[1.6] text-white/70 md:text-base">
            {t("help.intro")}
          </p>
          <ul className="m-0 mt-8 flex list-none flex-col p-0">
            {QUIVR_HELP_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-baseline gap-3 border-b border-white/15 py-4 text-[17px] font-semibold text-background last:border-b-0 md:text-lg"
              >
                <span aria-hidden="true" className="font-mono text-orange-400">
                  →
                </span>
                {t(`help.items.${key}`)}
              </li>
            ))}
          </ul>
          <a
            href={QUIVR_BOOKING_URL}
            {...bookingLocation("quivr_help")}
            className="mt-10 inline-flex items-center gap-3 border-2 border-background bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(255,255,255,0.35)] md:px-7 md:py-5 md:text-[17px]"
          >
            {t("help.cta")}
            <span aria-hidden="true" className="text-lg leading-none">
              →
            </span>
          </a>
        </div>
      </section>

      <section className={`${SECTION} py-16 md:py-20`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="border border-foreground p-7">
            <span className={KICKER}>{t("status.kicker")}</span>
            <h2 className="m-0 flex items-center gap-3 text-[24px] font-bold tracking-[-0.03em] text-foreground md:text-[28px]">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              {t("status.title")}
            </h2>
            <p className={`${PROSE} mt-3`}>{t("status.desc")}</p>
            <a href={QUIVR_QUICKSTART_URL} {...EXTERNAL} className={`mt-6 ${TEXT_LINK}`}>
              {t("status.quickstart")}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="border border-foreground p-7">
            <span className={KICKER}>{t("v1.kicker")}</span>
            <p className={PROSE}>
              {t("v1.desc", { stars: formatStarsCompact(stars, locale) })}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <a href={QUIVR_V1_URL} {...EXTERNAL} className={TEXT_LINK}>
                {t("v1.link")}
                <span aria-hidden="true">↗</span>
              </a>
              <Link href={QUIVR_STORY_ARTICLE_PATH} className={TEXT_LINK}>
                {t("v1.story")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <span className={KICKER}>{t("tech.kicker")}</span>
          <dl className="m-0 border-t-2 border-foreground">
            {QUIVR_TECH_KEYS.map((key) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-1 border-b border-border py-3 md:grid-cols-[200px_1fr] md:gap-8"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t(`tech.rows.${key}`)}
                </dt>
                <dd className="m-0 text-[14px] leading-[1.5] text-foreground">
                  {t(`tech.values.${key}`)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <a href={QUIVR_DOCS_URL} {...EXTERNAL} className={TEXT_LINK}>
              {t("tech.docs")}
              <span aria-hidden="true">↗</span>
            </a>
            <a href={QUIVR_REPO_URL} {...EXTERNAL} className={TEXT_LINK}>
              {t("tech.repo")}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
