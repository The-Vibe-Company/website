import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getProjects, type ContentLocale } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PortfolioPage() {
  const locale = (await getLocale()) as ContentLocale;
  const t = await getTranslations("portfolio");
  const projects = getProjects(locale);

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main className="flex-1">
        <section className="mx-auto max-w-[100rem] px-6 pb-16 pt-12 md:px-12 md:pb-20 md:pt-16">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("kicker")}
          </span>
          <h1
            className="m-0 max-w-[18ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6.4vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("titleLine1")}
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
              }}
            >
              {t("titleLine2")}
            </span>
          </h1>
          <p className="m-0 mt-8 max-w-[620px] text-lg leading-[1.5] text-muted-foreground">
            {t("subtitle")}
          </p>
        </section>

        <section className="mx-auto max-w-[100rem] px-6 pb-20 md:px-12 md:pb-28">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/${p.slug}`}
                className="group flex flex-col border border-foreground bg-background p-7 no-underline transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)] md:p-8"
              >
                <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      className="h-8 w-8 shrink-0 rounded-sm object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="truncate text-[26px] font-bold leading-none tracking-[-0.03em] text-foreground md:text-[30px]">
                      {p.name}
                    </span>
                  </div>
                  <span className="shrink-0 border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
                    {p.tag}
                  </span>
                </div>

                <div className="mt-6 border-t border-border pt-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {p.status} · {t("built")} {p.date}
                  </div>
                  <p className="m-0 mt-4 text-[15px] leading-[1.55] text-foreground">
                    {p.description}
                  </p>
                </div>

                <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                  <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">
                    {t("viewProject")}
                  </span>
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
