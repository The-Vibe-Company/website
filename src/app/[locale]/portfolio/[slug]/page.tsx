import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Arrow, ButtonLink, Groove, Kicker } from "@/components/kit";
import { JsonLd } from "@/components/JsonLd";
import { QuivrFeedMock } from "@/components/quivr/QuivrFeedMock";
import { QuivrSections } from "@/components/quivr/QuivrSections";
import { PROJECT_SLUGS, getProject, type ContentLocale } from "@/lib/projects";
import { QUIVR_FAQ_KEYS, QUIVR_OG_IMAGE, QUIVR_SLUG } from "@/lib/quivr";
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList, faqPageSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const project = getProject(slug, locale as ContentLocale);
  if (!project) return { title: t("back") };

  // Quivr keeps its own search title (absolute, so the brand is not repeated
  // by the layout template) and social card.
  const tQuivr =
    slug === QUIVR_SLUG
      ? await getTranslations({ locale, namespace: "quivr" })
      : null;
  const title = tQuivr ? tQuivr("metaTitle") : `${project.name} · ${t("back")}`;
  const description = tQuivr ? tQuivr("metaDescription") : project.description;
  return {
    title: tQuivr ? { absolute: title } : title,
    description,
    alternates: localizedAlternates(locale, `/portfolio/${slug}`),
    ...localizedSocialMetadata({
      locale,
      path: `/portfolio/${slug}`,
      title,
      description,
      image: tQuivr
        ? {
            path: QUIVR_OG_IMAGE.url[locale === "en" ? "en" : "fr"],
            width: QUIVR_OG_IMAGE.width,
            height: QUIVR_OG_IMAGE.height,
            alt: tQuivr("product.alt"),
          }
        : project.cover
          ? { path: project.cover, alt: `${project.name} homepage` }
          : undefined,
    }),
  };
}

/** The engraved vertical (md and up) or horizontal (phone) line between facts. */
const FACT_GROOVE =
  "relative before:pointer-events-none before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-[linear-gradient(180deg,rgba(11,11,12,0.1)_0_1px,rgba(255,255,255,0.95)_1px_2px)] first:before:hidden md:before:bottom-0 md:before:left-0 md:before:right-auto md:before:top-6 md:before:h-auto md:before:w-[2px] md:before:bg-[linear-gradient(90deg,rgba(11,11,12,0.1)_0_1px,rgba(255,255,255,0.95)_1px_2px)]";

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const project = getProject(slug, locale as ContentLocale);
  if (!project) notFound();
  // Quivr is an engine with an API, so on top of the shared template its
  // product is drawn in code (QuivrFeedMock) and explained further down
  // (QuivrSections).
  const isQuivr = slug === QUIVR_SLUG;
  const hasMedia = isQuivr || Boolean(project.cover);
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: tNav("portfolio"), url: localizedUrl(locale, "/portfolio") },
    { name: project.name, url: localizedUrl(locale, `/portfolio/${slug}`) },
  ]);
  // The Quivr page shows a FAQ (QuivrSections); its markup repeats it.
  const tQuivr = isQuivr ? await getTranslations({ locale, namespace: "quivr" }) : null;
  const faq = tQuivr
    ? faqPageSchema(
        QUIVR_FAQ_KEYS.map((key) => ({
          question: tQuivr(`faq.items.${key}.q`),
          answer: tQuivr(`faq.items.${key}.a`),
        })),
      )
    : null;

  const meta = [
    { value: project.status, label: t("statusLabel") },
    { value: project.date, label: t("built") },
    { value: project.tag, label: t("typeLabel") },
  ];

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Identity: the page's one main piece. */}
        <section className="pt-3 md:pt-5">
          <div className="wrap">
            <BackLink href="/portfolio" label={t("back")} />

            <div className="clay rim rim-warm mt-1 rounded-[28px] px-5 pb-5 pt-7 [--rim-angle:122deg] md:rounded-slab md:px-14 md:pb-10 md:pt-[52px]">
              <div className="flex flex-col-reverse items-start gap-5 md:flex-row md:justify-between md:gap-6">
                <div className="flex min-w-0 items-center gap-3.5 md:gap-7">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.logo}
                    alt={`${project.name} logo`}
                    width={104}
                    height={104}
                    className="h-[52px] w-[52px] shrink-0 rounded-[14px] object-contain shadow-[0_2px_4px_rgba(0,0,0,0.14),0_18px_28px_-18px_rgba(0,0,0,0.5)] md:h-[104px] md:w-[104px] md:rounded-[26px]"
                  />
                  <h1
                    className="display m-0 min-w-0 text-[clamp(2.75rem,12vw,4.25rem)] tracking-[-0.04em] underline decoration-[4px] underline-offset-[0.1em] md:text-[clamp(4.25rem,10.4vw,8.25rem)] md:decoration-[5px]"
                    style={{ textDecorationColor: project.accent }}
                  >
                    {project.name}
                  </h1>
                </div>
                <span className="chip md:mt-1.5">{project.tag}</span>
              </div>

              <Kicker className="mt-6 tracking-[0.06em] md:mt-[30px] md:tracking-[0.14em]">
                {project.status} · {t("built")} {project.date}
              </Kicker>

              <p className="lede-bar m-0 mt-5 max-w-[54ch] text-[19px] font-[450] leading-[1.45] md:mt-6 md:text-[26px] md:leading-[1.4]">
                {project.description}
              </p>

              <Groove className="mt-7 md:mt-10" />

              <dl className="m-0 grid grid-cols-1 md:grid-cols-3">
                {meta.map((item) => (
                  <div
                    key={item.label}
                    className={`${FACT_GROOVE} flex min-w-0 items-center justify-between gap-3 py-3.5 md:flex-col-reverse md:items-start md:justify-end md:gap-2 md:pb-1 md:pl-6 md:pr-4 md:pt-[26px] md:first:pl-0`}
                  >
                    <dt className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="display m-0 min-w-0 text-right text-[22px] leading-[1.1] md:text-left md:text-[28px]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* The product: a glazed insert, then the action. */}
        <section className="section-tight">
          <div className="wrap">
            <Kicker as="h2">{t("theProduct")}</Kicker>

            {hasMedia ? (
              <div className="clay-quiet mt-5 rounded-[22px] p-2 pb-5 md:rounded-plate md:p-3 md:pb-7">
                <div
                  // Columns sized by image aspect (16:10 web, ~9:19.5 phone); the phone frame then
                  // stretches to the row so both frames end on the same line.
                  className={
                    project.mobileCover
                      ? "grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.455fr)] md:gap-5"
                      : undefined
                  }
                >
                  {isQuivr ? (
                    <div className="glaze min-w-0 rounded-[14px] md:rounded-[16px]">
                      <QuivrFeedMock locale={locale} accent={project.accent} />
                    </div>
                  ) : project.cover ? (
                    <figure className="rim relative m-0 self-start overflow-hidden rounded-[14px] bg-[#0a0a0b] [--rim-angle:130deg] md:rounded-[16px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.cover}
                        alt={`${project.name} homepage`}
                        className="block h-auto w-full"
                        loading="lazy"
                      />
                    </figure>
                  ) : null}
                  {project.mobileCover && (
                    <figure className="rim relative m-0 mx-auto w-full max-w-[15rem] overflow-hidden rounded-[14px] bg-[#0a0a0b] [--rim-angle:130deg] md:flex md:max-w-none md:flex-col md:rounded-[16px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.mobileCover}
                        alt={`${project.name} iPhone app`}
                        className="block h-auto w-full md:min-h-0 md:flex-1 md:object-cover md:object-top"
                        loading="lazy"
                      />
                    </figure>
                  )}
                </div>
                <div className="px-2.5 pt-5 md:px-[18px] md:pt-7">
                  <ProjectLink url={project.url} label={t("visitProject", { name: project.name })} />
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <ProjectLink url={project.url} label={t("visitProject", { name: project.name })} />
              </div>
            )}
          </div>
        </section>

        {isQuivr ? <QuivrSections locale={locale} /> : null}

        <FinalCTA rail="narrow" />
      </main>
      <Footer />
    </div>
  );
}

/** The one way out of the page: the product itself, in a new tab. */
function ProjectLink({ url, label }: { url: string; label: string }) {
  return (
    <ButtonLink
      href={url}
      size="lg"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full md:w-auto"
    >
      {label}
      <Arrow direction="up-right" />
    </ButtonLink>
  );
}
