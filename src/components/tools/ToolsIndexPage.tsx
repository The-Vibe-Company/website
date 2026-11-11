import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BrandSquare } from "@/components/BrandSquare";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import { keepPunctuationAttached } from "@/lib/french-spacing";
import {
  localizedSocialMetadata,
  localizedUrl,
  splitPath,
  splitPathAlternates,
  TOOLS_PATHS,
} from "@/lib/site";
import { breadcrumbList, collectionPageSchema } from "@/lib/structured-data";
import { TOOLS } from "@/lib/tools";

/**
 * The tools section, served at /fr/tools and /en/tools: one card per entry
 * of TOOLS (src/lib/tools.ts), the first one under the lamp.
 */

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
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

export async function ToolsIndexPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "tools" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const display = (text: string) => (locale === "fr" ? keepPunctuationAttached(text) : text);
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
              {t("title")}
            </h1>
            <p className="m-0 mt-10 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("lede")}
            </p>
          </div>
        </section>

        <div data-surface="paper">
          <section className={`${SECTION} py-20 md:py-28 lg:py-32`}>
            <h2 className="m-0 font-bold text-foreground text-[clamp(2rem,4.2vw,3.75rem)] leading-[0.95] tracking-[-0.045em]">
              {t("listTitle")}
            </h2>
            <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-14 md:grid-cols-2">
              {items.map((item, index) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`group flex h-full flex-col border border-border p-7 transition-colors hover:border-border-strong md:p-9 ${
                      index === 0 ? "lamp-card relative overflow-hidden" : "bg-card"
                    }`}
                  >
                    {index === 0 && <span aria-hidden="true" className={LAMP} />}
                    <span className={`relative ${MONO}`}>
                      <BrandSquare />
                      {t("free")}
                    </span>
                    <h3 className="relative m-0 mt-5 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                      {display(item.name)}
                    </h3>
                    <p className="relative m-0 mt-4 text-[15px] leading-[1.6] text-muted-foreground md:text-base">
                      {item.description}
                    </p>
                    <span className="relative mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 group-hover:text-brand">
                      {t("open")}
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-10 max-w-[64ch] text-[15px] leading-[1.6] text-muted-foreground">
              {t("moreSoon")}
            </p>
          </section>
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
