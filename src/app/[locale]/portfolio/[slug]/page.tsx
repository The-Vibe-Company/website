import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PROJECT_SLUGS, getProject, type ContentLocale } from "@/lib/projects";
import { localizedAlternates } from "@/lib/site";

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
  const t = await getTranslations("portfolio");
  const project = getProject(slug, locale as ContentLocale);
  if (!project) return { title: t("back") };
  return {
    title: `${project.name} · ${t("back")}`,
    description: project.description,
    alternates: localizedAlternates(locale, `/portfolio/${slug}`),
  };
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const project = getProject(slug, locale as ContentLocale);
  if (!project) notFound();

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
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="mx-auto max-w-[80rem] px-6 pb-16 pt-10 md:px-12 md:pb-20 md:pt-12">
          <BackLink href="/portfolio" label={t("back")} />

          <div className="mt-10 border-t-2 border-foreground pt-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex min-w-0 items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="h-12 w-12 shrink-0 rounded-sm object-contain md:h-14 md:w-14"
                />
                <h1
                  className="m-0 text-[44px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[64px]"
                  style={{ textDecoration: "underline", textDecorationColor: project.accent, textUnderlineOffset: "0.12em", textDecorationThickness: "4px" }}
                >
                  {project.name}
                </h1>
              </div>
              <span className="shrink-0 self-start border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground md:self-auto">
                {project.tag}
              </span>
            </div>
            <div className="mt-4 font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
              {project.status} · {t("built")} {project.date}
            </div>
          </div>

          <p className="m-0 mt-10 max-w-[720px] text-xl leading-[1.5] text-foreground md:text-2xl">
            {project.description}
          </p>
        </section>

        <section className="border-y border-border bg-background">
          <div className="mx-auto grid max-w-[80rem] grid-cols-3 gap-px bg-border px-0">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 bg-background p-6 md:p-8">
                <div className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-foreground md:text-[28px]">
                  {item.value}
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[80rem] px-6 py-16 md:px-12 md:py-20">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("theProduct")}
          </span>
          <div className="overflow-hidden border border-foreground">
            <div className="h-[3px] w-full" style={{ backgroundColor: project.accent }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={`${project.name} homepage`}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 border-2 border-foreground bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
          >
            {t("visitProject", { name: project.name })}
            <span aria-hidden="true" className="text-lg">
              &#8599;
            </span>
          </a>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
