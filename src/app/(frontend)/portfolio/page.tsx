import type { Metadata } from "next";
import Image from "next/image";
import { FolderKanban } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { TopNav } from "@/components/TopNav";
import { resourcesTheme } from "@/lib/resources-theme";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type Localized = { en: string; fr: string };

type Project = {
  name: string;
  href: string;
  cover: string;
  logo: string;
  accent: string;
  description: Localized;
  date: Localized;
};

const projects: Project[] = [
  {
    name: "vanish.sh",
    href: "https://vanish.sh",
    cover: "/projects/vanish-home.png",
    logo: "/projects/vanish-favicon.svg",
    accent: "#10b981",
    description: {
      en: "Vanish is a temporary upload service: send a file, get a public link, and let it expire automatically.",
      fr: "Vanish est un service d’upload temporaire. Envoyez un fichier, récupérez un lien public, et laissez-le expirer automatiquement.",
    },
    date: { en: "Feb 2026", fr: "févr. 2026" },
  },
  {
    name: "The Companion",
    href: "https://www.thecompanion.sh/",
    cover: "/projects/compagnon-home.png",
    logo: "/projects/compagnon-favicon.svg",
    accent: "#f97316",
    description: {
      en: "The Companion helps teams execute with agent workflows, orchestration, and product operations without slideware.",
      fr: "The Companion aide les équipes à exécuter avec des workflows d’agents, de l’orchestration et des opérations produit, sans slides.",
    },
    date: { en: "Feb 2026", fr: "févr. 2026" },
  },
  {
    name: "vibedrift.dev",
    href: "https://www.vibedrift.dev",
    cover: "/projects/vibedrift-home.png",
    logo: "/projects/vibedrift-favicon.svg",
    accent: "#facc15",
    description: {
      en: "VibeDrift tracks real developer activity and turns it into useful metrics to understand flow and friction.",
      fr: "VibeDrift suit l’activité réelle des développeurs et la transforme en métriques utiles pour comprendre le flow et les frictions.",
    },
    date: { en: "Feb 2026", fr: "févr. 2026" },
  },
  {
    name: "Granite",
    href: "https://github.com/The-Vibe-Company/Granite",
    cover: "/projects/granite-home.png",
    logo: "/projects/granite-favicon.png",
    accent: "#62D1AF",
    description: {
      en: "Granite is the personal OS your agent runs on: markdown notes, a SQLite index, and a typed contract system that turns local files into a navigable company memory.",
      fr: "Granite est l’OS personnel sur lequel tourne votre agent. Des notes markdown, un index SQLite et un système de contrats typés qui transforme vos fichiers locaux en une mémoire d’entreprise navigable.",
    },
    date: { en: "Apr 2026", fr: "avr. 2026" },
  },
];

export default async function PortfolioPage() {
  const locale = (await getLocale()) === "fr" ? "fr" : "en";
  const t = await getTranslations("portfolio");
  return (
    <>
      <TopNav />
      <main className="resources-theme min-h-screen bg-res-bg text-res-text pt-12 pb-12">
        <section className={`${resourcesTheme.section.padding} pt-2 pb-8 border-b border-res-border mb-8`}>
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
              {t("kicker")}
            </span>
            <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
              <FolderKanban size={36} strokeWidth={1.5} className="shrink-0" />
              {t("title")}
            </h1>
            <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </section>

        <section className={`${resourcesTheme.section.padding} pb-24`}>
          <div className="divide-y divide-res-border border-y border-res-border">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-7 md:py-9"
              >
                <article className="relative grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-8 items-start">
                  <div className="absolute -left-6 top-8 hidden h-14 w-[2px] md:block" style={{ backgroundColor: project.accent }} />

                  <div className="md:col-span-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src={project.logo}
                        alt={`${project.name} logo`}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-sm object-contain bg-white/80"
                      />
                      <h2 className="text-3xl md:text-[2.15rem] font-bold tracking-tighter leading-none text-res-text">
                        {project.name}
                      </h2>
                    </div>

                    <p className="text-sm md:text-[15px] text-res-text-muted leading-relaxed max-w-md mb-5">
                      {project.description[locale]}
                    </p>

                    <div className="flex items-center justify-between max-w-md pt-3 border-t border-res-border">
                      <span className="text-[10px] font-mono text-res-text-muted uppercase tracking-[0.14em] whitespace-nowrap">
                        {t("built")} {project.date[locale]}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-res-text">
                        {t("open")} &rarr;
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden border border-res-border bg-res-surface">
                    <Image
                      src={project.cover}
                      alt={`${project.name} homepage`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: project.accent }} />
                  </div>
                </article>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
