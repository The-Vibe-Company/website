import { useTranslations } from "next-intl";
import { clientLogoSize } from "@/lib/client-logos";

/** The client's words, in a pool of warm light. */
export function LitQuote() {
  const t = useTranslations("quote");

  return (
    <section className="relative overflow-hidden border-y border-border bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(55% 75% at 22% 60%, rgb(242 115 19 / 0.16), rgb(242 115 19 / 0.04) 55%, transparent 80%)" }}
      />
      <figure className="relative mx-auto m-0 max-w-[90rem] px-6 py-28 md:px-10 lg:px-16 lg:py-40">
        <span aria-hidden="true" className="block font-bold leading-none text-brand text-[7rem] lg:text-[10rem]">“</span>
        <blockquote className="m-0 -mt-10 max-w-[22ch] text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground lg:-mt-16">
          {t.rich("text", { em: (chunks) => <em className="not-italic text-brand">{chunks}</em> })}
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/clients/monka.webp" alt="" aria-hidden="true" {...clientLogoSize("/images/clients/monka.webp")} className="h-6 w-auto brightness-0 invert" loading="lazy" decoding="async" />
          {t("author")}
        </figcaption>
      </figure>
    </section>
  );
}
