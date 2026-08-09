"use client";

import { useTranslations } from "next-intl";
import { captureEvent } from "@/lib/posthog";

export function HomeFinalCTA() {
  const t = useTranslations("homeFinalCta");

  return (
    <section id="contact" className="relative overflow-hidden border-b-2 border-foreground bg-orange-500 text-foreground">
      <div aria-hidden="true" className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-32 lg:px-24">
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em]">{t("kicker")}</p>
        <h2 className="m-0 mt-7 max-w-[12ch] text-[clamp(54px,9vw,148px)] font-bold leading-[0.84] tracking-[-0.065em]">{t("title")}</h2>
        <div className="mt-12 grid gap-7 border-t-2 border-foreground pt-7 md:grid-cols-[1fr_auto] md:items-end">
          <p className="m-0 max-w-[48ch] text-base font-medium leading-[1.5] md:text-lg">{t("description")}</p>
          <a
            href="https://cal.com/stangirard/30min"
            onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
            className="inline-flex min-h-14 items-center justify-between gap-8 border-2 border-foreground bg-foreground px-5 py-3 text-base font-semibold text-background no-underline transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_#fdfbf7]"
          >
            {t("bookCall")} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
