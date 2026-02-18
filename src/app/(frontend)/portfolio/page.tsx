import type { Metadata } from "next";
import Image from "next/image";
import { FolderKanban } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { resourcesTheme } from "@/lib/resources-theme";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A simple project list with homepage covers, short notes, and ship dates.",
};

type Project = {
  name: string;
  href: string;
  cover: string;
  logo: string;
  accent: string;
  description: string;
  date: string;
};

const projects: Project[] = [
  {
    name: "vanish.sh",
    href: "https://vanish.sh",
    cover: "/projects/vanish-home.png",
    logo: "/projects/vanish-favicon.svg",
    accent: "#10b981",
    description:
      "Vanish is a temporary upload service: send a file, get a public link, and let it expire automatically.",
    date: "Feb 2026",
  },
  {
    name: "The Companion",
    href: "https://github.com/The-Vibe-Company/companion",
    cover: "/projects/compagnon-home.png",
    logo: "/projects/compagnon-favicon.svg",
    accent: "#f97316",
    description:
      "The Companion helps teams execute with agent workflows, orchestration, and product operations without slideware.",
    date: "Feb 2026",
  },
  {
    name: "vibedrift.dev",
    href: "https://www.vibedrift.dev",
    cover: "/projects/vibedrift-home.png",
    logo: "/projects/vibedrift-favicon.svg",
    accent: "#facc15",
    description:
      "VibeDrift tracks real developer activity and turns it into useful metrics to understand flow and friction.",
    date: "Feb 2026",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <TopNav />
      <main className="resources-theme min-h-screen bg-res-bg text-res-text pt-12 pb-12">
        <section className={`${resourcesTheme.section.padding} pt-2 pb-8 border-b border-res-border mb-8`}>
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
              Portfolio
            </span>
            <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold tracking-tighter mb-3 leading-[0.95] text-res-text">
              <FolderKanban size={36} strokeWidth={1.5} className="shrink-0" />
              Projects
            </h1>
            <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
              A selection of our productions.
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
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between max-w-md pt-3 border-t border-res-border">
                      <span className="text-[10px] font-mono text-res-text-muted uppercase tracking-[0.14em] whitespace-nowrap">
                        Built {project.date}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-res-text">
                        Open &rarr;
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden border border-res-border bg-res-surface">
                    <Image
                      src={project.cover}
                      alt={`${project.name} homepage`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-30 transition-transform duration-500 group-hover:scale-x-100" style={{ backgroundColor: project.accent }} />
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
