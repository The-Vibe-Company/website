import type { ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { OFFER_BAND, OFFER_H2, OFFER_INK_GLOW, OFFER_MONO, OFFER_PROSE } from "./offer-styles";

export interface OfferMethodStep {
  n: string;
  label?: string;
  title: string;
  desc: string;
}

/**
 * Full-width ink band of emphasis showing how an engagement unfolds step by
 * step, with the house warm orange corner glow and an optional booking CTA or
 * checklist link aligned to the content column.
 */
export function OfferMethodBand({
  kicker,
  title,
  intro,
  steps,
  footer,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  steps: readonly OfferMethodStep[];
  footer?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: OFFER_INK_GLOW }}
      />
      <div className={`relative ${OFFER_BAND}`}>
        {kicker ? (
          <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
            <BrandSquare />
            {kicker}
          </p>
        ) : null}
        <h2 className={`${OFFER_H2} max-w-[20ch]`}>{title}</h2>
        {intro ? <p className={`${OFFER_PROSE} mt-6 max-w-[660px]`}>{intro}</p> : null}

        <ol className="m-0 mt-12 flex list-none flex-col border-t border-border p-0 md:mt-16">
          {steps.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-1 gap-4 border-b border-border py-8 last:border-b-0 md:grid-cols-[200px_1fr] md:gap-12 md:py-10"
            >
              <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-2.5">
                <span className="text-foreground text-[44px] font-bold leading-none tracking-[-0.05em] md:text-[64px]">
                  {step.n}
                </span>
                {step.label ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                    {step.label}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="m-0 max-w-[600px] text-[21px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[28px]">
                  {step.title}
                </h3>
                <p className={`${OFFER_PROSE} max-w-[60ch]`}>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {footer ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-[200px_1fr] md:gap-12">
            <span aria-hidden="true" className="hidden md:block" />
            <div>{footer}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
