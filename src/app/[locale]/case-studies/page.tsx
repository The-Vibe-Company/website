import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Arrow, Chip, LinkRim, Piece, SectionTitle } from "@/components/kit";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { localizedAlternates, localizedSocialMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const title = t("back");
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
  const [lead, ...others] = getCustomers(locale as ContentLocale);

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
              size="lg"
              kicker={t("kicker")}
              line1={t("titleLine1")}
              line2={t("titleLine2")}
            />
          </div>
        </section>

        <section className="pt-9 md:pt-14">
          <div className="wrap">
            {lead ? (
              /* The main piece: the lead case, with the rim light. The link
                 stretches over the whole piece; its button stays above it. */
              <Piece
                as="article"
                tone="main"
                radius="xl"
                className="relative px-5 pb-6 pt-5 [--rim-angle:122deg] md:px-12 md:pb-12 md:pt-9"
              >
                <h2 className="sr-only">{lead.client}</h2>
                <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
                  <Logo src={lead.logo} alt={lead.client} large />
                  <Chip className={SECTOR_CHIP}>{lead.sector}</Chip>
                </div>
                <hr className="groove my-6 md:mb-11 md:mt-[30px]" />
                <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-end md:gap-14">
                  <div className="min-w-0">
                    {lead.metric ? (
                      <p className="display m-0 text-[clamp(2.5rem,11.6vw,6.25rem)] leading-[0.92] text-balance">
                        {lead.metric}
                      </p>
                    ) : null}
                    {lead.metricLabel ? (
                      <p className="m-0 mt-3 max-w-[28rem] text-base leading-[1.45] text-muted-foreground md:mt-[18px] md:text-lg">
                        {lead.metricLabel}
                      </p>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 max-w-[54ch] text-base leading-[1.6] text-ink-2 md:text-[1.0938rem]">
                      {lead.summary}
                    </p>
                    <Link
                      href={`/case-studies/${lead.slug}?from=case-studies`}
                      className="group mt-6 flex rounded-full before:absolute before:inset-0 before:rounded-slab md:mt-[30px] md:inline-flex"
                    >
                      <span className="btn btn-lg btn-lacquer relative z-10 w-full transition-[filter,transform] group-hover:-translate-y-px group-hover:brightness-[1.18] md:w-auto">
                        {t("readCase")}
                        <span className="sr-only">, {lead.client}</span>
                        <Arrow />
                      </span>
                    </Link>
                  </div>
                </div>
              </Piece>
            ) : null}

            {others.length > 0 ? (
              /* The quieter ones: one tray, no card inside it. */
              <ul className="rows clay-quiet m-0 mt-4 list-none rounded-plate px-4 py-1 md:mt-5 md:px-10 md:py-2">
                {others.map((c) => (
                  <li key={c.slug}>
                    <article className="relative -mx-3 grid gap-4 rounded-piece px-3 py-6 transition-colors hover:bg-black/[0.03] md:-mx-5 md:grid-cols-[minmax(0,19.5rem)_minmax(0,1fr)_auto] md:items-start md:gap-x-11 md:gap-y-5 md:px-5 md:py-9">
                      <h2 className="sr-only">{c.client}</h2>
                      <div className="flex min-w-0 flex-col items-start gap-3.5">
                        <Logo src={c.logo} alt={c.client} />
                        <Chip className={SECTOR_CHIP}>{c.sector}</Chip>
                      </div>
                      <div className="min-w-0">
                        {c.metric ? (
                          <p className="display d-xs m-0 text-[clamp(1.875rem,1.2rem+2.2vw,2.75rem)] leading-none">
                            {c.metric}
                          </p>
                        ) : null}
                        {c.metricLabel ? (
                          <p className="m-0 mt-2.5 max-w-[54ch] text-[0.9375rem] leading-[1.45] text-muted-foreground">
                            {c.metricLabel}
                          </p>
                        ) : null}
                        <p
                          className={`m-0 max-w-[60ch] text-[0.96875rem] leading-[1.6] text-ink-2 ${c.metric || c.metricLabel ? "mt-4" : ""}`}
                        >
                          {c.summary}
                        </p>
                      </div>
                      <LinkRim
                        href={`/case-studies/${c.slug}?from=case-studies`}
                        className="self-start before:absolute before:inset-0 before:rounded-piece md:self-center"
                      >
                        {t("readCase")}
                        <span className="sr-only">, {c.client}</span>
                      </LinkRim>
                    </article>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* A sector tag may need two lines in a narrow column: it wraps instead of cutting. */
const SECTOR_CHIP =
  "h-auto max-w-full whitespace-normal rounded-pebble py-2 text-left leading-snug";

/** A client mark set on a faint plate in the clay (not a second box). */
function Logo({ src, alt, large = false }: { src: string; alt: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-piece bg-[rgba(20,20,22,0.05)] ${
        large ? "h-[68px] min-w-[164px] px-[26px] md:h-[84px] md:min-w-[200px] md:px-[34px]" : "h-16 min-w-[150px] px-6 md:h-[72px] md:min-w-[176px] md:px-7"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-auto max-w-full object-contain ${large ? "h-8 md:h-[38px]" : "h-7 md:h-8"}`}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
