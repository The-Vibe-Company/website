"use client";

import { motion, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";
import { usePointer } from "./pointer";
import s from "./profondeur.module.css";

const SERVICES = [
  { key: "build", z: -70, y: 34, delay: "0s" },
  { key: "operate", z: 50, y: -18, delay: "-2.4s" },
  { key: "advise", z: -20, y: 52, delay: "-4.8s" },
] as const;

/**
 * The three offers as panels hanging at different depths in one space. The
 * whole group turns a little toward the pointer, each panel bobs on its own
 * breath, and the one you point at (or tab to) comes forward into the light
 * and opens its list.
 */
export function ServicesFloat() {
  const t = useTranslations("services");
  const tParis = useTranslations("agencyParis");
  const locale = useLocale();
  const { x: px, y: py } = usePointer();
  const rotateY = useTransform(px, (v) => v * 6);
  const rotateX = useTransform(py, (v) => 8 + v * -4);

  return (
    <section id="services" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
          <BrandSquare />
          {t("kicker")}
        </p>
        <h2 className="m-0 mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-foreground">
          {t("titleLine1")}
          <br />
          <span className="text-soft-foreground">{t("titleLine2")}</span>
        </h2>

        <div className="mt-14 md:mt-20 lg:[perspective:1500px]">
          <motion.ol
            style={{ rotateX, rotateY }}
            className="m-0 grid list-none grid-cols-1 gap-6 p-0 max-lg:transform-none! lg:grid-cols-3 lg:gap-8 lg:[transform-style:preserve-3d]"
          >
            {SERVICES.map((sv, i) => (
              <li
                key={sv.key}
                tabIndex={0}
                style={{ "--z": `${sv.z}px`, "--y": `${sv.y}px`, animationDelay: sv.delay } as CSSProperties}
                className={cn(s.lit, s.panel, s.float, "relative flex flex-col p-7 outline-offset-4 md:p-8")}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[12px] tracking-[0.2em] text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t(`items.${sv.key}.tag`)}</span>
                </div>
                <h3 className="m-0 mt-10 text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-foreground md:text-[30px]">
                  {t(`items.${sv.key}.title`)}
                </h3>
                <p className="m-0 mt-4 text-[15px] leading-[1.6] text-muted-foreground">{t(`items.${sv.key}.desc`)}</p>
                <div className={s.reveal}>
                  <div>
                    <ul className="m-0 mt-6 list-none space-y-2.5 border-t border-border p-0 pt-5">
                      {(t.raw(`items.${sv.key}.bullets`) as string[]).map((b) => (
                        <li key={b} className="flex gap-3 text-[14px] leading-[1.45] text-soft-foreground">
                          <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 bg-brand" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </motion.ol>
        </div>

        <Link
          href={splitPath(AGENCY_PARIS_PATHS, locale)}
          className="mt-16 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand md:mt-24"
        >
          {tParis("homeLink")} <span aria-hidden="true" className="text-brand">→</span>
        </Link>
      </div>
    </section>
  );
}
