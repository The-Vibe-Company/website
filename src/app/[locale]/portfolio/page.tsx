import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Arrow, SectionTitle } from "@/components/kit";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getProjects, type ContentLocale } from "@/lib/projects";
import { localizedAlternates, localizedSocialMetadata } from "@/lib/site";

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

/** Statuses (both locales) that earn the orange status dot. */
const LIVE_STATUSES = new Set(["Live", "En ligne"]);

function Status({
  status,
  built,
  date,
  className,
}: {
  status: string;
  built: string;
  date: string;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-2.5 font-mono text-xs font-medium uppercase leading-[1.3] tracking-[0.1em] text-muted-foreground ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className={`dot ${LIVE_STATUSES.has(status) ? "dot-rim" : ""}`}
      />
      <span>
        {status} · {built} {date}
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
  // In alphabetical order, whatever order the catalogue keeps them in.
  const projects = [...getProjects(locale as ContentLocale)].sort((a, b) =>
    a.name.localeCompare(b.name, locale, { sensitivity: "base" }),
  );

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="pt-12 md:pt-[76px]">
          <div className="wrap">
            <SectionTitle
              as="h1"
              size="md"
              kicker={t("kicker")}
              line1={t("titleLine1")}
              line2={t("titleLine2")}
            >
              {t("subtitle")}
            </SectionTitle>
          </div>
        </section>

        <section className="pt-8 md:pt-14">
          <div className="wrap">
            {/* Every product with the same weight, in the catalogue's order:
                flat on the studio floor, a clay plate rises under the one you
                point at. */}
            <ul className="rows m-0 list-none p-0">
              {projects.map((p) => (
                <li
                  key={p.slug}
                  className="-mx-2 before:left-2 before:right-2 md:-mx-6 md:before:left-6 md:before:right-6"
                >
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="group grid grid-cols-[48px_minmax(0,1fr)_44px] gap-x-3.5 gap-y-4 rounded-piece px-2 py-[22px] no-underline transition-[background,box-shadow] duration-200 hover:bg-clay hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_1px_rgba(20,20,22,0.05),0_18px_30px_-24px_rgba(20,20,22,0.3)] focus-visible:bg-clay md:grid-cols-[56px_270px_minmax(0,1fr)_44px] md:items-start md:gap-x-7 md:px-6 md:py-7"
                  >
                    <span className="col-start-1 row-start-1 grid size-12 place-items-center rounded-[14px] bg-[radial-gradient(130%_110%_at_12%_-12%,#ffffff_0%,#fbfbfa_40%,#ececea_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(20,20,22,0.12),0_10px_14px_-10px_rgba(20,20,22,0.3)] md:size-14 md:rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.logo}
                        alt=""
                        className="size-[34px] rounded-[10px] object-contain md:size-10"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <div className="col-start-2 row-start-1 flex min-w-0 flex-col items-start gap-2 md:gap-2.5 md:pt-0.5">
                      <h2 className="m-0 truncate text-[26px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[28px]">
                        {p.name}
                      </h2>
                      <span className="chip">{p.tag}</span>
                    </div>
                    <div className="col-span-3 row-start-2 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1 md:pt-0.5">
                      <p className="m-0 max-w-[54ch] text-[15.5px] leading-[1.55] text-ink-2 md:text-base">
                        {p.description}
                      </p>
                      <Status
                        className="mt-3.5"
                        status={p.status}
                        built={t("built")}
                        date={p.date}
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="well col-start-3 row-start-1 grid size-11 place-items-center self-start rounded-full text-ink transition-colors duration-200 group-hover:text-on-lacquer group-hover:[background:var(--lacquer)] group-focus-visible:text-on-lacquer group-focus-visible:[background:var(--lacquer)] md:col-start-4 md:self-center"
                    >
                      <Arrow className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
