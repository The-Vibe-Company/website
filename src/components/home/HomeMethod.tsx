"use client";

import { useTranslations } from "next-intl";

const STEPS = ["brief", "design", "build", "operate"] as const;

export function HomeMethod() {
  const t = useTranslations("process");

  return (
    <section id="method" className="border-b-2 border-foreground bg-[#f3f0ea]">
      <div className="mx-auto max-w-[100rem] px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <div className="grid gap-8 pb-12 md:grid-cols-[1fr_1.2fr] md:items-end md:pb-16">
          <div>
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-800">{t("kicker")}</p>
            <h2 className="m-0 mt-4 text-[clamp(48px,7vw,104px)] font-bold leading-[0.86] tracking-[-0.06em]">
              {t("titleLine1")}<br />{t("titleLine2")}
            </h2>
          </div>
          <p className="m-0 max-w-[52ch] text-base leading-[1.55] text-muted-foreground md:justify-self-end md:text-lg">
            {t("intro")}
          </p>
        </div>

        <ol className="m-0 list-none border-t-2 border-foreground p-0">
          {STEPS.map((step, index) => (
            <li key={step} className="group grid gap-4 border-b border-foreground py-7 md:grid-cols-[100px_180px_1fr] md:gap-8 md:py-9">
              <span className="font-mono text-[11px] tracking-[0.18em] text-orange-800">0{index + 1}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t(`steps.${step}.label`)}</span>
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <h3 className="m-0 max-w-[15ch] text-[clamp(25px,3vw,42px)] font-bold leading-[0.98] tracking-[-0.04em]">{t(`steps.${step}.title`)}</h3>
                <p className="m-0 max-w-[58ch] text-sm leading-[1.55] text-muted-foreground md:text-base">{t(`steps.${step}.desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
