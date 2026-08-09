"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getProjects, type ContentLocale } from "@/lib/projects";

export function HomeProducts() {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("homeProducts");
  const projects = getProjects(locale);

  return (
    <section id="products" className="border-b-2 border-foreground bg-background">
      <div className="mx-auto max-w-[100rem] px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <div className="grid gap-8 border-t-2 border-foreground pt-5 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-800">{t("kicker")}</p>
            <h2 className="m-0 mt-4 max-w-[11ch] text-[clamp(48px,7vw,104px)] font-bold leading-[0.86] tracking-[-0.06em]">{t("title")}</h2>
          </div>
          <p className="m-0 max-w-[52ch] text-base leading-[1.55] text-muted-foreground md:justify-self-end md:text-lg">{t("intro")}</p>
        </div>

        <div className="mt-14 border-t border-foreground md:mt-20">
          {projects.map((project, index) => (
            <a
              key={project.slug}
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-5 border-b border-foreground py-6 text-foreground no-underline md:py-8 lg:grid-cols-[72px_minmax(220px,0.72fr)_minmax(320px,1.28fr)_auto] lg:items-center lg:gap-8"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-orange-800">0{index + 1}</span>
              <div>
                <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{project.tag} · {project.status}</p>
                <h3 className="m-0 mt-2 text-[clamp(30px,4vw,58px)] font-bold leading-[0.92] tracking-[-0.05em]">{project.name}</h3>
                <p className="m-0 mt-3 max-w-[48ch] text-sm leading-[1.5] text-muted-foreground">{project.description}</p>
              </div>
              <div className="relative aspect-[16/8] min-w-0 overflow-hidden border border-foreground bg-[#f3f0ea] transition-transform duration-300 ease-out group-hover:-translate-y-1">
                <Image src={project.cover} alt={t("coverAlt", { product: project.name })} fill sizes="(max-width: 768px) 100vw, 44vw" className="object-cover object-top" />
              </div>
              <span className="inline-flex min-h-11 items-center justify-self-start border border-foreground px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors group-hover:bg-foreground group-hover:text-background lg:justify-self-end">
                GitHub ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
