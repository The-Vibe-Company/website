"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { cn } from "@/lib/design-system";
import { DISPLAY } from "./font";

const SERVICES = [
  { n: "01", key: "build" },
  { n: "02", key: "operate" },
  { n: "03", key: "advise" },
] as const;

/**
 * Three giant verbs, squeezed narrow at rest. The one under the pointer or the
 * keyboard throws itself wide along the width axis and opens its offer
 * underneath; the other two stay squeezed. A click (or Enter) pins one open,
 * which is how touch screens use it.
 */
export function Services() {
  const t = useTranslations("services");
  const tHero = useTranslations("hero");
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <section id="services" className="scroll-mt-24 bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <BrandSquare />
            {t("kicker")}
          </span>
          <h2 className="m-0 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-right md:text-[32px]">
            {t("titleLine1")} {t("titleLine2")}
          </h2>
        </div>

        <ul className="m-0 list-none border-t border-border p-0">
          {SERVICES.map((service, i) => {
            const active = open === i;
            const panelId = `${id}-${service.key}`;
            return (
              <li key={service.key} className="border-b border-border" onMouseEnter={() => setOpen(i)}>
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={active}
                    aria-controls={panelId}
                    onFocus={() => setOpen(i)}
                    onClick={() => setOpen(i)}
                    className="group grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 py-5 text-left md:grid-cols-[5rem_minmax(0,1fr)_auto] md:py-7"
                  >
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground transition-colors group-aria-expanded:text-brand">
                      {service.n}
                    </span>
                    <span
                      data-open={active}
                      className={cn(
                        DISPLAY,
                        "block min-w-0 overflow-hidden whitespace-nowrap font-extrabold uppercase leading-[0.86] tracking-[-0.02em] text-foreground",
                        "text-[14vw] [--open:74%] [--rest:52%] md:text-[min(8vw,120px)] md:[--open:130%]",
                        "[font-stretch:var(--rest)] data-[open=true]:[font-stretch:var(--open)]",
                        "transition-[font-stretch,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                        !active && "text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]",
                      )}
                    >
                      {tHero(`items.${service.key}.label`)}
                    </span>
                    <span className="hidden border border-border-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-soft-foreground md:inline-block">
                      {t(`items.${service.key}.tag`)}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-label={t(`items.${service.key}.title`)}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                    active ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="min-h-0 overflow-hidden" inert={!active || undefined}>
                    <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:pb-12">
                      <span aria-hidden="true" className="hidden md:block" />
                      <div>
                        <p className="m-0 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[28px]">
                          {t(`items.${service.key}.title`)}
                        </p>
                        <p className="m-0 mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-muted-foreground md:text-base">
                          {t(`items.${service.key}.desc`)}
                        </p>
                      </div>
                      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                        {(t.raw(`items.${service.key}.bullets`) as string[]).map((b) => (
                          <li key={b} className="flex gap-3 text-sm leading-[1.5] text-foreground">
                            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-brand" />
                            <span>{b}</span>
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
      </div>
    </section>
  );
}
