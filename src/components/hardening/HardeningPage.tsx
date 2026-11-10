import type { Metadata } from "next";
import { ServiceHero } from "@/components/ServiceHero";
import { Clientele } from "@/components/home/landing/Clientele";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  AGENT_AUTHORITY_PATH,
  BLACK_OCTOBER_PATHS,
  HARDENING_CASE_SLUGS,
  HARDENING_FAQ_KEYS,
  HARDENING_HERO_KEYS,
  HARDENING_METHOD_STEPS,
  HARDENING_NOT_KEYS,
  HARDENING_OFFER_KEYS,
  HDS_GUIDE_PATHS,
  hardeningPageId,
  localizedArticle,
  MCP_GUIDE_PATHS,
} from "@/lib/hardening";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
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
import { BrandSquare } from "@/components/BrandSquare";

/**
 * The service landing on hardening a product and its stack with a fleet of AI
 * agents, served at /fr/agents-ia-securite-produit and
 * /en/ai-agents-product-hardening. Both routes render this component; each
 * declares the other through hreflang.
 *
 * Dressed like the homepage landing and the About page: the hero on the ink
 * in its orange bloom, warm paper for the problem and the offer (each area
 * under its lamp), the method as an ink band in the orange light, paper again
 * for proof, limits, FAQ and further reading, and the FinalCTA.
 */

export async function hardeningMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "hardening" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(HARDENING_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, HARDENING_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
/** A heading that shares its row with the text, sized like the homepage's
    products heading so it holds in half the width. */
const H2_SPLIT =
  "m-0 max-w-[16ch] font-bold text-foreground text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.95] tracking-[-0.04em]";
const PROOF_POINT =
  "m-0 py-5 text-[15px] leading-[1.6] text-foreground md:text-[17px] md:leading-[1.5]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";
/** The light an ink band sits in, as on the homepage's client quote. */
const INK_GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";

export async function HardeningPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "hardening" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const pageUrl = localizedUrl(locale, splitPath(HARDENING_PATHS, locale));
  const blackOctober = localizedArticle(BLACK_OCTOBER_PATHS, locale);

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

  // The authority article exists in French only, so it is always linked there.
  const pageLocale = locale as Locale;
  const reading: { key: string; href: string; locale: Locale }[] = [
    { key: "blackOctober", href: blackOctober, locale: pageLocale },
    { key: "authority", href: AGENT_AUTHORITY_PATH, locale: "fr" },
    { key: "mcp", href: localizedArticle(MCP_GUIDE_PATHS, locale), locale: pageLocale },
    { key: "hds", href: localizedArticle(HDS_GUIDE_PATHS, locale), locale: pageLocale },
  ];

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
        {/* 1 — On the ink, cut like the homepage's hero: the short headline,
            the full title as the H1's promise, the pitch and the call, the
            mascot standing in its light. */}
        <ServiceHero
          kicker={t("kicker")}
          display={t("displayTitle")}
          title={t("title")}
          lede={t("lede")}
          cta={<AboutBookingCta page={hardeningPageId(locale)} location="cta_hardening" />}
        />

        <div data-surface="paper">
          {/* The client logos running along the top of the paper, as on the
              homepage. */}
          <Clientele />

          {/* What the hero used to list, in short, at the top of the paper. */}
          <section className={`${SECTION} border-b border-border py-12 md:py-14`}>
            <span className={MONO}>
              <BrandSquare />
              {t("hero.label")}
            </span>
            <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-x-10 gap-y-5 p-0 md:grid-cols-2">
              {HARDENING_HERO_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 text-[16px] leading-[1.5] text-soft-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-brand"
                  />
                  {t(`hero.items.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 2 — Why point-in-time tools miss the drift. */}
          <section className={BAND}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
              <h2 className={H2_SPLIT}>{t("problem.title")}</h2>
              <div className="flex max-w-[68ch] flex-col gap-5 md:pt-3">
                <p className={PROSE}>{t("problem.p1")}</p>
                <p className={PROSE}>{t("problem.p2")}</p>
                <p className={PROSE}>
                  {t.rich("problem.p3", {
                    link: (chunks: ReactNode) => (
                      <Link href={blackOctober} className={TEXT_LINK}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* 3 — The offer: six areas the fleet covers, each under its
              lamp. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("offer.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("offer.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
              {HARDENING_OFFER_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <span aria-hidden="true" className={LAMP} />
                  <div className="relative mb-10 flex items-baseline justify-between gap-3">
                    <span className="text-lit text-[56px] font-bold leading-none tracking-[-0.05em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t(`offer.items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="relative m-0 mb-4 text-[clamp(1.5rem,2vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`relative ${PROSE} text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                  {key === "agents" ? (
                    <Link
                      href={localizedArticle(MCP_GUIDE_PATHS, locale)}
                      className={`relative ${MONO_LINK} mt-6 self-start`}
                    >
                      {t("offer.items.agents.link")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>

            <p className="m-0 mt-12 max-w-[760px] border-l-2 border-brand pl-5 text-[15px] leading-[1.6] text-foreground md:pl-6 md:text-base">
              {t("offer.guardrails")}
            </p>
          </section>
        </div>

        {/* 4 — How it is rolled out: an ink band in the orange light, like
            the homepage's client quote. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: INK_GLOW }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{t("method.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("method.intro")}</p>

            <span className={`mt-14 block border-b border-border pb-4 md:mt-16 ${MONO}`}>
              {t("method.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {HARDENING_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-10"
                >
                  <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="text-lit text-5xl font-bold leading-none tracking-[-0.05em] md:text-[72px]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                      {t(`method.steps.${step.key}.label`)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 max-w-[560px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[30px]">
                      {t(`method.steps.${step.key}.title`)}
                    </h3>
                    <p className={`${PROSE} max-w-[560px]`}>
                      {t(`method.steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div data-surface="paper">
          {/* 5 — Proof: what we already run in production, and the cases,
              each under its lamp. */}
          <section className={BAND}>
            <h2 className={H2}>{t("proof.title")}</h2>

            <ul className="m-0 mt-12 flex max-w-[860px] list-none flex-col p-0 md:mt-16">
              <li className={PROOF_POINT}>
                {t("proof.points.production")}
              </li>
              <li className={PROOF_POINT}>
                {t.rich("proof.points.public", {
                  black: (chunks: ReactNode) => (
                    <Link href={blackOctober} className={TEXT_LINK}>
                      {chunks}
                    </Link>
                  ),
                  authority: (chunks: ReactNode) => (
                    <Link href={AGENT_AUTHORITY_PATH} locale="fr" className={TEXT_LINK}>
                      {chunks}
                    </Link>
                  ),
                })}
              </li>
              <li className={PROOF_POINT}>
                {t("proof.points.agency")}
              </li>
            </ul>

            <span className={`mt-14 block ${MONO} md:mt-16`}>{t("proof.casesLabel")}</span>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {cases.map(({ slug, customer }) =>
                customer ? (
                  <article
                    key={slug}
                    className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
                  >
                    <span aria-hidden="true" className={LAMP} />
                    <span className="relative font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                      {customer.sector}
                    </span>
                    <h3 className="relative m-0 mt-4 text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                      {customer.client}
                    </h3>
                    <p className={`relative ${PROSE} mt-4 flex-1 text-soft-foreground`}>
                      {t(`proof.cases.${slug}`)}
                    </p>
                    <Link
                      href={`/case-studies/${slug}`}
                      className={`relative ${MONO_LINK} mt-6 self-start`}
                    >
                      {t("proof.readCase")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ) : null,
              )}
            </div>
          </section>

          {/* 6 — What this is not, to set expectations. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("not.title")}</h2>
            <div className="mt-12 grid grid-cols-1 border-l border-t border-border md:mt-16 md:grid-cols-3">
              {HARDENING_NOT_KEYS.map((key, i) => (
                <article key={key} className="border-b border-r border-border bg-card p-7 md:p-8">
                  <span className="text-lit text-[40px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-6 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[22px]">
                    {t(`not.items.${key}.title`)}
                  </h3>
                  <p className={`${PROSE} mt-3`}>{t(`not.items.${key}.desc`)}</p>
                </article>
              ))}
            </div>
          </section>

          {/* 7 — FAQ, mirrored word for word in the FAQPage JSON-LD above. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 md:mt-16">
              {HARDENING_FAQ_KEYS.map((key) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
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
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("further.title")}</h2>
            <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
              <div>
                <span className={MONO}>{t("further.readingLabel")}</span>
                <ul className="m-0 mt-4 list-none p-0">
                  {reading.map((item) => (
                    <li key={item.key} className="border-b border-border">
                      <Link
                        href={item.href}
                        locale={item.locale}
                        className="group flex items-baseline justify-between gap-4 py-4 text-[15px] leading-[1.45] text-foreground md:text-base"
                      >
                        <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-foreground">
                          {t(`further.reading.${item.key}`)}
                        </span>
                        <span aria-hidden="true" className="shrink-0 transition-colors group-hover:text-brand">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className={MONO}>{t("further.alsoLabel")}</span>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {(
                    [
                      { key: "agentsProduction", href: splitPath(AGENTS_PRODUCTION_PATHS, locale) },
                      { key: "agency", href: splitPath(AGENCY_PARIS_PATHS, locale) },
                      { key: "about", href: splitPath(ABOUT_PATHS, locale) },
                    ] as const
                  ).map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group block border border-border bg-card p-6 transition-colors duration-300 hover:border-border-strong"
                    >
                      <span className="flex items-baseline justify-between gap-4 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                        {t(`further.${item.key}.title`)}
                        <span aria-hidden="true" className="text-lg transition-colors group-hover:text-brand">
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
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
