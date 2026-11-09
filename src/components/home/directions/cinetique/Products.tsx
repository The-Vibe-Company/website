"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { getProjects, type ContentLocale, type Project } from "@/lib/projects";
import { DISPLAY } from "./font";

const ORG_URL = "https://github.com/The-Vibe-Company";

/** A tall product tile; its name widens on hover, its border takes the accent. */
function Tile({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <Link
      href={`/portfolio/${p.slug}`}
      style={{ "--accent": p.accent } as CSSProperties}
      className={`group relative flex flex-col overflow-hidden border border-border bg-card no-underline transition-colors duration-300 hover:border-[var(--accent)] focus-visible:border-[var(--accent)] ${className}`}
    >
      <span aria-hidden="true" className="h-[3px] w-full bg-[var(--accent)]" />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.logo} alt="" aria-hidden="true" className="h-10 w-10 rounded-md object-contain" loading="lazy" decoding="async" />
          <span aria-hidden="true" className="text-lg text-foreground transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
        <p
          className={`${DISPLAY} m-0 mt-auto pt-10 text-[clamp(40px,4vw,60px)] font-extrabold uppercase leading-[0.86] tracking-[-0.02em] text-foreground [font-stretch:62%] transition-[font-stretch] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[font-stretch:80%] group-focus-visible:[font-stretch:80%] motion-reduce:transition-none`}
        >
          {p.name}
        </p>
        <p className="m-0 mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          {p.tag}
        </p>
        <p className="m-0 mt-4 line-clamp-4 text-sm leading-[1.55] text-soft-foreground">{p.description}</p>
        <p className="m-0 mt-5 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {p.status} · {p.date}
        </p>
      </div>
    </Link>
  );
}

/**
 * Our products on a sideways track: the section pins and scrolling down slides
 * the row of tall tiles to the left, an orange bar counting the way. Phones
 * and reduced motion get the tiles as a plain grid.
 */
export function Products({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("proof");
  const projects = getProjects(locale);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const intro = (
    <div className="flex flex-col justify-between">
      <div>
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <BrandSquare />
          {t("kicker")}
        </span>
        <h2
          className={`${DISPLAY} m-0 mt-6 font-extrabold uppercase leading-[0.84] tracking-[-0.02em] text-foreground`}
          style={{ fontSize: "clamp(44px, 5.6vw, 92px)", fontStretch: "62%" }}
        >
          {t("titleLine1")}
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]">{t("titleLine2")}</span>
        </h2>
        <p className="m-0 mt-6 max-w-[34ch] text-[15px] leading-[1.6] text-muted-foreground md:text-base">{t("intro")}</p>
      </div>
      <a
        href={ORG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex w-fit items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-brand"
      >
        {t("browseAll")} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );

  return (
    <>
      {/* Wide screens: the pinned sideways track. */}
      <section
        ref={sectionRef}
        id="proof"
        aria-label={t("indexTitle")}
        className="relative hidden border-t border-border bg-background md:block md:motion-reduce:hidden"
        style={{ height: `calc(100vh + ${distance}px)` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[84px]">
          <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-5 px-10 lg:px-16">
            <div className="flex w-[min(30rem,38vw)] shrink-0 pr-8">{intro}</div>
            {projects.map((p) => (
              <Tile key={p.slug} p={p} className="h-[min(560px,64vh)] w-[min(340px,max(260px,26vw))] shrink-0" />
            ))}
          </motion.div>
          <div className="mx-10 mt-8 h-px bg-border lg:mx-16">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-brand" />
          </div>
        </div>
      </section>

      {/* Phones and reduced motion: the same tiles as a grid. */}
      <section aria-label={t("indexTitle")} className="border-t border-border bg-background md:hidden md:motion-reduce:block">
        <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 lg:px-16">
          {intro}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <Tile key={p.slug} p={p} className="min-h-[300px]" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
