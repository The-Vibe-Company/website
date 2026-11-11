import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BrandSquare } from "@/components/BrandSquare";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AGENT_READY_CATEGORIES, type AgentReadyCopy, type CheckCopy } from "@/lib/agent-ready-ui";
import type { CheckId } from "@/lib/agent-ready/types";
import { keepPunctuationAttached } from "@/lib/french-spacing";
import {
  AGENT_READY_PATHS,
  localizedSocialMetadata,
  localizedUrl,
  splitPath,
  splitPathAlternates,
  TOOLS_PATHS,
} from "@/lib/site";
import { breadcrumbList, faqPageSchema, webApplicationSchema } from "@/lib/structured-data";
import { AgentReadyScanner } from "./AgentReadyScanner";

/**
 * The agent-ready scanner, served at /fr/tools/agent-ready and
 * /en/tools/agent-ready. Everything a reader or a crawler needs (intro, how
 * it works, what is checked, FAQ) is server HTML; only the form and the
 * report are hydrated, in AgentReadyScanner.
 */

export const AGENT_READY_FAQ_KEYS = ["what", "why", "data", "score", "fix"] as const;
const STEP_KEYS = ["address", "read", "fix"] as const;

export async function agentReadyMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "agentReady" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(AGENT_READY_PATHS, locale);
  return {
    // Absolute: the layout's " | The Vibe Company" would push it past 60.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, AGENT_READY_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2rem,4.2vw,3.75rem)] leading-[0.95] tracking-[-0.045em]";
const MONO = "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";

export async function AgentReadyPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "agentReady" });
  const tTools = await getTranslations({ locale, namespace: "tools" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const display = (text: string) => (locale === "fr" ? keepPunctuationAttached(text) : text);
  const url = localizedUrl(locale, splitPath(AGENT_READY_PATHS, locale));

  // Read raw: the copy holds literal braces, angle brackets and quotes that
  // ICU formatting would interpret. The island fills its own placeholders.
  const copy: AgentReadyCopy = {
    form: t.raw("form"),
    errors: t.raw("errors"),
    report: t.raw("report"),
    status: t.raw("status"),
    categories: t.raw("categories"),
    checks: t.raw("checks"),
    prompt: t.raw("prompt"),
  };

  const faqItems = AGENT_READY_FAQ_KEYS.map((key) => ({
    question: t(`faq.items.${key}.q`),
    answer: t(`faq.items.${key}.a`),
  }));

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <JsonLd
        data={breadcrumbList([
          { name: tFooter("home"), url: localizedUrl(locale) },
          { name: tTools("breadcrumb"), url: localizedUrl(locale, splitPath(TOOLS_PATHS, locale)) },
          { name: t("breadcrumb"), url },
        ])}
      />
      <JsonLd
        data={webApplicationSchema({
          name: t("appName"),
          description: t("metaDescription"),
          url,
          language: locale,
          applicationCategory: "DeveloperApplication",
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1. On the ink, in the hero's orange light: the question, and the
            form that answers it. The report opens right under the form. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-72 h-[900px] w-[1100px]"
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
              {t("lede")}
            </p>
            <AgentReadyScanner copy={copy} />
          </div>
        </section>

        <div data-surface="paper">
          {/* 2. How it works, in three steps. */}
          <section className={BAND}>
            <h2 className={H2}>{t("how.title")}</h2>
            <ol className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-14 md:grid-cols-3">
              {STEP_KEYS.map((key, index) => (
                <li key={key} className="flex flex-col border border-border bg-card p-7 md:p-9">
                  <span className="text-lit text-[44px] font-bold leading-none tracking-[-0.04em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-6 text-[22px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground">
                    {t(`how.steps.${key}.title`)}
                  </h3>
                  <p className={`${PROSE} mt-3`}>{t(`how.steps.${key}.body`)}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 3. Every check, by category, in plain words. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("checksSection.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[64ch]`}>{t("checksSection.lede")}</p>
            <div className="mt-12 flex flex-col gap-12 md:mt-16">
              {AGENT_READY_CATEGORIES.map(({ id, checks }) => (
                <div
                  key={id}
                  className="grid grid-cols-1 gap-6 border-t border-border pt-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12"
                >
                  <div>
                    <span className={MONO}>
                      <BrandSquare />
                      {copy.categories[id].name}
                    </span>
                    <p className="m-0 mt-4 text-[20px] font-bold leading-[1.2] tracking-[-0.025em] text-foreground md:text-[22px]">
                      {display(copy.categories[id].question)}
                    </p>
                  </div>
                  <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-6 p-0 lg:grid-cols-2">
                    {checks.map((checkId: CheckId) => {
                      const check: CheckCopy = copy.checks[checkId];
                      return (
                        <li key={checkId}>
                          <h3 className="m-0 text-[17px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
                            {check.name}
                          </h3>
                          <p className={`${PROSE} mt-2`}>{check.explain}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. Back on the ink: the questions people ask before typing their URL. */}
        <section className={BAND}>
          <h2 className={H2}>{t("faq.title")}</h2>
          <div className="mt-12 md:mt-16">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="grid grid-cols-1 gap-3 border-t border-border py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
              >
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {display(item.question)}
                </h3>
                <p className={`${PROSE} max-w-[70ch]`}>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
