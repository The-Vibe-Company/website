import type { Metadata } from "next";
import { ServiceHero } from "@/components/ServiceHero";
import { Clientele } from "@/components/home/landing/Clientele";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import {
  CUSTOM_AI_APP_APPS_KEYS,
  CUSTOM_AI_APP_CASES,
  CUSTOM_AI_APP_FAQ_KEYS,
  CUSTOM_AI_APP_HERO_KEYS,
  CUSTOM_AI_APP_METHOD_STEPS,
  CUSTOM_AI_APP_RAG_KEYS,
  CUSTOM_AI_APP_SECURITY_KEYS,
  customAiAppPageId,
  customAiAppRagArticle,
} from "@/lib/custom-ai-app";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
  CUSTOM_AI_APP_PATHS,
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
 * The custom AI application landing, served at
 * /fr/developpement-application-ia-sur-mesure and
 * /en/custom-ai-app-development. Both routes render this component; each
 * declares the other through hreflang.
 *
 * Drawn in the landing's theme, like the About page: the hero on the ink in
 * an orange bloom, then warm paper (lamp cards with lit numerals, the three
 * cases with lit figures), the method as an ink band in the orange light,
 * and the FAQ on paper. The page body carries exactly one booking call, in
 * the hero: no mid-page call and no FinalCTA.
 */

export async function customAiAppMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "customAiApp" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(CUSTOM_AI_APP_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, CUSTOM_AI_APP_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 text-balance font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
/** The soft orange light an emphasis ink band sits in. */
const GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

/** The FAQ answers' link tags, kept as plain text for the JSON-LD. */
const FAQ_PLAIN_TAGS = {
  case: (chunks: string) => chunks,
  rag: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  agents: (chunks: string) => chunks,
};

/** A titled grid of lamp cards: sections 1 to 3 share the same shape. */
function CardSection({
  title,
  intro,
  cards,
  first = false,
  children,
}: {
  title: string;
  intro: string;
  cards: { key: string; title: string; desc: string }[];
  /** The first section of a paper band carries no top rule. */
  first?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={first ? BAND : `${BAND} border-t border-border`}>
      <h2 className={`${H2} max-w-[20ch]`}>{title}</h2>
      <p className={`${PROSE} mt-6 max-w-[680px]`}>{intro}</p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
        {cards.map((card, i) => (
          <article
            key={card.key}
            className="lamp-card relative flex flex-col overflow-hidden border border-border p-7 md:p-9"
          >
            <span aria-hidden="true" className={LAMP} />
            <span className="text-lit relative mb-10 self-start text-[56px] font-bold leading-none tracking-[-0.05em]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="relative m-0 mb-4 text-[clamp(1.5rem,2.2vw,2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
              {card.title}
            </h3>
            <p className={`relative ${PROSE} max-w-[60ch] text-soft-foreground`}>{card.desc}</p>
          </article>
        ))}
      </div>

      {children}
    </section>
  );
}

export async function CustomAiAppPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale, namespace: "customAiApp" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(CUSTOM_AI_APP_PATHS, locale));
  const ragArticle = customAiAppRagArticle(locale);
  const agencyPath = splitPath(AGENCY_PARIS_PATHS, locale);
  const agentsPath = splitPath(AGENTS_PRODUCTION_PATHS, locale);
  const link = (href: string) =>
    function InlineLink(chunks: ReactNode) {
      return (
        <Link href={href} className={TEXT_LINK}>
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
    // Answers that name a client are left out by `isPublishable`, like
    // everywhere else on the site.
    faqPageSchema(
      CUSTOM_AI_APP_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        // The answers' inline links, dropped to the text the reader sees.
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

  const cards = (section: string, keys: readonly string[]) =>
    keys.map((key) => ({
      key,
      title: t(`${section}.items.${key}.title`),
      desc: t(`${section}.items.${key}.desc`),
    }));

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
        {/* 1 — On the ink, cut like the homepage's hero: the short headline,
            the full title as the H1's promise, the pitch and the call, the
            mascot standing in its light. */}
        <ServiceHero
          kicker={t("kicker")}
          display={t("displayTitle")}
          title={t("title")}
          lede={t("lede")}
          cta={<AboutBookingCta page={customAiAppPageId(locale)} location="cta_custom_ai_app_hero" namespace="customAiApp" />}
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
            <ul className="m-0 mt-6 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
              {CUSTOM_AI_APP_HERO_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-4 border-b border-border py-4 text-[15px] leading-[1.5] text-foreground md:text-base"
                >
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-brand" />
                  {t(`hero.items.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 1. AI applications and SaaS. */}
          <CardSection
            first
            title={t("apps.title")}
            intro={t("apps.intro")}
            cards={cards("apps", CUSTOM_AI_APP_APPS_KEYS)}
          />

          {/* 2. RAG architecture and agents, with the RAG article and the
              agents landing. */}
          <CardSection
            title={t("rag.title")}
            intro={t("rag.intro")}
            cards={cards("rag", CUSTOM_AI_APP_RAG_KEYS)}
          >
            <div className="mt-10 flex max-w-[760px] flex-col gap-3">
              <p className={PROSE}>{t.rich("rag.article", { link: link(ragArticle) })}</p>
              <p className={PROSE}>{t.rich("rag.agents", { link: link(agentsPath) })}</p>
            </div>
          </CardSection>

          {/* 3. Security, GDPR and business integrations. */}
          <CardSection
            title={t("security.title")}
            intro={t("security.intro")}
            cards={cards("security", CUSTOM_AI_APP_SECURITY_KEYS)}
          />

          {/* 4 to 6. The three cases: Monka, LocService, AFP / MediaGen. Every
              figure is either given in the brief or published on the case
              page, and lit like the homepage's. */}
          {CUSTOM_AI_APP_CASES.map(({ key, slug, stats }) => {
            const customer = getCustomer(slug, contentLocale);
            return (
              <section key={key} className={`${BAND} border-t border-border`}>
                <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                  <BrandSquare />
                  {t("cases.label")}
                </span>
                <h2 className={`${H2} mt-6 max-w-[20ch]`}>{t(`cases.${key}.title`)}</h2>
                <p className={`${PROSE} mt-6 max-w-[720px]`}>{t(`cases.${key}.intro`)}</p>

                <article className="mt-12 grid grid-cols-1 border border-border bg-card transition-colors duration-300 hover:border-border-strong md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                  <div className="flex flex-col border-b border-border p-7 md:p-9 lg:border-b-0 lg:border-r">
                    {customer ? (
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                        <h3 className="m-0">
                          {/* The logo is the card's title: its alt carries the client name. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={customer.logo}
                            alt={customer.client}
                            {...clientLogoSize(customer.logo)}
                            className="logo-tone h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                            loading="lazy"
                            decoding="async"
                          />
                        </h3>
                        <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
                          {customer.sector}
                        </span>
                      </div>
                    ) : null}

                    <dl className="m-0 mt-10 border-t border-border">
                      {stats.map((stat) => (
                        <div
                          key={stat}
                          className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-5 md:grid-cols-[minmax(0,140px)_minmax(0,1fr)]"
                        >
                          <dt className={MONO}>{t(`cases.${key}.stats.${stat}.label`)}</dt>
                          <dd className="m-0 text-[30px] font-bold leading-[1.05] tracking-[-0.04em] md:text-[40px]">
                            <span className="text-lit box-decoration-clone">
                              {t(`cases.${key}.stats.${stat}.value`)}
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {t.has(`cases.${key}.statNote`) ? (
                      <p className={`${PROSE} mt-5`}>{t(`cases.${key}.statNote`)}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col p-7 md:p-9">
                    <ul className="m-0 flex list-none flex-col p-0">
                      {(t.raw(`cases.${key}.points`) as string[]).map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 border-b border-border py-4 text-[15px] leading-[1.55] text-foreground last:border-b-0 md:text-base"
                        >
                          <span aria-hidden="true" className="font-mono text-brand">
                            →
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/case-studies/${slug}`} className={`${MONO_LINK} mt-auto self-start pt-6`}>
                      {t(`cases.${key}.readCase`)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              </section>
            );
          })}
        </div>

        {/* 7. Method and process: an ink band in the orange light, like the
            About process section. No booking call here: the page keeps a
            single one, in the hero. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: GLOW }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{t("method.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("method.intro")}</p>

            <ol className="m-0 mt-14 flex list-none flex-col border-t border-border p-0 md:mt-16">
              {CUSTOM_AI_APP_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-10"
                >
                  <span className="text-lit self-start text-5xl font-bold leading-none tracking-[-0.05em] md:text-[72px]">
                    {step.n}
                  </span>
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
          {/* 8. FAQ; the publishable answers are restated in the FAQPage
              JSON-LD above. Then the cross-links to the sibling landings. */}
          <section className={BAND}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 border-t border-border md:mt-16">
              {CUSTOM_AI_APP_FAQ_KEYS.map((key) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-3 border-b border-border py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
                >
                  <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`faq.items.${key}.q`)}
                  </h3>
                  <p className={`${PROSE} max-w-[70ch]`}>{t.rich(`faq.items.${key}.a`, faqLinks)}</p>
                </article>
              ))}
            </div>

            <nav aria-labelledby="custom-ai-app-see-also" className="mt-16">
              <span id="custom-ai-app-see-also" className={MONO}>
                {t("seeAlso.title")}
              </span>
              <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
                {[
                  { key: "agency", href: agencyPath },
                  { key: "agents", href: agentsPath },
                  { key: "rag", href: ragArticle },
                ].map((item) => (
                  <li key={item.key} className="flex">
                    <Link
                      href={item.href}
                      className="group flex w-full items-baseline justify-between gap-4 border border-border bg-card p-6 text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-foreground transition-colors duration-300 hover:border-border-strong md:p-7 md:text-[21px]"
                    >
                      <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-foreground">
                        {t(`seeAlso.${item.key}`)}
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-brand">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className={`${PROSE} mt-12 max-w-[760px] border-l border-border-strong pl-5`}>
              {t.rich("about", { link: link(splitPath(ABOUT_PATHS, locale)) })}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
