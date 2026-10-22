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

/** The product the page leans on: the one main piece. */
const FEATURED_SLUG = "armada";

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
  const projects = getProjects(locale as ContentLocale);
  const featured = projects.find((p) => p.slug === FEATURED_SLUG) ?? projects[0];
  const others = projects.filter((p) => p.slug !== featured?.slug);

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

        {featured ? (
          <section className="pt-8 md:pt-14">
            <div className="wrap">
              {/* The one main piece: the whole slab opens the product page. */}
              <Link
                href={`/portfolio/${featured.slug}`}
                className="group clay rim rim-warm grid gap-[22px] rounded-[28px] p-5 pb-[26px] no-underline [--rim-angle:118deg] md:grid-cols-[minmax(0,1fr)_300px] md:items-center md:gap-12 md:rounded-slab md:px-14 md:pb-14 md:pt-[52px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3">
                    <span className="chip h-[30px]">{featured.tag}</span>
                    <Status
                      status={featured.status}
                      built={t("built")}
                      date={featured.date}
                    />
                  </div>
                  <h2 className="display m-0 mt-5 text-[clamp(4.25rem,2rem+8vw,7.75rem)] md:mt-[30px]">
                    {featured.name}
                  </h2>
                  <p className="relative m-0 mt-5 max-w-[56ch] pl-[18px] text-[17px] leading-[1.5] text-ink-2 before:absolute before:bottom-1 before:left-0 before:top-1 before:w-1 before:rounded before:bg-[linear-gradient(180deg,#3a3a3c,#0b0b0c)] before:content-[''] md:mt-[30px] md:pl-[22px] md:text-xl">
                    {featured.description}
                  </p>
                  <span
                    aria-hidden="true"
                    className="round lacquer rim mt-[26px] size-[60px] transition-transform duration-200 [--rim-angle:110deg] group-hover:translate-x-1 md:mt-[38px]"
                  >
                    <Arrow className="!size-[22px]" />
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="rim relative order-first size-[92px] shrink-0 justify-self-start rounded-[22px] shadow-[0_2px_3px_rgba(20,20,22,0.2),0_18px_20px_-14px_rgba(20,20,22,0.5)] [--rim-angle:132deg] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:bg-[linear-gradient(158deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.04)_30%,rgba(255,255,255,0)_52%)] before:content-[''] md:order-none md:size-[236px] md:justify-self-center md:rounded-[54px] md:shadow-[0_2px_3px_rgba(20,20,22,0.22),0_38px_40px_-28px_rgba(20,20,22,0.55)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.logo}
                    alt=""
                    className="size-full rounded-[inherit]"
                    decoding="async"
                  />
                </span>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="pt-7 md:pt-10">
          <div className="wrap">
            {/* The quieter ones: flat on the studio floor, a clay plate rises under the one you point at. */}
            <ul className="rows m-0 list-none p-0">
              {others.map((p) => (
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
