import type { ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { OFFER_BAND, OFFER_H2, OFFER_H3, OFFER_MONO, OFFER_PROSE } from "./offer-styles";

export interface OfferFaqEntry {
  key: string;
  question: string;
  answer: ReactNode;
  extra?: ReactNode;
}

/**
 * Two-column FAQ section on warm paper, kept strictly in sync with the page's
 * FAQPage JSON-LD. Space and typography carry the hierarchy; a single rule
 * closes the band cleanly.
 */
export function OfferFaqSection({
  kicker,
  title,
  items,
  borderTop = true,
}: {
  kicker?: string;
  title: string;
  items: readonly OfferFaqEntry[];
  borderTop?: boolean;
}) {
  return (
    <section className={borderTop ? `${OFFER_BAND} border-t border-border` : OFFER_BAND}>
      {kicker ? (
        <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
          <BrandSquare />
          {kicker}
        </p>
      ) : null}
      <h2 className={OFFER_H2}>{title}</h2>

      <div className="mt-12 md:mt-16">
        {items.map((item) => (
          <article
            key={item.key}
            className="grid grid-cols-1 gap-3 border-t border-border py-8 md:grid-cols-[minmax(0,440px)_1fr] md:gap-12 md:py-10"
          >
            <h3 className={OFFER_H3}>{item.question}</h3>
            <div className="flex max-w-[68ch] flex-col gap-4">
              <p className={OFFER_PROSE}>{item.answer}</p>
              {item.extra}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
