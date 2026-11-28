import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { BrandSquare } from "@/components/BrandSquare";
import { ClientMark } from "@/components/ClientMark";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ServiceHero } from "@/components/ServiceHero";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Clientele } from "@/components/home/landing/Clientele";
import { OfferFactsStrip, type OfferFactItem } from "@/components/offer/OfferFactsStrip";
import { OfferFaqSection } from "@/components/offer/OfferFaqSection";
import { OfferFurtherReading } from "@/components/offer/OfferFurtherReading";
import { OfferMethodBand } from "@/components/offer/OfferMethodBand";
import {
  OFFER_BAND,
  OFFER_H2,
  OFFER_H2_SPLIT,
  OFFER_INLINE_LINK,
  OFFER_MONO,
  OFFER_MONO_LINK,
  OFFER_PROSE,
  OFFER_PROSE_LEAD,
} from "@/components/offer/offer-styles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  CUSTOM_AI_APP_APPS_KEYS,
  CUSTOM_AI_APP_CASES,
  CUSTOM_AI_APP_FAQ_KEYS,
  CUSTOM_AI_APP_METHOD_STEPS,
  CUSTOM_AI_APP_RAG_KEYS,
  CUSTOM_AI_APP_SECURITY_KEYS,
  customAiAppPageId,
  customAiAppRagArticle,
  customAiAppRoiArticle,
  customAiAppStepsArticle,
} from "@/lib/custom-ai-app";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
  CUSTOM_AI_APP_PATHS,
  HARDENING_PATHS,
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
 * Custom AI application development landing
 * (/fr/developpement-application-ia-sur-mesure, /en/custom-ai-app-development).
 *
 * Breaks up the previous wall of 3x4 identical cards into distinct visual
 * rhythms: 2x2 lamp cards for app types, one unified proof band (Monka wide
 * bench + LocService & AFP), an asymmetric ruled architecture ledger for RAG
 * and GDPR security, 5-step method on ink, FAQ, further reading and FinalCTA.
 */

export async function customAiAppMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "customAiApp" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(CUSTOM_AI_APP_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, CUSTOM_AI_APP_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const FAQ_PLAIN_TAGS = {
  case: (chunks: string) => chunks,
  rag: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  agents: (chunks: string) => chunks,
};

export async function CustomAiAppPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const pageLocale = contentLocale as Locale;
  const t = await getTranslations({ locale, namespace: "customAiApp" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(CUSTOM_AI_APP_PATHS, locale));
  const ragArticle = customAiAppRagArticle(locale);
  const roiArticle = customAiAppRoiArticle(locale);
  const stepsArticle = customAiAppStepsArticle(locale);
  const agencyPath = splitPath(AGENCY_PARIS_PATHS, locale);
  const agentsPath = splitPath(AGENTS_PRODUCTION_PATHS, locale);
  const hardeningPath = splitPath(HARDENING_PATHS, locale);

  const link = (href: string) =>
    function InlineLink(chunks: ReactNode) {
      return (
        <Link href={href} className={OFFER_INLINE_LINK}>
          {chunks}
        </Link>
      );
    };
  const faqLinks = {
    case: link("/case-studies/monka"),
    rag: link(ragArticle),
    agency: link(agencyPath),
    agents: link(agentsPath),
  };

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
      CUSTOM_AI_APP_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        answer: t.markup(`faq.items.${key}.a`, FAQ_PLAIN_TAGS),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("service.name"),
      serviceType: "Custom AI application development",
      description: t("service.description"),
    }),
  ];

  const [monkaSpec, ...otherCaseSpecs] = CUSTOM_AI_APP_CASES;
  const monkaCustomer = getCustomer(monkaSpec.slug, contentLocale);
  const facts = t.raw("facts") as OfferFactItem[];

  const articles = [
    { key: "rag", label: t("seeAlso.rag"), href: ragArticle, locale: pageLocale },
    { key: "roi", label: t("seeAlso.roi"), href: roiArticle, locale: pageLocale },
    { key: "steps", label: t("seeAlso.steps"), href: stepsArticle, locale: pageLocale },
  ];

  const siblingOffers = [
    {
      key: "agency",
      title: t("seeAlso.agencyTitle"),
      desc: t("seeAlso.agencyDesc"),
      href: agencyPath,
    },
    {
      key: "agents",
      title: t("seeAlso.agentsTitle"),
      desc: t("seeAlso.agentsDesc"),
      href: agentsPath,
    },
    {
      key: "hardening",
      title: t("seeAlso.hardeningTitle"),
      desc: t("seeAlso.hardeningDesc"),
      href: hardeningPath,
    },
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
        <ServiceHero
          kicker={t("kicker")}
          title={t("title")}
          lede={t("lede")}
          cta={
            <AboutBookingCta
              page={customAiAppPageId(locale)}
              location="cta_custom_ai_app_hero"
              namespace="customAiApp"
              lit
            />
          }
        />

        <div data-surface="paper">
          <Clientele />

          <OfferFactsStrip kicker={t("factsLabel")} items={facts} />

          {/* 1. What we build: 2x2 lamp cards (the one feature card grid on the page). */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("apps.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("apps.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[62ch]`}>{t("apps.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
              {CUSTOM_AI_APP_APPS_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="lamp-card relative flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <span className="text-foreground relative mb-8 self-start text-[48px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative m-0 mb-3 text-[clamp(1.45rem,2.1vw,1.9rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
                    {t(`apps.items.${key}.title`)}
                  </h3>
                  <p className={`relative ${OFFER_PROSE} max-w-[56ch] text-soft-foreground`}>
                    {t(`apps.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* 2. Unified proof band: Monka featured wide bench + LocService & AFP below. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("cases.label")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("cases.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[64ch]`}>{t("cases.intro")}</p>

            {/* Featured: Monka */}
            <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="relative flex flex-col border-b border-border p-7 md:p-10 lg:border-b-0 lg:border-r">
                {monkaCustomer ? (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h3 className="m-0">
                      <ClientMark
                        logo={monkaCustomer.logo}
                        client={monkaCustomer.client}
                        className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                        textClassName="text-[24px]"
                      />
                    </h3>
                    <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                      {monkaCustomer.sector}
                    </span>
                  </div>
                ) : null}

                <dl className="m-0 mt-10 border-t border-border">
                  {monkaSpec.stats.map((stat) => (
                    <div
                      key={stat}
                      className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-5"
                    >
                      <dt className={OFFER_MONO}>{t(`cases.monka.stats.${stat}.label`)}</dt>
                      <dd className="m-0 text-[30px] font-bold leading-[1.05] tracking-[-0.04em] text-foreground md:text-[38px]">
                        {t(`cases.monka.stats.${stat}.value`)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className={`${OFFER_PROSE} mt-5`}>{t("cases.monka.intro")}</p>
              </div>
              <div className="relative flex flex-col p-7 md:p-10">
                <ul className="m-0 flex list-none flex-col p-0">
                  {(t.raw("cases.monka.points") as string[]).map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 py-3 text-[15px] leading-[1.55] text-foreground md:text-base"
                    >
                      <span aria-hidden="true" className="font-mono text-brand">
                        →
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/case-studies/${monkaSpec.slug}`}
                  className={`${OFFER_MONO_LINK} mt-auto self-start pt-6`}
                >
                  {t("cases.monka.readCase")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            {/* Secondary cases: LocService + AFP / MediaGen */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {otherCaseSpecs.map(({ key, slug, stats }) => {
                const customer = getCustomer(slug, contentLocale);
                return (
                  <article
                    key={key}
                    className="flex flex-col border border-border bg-card p-7 transition-colors duration-300 hover:border-border-strong md:p-9"
                  >
                    {customer ? (
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <h3 className="m-0">
                          <ClientMark
                            logo={customer.logo}
                            client={customer.client}
                            className="h-7 w-auto max-w-[170px] object-contain object-left md:h-8"
                            textClassName="text-[22px]"
                          />
                        </h3>
                        <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                          {customer.sector}
                        </span>
                      </div>
                    ) : null}

                    <dl className="m-0 mt-7 flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-5">
                      {stats.map((stat) => (
                        <div key={stat}>
                          <dt className={OFFER_MONO}>{t(`cases.${key}.stats.${stat}.label`)}</dt>
                          <dd className="m-0 mt-1 text-[26px] font-bold leading-[1.05] tracking-[-0.04em] text-foreground md:text-[32px]">
                            {t(`cases.${key}.stats.${stat}.value`)}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className={`${OFFER_PROSE} mt-5`}>{t(`cases.${key}.intro`)}</p>
                    {t.has(`cases.${key}.statNote`) ? (
                      <p className="m-0 mt-3 text-[15px] font-medium leading-[1.55] text-foreground">
                        {t(`cases.${key}.statNote`)}
                      </p>
                    ) : null}

                    <ul className="m-0 mt-4 flex list-none flex-col p-0">
                      {(t.raw(`cases.${key}.points`) as string[]).map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 py-2 text-[14px] leading-[1.55] text-soft-foreground md:text-[15px]"
                        >
                          <span aria-hidden="true" className="font-mono text-brand">
                            →
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/case-studies/${slug}`}
                      className={`${OFFER_MONO_LINK} mt-auto self-start pt-6`}
                    >
                      {t(`cases.${key}.readCase`)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 3. Architecture, RAG, agents & GDPR security as an asymmetric ruled ledger (no card wall). */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("rag.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{t("rag.title")}</h2>
                <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[44ch]`}>{t("rag.intro")}</p>
                <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6">
                  <p className={OFFER_PROSE}>{t.rich("rag.article", { link: link(ragArticle) })}</p>
                  <p className={OFFER_PROSE}>{t.rich("rag.agents", { link: link(agentsPath) })}</p>
                </div>
              </div>

              <div className="flex flex-col gap-12">
                <div>
                  <h3 className={`m-0 font-normal ${OFFER_MONO}`}>{t("rag.groupLabel")}</h3>
                  <dl className="m-0 mt-5 border-t border-border">
                    {CUSTOM_AI_APP_RAG_KEYS.map((key, i) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 gap-2 border-b border-border py-5 sm:grid-cols-[36px_minmax(0,1fr)] sm:gap-5"
                      >
                        <span className="font-mono text-[12px] tracking-[0.16em] text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <dt className="text-[19px] font-bold leading-[1.2] tracking-[-0.025em] text-foreground">
                            {t(`rag.items.${key}.title`)}
                          </dt>
                          <dd className={`${OFFER_PROSE} mt-2`}>{t(`rag.items.${key}.desc`)}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3 className={`m-0 font-normal ${OFFER_MONO}`}>{t("security.title")}</h3>
                  <p className={`${OFFER_PROSE} mt-3 max-w-[58ch]`}>{t("security.intro")}</p>
                  <dl className="m-0 mt-5 border-t border-border">
                    {CUSTOM_AI_APP_SECURITY_KEYS.map((key, i) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 gap-2 border-b border-border py-5 sm:grid-cols-[36px_minmax(0,1fr)] sm:gap-5"
                      >
                        <span className="font-mono text-[12px] tracking-[0.16em] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <dt className="text-[19px] font-bold leading-[1.2] tracking-[-0.025em] text-foreground">
                            {t(`security.items.${key}.title`)}
                          </dt>
                          <dd className={`${OFFER_PROSE} mt-2`}>
                            {t(`security.items.${key}.desc`)}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4. 5-step method on ink. */}
        <OfferMethodBand
          kicker={t("method.kicker")}
          title={t("method.title")}
          intro={t("method.intro")}
          steps={CUSTOM_AI_APP_METHOD_STEPS.map((step) => ({
            n: step.n,
            title: t(`method.steps.${step.key}.title`),
            desc: t(`method.steps.${step.key}.desc`),
          }))}
        />

        <div data-surface="paper">
          <OfferFaqSection
            kicker={t("faq.kicker")}
            title={t("faq.title")}
            borderTop={false}
            items={CUSTOM_AI_APP_FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.q`),
              answer: t.rich(`faq.items.${key}.a`, faqLinks),
            }))}
          />

          <OfferFurtherReading
            kicker={t("seeAlso.kicker")}
            title={t("seeAlso.title")}
            articlesLabel={t("seeAlso.articlesLabel")}
            articles={articles}
            offersLabel={t("seeAlso.offersLabel")}
            offers={siblingOffers}
            note={t.rich("about", { link: link(splitPath(ABOUT_PATHS, locale)) })}
          />
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
