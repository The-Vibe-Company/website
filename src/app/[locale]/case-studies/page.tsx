import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Chip, LinkRim, SectionTitle } from "@/components/kit";
import { JsonLd } from "@/components/JsonLd";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList } from "@/lib/structured-data";

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
  // In alphabetical order of the client, whatever order the data keeps them in.
  const customers = [...getCustomers(locale as ContentLocale)].sort((a, b) =>
    a.client.localeCompare(b.client, locale, { sensitivity: "base" }),
  );
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
          { name: tNav("caseStudies"), url: localizedUrl(locale, "/case-studies") },
        ])}
      />
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
            {customers.length > 0 ? (
              /* Every case with the same weight, in one tray, no card inside it. */
              <ul className="rows clay-quiet m-0 list-none rounded-plate px-4 py-1 md:px-10 md:py-2">
                {customers.map((c) => (
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
                        <span>{t("readCase")}</span>
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

/** A client mark, standing on the clay itself: no plate, so the sector chip under it is the only box. */
function Logo({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex h-10 items-center md:h-11">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-7 w-auto max-w-full object-contain md:h-8"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
