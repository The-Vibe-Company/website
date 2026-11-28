import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BrandSquare } from "@/components/BrandSquare";
import { OFFER_BAND, OFFER_H2, OFFER_MONO, OFFER_PROSE } from "./offer-styles";

export interface OfferArticleLink {
  key: string;
  label: string;
  href: string;
  locale?: Locale;
}

export interface OfferSiblingLink {
  key: string;
  title: string;
  desc: string;
  href: string;
}

/**
 * Closing internal-linking band on warm paper: published articles on the left
 * (clean ruled list), sibling offer landings on the right (quiet hairline
 * cards that step to border-strong on hover).
 */
export function OfferFurtherReading({
  kicker,
  title,
  articlesLabel,
  articles,
  offersLabel,
  offers,
  note,
}: {
  kicker?: string;
  title: string;
  articlesLabel: string;
  articles: readonly OfferArticleLink[];
  offersLabel: string;
  offers: readonly OfferSiblingLink[];
  note?: ReactNode;
}) {
  return (
    <section className={`${OFFER_BAND} border-t border-border`}>
      {kicker ? (
        <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
          <BrandSquare />
          {kicker}
        </p>
      ) : null}
      <h2 className={OFFER_H2}>{title}</h2>

      <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className={OFFER_MONO}>{articlesLabel}</span>
          <ul className="m-0 mt-5 list-none border-t border-border p-0">
            {articles.map((item) => (
              <li key={item.key} className="border-b border-border">
                <Link
                  href={item.href}
                  locale={item.locale}
                  className="group flex items-baseline justify-between gap-4 py-4 text-[16px] leading-[1.45] text-foreground"
                >
                  <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-foreground">
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-muted-foreground transition-colors group-hover:text-brand"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className={OFFER_MONO}>{offersLabel}</span>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {offers.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group block border border-border bg-card p-6 transition-colors duration-300 hover:border-border-strong"
              >
                <span className="flex items-baseline justify-between gap-4 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[22px]">
                  {item.title}
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-base text-muted-foreground transition-colors group-hover:text-brand"
                  >
                    →
                  </span>
                </span>
                <span className={`${OFFER_PROSE} mt-2 block`}>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {note ? (
        <div className={`${OFFER_PROSE} mt-12 max-w-[760px] border-l border-border-strong pl-5`}>
          {note}
        </div>
      ) : null}
    </section>
  );
}
