"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandSquare } from "@/components/BrandSquare";
import { getProjects } from "@/lib/projects";

/** Our own products, as the tools hanging on the workshop wall. */
export function Tools() {
  const t = useTranslations("proof");
  const locale = useLocale() === "en" ? "en" : "fr";
  const projects = getProjects(locale);

  return (
    <section aria-labelledby="produits-title" className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-6 py-24 md:px-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20 lg:px-16 lg:py-32">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
            <BrandSquare />
            {t("kicker")}
          </span>
          <h2 id="produits-title" className="m-0 mt-6 text-[clamp(2.25rem,4.4vw,4rem)] font-bold leading-[0.95] tracking-[-0.04em] text-foreground">
            {t("titleLine1")}
            <br />
            <span className="text-soft-foreground">{t("titleLine2")}</span>
          </h2>
          <p className="m-0 mt-6 text-[16px] leading-[1.6] text-muted-foreground">{t("intro")}</p>
          <a
            href="https://github.com/The-Vibe-Company"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
          >
            GitHub ↗
          </a>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-px self-start border border-border bg-border p-0 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <li key={p.slug} className="bg-background">
              <Link
                href={`/portfolio/${p.slug}`}
                className="group flex h-full items-center gap-4 p-5 no-underline transition-colors hover:bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt="" aria-hidden="true" className="h-10 w-10 shrink-0 rounded-md object-contain" loading="lazy" decoding="async" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold tracking-[-0.01em] text-foreground">{p.name}</span>
                  <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">{p.tag}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                  style={{ background: p.accent, boxShadow: `0 0 14px 2px ${p.accent}` }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
