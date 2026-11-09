import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { QuivrStage } from "@/components/quivr/QuivrStage";
import { QuivrSections } from "@/components/quivr/QuivrSections";
import { PORTFOLIO_CATEGORY_MAP, PROJECT_SLUGS, getProject, type ContentLocale } from "@/lib/projects";
import { QUIVR_FAQ_KEYS, QUIVR_OG_IMAGE, QUIVR_SLUG } from "@/lib/quivr";
import { absoluteUrl, localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList, faqPageSchema, softwareApplicationSchema } from "@/lib/structured-data";
import { BrandSquare } from "@/components/BrandSquare";

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
  const description = tQuivr ? tQuivr("metaDescription") : project.metaDescription;
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

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
/** A story row: its heading on the left, the words on the right. */
const STORY_ROW = "grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16";
const STORY_H2 =
  "m-0 max-w-[12ch] text-[clamp(2rem,3.4vw,3.25rem)] font-bold leading-[0.95] tracking-[-0.04em] text-foreground";

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
  // product is drawn in code (QuivrStage) and explained further down
  // (QuivrSections). Its repository link lives in that feature grid, so the
  // page keeps a single call to action: booking a call.
  const isQuivr = slug === QUIVR_SLUG;
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: tNav("portfolio"), url: localizedUrl(locale, "/portfolio") },
    { name: project.name, url: localizedUrl(locale, `/portfolio/${slug}`) },
  ]);
  const categoryConfig = PORTFOLIO_CATEGORY_MAP[slug];
  const software = categoryConfig
    ? softwareApplicationSchema({
        name: project.name,
        description: project.metaDescription || project.description,
        url: localizedUrl(locale, `/portfolio/${slug}`),
        applicationCategory: categoryConfig.applicationCategory,
        applicationSubCategory: project.tag,
        imageUrl: project.cover ? absoluteUrl(project.cover) : undefined,
        sameAs: [project.url, project.repositoryUrl].filter(Boolean),
        operatingSystem: categoryConfig.operatingSystem,
      })
    : null;
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
      <JsonLd data={software} />
      <JsonLd data={faq} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* On the ink, in the hero's orange light: the product's mark and
            name (the one H1), its status lit in its own colour, the sentence
            that says what it does, and the facts in a hairline row. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
            style={{
              background:
                "radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)",
            }}
          />
          <div className={`relative ${SECTION} pb-16 pt-10 md:pb-20 md:pt-12`}>
            <BackLink href="/portfolio" label={t("back")} />

            <span className="mt-12 block font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground md:mt-16">
              <BrandSquare />
              {project.tag}
            </span>
            <div className="mt-6 flex min-w-0 items-center gap-4 md:mt-8 md:gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.logo}
                alt={`${project.name} logo`}
                className="h-12 w-12 shrink-0 rounded-md object-contain md:h-20 md:w-20 lg:h-24 lg:w-24"
              />
              <h1 className="m-0 min-w-0 break-words text-[clamp(3rem,9vw,9rem)] font-bold leading-[0.9] tracking-[-0.05em] text-foreground">
                {project.name}
              </h1>
            </div>
            <div className="mt-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.18em] text-soft-foreground md:mt-8">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: project.accent, boxShadow: `0 0 12px 2px ${project.accent}` }}
              />
              <span>
                {project.status} · {t("built")} {project.date}
              </span>
            </div>

            <p className="m-0 mt-10 max-w-[760px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:mt-12 md:pl-6 md:text-[21px]">
              {project.description}
            </p>

            <div className="mt-14 grid grid-cols-3 border-t border-border md:mt-20">
              {meta.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex min-w-0 flex-col gap-1 py-5 md:py-7 ${
                    i > 0 ? "border-l border-border pl-3 sm:pl-6 md:pl-8" : "pr-3 sm:pr-6"
                  }`}
                >
                  {/* Long type words ("Bibliothèque", "Recherche") hyphenate on
                      phones instead of pushing the row past the screen. */}
                  <div className="hyphens-auto break-words text-[18px] font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-[22px] md:text-[28px]">
                    {item.value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase leading-snug tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div data-surface="paper">
          {/* The product itself, framed on the paper. */}
          <section className={BAND}>
            <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
              <BrandSquare />
              {t("theProduct")}
            </span>
            <div
              // Columns sized by image aspect (16:10 web, ~9:19.5 phone); the phone frame then stretches
              // to the row so both frames end on the same line.
              className={
                project.mobileCover
                  ? "mt-8 grid gap-6 md:mt-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.455fr)] md:gap-8"
                  : "mt-8 md:mt-10"
              }
            >
              {isQuivr ? (
                <QuivrStage locale={locale} accent={project.accent} />
              ) : project.cover ? (
                <div className="self-start overflow-hidden border border-border bg-card">
                  <div className="h-[3px] w-full" style={{ backgroundColor: project.accent }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.cover}
                    alt={`${project.name} homepage`}
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </div>
              ) : null}
              {project.mobileCover && (
                <div className="mx-auto w-full max-w-[15rem] overflow-hidden border border-border bg-card md:flex md:max-w-none md:flex-col">
                  <div className="h-[3px] w-full" style={{ backgroundColor: project.accent }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.mobileCover}
                    alt={`${project.name} iPhone app`}
                    className="h-auto w-full md:min-h-0 md:flex-1 md:object-cover md:object-top"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {isQuivr ? null : (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 rounded-[2px] border border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-colors duration-300 hover:border-soft-foreground hover:bg-soft-foreground md:px-7 md:py-5 md:text-[17px]"
              >
                {t("visitProject", { name: project.name })}
                <span aria-hidden="true" className="text-lg leading-none">
                  &#8599;
                </span>
              </a>
            )}
          </section>

          {/* Why we built it, how it works, who it serves: one row each, the
              heading on the left. */}
          {project.story ? (
            <section className={`${BAND} border-t border-border`}>
              <div className={STORY_ROW}>
                <h2 className={STORY_H2}>{t("storyWhy")}</h2>
                <p className="m-0 max-w-[760px] text-[20px] leading-[1.5] text-foreground md:text-[24px]">
                  {project.story.why}
                </p>
              </div>
              <div className={`${STORY_ROW} mt-14 border-t border-border pt-14 md:mt-20 md:pt-20`}>
                <h2 className={STORY_H2}>{t("storyHow")}</h2>
                <ul className="m-0 flex max-w-[760px] list-none flex-col border-t border-border p-0">
                  {project.story.how.map((step, i) => (
                    <li
                      key={step}
                      className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-border py-6 md:grid-cols-[3.5rem_1fr] md:gap-6"
                    >
                      <span
                        aria-hidden="true"
                        className="text-lit text-[32px] font-bold leading-none tracking-[-0.05em] md:text-[40px]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[17px] leading-[1.55] text-soft-foreground md:text-lg">
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${STORY_ROW} mt-14 border-t border-border pt-14 md:mt-20 md:pt-20`}>
                <h2 className={STORY_H2}>{t("storyAudience")}</h2>
                <p className="m-0 max-w-[760px] text-[17px] leading-[1.65] text-soft-foreground md:text-lg">
                  {project.story.audience}
                </p>
              </div>
            </section>
          ) : null}
        </div>

        {isQuivr ? <QuivrSections locale={locale} /> : null}

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
