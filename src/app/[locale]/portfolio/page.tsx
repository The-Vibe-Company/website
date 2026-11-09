import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { getProjects, type ContentLocale, type Project } from "@/lib/projects";
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList } from "@/lib/structured-data";
import { BrandSquare } from "@/components/BrandSquare";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: localizedAlternates(locale, "/portfolio"),
    ...localizedSocialMetadata({
      locale,
      path: "/portfolio",
      title,
      description,
    }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

/**
 * The products the subtitle names with what they do, in its order: each gets
 * a lamp card, the first two on the wide benches. The others follow as plain
 * cards, a row of four.
 */
const FEATURED = ["quivr", "vanish", "skillpack", "vibedrift", "granite"];
const FEATURED_SPANS = [
  "md:col-span-2 lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

/** The product's own colour, as a small lit dot beside its status. */
function AccentDot({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden="true"
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ background: accent, boxShadow: `0 0 12px 2px ${accent}` }}
    />
  );
}

/** "En ligne · Réalisé févr. 2026", breaking at the dot when the card is narrow. */
function StatusLine({ status, built, date }: { status: string; built: string; date: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-wrap gap-x-2">
      <span>{status} ·</span>{" "}
      <span>
        {built} {date}
      </span>
    </span>
  );
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const projects = getProjects(locale as ContentLocale);
  const featured = FEATURED.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p),
  );
  const others = projects.filter((p) => !FEATURED.includes(p.slug));
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd
        data={breadcrumbList([
          { name: tFooter("home"), url: localizedUrl(locale) },
          { name: tNav("portfolio"), url: localizedUrl(locale, "/portfolio") },
        ])}
      />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* On the ink, in the hero's orange light: the one H1 and the list
            of what follows. */}
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
            <h1 className="m-0 mt-8 text-[clamp(3rem,7.4vw,7.75rem)] font-bold leading-[0.9] tracking-[-0.05em] text-foreground lg:mt-10">
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
          {/* The products, like the homepage's tools on the wall: the five
              the subtitle names under their lamps, then the rest. */}
          <section className={BAND}>
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-12">
              {featured.map((p, i) => (
                <li key={p.slug} className={FEATURED_SPANS[i] ?? "lg:col-span-4"}>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="lamp-card group flex h-full min-h-[20rem] flex-col overflow-hidden border border-border p-7 no-underline transition-colors hover:border-brand/50 md:p-9"
                  >
                    <span aria-hidden="true" className={LAMP} />
                    <div className="relative flex items-start justify-between gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className="h-11 w-11 shrink-0 rounded-md object-contain md:h-12 md:w-12"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="max-w-[14rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                        {p.tag}
                      </span>
                    </div>
                    <div className="relative mt-auto pt-12">
                      <span className="block text-[clamp(2.25rem,3.4vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-foreground">
                        {p.name}
                      </span>
                      <p className="m-0 mt-4 max-w-[34rem] text-[15px] leading-[1.55] text-soft-foreground">
                        {p.description}
                      </p>
                      <div className="mt-7 flex items-center gap-3 border-t border-border pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        <AccentDot accent={p.accent} />
                        <StatusLine status={p.status} built={t("built")} date={p.date} />
                        <span aria-hidden="true" className="text-brand">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              {others.map((p) => (
                <li key={p.slug} className="lg:col-span-3">
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="group flex h-full flex-col border border-border bg-card p-6 no-underline transition-colors hover:border-border-strong md:p-7"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className="h-9 w-9 shrink-0 rounded-md object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="truncate text-[24px] font-bold leading-none tracking-[-0.03em] text-foreground">
                        {p.name}
                      </span>
                    </div>
                    <span className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                      {p.tag}
                    </span>
                    <p className="m-0 mt-3 text-[14px] leading-[1.55] text-soft-foreground">
                      {p.description}
                    </p>
                    <div className="mt-auto pt-6">
                      <div className="flex items-center gap-3 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        <AccentDot accent={p.accent} />
                        <StatusLine status={p.status} built={t("built")} date={p.date} />
                        <span aria-hidden="true" className="text-brand">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Why an agency ships its own products. */}
          <section className={`${BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
              <div>
                <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                  <BrandSquare />
                  {t("about.kicker")}
                </span>
                <h2 className={`${H2} mt-6 max-w-[14ch]`}>{t("about.title")}</h2>
              </div>
              <div className="flex max-w-[720px] flex-col gap-6 text-[17px] leading-[1.65] text-soft-foreground md:text-lg lg:pt-12">
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
