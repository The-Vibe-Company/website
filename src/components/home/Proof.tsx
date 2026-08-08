"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getProjects, type ContentLocale } from "@/lib/projects";

const ORG_URL = "https://github.com/The-Vibe-Company";

export function Proof() {
  const reduceMotion = useReducedMotion() ?? false;
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("proof");
  const projects = getProjects(locale);

  return (
    <section
      id="proof"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 md:mb-14">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("kicker")}
          </span>
          <h2
            className="m-0 font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6vw, 88px)",
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
          </h2>
          <p className="m-0 mt-7 max-w-[620px] text-lg leading-[1.5] text-muted-foreground">
            {t("intro")}
          </p>
        </div>

        <div className="mb-5 border-b border-border pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="font-semibold text-foreground">
            {t("barLeft")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {projects.map((p, i) => (
            <motion.a
              key={p.slug}
              href={p.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col gap-3 overflow-hidden border border-foreground bg-background p-6 no-underline transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  GITHUB
                </span>
                <span aria-hidden="true" className="text-lg text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </div>
              <div className="mt-3">
                <h3 className="m-0 font-mono text-2xl font-bold tracking-[-0.03em] text-foreground">
                  {p.name}
                </h3>
              </div>
              <p className="m-0 min-h-[60px] text-sm leading-[1.5] text-muted-foreground">
                {p.description}
              </p>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 flex justify-start">
          <a
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          >
            {t("browseAll")}
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
