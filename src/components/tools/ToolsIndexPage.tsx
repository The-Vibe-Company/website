import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Children, type ReactNode } from "react";

import { BrandSquare } from "@/components/BrandSquare";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import { keepPunctuationAttached } from "@/lib/french-spacing";
import {
  AGENCY_PARIS_PATHS,
  AGENT_READY_PATHS,
  localizedSocialMetadata,
  localizedUrl,
  splitPath,
  splitPathAlternates,
  TOOLS_PATHS,
  type SplitPaths,
} from "@/lib/site";
import { breadcrumbList, collectionPageSchema, faqPageSchema } from "@/lib/structured-data";
import { TOOLS } from "@/lib/tools";

/**
 * The tools section, served at /fr/tools and /en/tools: an introduction, one
 * card per entry of TOOLS (src/lib/tools.ts), the first one under the lamp,
 * then the explainers around the agent-ready checker (categories, llms.txt,
 * reading the score), a FAQ restated in FAQPage JSON-LD, and what comes next.
 */

/** FAQ entries, in order, under `tools.faq.items.<key>.{q,a}`. */
export const TOOLS_FAQ_KEYS = ["free", "ready", "llms", "data", "dev"] as const;

/** The agent-ready categories explained on the hub, in order (`tools.agentReady.<key>`). */
const AGENT_READY_CATEGORY_KEYS = ["discovery", "content", "bots", "protocols", "commerce"] as const;

/** Reading links of the hub. The MCP article lives under its own slug in each language. */
const AEO_ARTICLE_PATHS: SplitPaths = {
  fr: "/resources/articles/etre-cite-chatgpt-gemini-aeo",
  en: "/resources/articles/get-cited-chatgpt-gemini-aeo",
};
const MCP_ARTICLE_PATHS: SplitPaths = {
  fr: "/resources/articles/serveur-mcp-entreprise",
  en: "/resources/articles/what-is-an-mcp-server",
};

export async function toolsMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tools" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(TOOLS_PATHS, locale);
  return {
    // Absolute: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, TOOLS_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const MONO = "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 max-w-[24ch] font-bold text-foreground text-[clamp(2rem,4.2vw,3.75rem)] leading-[0.95] tracking-[-0.045em]";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const PROSE_STACK = "mt-10 flex max-w-[68ch] flex-col gap-5 md:mt-12";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";

export async function ToolsIndexPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "tools" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const display = (text: string) => (locale === "fr" ? keepPunctuationAttached(text) : text);
  // `display` on the plain-text runs of a rich message, links included.
  const displayNodes = (nodes: ReactNode) =>
    Children.map(nodes, (node) => (typeof node === "string" ? display(node) : node));
  const link = (href: string) =>
    function InlineLink(chunks: ReactNode) {
      return (
        <Link href={href} className={TEXT_LINK}>
          {displayNodes(chunks)}
        </Link>
      );
    };
  const links = {
    agencyLink: link(splitPath(AGENCY_PARIS_PATHS, locale)),
    mcpLink: link(splitPath(MCP_ARTICLE_PATHS, locale)),
    aeoLink: link(splitPath(AEO_ARTICLE_PATHS, locale)),
    resourcesLink: link("/resources"),
  };
  const rich = (key: string) => displayNodes(t.rich(key, links));
  const faqItems = TOOLS_FAQ_KEYS.map((key) => ({
    key,
    question: t(`faq.items.${key}.q`),
    answer: t(`faq.items.${key}.a`),
  }));
  const url = localizedUrl(locale, splitPath(TOOLS_PATHS, locale));
  const items = TOOLS.map((tool) => ({
    ...tool,
    name: t(`items.${tool.key}.name`),
    description: t(`items.${tool.key}.description`),
    href: splitPath(tool.paths, locale),
  }));

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <JsonLd
        data={breadcrumbList([
          { name: tFooter("home"), url: localizedUrl(locale) },
          { name: t("breadcrumb"), url },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          url,
          name: t("metaTitle"),
          description: t("metaDescription"),
          language: locale,
          items: items.map((item) => ({ name: item.name, url: localizedUrl(locale, item.href) })),
        })}
      />
      {/* The visible FAQ below, word for word. */}
      <JsonLd data={faqPageSchema(faqItems.map(({ question, answer }) => ({ question, answer })))} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
            style={{
              background:
                "radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)",
            }}
          />
          <div className={`relative ${SECTION} pb-20 pt-12 md:pb-28 lg:pt-[80px]`}>
            <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h1 className="m-0 mt-8 max-w-[18ch] text-[clamp(2.75rem,7vw,7rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-10">
              {display(t("title"))}
            </h1>
            <p className="m-0 mt-10 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {display(t("lede"))}
            </p>
          </div>
        </section>

        <div data-surface="paper">
          {/* What you will find here. */}
          <section className={`${BAND} pb-0 md:pb-0 lg:pb-0`}>
            <h2 className={H2}>{display(t("intro.title"))}</h2>
            <div className={PROSE_STACK}>
              <p className={PROSE}>{rich("intro.p1")}</p>
              <p className={PROSE}>{display(t("intro.p2"))}</p>
            </div>
          </section>

          <section className={BAND}>
            <h2 className={H2}>{display(t("listTitle"))}</h2>
            <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-14 md:grid-cols-2">
              {items.map((item, index) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`group flex h-full flex-col border border-border p-7 transition-colors hover:border-border-strong md:p-9 ${
                      index === 0 ? "lamp-card relative overflow-hidden" : "bg-card"
                    }`}
                  >
                    <span className={`relative ${MONO}`}>
                      <BrandSquare />
                      {t("free")}
                    </span>
                    <h3 className="relative m-0 mt-5 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                      {display(item.name)}
                    </h3>
                    <p className="relative m-0 mt-4 text-[15px] leading-[1.6] text-muted-foreground md:text-base">
                      {display(item.description)}
                    </p>
                    <span className="relative mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 group-hover:text-brand">
                      {t("open")}
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* The first tool, explained: an ink band of emphasis. */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 60% at 85% 20%, rgb(242 115 19 / 0.14), rgb(242 115 19 / 0.04) 55%, transparent 80%)",
            }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{display(t("agentReady.title"))}</h2>
            <div className={PROSE_STACK}>
              <p className={PROSE}>{display(t("agentReady.p1"))}</p>
              <p className={PROSE}>{display(t("agentReady.p2"))}</p>
              <p className={PROSE}>{display(t("agentReady.p3"))}</p>
            </div>
            <h3 className="m-0 mt-16 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:mt-20">
              {display(t("agentReady.categoriesTitle"))}
            </h3>
            <div className="mt-8 max-w-[68ch] border-t border-border md:mt-10">
              {AGENT_READY_CATEGORY_KEYS.map((key) => (
                <p key={key} className={`${PROSE} border-b border-border py-6`}>
                  {rich(`agentReady.${key}`)}
                </p>
              ))}
            </div>
            <Link
              href={splitPath(AGENT_READY_PATHS, locale)}
              className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
            >
              {display(t("agentReady.link"))}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <div data-surface="paper">
          {/* llms.txt, then how to read the score. */}
          <section className={BAND}>
            <h2 className={H2}>{display(t("llms.title"))}</h2>
            <div className={PROSE_STACK}>
              {(["p1", "p2", "p3", "p4"] as const).map((key) => (
                <p key={key} className={PROSE}>
                  {display(t(`llms.${key}`))}
                </p>
              ))}
            </div>
          </section>

          <section className={`${SECTION} border-t border-border py-20 md:py-28 lg:py-32`}>
            <h2 className={H2}>{display(t("score.title"))}</h2>
            <div className={PROSE_STACK}>
              {(["p1", "p2", "p3"] as const).map((key) => (
                <p key={key} className={PROSE}>
                  {display(t(`score.${key}`))}
                </p>
              ))}
            </div>
          </section>

          {/* FAQ, restated in the FAQPage JSON-LD above. */}
          <section className={`${SECTION} border-t border-border py-20 md:py-28 lg:py-32`}>
            <h2 className={H2}>{display(t("faq.title"))}</h2>
            <dl className="m-0 mt-12 border-t border-border md:mt-16">
              {faqItems.map((item) => (
                <div
                  key={item.key}
                  className="grid grid-cols-1 gap-3 border-b border-border py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
                >
                  <dt className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {display(item.question)}
                  </dt>
                  <dd className={`${PROSE} max-w-[70ch]`}>{display(item.answer)}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* What comes next, and where to read on. */}
          <section className={`${SECTION} border-t border-border py-20 md:py-28 lg:py-32`}>
            <h2 className={H2}>{display(t("more.title"))}</h2>
            <div className={PROSE_STACK}>
              <p className={PROSE}>{display(t("more.p1"))}</p>
              <p className={PROSE}>{rich("more.p2")}</p>
            </div>
          </section>
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
