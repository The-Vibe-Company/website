import { useTranslations } from "next-intl";

/**
 * A client's own words between the cases and the services, on phones only: a
 * quiet clay piece, the quote set in two tones (the sentence in grey clay, the
 * line that sums the work up in ink), the client's logo to sign it.
 */
export function Quote() {
  const t = useTranslations("quote");

  return (
    <section className="section-tight md:hidden">
      <div className="wrap">
        <figure className="clay-quiet relative m-0 rounded-plate px-6 pb-6 pt-5">
          <span aria-hidden="true" className="display block select-none text-[88px] leading-[0.8] text-bisque">
            “
          </span>
          <blockquote className="display m-0 mt-1 text-[26px] leading-[1.15] text-bisque">
            {t.rich("text", { em: (chunks) => <em className="not-italic text-ink">{chunks}</em> })}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clients/monka.webp"
              alt=""
              aria-hidden="true"
              width={63}
              height={22}
              className="h-[22px] w-auto brightness-0"
            />
            {t("author")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
