import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBackers } from "@/components/about/AboutBackers";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  HEALTHCARE_AUDIENCE_KEYS,
  HEALTHCARE_CASE_SLUG,
  HEALTHCARE_FAQ_KEYS,
  HEALTHCARE_HDS_KEYS,
  HEALTHCARE_HERO_KEYS,
  HEALTHCARE_METHOD_STEPS,
  HEALTHCARE_OFFER_KEYS,
  HEALTHCARE_SECONDARY_CASE_SLUG,
  healthcareHdsArticle,
  healthcarePageId,
} from "@/lib/healthcare-ai";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  HARDENING_PATHS,
  HEALTHCARE_AI_PATHS,
  localizedSocialMetadata,
  localizedUrl,
  splitPath,
  splitPathAlternates,
} from "@/lib/site";
import {
  breadcrumbList,
  faqPageSchema,
  serviceNode,
  webPageNode,
} from "@/lib/structured-data";

/**
 * The healthcare AI landing, served at /fr/ia-sante-hds and
 * /en/healthcare-ai-hds. Both routes render this component; each declares the
 * other through hreflang.
 *
 * Built from the About page and the other service landings (mono kicker, clamp
 * H1, bordered cards, ink slab, FAQ rows, FinalCTA), with no new visual
 * language. The HDS certification is the host's: the page never claims it.
 */

export async function healthcareAiMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "healthcareAi" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(HEALTHCARE_AI_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, HEALTHCARE_AI_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const H2 =
  "m-0 font-bold text-foreground text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const CARD_HOVER =
  "transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]";

export async function HealthcareAiPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale, namespace: "healthcareAi" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(HEALTHCARE_AI_PATHS, locale));
  const page = healthcarePageId(locale);
  const hdsArticle = healthcareHdsArticle(locale);
  const monka = getCustomer(HEALTHCARE_CASE_SLUG, contentLocale);
  const secondary = getCustomer(HEALTHCARE_SECONDARY_CASE_SLUG, contentLocale);
  const monkaPath = `/case-studies/${HEALTHCARE_CASE_SLUG}`;

  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: t("title"),
      description: t("metaDescription"),
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: t("breadcrumb"), url: pageUrl },
    ]),
    faqPageSchema(
      HEALTHCARE_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        answer: t(`faq.items.${key}.a`),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("service.name"),
      serviceType: "Healthcare AI product development under GDPR and HDS requirements",
      description: t("service.description"),
    }),
  ];

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {jsonLd.map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — The one H1 on the page, the promise, the facts and the call. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}>{t("kicker")}</span>
          <h1
            className="m-0 max-w-[22ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(38px, 5.6vw, 84px)",
              lineHeight: 0.93,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>
          <p className="m-0 mt-8 max-w-[760px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
            {t("lede")}
          </p>

          <span className={`mt-10 block ${MONO}`}>{t("hero.label")}</span>
          <ul className="m-0 mt-4 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
            {HEALTHCARE_HERO_KEYS.map((key) => (
              <li
                key={key}
                className="flex gap-4 border-b border-border py-4 text-[15px] leading-[1.5] text-foreground md:text-base"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-2 w-2 shrink-0 bg-foreground"
                />
                {t(`hero.items.${key}`)}
              </li>
            ))}
          </ul>

          <AboutBookingCta
            page={page}
            location="cta_healthcare_ai_hero"
            namespace="healthcareAi"
          />
          <AboutBackers label={tAbout("backedBy")} />

          {/* The healthcare client already on the site, and no other logo. */}
          {monka ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-7">
              <span className={MONO}>{t("hero.caseLabel")}</span>
              <Link
                href={monkaPath}
                className="group inline-flex items-center gap-4 text-foreground"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={monka.logo}
                  alt={monka.client}
                  className="h-8 w-auto max-w-[160px] object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] underline decoration-1 underline-offset-4 group-hover:text-muted-foreground">
                  {t("hero.caseLink")}
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            </div>
          ) : null}
        </section>

        {/* 2 — Who it is for: the kinds of teams, then the signals. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("audience.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("audience.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
            <div>
              <span className={MONO}>{t("audience.typesLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
                {HEALTHCARE_AUDIENCE_KEYS.map((key, i) => (
                  <li
                    key={key}
                    className="flex items-baseline gap-4 border-b border-border py-4 text-[17px] leading-[1.45] text-foreground"
                  >
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{t(`audience.types.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className={MONO}>{t("audience.signalsLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
                {(t.raw("audience.signals") as string[]).map((signal) => (
                  <li
                    key={signal}
                    className="flex gap-3 border-b border-border py-4 text-[17px] leading-[1.45] text-foreground"
                  >
                    <span aria-hidden="true" className="font-mono text-muted-foreground">
                      —
                    </span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3 — The offer: five building blocks. The first card spans two
            columns so five cards fill two full rows. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("offer.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("offer.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {HEALTHCARE_OFFER_KEYS.map((key, i) => (
              <article
                key={key}
                className={`flex flex-col border border-foreground bg-background p-7 ${CARD_HOVER} ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="mb-7 flex items-start justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {t(`offer.items.${key}.tag`)}
                  </span>
                </div>
                <h3 className="m-0 mb-4 text-[24px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(22px,2.2vw,28px)]">
                  {t(`offer.items.${key}.title`)}
                </h3>
                <p className={`${PROSE} max-w-[60ch]`}>{t(`offer.items.${key}.desc`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 4 — Who holds the HDS certification, and where we work: the host
            is certified, we build inside the client's perimeter. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={`${H2} max-w-[20ch]`}>{t("hds.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("hds.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <figure className="m-0 self-start border border-dashed border-foreground p-5 md:p-7">
              <figcaption className={MONO}>{t("hds.scope.label")}</figcaption>
              <div
                data-surface="inverse"
                className="mt-5 bg-foreground p-6 text-background"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                  01
                </span>
                <p className="m-0 mt-3 text-[22px] font-bold leading-[1.1] tracking-[-0.03em]">
                  {t("hds.scope.host.label")}
                </p>
                <p className="m-0 mt-2 text-[15px] leading-[1.55] text-white/70">
                  {t("hds.scope.host.desc")}
                </p>
              </div>
              <div className="mt-4 border border-foreground bg-background p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  02
                </span>
                <p className="m-0 mt-3 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                  {t("hds.scope.us.label")}
                </p>
                <p className={`${PROSE} mt-2`}>{t("hds.scope.us.desc")}</p>
              </div>
            </figure>

            <div>
              <div className="border-t-2 border-foreground">
                {HEALTHCARE_HDS_KEYS.map((key, i) => (
                  <article
                    key={key}
                    className="grid grid-cols-1 gap-3 border-b border-border py-6 md:grid-cols-[48px_minmax(0,1fr)] md:gap-6"
                  >
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[22px]">
                        {t(`hds.items.${key}.title`)}
                      </h3>
                      <p className={`${PROSE} mt-2 max-w-[68ch]`}>
                        {t(`hds.items.${key}.desc`)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <Link href={hdsArticle} className={`${MONO_LINK} mt-8`}>
                {t("hds.articleLink")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 5 — Proof: the Monka case, facts from the published case study
            only, then one non-healthcare case for shipping pace. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("proof.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[720px]`}>{t("proof.intro")}</p>

          {monka ? (
            <article
              className={`mt-10 grid grid-cols-1 border border-foreground bg-background md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] ${CARD_HOVER}`}
            >
              <div className="flex flex-col border-b border-foreground p-7 md:p-9 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                  <h3 className="m-0">
                    {/* The logo is the card's title: its alt carries the client name. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={monka.logo}
                      alt={monka.client}
                      className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                      loading="lazy"
                      decoding="async"
                    />
                  </h3>
                  <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {monka.sector}
                  </span>
                </div>

                <dl className="m-0 mt-8 grid grid-cols-2 border-l border-t border-border">
                  {monka.results.map((stat) => (
                    // The figure reads first on screen; the label stays first
                    // in the markup, as a term before its value.
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse justify-end gap-2 border-b border-r border-border p-4 md:p-5"
                    >
                      <dt className="text-sm leading-[1.4] text-muted-foreground">{stat.label}</dt>
                      <dd className="m-0 text-[36px] font-bold leading-none tracking-[-0.05em] text-foreground md:text-[48px]">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {monka.quote ? (
                  <figure className="m-0 mt-8 border-l-2 border-foreground pl-5">
                    <blockquote className="m-0 text-[15px] leading-[1.6] text-foreground">
                      {locale === "fr" ? `« ${monka.quote.text} »` : `“${monka.quote.text}”`}
                    </blockquote>
                    <figcaption className={`mt-3 ${MONO}`}>{monka.quote.author}</figcaption>
                  </figure>
                ) : null}
              </div>
              <div className="flex flex-col p-7 md:p-9">
                <ul className="m-0 flex list-none flex-col p-0">
                  {(t.raw("proof.points") as string[]).map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 border-b border-border py-3 text-[15px] leading-[1.5] text-foreground last:border-b-0"
                    >
                      <span aria-hidden="true" className="font-mono text-orange-500">
                        →
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={monkaPath} className={`${MONO_LINK} mt-auto self-start pt-6`}>
                  {t("proof.readCase")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ) : null}

          {secondary ? (
            <div className="mt-5 grid grid-cols-1 gap-4 border border-border p-7 md:grid-cols-[minmax(0,260px)_1fr_auto] md:items-center md:gap-10">
              <span className={MONO}>{t("proof.otherLabel")}</span>
              <p className={`${PROSE} text-foreground`}>{t("proof.other")}</p>
              <Link
                href={`/case-studies/${secondary.slug}`}
                className={`${MONO_LINK} self-start md:self-center`}
              >
                {t("proof.otherLink")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </section>

        {/* 6 — How a project starts, on the same ink slab as the About
            process section, with the mid-page call. */}
        <section
          data-surface="inverse"
          className="border-y-2 border-foreground bg-foreground text-background"
        >
          <div className={`${SECTION} py-16 md:py-24`}>
            <h2
              className="m-0 font-bold text-background"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              {t("method.title")}
            </h2>
            <p className="m-0 mt-5 max-w-[680px] text-[15px] leading-[1.6] text-white/70 md:text-base">
              {t("method.intro")}
            </p>

            <span className="mt-12 block border-b border-white/15 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 md:mt-16">
              {t("method.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {HEALTHCARE_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-white/15 py-7 md:grid-cols-[200px_1fr] md:gap-12 md:py-8"
                >
                  <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="text-4xl font-bold leading-none tracking-[-0.05em] text-background md:text-[56px]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                      {t(`method.steps.${step.key}.label`)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 max-w-[620px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[28px]">
                      {t(`method.steps.${step.key}.title`)}
                    </h3>
                    <p className="m-0 max-w-[620px] text-[15px] leading-[1.55] text-white/70 md:text-base">
                      {t(`method.steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <AboutBookingCta
              page={page}
              location="cta_healthcare_ai_method"
              namespace="healthcareAi"
              inverse
            />
          </div>
        </section>

        {/* 7 — FAQ, mirrored word for word in the FAQPage JSON-LD above. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {HEALTHCARE_FAQ_KEYS.map((key) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-8"
              >
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {t(`faq.items.${key}.q`)}
                </h3>
                <p className={`${PROSE} max-w-[70ch]`}>{t(`faq.items.${key}.a`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 8 — Further reading and the sibling pages. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("further.title")}</h2>
          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
            <div>
              <span className={MONO}>{t("further.readingLabel")}</span>
              <ul className="m-0 mt-4 list-none border-t border-border p-0">
                {(
                  [
                    { key: "hds", href: hdsArticle },
                    { key: "monka", href: monkaPath },
                  ] as const
                ).map((item) => (
                  <li key={item.key} className="border-b border-border">
                    <Link
                      href={item.href}
                      className="group flex items-baseline justify-between gap-4 py-4 text-[15px] leading-[1.45] text-foreground md:text-base"
                    >
                      <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-foreground">
                        {t(`further.reading.${item.key}`)}
                      </span>
                      <span aria-hidden="true" className="shrink-0">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className={MONO}>{t("further.alsoLabel")}</span>
              <div className="mt-4 grid grid-cols-1 gap-5">
                {(
                  [
                    { key: "agency", href: splitPath(AGENCY_PARIS_PATHS, locale) },
                    { key: "about", href: splitPath(ABOUT_PATHS, locale) },
                    { key: "hardening", href: splitPath(HARDENING_PATHS, locale) },
                  ] as const
                ).map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="group block border border-foreground p-6 transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
                  >
                    <span className="flex items-baseline justify-between gap-4 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                      {t(`further.${item.key}.title`)}
                      <span aria-hidden="true" className="text-lg">
                        →
                      </span>
                    </span>
                    <span className={`${PROSE} mt-2 block`}>
                      {t(`further.${item.key}.desc`)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
