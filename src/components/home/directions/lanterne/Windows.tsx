"use client";

import { useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { getProjects, type ContentLocale } from "@/lib/projects";
import { Kicker, LitTitle } from "./light";
import s from "./lantern.module.css";

/** Two windows where someone left a screen on. */
const FLICKER = new Set([2, 6]);

/**
 * Our products as a building at night: one lit window per product, its glow
 * tinted by the product's own colour, two of them flickering like a screen
 * left on. Hovering or focusing a window turns its light up and writes the
 * product's story in the caption beside the facade.
 */
export function Windows({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("proof");
  const projects = getProjects(locale);
  const [active, setActive] = useState(0);
  const current = projects[active];
  const fr = locale === "fr";

  return (
    <section id="proof" className="relative overflow-hidden bg-[#070707] py-24 md:py-32">
      {/* The street light the facade stands in. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(900px 600px at 72% 60%, rgb(242 115 19 / 0.1), transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Kicker>{t("kicker")}</Kicker>
          <LitTitle line1={t("titleLine1")} line2={t("titleLine2")} className="mt-8 text-[clamp(2.4rem,4.2vw,4.4rem)]" />
          <p className="m-0 mt-8 max-w-[30rem] text-[17px] leading-[1.6] text-[#a7a49d]">{t("intro")}</p>

          {/* The caption of the lit window. */}
          <div aria-live="polite" className="mt-10 hidden border-t border-border pt-6 lg:block">
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {fr ? "Fenêtre" : "Window"} {String(active + 1).padStart(2, "0")} · {current.status} · {current.date}
            </p>
            <p className="m-0 mt-3 text-[28px] font-[750] tracking-[-0.03em] text-foreground">
              {current.name}{" "}
              <span className="text-[17px] font-normal tracking-normal text-muted-foreground">{current.tag}</span>
            </p>
            <p className="m-0 mt-3 max-w-[30rem] text-[15px] leading-[1.6] text-[#b8b4ac]">{current.description}</p>
          </div>

          <a
            href="https://github.com/The-Vibe-Company"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-[#ffb36b]"
          >
            {t("browseAll")}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* The facade. */}
        <ul className="m-0 grid list-none grid-cols-3 gap-x-4 gap-y-8 border-x border-t border-[#1d1c1c] bg-[#0a0909] p-4 pb-0 md:gap-x-8 md:gap-y-12 md:p-10 md:pb-0">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/portfolio/${p.slug}`}
                data-active={active === i}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(s.windowHost, FLICKER.has(i) && s.flicker, "group block")}
                style={{ "--accent": p.accent, "--delay": `${i * 0.7}s` } as CSSProperties}
              >
                <div className={s.window}>
                  <div className={s.windowGlow} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.logo}
                    alt=""
                    aria-hidden="true"
                    className="absolute bottom-[14%] left-1/2 z-[3] h-7 w-7 -translate-x-1/2 rounded-[6px] object-contain opacity-90 md:h-9 md:w-9"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* The sill, catching the window's light. */}
                <div
                  aria-hidden="true"
                  className="h-[3px] bg-[#2a2827] transition-colors duration-500 group-hover:bg-[color-mix(in_oklab,var(--accent)_45%,#ffb36b)]"
                />
                <p className="m-0 mt-3 text-[13px] font-[700] tracking-[-0.01em] text-foreground md:text-[16px]">{p.name}</p>
                <p className="m-0 mt-1 font-mono text-[9px] uppercase leading-[1.4] tracking-[0.16em] text-muted-foreground md:text-[10px]">
                  {p.tag}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
