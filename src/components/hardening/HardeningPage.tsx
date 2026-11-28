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
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  AGENT_AUTHORITY_PATH,
  BLACK_OCTOBER_PATHS,
  CI_SECURITY_PATHS,
  CYBER_FLEET_PATHS,
  HARDENING_CASE_SLUGS,
  HARDENING_FAQ_KEYS,
  HARDENING_METHOD_STEPS,
  HARDENING_NOT_KEYS,
  HARDENING_OFFER_KEYS,
  HDS_GUIDE_PATHS,
  hardeningPageId,
  localizedArticle,
  MCP_GUIDE_PATHS,
} from "@/lib/hardening";
import {
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
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
 * Service landing on AI agents for product and infrastructure hardening
 * (/fr/agents-ia-securite-produit, /en/ai-agents-product-hardening).
 */

export async function hardeningMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "hardening" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(HARDENING_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, HARDENING_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

export async function HardeningPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "hardening" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const pageUrl = localizedUrl(locale, splitPath(HARDENING_PATHS, locale));
  const blackOctober = localizedArticle(BLACK_OCTOBER_PATHS, locale);
  const cyberFleet = localizedArticle(CYBER_FLEET_PATHS, locale);
  const ciSecurity = localizedArticle(CI_SECURITY_PATHS, locale);
  const mcpGuide = localizedArticle(MCP_GUIDE_PATHS, locale);
  const hdsGuide = localizedArticle(HDS_GUIDE_PATHS, locale);

  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: t("breadcrumb"), url: pageUrl },
  ]);
  const webPage = webPageNode({
    url: pageUrl,
    name: t("title"),
    description: t("metaDescription"),
    language: locale,
  });
  const service = serviceNode({
    url: pageUrl,
    name: t("service.name"),
    serviceType: "AI agents for product and infrastructure hardening",
    description: t("service.description"),
  });
  const faq = faqPageSchema(
    HARDENING_FAQ_KEYS.map((key) => ({
      question: t(`faq.items.${key}.q`),
      answer: t(`faq.items.${key}.a`),
    })),
  );
  const cases = HARDENING_CASE_SLUGS.map((slug) => ({
    slug,
    customer: getCustomer(slug, locale as ContentLocale),
  }));

  const pageLocale = locale as Locale;
  const articles = [
    { key: "cyberFleet", label: t("further.reading.cyberFleet"), href: cyberFleet, locale: pageLocale },
    { key: "ciSecurity", label: t("further.reading.ciSecurity"), href: ciSecurity, locale: pageLocale },
    { key: "blackOctober", label: t("further.reading.blackOctober"), href: blackOctober, locale: pageLocale },
    { key: "mcp", label: t("further.reading.mcp"), href: mcpGuide, locale: pageLocale },
    { key: "authority", label: t("further.reading.authority"), href: AGENT_AUTHORITY_PATH, locale: "fr" as Locale },
    { key: "hds", label: t("further.reading.hds"), href: hdsGuide, locale: pageLocale },
  ];

  const siblingOffers = [
    {
      key: "agentsProduction",
      title: t("further.agentsProduction.title"),
      desc: t("further.agentsProduction.desc"),
      href: splitPath(AGENTS_PRODUCTION_PATHS, locale),
    },
    {
      key: "agency",
      title: t("further.agency.title"),
      desc: t("further.agency.desc"),
      href: splitPath(AGENCY_PARIS_PATHS, locale),
    },
    {
      key: "health",
      title: t("further.health.title"),
      desc: t("further.health.desc"),
      href: splitPath(HEALTHCARE_AI_PATHS, locale),
    },
  ];

  const facts = t.raw("facts") as OfferFactItem[];

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={webPage} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={service} />
      <JsonLd data={faq} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <ServiceHero
          kicker={t("kicker")}
          display={t("displayTitle")}
          title={t("title")}
          lede={t("lede")}
          cta={<AboutBookingCta page={hardeningPageId(locale)} location="cta_hardening" lit />}
        />

        <div data-surface="paper">
          <Clientele exclude={["Softway Medical"]} />

          <OfferFactsStrip kicker={t("factsLabel")} items={facts} />

          {/* Why point-in-time scanners miss security drift: editorial split. */}
          <section className={OFFER_BAND}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
              <div>
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("problem.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{t("problem.title")}</h2>
              </div>
              <div className="flex max-w-[66ch] flex-col gap-5 lg:pt-8">
                <p className={OFFER_PROSE_LEAD}>{t("problem.p1")}</p>
                <p className={OFFER_PROSE}>{t("problem.p2")}</p>
                <p className={OFFER_PROSE}>
                  {t.rich("problem.p3", {
                    link: (chunks: ReactNode) => (
                      <Link href={blackOctober} className={OFFER_INLINE_LINK}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* The 6 workstreams as a tight hairline architectural spec matrix. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("offer.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("offer.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[64ch]`}>{t("offer.intro")}</p>

            <div className="mt-12 grid grid-cols-1 border-l border-t border-border md:mt-16 md:grid-cols-2 lg:grid-cols-3">
              {HARDENING_OFFER_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="flex flex-col border-b border-r border-border bg-card p-7 transition-colors duration-300 hover:bg-background md:p-9"
                >
                  <div className="mb-8 flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[13px] font-medium tracking-[0.18em] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t(`offer.items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="m-0 mb-3 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`flex-1 ${OFFER_PROSE} text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                  {key === "agents" ? (
                    <Link href={mcpGuide} className={`${OFFER_MONO_LINK} mt-6 self-start`}>
                      {t("offer.items.agents.link")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>

            <p className="m-0 mt-10 max-w-[760px] border-l-2 border-brand pl-5 text-[15px] leading-[1.6] text-foreground md:pl-6 md:text-base">
              {t("offer.guardrails")}
            </p>
          </section>
        </div>

        {/* 6-step rollout on ink. */}
        <OfferMethodBand
          kicker={t("method.stepsLabel")}
          title={t("method.title")}
          intro={t("method.intro")}
          steps={HARDENING_METHOD_STEPS.map((step) => ({
            n: step.n,
            label: t(`method.steps.${step.key}.label`),
            title: t(`method.steps.${step.key}.title`),
            desc: t(`method.steps.${step.key}.desc`),
          }))}
          footer={
            <AboutBookingCta
              page={hardeningPageId(locale)}
              location="cta_hardening_method"
              lit
            />
          }
        />

        <div data-surface="paper">
          {/* Proof: published production cases under warm lamps + public writing. */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("proof.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("proof.title")}</h2>

            <div className="mt-10 grid grid-cols-1 gap-6 border-y border-border py-8 md:grid-cols-3 md:gap-10">
              <p className={OFFER_PROSE}>{t("proof.points.production")}</p>
              <p className={OFFER_PROSE}>
                {t.rich("proof.points.public", {
                  black: (chunks: ReactNode) => (
                    <Link href={blackOctober} className={OFFER_INLINE_LINK}>
                      {chunks}
                    </Link>
                  ),
                  authority: (chunks: ReactNode) => (
                    <Link href={AGENT_AUTHORITY_PATH} locale="fr" className={OFFER_INLINE_LINK}>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <p className={OFFER_PROSE}>{t("proof.points.agency")}</p>
            </div>

            <span className={`mt-12 block ${OFFER_MONO}`}>{t("proof.casesLabel")}</span>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {cases.map(({ slug, customer }) =>
                customer ? (
                  <article
                    key={slug}
                    className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
                  >
                    <div className="relative flex flex-wrap items-start justify-between gap-3">
                      <ClientMark
                        logo={customer.logo}
                        client={customer.client}
                        className="h-7 w-auto max-w-[150px] object-contain object-left"
                        textClassName="text-[22px]"
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {customer.sector}
                      </span>
                    </div>
                    <h3 className="relative m-0 mt-7 text-[clamp(1.5rem,2.2vw,1.9rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
                      {customer.metric ?? customer.client}
                    </h3>
                    <p className={`relative ${OFFER_PROSE} mt-4 flex-1 text-soft-foreground`}>
                      {t(`proof.cases.${slug}`)}
                    </p>
                    <Link
                      href={`/case-studies/${slug}`}
                      className={`relative ${OFFER_MONO_LINK} mt-6 self-start`}
                    >
                      {t("proof.readCase")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ) : null,
              )}
            </div>
          </section>

          {/* What this is not: clean 3-column ruled strip. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("not.kicker")}
            </p>
            <h2 className={OFFER_H2}>{t("not.title")}</h2>
            <div className="mt-12 grid grid-cols-1 border-t border-border md:mt-16 md:grid-cols-3">
              {HARDENING_NOT_KEYS.map((key, i) => (
                <article
                  key={key}
                  className={`border-b border-border py-7 md:py-8 ${
                    i > 0 ? "md:border-l md:pl-8" : ""
                  } ${i < HARDENING_NOT_KEYS.length - 1 ? "md:pr-8" : ""}`}
                >
                  <span className="font-mono text-[12px] tracking-[0.18em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-4 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[22px]">
                    {t(`not.items.${key}.title`)}
                  </h3>
                  <p className={`${OFFER_PROSE} mt-3`}>{t(`not.items.${key}.desc`)}</p>
                </article>
              ))}
            </div>
          </section>

          <OfferFaqSection
            kicker={t("faq.kicker")}
            title={t("faq.title")}
            items={HARDENING_FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.q`),
              answer: t(`faq.items.${key}.a`),
            }))}
          />

          <OfferFurtherReading
            kicker={t("further.kicker")}
            title={t("further.title")}
            articlesLabel={t("further.readingLabel")}
            articles={articles}
            offersLabel={t("further.alsoLabel")}
            offers={siblingOffers}
          />
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
