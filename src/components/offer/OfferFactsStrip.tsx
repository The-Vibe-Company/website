import type { ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { OFFER_MONO, OFFER_SECTION } from "./offer-styles";

export interface OfferFactItem {
  figure: string;
  label: string;
  detail: string;
}

/**
 * Architectural 4-column proof ledger sitting at the top of the warm-paper
 * band, right under the hero / client logo loop. Gives a skeptical buyer the
 * hard sourced numbers in one scan, with crisp hairline dividers and zero card
 * boxes.
 */
export function OfferFactsStrip({
  kicker,
  items,
  footer,
}: {
  kicker: string;
  items: readonly OfferFactItem[];
  footer?: ReactNode;
}) {
  return (
    <section className={`${OFFER_SECTION} border-b border-border py-12 md:py-16`}>
      <p className={`m-0 inline-flex items-center ${OFFER_MONO}`}>
        <BrandSquare />
        {kicker}
      </p>
      <dl className="m-0 mt-7 grid grid-cols-1 gap-y-8 border-t border-border pt-7 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-0 lg:pt-0">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex flex-col lg:pt-7 ${
              i > 0 ? "lg:border-l lg:border-border lg:pl-8" : ""
            } ${i < items.length - 1 ? "lg:pr-8" : ""}`}
          >
            <dt className={OFFER_MONO}>{item.label}</dt>
            <dd className="m-0 mt-3 text-[clamp(1.75rem,2.6vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-foreground">
              {item.figure}
            </dd>
            <p className="m-0 mt-2.5 text-[14px] leading-[1.5] text-muted-foreground">
              {item.detail}
            </p>
          </div>
        ))}
      </dl>
      {footer ? <div className="mt-8 border-t border-border pt-7">{footer}</div> : null}
    </section>
  );
}
