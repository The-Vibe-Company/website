"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";
import { Kicker, LitTitle } from "./light";
import s from "./lantern.module.css";

const KEYS = ["build", "operate", "advise"] as const;

/**
 * The three ways to work together, each under its own pendant lamp. One lamp
 * is on at a time: hovering, focusing or tapping a column switches its bulb on,
 * sets the lamp swinging, and pours its light down over the offer and its
 * list. Phones get all three lit, one under the other.
 */
export function Lamps() {
  const t = useTranslations("services");
  const tParis = useTranslations("agencyParis");
  const locale = useLocale();
  const [on, setOn] = useState(0);

  return (
    <section id="services" className="relative bg-[#070707] py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <Kicker>{t("kicker")}</Kicker>
        <LitTitle line1={t("titleLine1")} line2={t("titleLine2")} className="mt-8" />

        <div className="mt-6 grid grid-cols-1 gap-y-4 md:mt-4 md:grid-cols-3 md:gap-x-0">
          {KEYS.map((key, i) => {
            const bullets = t.raw(`items.${key}.bullets`) as string[];
            const active = on === i;
            return (
              <div
                key={key}
                data-on={active}
                onPointerEnter={(e) => e.pointerType === "mouse" && setOn(i)}
                onFocus={() => setOn(i)}
                className={cn(
                  s.lampHost,
                  "group relative flex flex-col md:border-l md:border-[#1f1e1e] md:last:border-r",
                )}
              >
                <div aria-hidden="true" className="relative">
                  <div className={s.lampCord} />
                  <div className={s.lamp}>
                    <span className={s.bulb} />
                  </div>
                </div>
                <div className="relative mt-3 flex flex-1 flex-col px-1 pb-8 pt-10 md:px-8 md:pb-10">
                  <span aria-hidden="true" className={s.lampCone} />
                  <span className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffb36b]">
                    {String(i + 1).padStart(2, "0")} · {t(`items.${key}.tag`)}
                  </span>
                  <h3
                    className={cn(
                      "relative m-0 mt-4 text-[clamp(1.7rem,2.4vw,2.35rem)] font-[750] leading-[1.04] tracking-[-0.035em] transition-colors duration-500",
                      active ? "text-[#fff4e6]" : "text-[#c9c4bb] max-md:text-[#fff4e6]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOn(i)}
                      aria-expanded={active}
                      aria-controls={`lamp-${key}`}
                      className="text-left"
                    >
                      {t(`items.${key}.title`)}
                    </button>
                  </h3>
                  <p
                    className={cn(
                      "relative m-0 mt-4 text-[15px] leading-[1.6] transition-colors duration-500",
                      active ? "text-[#b8b4ac]" : "text-[#8f8b84] max-md:text-[#b8b4ac]",
                    )}
                  >
                    {t(`items.${key}.desc`)}
                  </p>
                  <div
                    id={`lamp-${key}`}
                    className={cn(
                      "relative grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                      active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 max-md:grid-rows-[1fr] max-md:opacity-100",
                    )}
                  >
                    <ul className="m-0 min-h-0 list-none overflow-hidden p-0">
                      {bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 border-t border-[#2a2420] py-2.5 text-[14px] leading-[1.5] text-[#d9d4cb] first:mt-6"
                        >
                          <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 bg-[#ffb36b] shadow-[0_0_6px_1px_rgb(242_115_19/0.8)]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href={splitPath(AGENCY_PARIS_PATHS, locale)}
          className="mt-12 flex items-center justify-between gap-4 border-y border-border py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-[#ffb36b]"
        >
          <span className="underline decoration-1 underline-offset-4">{tParis("homeLink")}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
