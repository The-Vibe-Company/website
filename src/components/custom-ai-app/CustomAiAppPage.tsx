import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBackers } from "@/components/about/AboutBackers";
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

/**
 * The custom AI application landing, served at
 * /fr/developpement-application-ia-sur-mesure and
 * /en/custom-ai-app-development. Both routes render this component; each
 * declares the other through hreflang.
 *
 * Built from the other service landings (mono kicker, clamp H1, bordered
 * cards, case cards, ink slab, FAQ rows), with no new visual language. The
 * page body carries exactly one booking call, in the hero: no mid-page call
 * and no FinalCTA.
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
const CARD_HOVER =
  "transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]";

/** The FAQ answers' link tags, kept as plain text for the JSON-LD. */
const FAQ_PLAIN_TAGS = {
  case: (chunks: string) => chunks,
  rag: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  agents: (chunks: string) => chunks,
};

/** A titled card grid: sections 1 to 3 share the same shape. */
function CardSection({
  title,
  intro,
  cards,
  children,
}: {
  title: string;
  intro: string;
  cards: { key: string; title: string; desc: string }[];
  children?: ReactNode;
}) {
  return (
    <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
      <h2 className={`${H2} max-w-[22ch]`}>{title}</h2>
      <p className={`${PROSE} mt-5 max-w-[680px]`}>{intro}</p>

      <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2">
        {cards.map((card, i) => (
          <article
            key={card.key}
            className={`flex flex-col border border-foreground bg-background p-7 ${CARD_HOVER}`}
          >
            <span className="mb-7 font-mono text-xs tracking-[0.2em] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="m-0 mb-4 text-[24px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(22px,2.2vw,28px)]">
              {card.title}
            </h3>
            <p className={`${PROSE} max-w-[60ch]`}>{card.desc}</p>
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
  const tAbout = await getTranslations({ locale, namespace: "about" });
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
        {/* Hero: the one H1, the promise, and the page's only booking call. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}>{t("kicker")}</span>
          <h1
            className="m-0 max-w-[24ch] font-bold text-foreground"
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
            {CUSTOM_AI_APP_HERO_KEYS.map((key) => (
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
            page={customAiAppPageId(locale)}
            location="cta_custom_ai_app_hero"
            namespace="customAiApp"
          />
          <AboutBackers label={tAbout("backedBy")} />
        </section>

        {/* 1. AI applications and SaaS. */}
        <CardSection
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
          <div className="mt-8 flex flex-col gap-3">
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
            figure is either given in the brief or published on the case page. */}
        {CUSTOM_AI_APP_CASES.map(({ key, slug, stats }) => {
          const customer = getCustomer(slug, contentLocale);
          return (
            <section key={key} className={`${SECTION} border-t border-border py-14 md:py-20`}>
              <span className={`mb-5 block ${MONO}`}>{t("cases.label")}</span>
              <h2 className={`${H2} max-w-[22ch]`}>{t(`cases.${key}.title`)}</h2>
              <p className={`${PROSE} mt-5 max-w-[720px]`}>{t(`cases.${key}.intro`)}</p>

              <article
                className={`mt-10 grid grid-cols-1 border border-foreground bg-background md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] ${CARD_HOVER}`}
              >
                <div className="flex flex-col border-b border-foreground p-7 md:p-9 lg:border-b-0 lg:border-r">
                  {customer ? (
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                      <h3 className="m-0">
                        {/* The logo is the card's title: its alt carries the client name. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customer.logo}
                          alt={customer.client}
                          {...clientLogoSize(customer.logo)}
                          className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                          loading="lazy"
                          decoding="async"
                        />
                      </h3>
                      <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                        {customer.sector}
                      </span>
                    </div>
                  ) : null}

                  <dl className="m-0 mt-8 border-t-2 border-foreground">
                    {stats.map((stat) => (
                      <div
                        key={stat}
                        className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-4"
                      >
                        <dt className={MONO}>{t(`cases.${key}.stats.${stat}.label`)}</dt>
                        <dd className="m-0 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                          {t(`cases.${key}.stats.${stat}.value`)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {t.has(`cases.${key}.statNote`) ? (
                    <p className={`${PROSE} mt-4`}>{t(`cases.${key}.statNote`)}</p>
                  ) : null}
                </div>
                <div className="flex flex-col p-7 md:p-9">
                  <ul className="m-0 flex list-none flex-col p-0">
                    {(t.raw(`cases.${key}.points`) as string[]).map((point) => (
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
                  <Link href={`/case-studies/${slug}`} className={`${MONO_LINK} mt-auto self-start pt-6`}>
                    {t(`cases.${key}.readCase`)}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </section>
          );
        })}

        {/* 7. Method and process, on the same ink slab as the other landings.
            No booking call here: the page keeps a single one, in the hero. */}
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

            <ol className="m-0 mt-12 flex list-none flex-col border-t border-white/15 p-0 md:mt-16">
              {CUSTOM_AI_APP_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-white/15 py-7 md:grid-cols-[200px_1fr] md:gap-12 md:py-8"
                >
                  <span className="text-4xl font-bold leading-none tracking-[-0.05em] text-background md:text-[56px]">
                    {step.n}
                  </span>
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
          </div>
        </section>

        {/* 8. FAQ; the publishable answers are restated in the FAQPage
            JSON-LD above. Then the cross-links to the sibling landings. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {CUSTOM_AI_APP_FAQ_KEYS.map((key) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-8"
              >
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {t(`faq.items.${key}.q`)}
                </h3>
                <p className={`${PROSE} max-w-[70ch]`}>{t.rich(`faq.items.${key}.a`, faqLinks)}</p>
              </article>
            ))}
          </div>

          <nav aria-labelledby="custom-ai-app-see-also" className="mt-12">
            <span id="custom-ai-app-see-also" className={MONO}>
              {t("seeAlso.title")}
            </span>
            <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
              {[
                { key: "agency", href: agencyPath },
                { key: "agents", href: agentsPath },
                { key: "rag", href: ragArticle },
              ].map((item) => (
                <li key={item.key} className="border-b border-border py-4">
                  <Link href={item.href} className={`${TEXT_LINK} text-[17px] leading-[1.45]`}>
                    {t(`seeAlso.${item.key}`)}
                    <span aria-hidden="true"> →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className={`${PROSE} mt-10 border-l-2 border-foreground pl-5`}>
            {t.rich("about", { link: link(splitPath(ABOUT_PATHS, locale)) })}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
