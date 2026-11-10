import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList, webPageNode } from "@/lib/structured-data";
import { BrandSquare } from "@/components/BrandSquare";
import { CaseCards } from "@/components/CaseCards";

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[0.95] tracking-[-0.045em]";
const MONO =
  "block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: localizedAlternates(locale, "/case-studies"),
    ...localizedSocialMetadata({
      locale,
      path: "/case-studies",
      title,
      description,
    }),
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const customers = getCustomers(locale as ContentLocale);
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = localizedUrl(locale, "/case-studies");
  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: t("back"),
      description: t("metaDescription"),
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: tNav("caseStudies"), url: pageUrl },
    ]),
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
        {/* 1 — On the ink, like the About page: the one H1 in the hero's
            orange light, its second line lit. */}
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
              {t("titleLine1")}
              <br />
              <span className="text-lit">{t("titleLine2")}</span>
            </h1>
            <p className="m-0 mt-10 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("subtitle")}
            </p>
          </div>
        </section>

        <div data-surface="paper">
          {/* 2 — The cases, each under its own lamp like the homepage's
              workbench: the client, the figure lit, the story in a line. */}
          <section className={BAND}>
            <CaseCards cases={customers} from="case-studies" readLabel={t("readCase")} />
          </section>

          {/* 3 — How the work goes, read on the paper. */}
          <section className={`${BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-16">
              <div>
                <span className={MONO}>
                  <BrandSquare />
                  {t("about.kicker")}
                </span>
                <h2 className={`${H2} mt-6 max-w-[14ch]`}>{t("about.title")}</h2>
              </div>
              <div className="flex max-w-[720px] flex-col gap-6 text-lg leading-[1.6] text-soft-foreground md:pt-10">
                <p className="m-0">{t("about.p1")}</p>
                <p className="m-0">{t("about.p2")}</p>
                <p className="m-0">{t("about.p3")}</p>
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
