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
import { OfferEditorialQuote } from "@/components/offer/OfferEditorialQuote";
import { OfferFactsStrip, type OfferFactItem } from "@/components/offer/OfferFactsStrip";
import { OfferFaqSection } from "@/components/offer/OfferFaqSection";
import { OfferFurtherReading } from "@/components/offer/OfferFurtherReading";
import { OfferMethodBand } from "@/components/offer/OfferMethodBand";
import {
  OFFER_BAND,
  OFFER_H2,
  OFFER_H2_SPLIT,
  OFFER_INLINE_LINK,
  OFFER_LIST_RULE,
  OFFER_MONO,
  OFFER_MONO_LINK,
  OFFER_PROSE,
  OFFER_PROSE_LEAD,
} from "@/components/offer/offer-styles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { clientLogoSize } from "@/lib/client-logos";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  HEALTHCARE_AUDIENCE_KEYS,
  HEALTHCARE_CASE_SLUG,
  HEALTHCARE_FAQ_KEYS,
  HEALTHCARE_HDS_KEYS,
  HEALTHCARE_METHOD_STEPS,
  HEALTHCARE_OFFER_KEYS,
  HEALTHCARE_SECONDARY_CASE_SLUG,
  healthcareHdsArticle,
  healthcareHostingArticle,
  healthcarePageId,
} from "@/lib/healthcare-ai";
import {
  AGENCY_PARIS_PATHS,
  CUSTOM_AI_APP_PATHS,
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
 * Healthcare AI & HDS offer landing (/fr/ia-sante-hds, /en/healthcare-ai-hds).
 *
 * Per DESIGN.md, omits the general Clientele marquee so Monka stands alone as
 * the healthcare reference. Opens with the 4-column Monka proof ledger, puts
 * the HDS certification perimeter diagram right where healthcare CTOs and DPOs
 * doubt, follows with the Monka case bench + verbatim CEO quote on ink, then
 * deliverables, audience, 4-step method on ink, FAQ and further reading.
 */

export async function healthcareAiMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "healthcareAi" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(HEALTHCARE_AI_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, HEALTHCARE_AI_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const FAQ_PLAIN_TAGS = {
  hds: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  hardening: (chunks: string) => chunks,
};

export async function HealthcareAiPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const pageLocale = contentLocale as Locale;
  const t = await getTranslations({ locale, namespace: "healthcareAi" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(HEALTHCARE_AI_PATHS, locale));
  const page = healthcarePageId(locale);
  const hdsArticle = healthcareHdsArticle(locale);
  const hostingArticle = healthcareHostingArticle(locale);
  const monka = getCustomer(HEALTHCARE_CASE_SLUG, contentLocale);
  const secondary = getCustomer(HEALTHCARE_SECONDARY_CASE_SLUG, contentLocale);
  const monkaPath = `/case-studies/${HEALTHCARE_CASE_SLUG}`;

  const faqLinks = {
    hds: (chunks: ReactNode) => (
      <Link href={hdsArticle} className={OFFER_INLINE_LINK}>
        {chunks}
      </Link>
    ),
    agency: (chunks: ReactNode) => (
      <Link href={splitPath(AGENCY_PARIS_PATHS, locale)} className={OFFER_INLINE_LINK}>
        {chunks}
      </Link>
    ),
    hardening: (chunks: ReactNode) => (
      <Link href={splitPath(HARDENING_PATHS, locale)} className={OFFER_INLINE_LINK}>
        {chunks}
      </Link>
    ),
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
      HEALTHCARE_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        answer: t.markup(`faq.items.${key}.a`, FAQ_PLAIN_TAGS),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("service.name"),
      serviceType: "Healthcare AI product development under GDPR and HDS requirements",
      description: t("service.description"),
    }),
  ];

  const facts = t.raw("facts") as OfferFactItem[];
  const [firstTwoOffers, lastThreeOffers] = [
    HEALTHCARE_OFFER_KEYS.slice(0, 2),
    HEALTHCARE_OFFER_KEYS.slice(2),
  ];

  const articles = [
    { key: "hds", label: t("further.reading.hds"), href: hdsArticle, locale: pageLocale },
    { key: "hosting", label: t("further.reading.hosting"), href: hostingArticle, locale: pageLocale },
    { key: "monka", label: t("further.reading.monka"), href: monkaPath, locale: pageLocale },
  ];

  const siblingOffers = [
    {
      key: "agency",
      title: t("further.agency.title"),
      desc: t("further.agency.desc"),
      href: splitPath(AGENCY_PARIS_PATHS, locale),
    },
    {
      key: "hardening",
      title: t("further.hardening.title"),
      desc: t("further.hardening.desc"),
      href: splitPath(HARDENING_PATHS, locale),
    },
    {
      key: "custom",
      title: t("further.custom.title"),
      desc: t("further.custom.desc"),
      href: splitPath(CUSTOM_AI_APP_PATHS, locale),
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
              page={page}
              location="cta_healthcare_ai_hero"
              namespace="healthcareAi"
              lit
            />
          }
        />

        <div data-surface="paper">
          {/* No Clientele loop here per DESIGN.md: Monka stands alone as the healthcare proof. */}
          <OfferFactsStrip
            kicker={t("factsLabel")}
            items={facts}
            footer={
              monka ? (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <span className={OFFER_MONO}>{t("hero.caseLabel")}</span>
                  <Link
                    href={monkaPath}
                    className="group inline-flex items-center gap-4 text-foreground"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={monka.logo}
                      alt={monka.client}
                      {...clientLogoSize(monka.logo)}
                      className="logo-tone h-7 w-auto max-w-[150px] object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={OFFER_MONO_LINK}>
                      {t("hero.caseLink")}
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </div>
              ) : null
            }
          />

          {/* HDS scope first: placed where healthcare CTOs and DPOs ask who holds certification. */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("hds.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("hds.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[64ch]`}>{t("hds.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <figure className="m-0 self-start border border-dashed border-border-strong p-5 md:p-7">
                <figcaption className={OFFER_MONO}>{t("hds.scope.label")}</figcaption>
                <div className="lamp-card relative mt-5 overflow-hidden border border-border p-6 md:p-7">
                  <span className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                    01
                  </span>
                  <p className="relative m-0 mt-3 text-[21px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[25px]">
                    {t("hds.scope.host.label")}
                  </p>
                  <p className={`relative ${OFFER_PROSE} mt-2 text-soft-foreground`}>
                    {t("hds.scope.host.desc")}
                  </p>
                </div>
                <div className="mt-4 border border-border bg-card p-6 md:p-7">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    02
                  </span>
                  <p className="m-0 mt-3 text-[21px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[25px]">
                    {t("hds.scope.us.label")}
                  </p>
                  <p className={`${OFFER_PROSE} mt-2`}>{t("hds.scope.us.desc")}</p>
                </div>
              </figure>

              <div className="border-t border-border">
                {HEALTHCARE_HDS_KEYS.map((key, i) => (
                  <article
                    key={key}
                    className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[64px_minmax(0,1fr)] md:gap-6"
                  >
                    <span className="font-mono text-[13px] font-medium tracking-[0.18em] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[23px]">
                        {t(`hds.items.${key}.title`)}
                      </h3>
                      <p className={`${OFFER_PROSE} mt-2 max-w-[62ch]`}>
                        {t(`hds.items.${key}.desc`)}
                      </p>
                      {key === "ai" ? (
                        <Link href={hdsArticle} className={`${OFFER_MONO_LINK} mt-4`}>
                          {t("hds.articleLink")}
                          <span aria-hidden="true">→</span>
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Proof: Monka wide lamp bench + LocService shipping pace note. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("proof.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("proof.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[66ch]`}>{t("proof.intro")}</p>

            {monka ? (
              <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div className="relative flex flex-col border-b border-border p-7 md:p-10 lg:border-b-0 lg:border-r">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h3 className="m-0">
                      <ClientMark
                        logo={monka.logo}
                        client={monka.client}
                        className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                        textClassName="text-[24px]"
                      />
                    </h3>
                    <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                      {monka.sector}
                    </span>
                  </div>

                  <dl className="m-0 mt-10 grid grid-cols-2 border-l border-t border-border">
                    {monka.results.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col-reverse justify-end gap-2 border-b border-r border-border p-4 md:p-5"
                      >
                        <dt className="text-[13px] leading-[1.4] text-muted-foreground">
                          {stat.label}
                        </dt>
                        <dd className="m-0 text-[32px] font-bold leading-none tracking-[-0.05em] text-foreground md:text-[42px]">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="relative flex flex-col p-7 md:p-10">
                  <ul className="m-0 flex list-none flex-col p-0">
                    {(t.raw("proof.points") as string[]).map((point) => (
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
                  <Link href={monkaPath} className={`${OFFER_MONO_LINK} mt-auto self-start pt-6`}>
                    {t("proof.readCase")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ) : null}

            {secondary ? (
              <div className="mt-4 grid grid-cols-1 gap-4 border border-border bg-card p-7 md:grid-cols-[minmax(0,240px)_1fr_auto] md:items-center md:gap-10 md:p-8">
                <span className={OFFER_MONO}>{t("proof.otherLabel")}</span>
                <p className={`${OFFER_PROSE} text-foreground`}>{t("proof.other")}</p>
                <Link
                  href={`/case-studies/${secondary.slug}`}
                  className={`${OFFER_MONO_LINK} self-start md:self-center`}
                >
                  {t("proof.otherLink")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : null}
          </section>
        </div>

        {/* Ink emphasis band: Étienne Rubi's verbatim Monka quote. */}
        {monka?.quote ? (
          <OfferEditorialQuote
            quote={monka.quote.text}
            author={t("proof.quoteAttribution", { author: monka.quote.author })}
            locale={locale}
            logoSrc="/images/clients/monka.webp"
          />
        ) : null}

        <div data-surface="paper">
          {/* 5 healthcare deliverables in a balanced 2 + 3 layout. */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("offer.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("offer.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[62ch]`}>{t("offer.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
              {firstTwoOffers.map((key, i) => (
                <article
                  key={key}
                  className="lamp-card relative flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <div className="relative mb-8 flex items-baseline justify-between gap-3">
                    <span className="text-foreground text-[48px] font-bold leading-none tracking-[-0.05em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t(`offer.items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="relative m-0 mb-3 text-[clamp(1.45rem,2.1vw,1.9rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`relative ${OFFER_PROSE} max-w-[56ch] text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {lastThreeOffers.map((key, i) => (
                <article
                  key={key}
                  className="flex flex-col border border-border bg-card p-7 transition-colors duration-300 hover:border-border-strong md:p-9"
                >
                  <div className="mb-8 flex items-baseline justify-between gap-3">
                    <span className="text-foreground text-[44px] font-bold leading-none tracking-[-0.05em]">
                      {String(i + 3).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t(`offer.items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="m-0 mb-3 text-[21px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`${OFFER_PROSE} text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Audience fit: unboxed 2-column split. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("audience.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{t("audience.title")}</h2>
                <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[44ch]`}>{t("audience.intro")}</p>
              </div>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <div>
                  <span className={OFFER_MONO}>{t("audience.typesLabel")}</span>
                  <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
                    {HEALTHCARE_AUDIENCE_KEYS.map((key, i) => (
                      <li
                        key={key}
                        className="flex items-baseline gap-4 border-b border-border py-4 text-[16px] leading-[1.45] text-foreground"
                      >
                        <span className="font-mono text-xs tracking-[0.18em] text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{t(`audience.types.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className={OFFER_MONO}>{t("audience.signalsLabel")}</span>
                  <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
                    {(t.raw("audience.signals") as string[]).map((signal) => (
                      <li
                        key={signal}
                        className="flex gap-3 border-b border-border py-4 text-[16px] leading-[1.45] text-soft-foreground"
                      >
                        <span aria-hidden="true" className={OFFER_LIST_RULE} />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4-step method on ink. */}
        <OfferMethodBand
          kicker={t("method.stepsLabel")}
          title={t("method.title")}
          intro={t("method.intro")}
          steps={HEALTHCARE_METHOD_STEPS.map((step) => ({
            n: step.n,
            label: t(`method.steps.${step.key}.label`),
            title: t(`method.steps.${step.key}.title`),
            desc: t(`method.steps.${step.key}.desc`),
          }))}
          footer={
            <AboutBookingCta
              page={page}
              location="cta_healthcare_ai_method"
              namespace="healthcareAi"
              lit
            />
          }
        />

        <div data-surface="paper">
          <OfferFaqSection
            kicker={t("faq.kicker")}
            title={t("faq.title")}
            borderTop={false}
            items={HEALTHCARE_FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.q`),
              answer: t.rich(`faq.items.${key}.a`, faqLinks),
            }))}
          />

          <OfferFurtherReading
            kicker={t("further.kicker")}
            title={t("further.title")}
            articlesLabel={t("further.readingLabel")}
            articles={articles}
            offersLabel={t("further.offersLabel")}
            offers={siblingOffers}
          />
        </div>

        <FinalCTA namespace={locale === "fr" ? "healthcareAi.finalCta" : undefined} />
      </main>
      <Footer />
    </div>
  );
}
