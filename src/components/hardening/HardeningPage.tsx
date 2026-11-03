import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBackers } from "@/components/about/AboutBackers";
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

/**
 * The service landing on hardening a product and its stack with a fleet of AI
 * agents, served at /fr/agents-ia-securite-produit and
 * /en/ai-agents-product-hardening. Both routes render this component; each
 * declares the other through hreflang.
 *
 * Built from the About page's pieces (mono kicker, clamp H1, bordered cards,
 * ink slab, FAQ rows, FinalCTA), with no new visual language.
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

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const H2 =
  "m-0 font-bold text-foreground text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";

export async function HardeningPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "hardening" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
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
        {/* 1 — The one H1 on the page, the promise, and the call. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}>{t("kicker")}</span>
          <h1
            className="m-0 max-w-[22ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>
          <p className="m-0 mt-8 max-w-[720px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
            {t("lede")}
          </p>

          <span className={`mt-10 block ${MONO}`}>{t("hero.label")}</span>
          <ul className="m-0 mt-4 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
            {HARDENING_HERO_KEYS.map((key) => (
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

          <AboutBookingCta page={hardeningPageId(locale)} location="cta_hardening" />
          <AboutBackers label={tAbout("backedBy")} />
        </section>

        {/* 2 — Why point-in-time tools miss the drift. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
            <h2 className={`${H2} max-w-[16ch]`}>{t("problem.title")}</h2>
            <div className="flex max-w-[68ch] flex-col gap-5">
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

        {/* 3 — The offer: six areas the fleet covers. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("offer.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("offer.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {HARDENING_OFFER_KEYS.map((key, i) => (
              <article
                key={key}
                className="flex flex-col border border-foreground bg-background p-7 transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
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
                <p className={PROSE}>{t(`offer.items.${key}.desc`)}</p>
                {key === "agents" ? (
                  <Link
                    href={localizedArticle(MCP_GUIDE_PATHS, locale)}
                    className={`${MONO_LINK} mt-5`}
                  >
                    {t("offer.items.agents.link")}
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            ))}
          </div>

          <p className="m-0 mt-10 max-w-[760px] border-l-2 border-orange-500 pl-5 text-[15px] leading-[1.6] text-foreground md:pl-6 md:text-base">
            {t("offer.guardrails")}
          </p>
        </section>

        {/* 4 — How it is rolled out, on the same ink slab as the About
            process section. */}
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
              {HARDENING_METHOD_STEPS.map((step) => (
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
                    <h3 className="m-0 max-w-[560px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[28px]">
                      {t(`method.steps.${step.key}.title`)}
                    </h3>
                    <p className="m-0 max-w-[560px] text-[15px] leading-[1.55] text-white/70 md:text-base">
                      {t(`method.steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5 — Proof: what we already run in production, and the cases. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <h2 className={H2}>{t("proof.title")}</h2>

          <ul className="m-0 mt-10 flex max-w-[860px] list-none flex-col border-t-2 border-foreground p-0 md:mt-12">
            <li className={`${PROSE} border-b border-border py-5 text-foreground`}>
              {t("proof.points.production")}
            </li>
            <li className={`${PROSE} border-b border-border py-5 text-foreground`}>
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
            <li className={`${PROSE} border-b border-border py-5 text-foreground`}>
              {t("proof.points.agency")}
            </li>
          </ul>

          <span className={`mt-12 block ${MONO} md:mt-16`}>{t("proof.casesLabel")}</span>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {cases.map(({ slug, customer }) =>
              customer ? (
                <article
                  key={slug}
                  className="flex flex-col border border-foreground bg-background p-7"
                >
                  <span className={MONO}>{customer.sector}</span>
                  <h3 className="m-0 mt-3 text-[26px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[32px]">
                    {customer.client}
                  </h3>
                  <p className={`${PROSE} mt-4 flex-1`}>{t(`proof.cases.${slug}`)}</p>
                  <Link
                    href={`/case-studies/${slug}`}
                    className={`${MONO_LINK} mt-6 border-t border-border pt-5`}
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
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("not.title")}</h2>
          <div className="mt-10 grid grid-cols-1 border-l border-t border-border md:mt-12 md:grid-cols-3">
            {HARDENING_NOT_KEYS.map((key, i) => (
              <article key={key} className="border-b border-r border-border p-7">
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 mt-4 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[22px]">
                  {t(`not.items.${key}.title`)}
                </h3>
                <p className={`${PROSE} mt-3`}>{t(`not.items.${key}.desc`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 7 — FAQ, mirrored word for word in the FAQPage JSON-LD above. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {HARDENING_FAQ_KEYS.map((key) => (
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
                    { key: "agentsProduction", href: splitPath(AGENTS_PRODUCTION_PATHS, locale) },
                    { key: "agency", href: splitPath(AGENCY_PARIS_PATHS, locale) },
                    { key: "about", href: splitPath(ABOUT_PATHS, locale) },
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
