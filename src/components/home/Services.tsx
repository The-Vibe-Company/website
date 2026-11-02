"use client";

import { useTranslations } from "next-intl";
import { Chip, Groove, Reveal, SectionTitle, revealProps, useReveal } from "@/components/kit";

const SERVICES = [
  { n: "01", key: "build" },
  { n: "02", key: "operate" },
  { n: "03", key: "advise" },
] as const;

/**
 * The three ways to work with us: three quiet clay pieces on one set of rows,
 * so the title, the pitch and the list start at the same height in every card
 * whatever their length (a subgrid from 768px, plain stacking before).
 */
export function Services() {
  const t = useTranslations("services");
  const reveal = useReveal();

  return (
    <section id="services" className="section scroll-mt-24">
      <div className="wrap">
        <Reveal from="left">
          <SectionTitle kicker={t("kicker")} line1={t("titleLine1")} line2={t("titleLine2")} size="md" />
        </Reveal>

        <div className="mt-9 grid gap-3.5 md:mt-14 md:grid-cols-3 md:gap-x-5 md:gap-y-0">
          {SERVICES.map((service, i) => (
            <article
              key={service.n}
              ref={reveal}
              {...revealProps("up", i * 110)}
              className="clay-quiet grid grid-rows-[auto_auto_1fr_auto] rounded-plate px-6 pb-7 pt-6 md:row-span-4 md:grid-rows-subgrid md:px-7 md:pb-[30px] md:pt-[26px]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="mono text-xs tracking-[0.08em] text-muted-foreground">{service.n}</span>
                <Chip>{t(`items.${service.key}.tag`)}</Chip>
              </div>

              <h3 className="display m-0 mt-7 text-[28px] leading-[1.02] md:mt-[34px] md:text-[32px]">
                {t(`items.${service.key}.title`)}
              </h3>
              <p className="m-0 mt-3.5 text-[15.5px] leading-[1.55] text-muted-foreground">
                {t(`items.${service.key}.desc`)}
              </p>

              {/* On a phone the list is tighter: smaller type and rhythm, the
                  same points. */}
              <div>
                <Groove className="mt-5 md:mt-6" />
                <ul className="ticks mt-4 gap-2 max-md:[&>li]:text-sm md:mt-[22px] md:gap-[11px]">
                  {(t.raw(`items.${service.key}.bullets`) as string[]).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
