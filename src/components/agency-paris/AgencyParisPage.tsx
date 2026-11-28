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
import { OfferEditorialQuote } from "@/components/offer/OfferEditorialQuote";
import { OfferFactsStrip, type OfferFactItem } from "@/components/offer/OfferFactsStrip";
import { OfferFaqSection } from "@/components/offer/OfferFaqSection";
import { OfferFurtherReading } from "@/components/offer/OfferFurtherReading";
import { OfferMethodBand } from "@/components/offer/OfferMethodBand";
import {
  OFFER_BAND,
  OFFER_H2,
  OFFER_H2_SPLIT,
  OFFER_H3,
  OFFER_INLINE_LINK,
  OFFER_LIST_RULE,
  OFFER_MONO,
  OFFER_MONO_LINK,
  OFFER_PROSE,
  OFFER_PROSE_LEAD,
} from "@/components/offer/offer-styles";
import { Link } from "@/i18n/navigation";
import { ABOUT_ORIGIN_ARTICLE_LOCALE, ABOUT_ORIGIN_ARTICLE_PATH } from "@/lib/about";
import {
  AGENCY_PARIS_ARTICLES,
  AGENCY_PARIS_COMPARISON,
  AGENCY_PARIS_FAQ_KEYS,
  AGENCY_PARIS_OFFER_KEYS,
  AGENCY_PARIS_PLAYERS,
  AGENCY_PARIS_PROOF_SLUGS,
  AGENCY_PARIS_STEPS,
  OFFICE_ADDRESS,
} from "@/lib/agency-paris";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import { keepPunctuationAttached } from "@/lib/french-spacing";
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
 * Commercial "AI agency in Paris" offer page (/fr/agence-ia-paris,
 * /en/ai-agency-paris).
 *
 * Visual arc: Ink hero with answer block and booking slab, warm paper with
 * logo marquee, 4-column sourced proof ledger, published cases under warm
 * lamps, Monka CEO quote on ink in orange light, audience fit and three offers
 * on paper, 5-step method on ink, honest Paris agency landscape, AI vs
 * generalist + GDPR/HDS and Paris team on paper, 6-question FAQ, further
 * reading and sibling offers, and the closing scene.
 */

export async function agencyParisMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "agencyParis" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(AGENCY_PARIS_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, AGENCY_PARIS_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

export async function AgencyParisPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale, namespace: "agencyParis" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const d = (text: string) => (contentLocale === "fr" ? keepPunctuationAttached(text) : text);
  const attach = (node: ReactNode): ReactNode =>
    typeof node === "string" ? d(node) : Array.isArray(node) ? node.map(attach) : node;

  const pageUrl = localizedUrl(locale, splitPath(AGENCY_PARIS_PATHS, locale));
  const page = splitPath(AGENCY_PARIS_PATHS, locale).slice(1);
  const comparison = AGENCY_PARIS_COMPARISON[contentLocale];

  const proofCases = AGENCY_PARIS_PROOF_SLUGS.map((slug) => getCustomer(slug, contentLocale)).filter(
    (customer) => customer !== undefined,
  );
  const [featured, ...others] = proofCases;
  const players = AGENCY_PARIS_PLAYERS.map((player, i) => ({ ...player, n: i + 1 }));

  const comparisonLink = (chunks: ReactNode) => (
    <Link href={comparison.path} locale={comparison.locale} className={OFFER_INLINE_LINK}>
      {chunks}
    </Link>
  );

  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: t("metaTitle"),
      description: t("metaDescription"),
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: t("breadcrumb"), url: pageUrl },
    ]),
    faqPageSchema(
      AGENCY_PARIS_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        answer: t.markup(`faq.items.${key}.a`, { link: (chunks) => chunks }),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("serviceName"),
      serviceType: "AI product development, AI agents, AI training",
      city: "Paris",
    }),
  ];

  const facts = (t.raw("facts") as OfferFactItem[]).map((item) => ({
    ...item,
    figure: d(item.figure),
    detail: d(item.detail),
  }));

  const articles = [
    {
      key: "comparison",
      label: d(t("links.comparison")),
      href: comparison.path,
      locale: comparison.locale,
    },
    {
      key: "choose",
      label: d(t("links.choose")),
      href: AGENCY_PARIS_ARTICLES.choose[contentLocale],
      locale: contentLocale,
    },
    {
      key: "steps",
      label: d(t("links.steps")),
      href: AGENCY_PARIS_ARTICLES.steps[contentLocale],
      locale: contentLocale,
    },
    {
      key: "versus",
      label: d(t("links.versus")),
      href: AGENCY_PARIS_ARTICLES.versus[contentLocale],
      locale: contentLocale,
    },
  ];

  const siblingOffers = [
    {
      key: "agentsProduction",
      title: d(t("links.offers.agentsProduction.title")),
      desc: d(t("links.offers.agentsProduction.desc")),
      href: splitPath(AGENTS_PRODUCTION_PATHS, locale),
    },
    {
      key: "customAiApp",
      title: d(t("links.offers.customAiApp.title")),
      desc: d(t("links.offers.customAiApp.desc")),
      href: splitPath(CUSTOM_AI_APP_PATHS, locale),
    },
    {
      key: "hardening",
      title: d(t("links.offers.hardening.title")),
      desc: d(t("links.offers.hardening.desc")),
      href: splitPath(HARDENING_PATHS, locale),
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
          display={t("displayTitle")}
          title={t("title")}
          lede={(t.raw("lede") as string[]).map(d)}
          cta={
            <AboutBookingCta
              page={page}
              location="cta_agency_paris_hero"
              namespace="agencyParis"
              lit
            />
          }
        />

        <div data-surface="paper">
          <Clientele exclude={["Softway Medical"]} />

          <OfferFactsStrip kicker={t("factsLabel")} items={facts} />

          {/* Proof first: placed right where a skeptical buyer asks what actually shipped. */}
          <section className={OFFER_BAND}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("proof.kicker")}
                </p>
                <h2 className={`${OFFER_H2} max-w-[20ch]`}>{d(t("proof.title"))}</h2>
                <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[60ch]`}>{d(t("proof.intro"))}</p>
              </div>
              <Link href="/case-studies" className={`shrink-0 ${OFFER_MONO_LINK}`}>
                {t("proof.linkLabel")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {featured ? (
              <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div className="relative flex flex-col justify-between border-b border-border p-7 md:p-10 lg:border-b-0 lg:border-r">
                  <CaseHeader
                    logo={featured.logo}
                    client={featured.client}
                    sector={t(`proof.cases.${featured.slug}.sector`)}
                  />
                  <div className="mt-10 lg:mt-14">
                    <div className="text-foreground text-[clamp(3.25rem,6.5vw,5.5rem)] font-bold leading-none tracking-[-0.055em]">
                      {t(`proof.cases.${featured.slug}.figure`)}
                    </div>
                    <p className="m-0 mt-3 max-w-[34ch] text-[15px] leading-[1.5] text-soft-foreground">
                      {d(t(`proof.cases.${featured.slug}.caption`))}
                    </p>
                  </div>
                </div>
                <div className="relative flex flex-col p-7 md:p-10">
                  <CasePoints
                    points={(t.raw(`proof.cases.${featured.slug}.points`) as string[]).map(d)}
                  />
                  <CaseLink
                    slug={featured.slug}
                    label={t("proof.readCase", { name: featured.client })}
                  />
                </div>
              </article>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {others.map((customer) => (
                <article
                  key={customer.slug}
                  className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <div className="relative">
                    <CaseHeader
                      logo={customer.logo}
                      client={customer.client}
                      sector={t(`proof.cases.${customer.slug}.sector`)}
                    />
                  </div>
                  <div className="text-foreground relative mt-8 text-[clamp(2.5rem,4.2vw,3.75rem)] font-bold leading-none tracking-[-0.05em]">
                    {t(`proof.cases.${customer.slug}.figure`)}
                  </div>
                  <div className="relative mt-6 flex flex-1 flex-col border-t border-border pt-5">
                    <CasePoints
                      points={(t.raw(`proof.cases.${customer.slug}.points`) as string[]).map(d)}
                    />
                    <CaseLink
                      slug={customer.slug}
                      label={t("proof.readCase", { name: customer.client })}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Ink emphasis band: Monka CEO quote verbatim from src/lib/customers.ts. */}
        {featured?.quote ? (
          <OfferEditorialQuote
            quote={featured.quote.text}
            author={featured.quote.author}
            locale={locale}
            logoSrc="/images/clients/monka.webp"
          />
        ) : null}

        <div data-surface="paper">
          {/* Audience fit: asymmetric editorial split, unboxed typography. */}
          <section className={OFFER_BAND}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("audience.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{d(t("audience.title"))}</h2>
                <p className={`${OFFER_PROSE_LEAD} mt-6 max-w-[44ch]`}>{d(t("audience.intro"))}</p>
              </div>

              <div className="flex flex-col gap-12">
                <div>
                  <h3 className={`m-0 font-normal ${OFFER_MONO}`}>{t("audience.signalsLabel")}</h3>
                  <ul className="m-0 mt-5 flex list-none flex-col border-t border-border p-0">
                    {(t.raw("audience.signals") as string[]).map((item) => (
                      <li
                        key={item}
                        className="flex gap-3.5 border-b border-border py-4 text-[16px] leading-[1.5] text-foreground md:text-[17px]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-brand"
                        />
                        <span>{d(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className={`m-0 font-normal ${OFFER_MONO}`}>{t("audience.notFitLabel")}</h3>
                  <ul className="m-0 mt-5 flex list-none flex-col border-t border-border p-0">
                    {(t.raw("audience.notFit") as string[]).map((item) => (
                      <li
                        key={item}
                        className="flex gap-3.5 border-b border-border py-4 text-[16px] leading-[1.5] text-muted-foreground md:text-[17px]"
                      >
                        <span aria-hidden="true" className={OFFER_LIST_RULE} />
                        <span>{d(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Three ways to work together: 3 lamp cards with aligned row tracks. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("offers.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{d(t("offers.title"))}</h2>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 lg:grid-cols-3">
              {AGENCY_PARIS_OFFER_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <div className="relative mb-10 flex items-baseline justify-between gap-3">
                    <span className="text-foreground text-[52px] font-bold leading-none tracking-[-0.05em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {tServices(`items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="relative m-0 mb-4 text-[clamp(1.5rem,2.1vw,2rem)] font-bold leading-[1.06] tracking-[-0.03em] text-foreground">
                    {t(`offers.items.${key}.label`)}
                    <span className="mt-1 block text-muted-foreground">
                      {t(`offers.items.${key}.title`)}
                    </span>
                  </h3>
                  <p className={`relative flex-1 ${OFFER_PROSE} text-soft-foreground`}>
                    {d(t(`offers.items.${key}.desc`))}
                  </p>
                  {key === "build" || key === "operate" ? (
                    <Link
                      href={splitPath(
                        key === "build" ? CUSTOM_AI_APP_PATHS : AGENTS_PRODUCTION_PATHS,
                        locale,
                      )}
                      className={`relative ${OFFER_MONO_LINK} mt-7 self-start`}
                    >
                      {t(`offers.items.${key}.link`)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* 5-step delivery method on ink in warm orange light. */}
        <OfferMethodBand
          kicker={t("method.kicker")}
          title={d(t("method.title"))}
          intro={d(t("method.intro"))}
          steps={AGENCY_PARIS_STEPS.map((step) => ({
            n: step.n,
            title: d(t(`method.steps.${step.key}.title`)),
            desc: d(t(`method.steps.${step.key}.desc`)),
          }))}
          footer={
            <div>
              <p className="m-0 max-w-[46ch] text-[18px] leading-[1.45] text-foreground md:text-[21px]">
                {d(t("cta.text"))}
              </p>
              <AboutBookingCta
                page={page}
                location="cta_agency_paris_method"
                namespace="agencyParis"
                lit
              />
            </div>
          }
        />

        <div data-surface="paper">
          {/* Honest Paris AI landscape: the 8 firms in mandatory order + 3 buyer questions. */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("landscape.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{d(t("landscape.title"))}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-6 max-w-[66ch]`}>{d(t("landscape.intro"))}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
              {(
                [
                  ["sme", "landscape.smeTitle"],
                  ["large", "landscape.largeTitle"],
                ] as const
              ).map(([group, titleKey]) => {
                const members = players.filter((player) => player.group === group);
                return (
                  <div key={group} className="border border-border bg-card p-7 md:p-9">
                    <h3 className={`m-0 font-normal ${OFFER_MONO}`}>{t(titleKey)}</h3>
                    <ol start={members[0]?.n} className="m-0 mt-5 flex list-none flex-col p-0">
                      {members.map((player) => (
                        <li
                          key={player.name}
                          className="flex items-baseline gap-5 border-b border-border py-4 last:border-b-0"
                        >
                          <span
                            aria-hidden="true"
                            className="w-8 shrink-0 font-mono text-[12px] tracking-[0.1em] text-muted-foreground"
                          >
                            {String(player.n).padStart(2, "0")}
                          </span>
                          <span className="text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                            {player.name}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col gap-4">
                <p className={OFFER_PROSE}>{d(t("landscape.pointers"))}</p>
                <p className={OFFER_PROSE}>{d(t("landscape.others"))}</p>
                <Link
                  href={comparison.path}
                  locale={comparison.locale}
                  className={`${OFFER_MONO_LINK} mt-3 self-start`}
                >
                  {t("landscape.linkLabel")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div>
                <h3 className={OFFER_H3}>{d(t("landscape.questionsTitle"))}</h3>
                <ol className="m-0 mt-5 flex list-none flex-col border-t border-border p-0">
                  {(t.raw("landscape.questions") as string[]).map((question, i) => (
                    <li
                      key={question}
                      className="flex gap-4 border-b border-border py-4 text-[16px] leading-[1.45] text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[12px] leading-[2] text-brand"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{d(question)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* AI agency vs generalist + Security (GDPR / HDS) + Paris office in one crisp editorial section. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col gap-5">
                <p className={`m-0 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("versus.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{d(t("versus.title"))}</h2>
                {(t.raw("versus.text") as string[]).map((paragraph, i) => (
                  <p key={paragraph} className={i === 0 ? OFFER_PROSE_LEAD : OFFER_PROSE}>
                    {d(paragraph)}
                  </p>
                ))}
                <Link
                  href={comparison.path}
                  locale={comparison.locale}
                  className={`${OFFER_MONO_LINK} mt-2 self-start`}
                >
                  {t("versus.linkLabel")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="flex flex-col gap-8 border-t border-border pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                <div className="flex flex-col gap-4">
                  <p className={`m-0 inline-flex items-center ${OFFER_MONO}`}>
                    <BrandSquare />
                    {t("security.kicker")}
                  </p>
                  <h3 className="m-0 text-[24px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                    {d(t("security.title"))}
                  </h3>
                  {(t.raw("security.text") as string[]).map((paragraph) => (
                    <p key={paragraph} className={OFFER_PROSE}>
                      {d(paragraph)}
                    </p>
                  ))}
                </div>

                <div className="border border-border bg-card p-7 md:p-8">
                  <p className={`m-0 inline-flex items-center ${OFFER_MONO}`}>
                    <BrandSquare />
                    {t("team.addressTitle")}
                  </p>
                  <address className="mt-3 text-[20px] font-bold not-italic leading-[1.2] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {OFFICE_ADDRESS.display}
                  </address>
                  {(t.raw("team.desc") as string[]).map((paragraph) => (
                    <p key={paragraph} className={`${OFFER_PROSE} mt-3`}>
                      {d(paragraph)}
                    </p>
                  ))}
                  <p className={`${OFFER_PROSE} mt-3`}>{d(t("team.addressNote"))}</p>
                  <p className="m-0 mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t("team.notToConfuse")}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5">
                    <Link href={splitPath(ABOUT_PATHS, locale)} className={OFFER_MONO_LINK}>
                      {t("team.aboutLink")}
                      <span aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href={ABOUT_ORIGIN_ARTICLE_PATH}
                      locale={ABOUT_ORIGIN_ARTICLE_LOCALE}
                      className={OFFER_MONO_LINK}
                    >
                      {t("team.originLink")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <OfferFaqSection
            kicker={t("faq.kicker")}
            title={d(t("faq.title"))}
            items={AGENCY_PARIS_FAQ_KEYS.map((key) => ({
              key,
              question: d(t(`faq.items.${key}.q`)),
              answer: attach(t.rich(`faq.items.${key}.a`, { link: comparisonLink })),
            }))}
          />

          <OfferFurtherReading
            kicker={t("links.kicker")}
            title={d(t("links.title"))}
            articlesLabel={t("links.articlesLabel")}
            articles={articles}
            offersLabel={t("links.offersLabel")}
            offers={siblingOffers}
          />
        </div>

        <FinalCTA namespace="agencyParis.finalCta" />
      </main>
      <Footer />
    </div>
  );
}

function CaseHeader({ logo, client, sector }: { logo?: string; client: string; sector: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <h3 className="m-0">
        <ClientMark
          logo={logo}
          client={client}
          className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
          textClassName="text-[24px] md:text-[28px]"
        />
      </h3>
      <span className="max-w-[16rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
        {sector}
      </span>
    </div>
  );
}

function CasePoints({ points }: { points: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {points.map((point) => (
        <li key={point} className="flex gap-3 py-2.5 text-[15px] leading-[1.55] text-foreground">
          <span aria-hidden="true" className="font-mono text-brand">
            →
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function CaseLink({ slug, label }: { slug: string; label: string }) {
  return (
    <Link href={`/case-studies/${slug}`} className={`mt-auto pt-6 ${OFFER_MONO_LINK} self-start`}>
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
