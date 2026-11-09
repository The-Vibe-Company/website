"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";
import { SERIF } from "./fonts";

const ITEMS = ["build", "operate", "advise"] as const;
const NUMERALS = ["i.", "ii.", "iii."];

/**
 * The three ways of working as an index: three big rows, one open at a time.
 * Pointing at a row, focusing it or pressing it opens it; the others fold to
 * their title line. The open row shows its pitch beside its list.
 */
export function ServicesIndex() {
  const t = useTranslations("services");
  const tParis = useTranslations("agencyParis");
  const locale = useLocale();
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <div>
      <ul className="m-0 list-none border-t border-border p-0">
        {ITEMS.map((key, i) => {
          const isOpen = open === i;
          const bullets = t.raw(`items.${key}.bullets`) as string[];
          return (
            <li
              key={key}
              className={cn("border-b border-border transition-colors duration-500", isOpen && "bg-card")}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-${key}`}
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  className="grid w-full cursor-pointer grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-4 px-0 py-7 text-left md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:px-6 md:py-9"
                >
                  <span className={`${SERIF} text-[28px] leading-none tracking-[-0.02em] text-muted-foreground md:text-[40px]`}>
                    {NUMERALS[i]}
                  </span>
                  <span
                    className={cn(
                      "text-[clamp(28px,4.2vw,60px)] font-bold leading-[0.98] tracking-[-0.04em] transition-colors duration-300",
                      isOpen ? "text-foreground" : "text-soft-foreground",
                    )}
                  >
                    {t(`items.${key}.title`)}
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:inline">
                    {t(`items.${key}.tag`)}
                  </span>
                </button>
              </h3>
              <div
                id={`${id}-${key}`}
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-8 pb-9 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-8 md:px-6 md:pb-12">
                    <span aria-hidden="true" className="hidden md:block" />
                    <p className="m-0 max-w-[34rem] text-[17px] leading-[1.6] text-foreground">{t(`items.${key}.desc`)}</p>
                    <ul className="m-0 flex list-none flex-col p-0">
                      {bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 border-t border-border py-3 text-[14px] leading-[1.5] text-muted-foreground first:border-t-0 first:pt-0"
                        >
                          <span aria-hidden="true" className="font-mono text-brand">
                            —
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Link
        href={splitPath(AGENCY_PARIS_PATHS, locale)}
        className="group mt-10 inline-flex min-h-11 items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground no-underline"
      >
        <span className="underline decoration-1 underline-offset-4">{tParis("homeLink")}</span>
        <span aria-hidden="true" className="text-brand transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}
