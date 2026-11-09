"use client";

import { useTranslations } from "next-intl";
import { clientLogoSize } from "@/lib/client-logos";
import { LivePulse } from "./primitives";

const LABEL = { fr: "Message entrant", en: "Incoming message" };

/**
 * The client's word, set like a message just received: muted text with the
 * phrase that sums the work up in full paper.
 */
export function LiveQuote({ locale }: { locale: "fr" | "en" }) {
  const t = useTranslations("quote");
  return (
    <section className="border-t border-border bg-background">
      <figure className="mx-auto m-0 grid max-w-[90rem] grid-cols-1 gap-8 px-6 py-20 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-12 md:px-10 md:py-28 lg:px-16">
        <p className="m-0 flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
          <LivePulse />
          {LABEL[locale]}
        </p>
        <div>
          <blockquote className="m-0 max-w-[24ch] text-[clamp(30px,3.8vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-muted-foreground">
            {t.rich("text", { em: (chunks) => <em className="not-italic text-foreground">{chunks}</em> })}
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clients/monka.webp"
              alt=""
              aria-hidden="true"
              {...clientLogoSize("/images/clients/monka.webp")}
              className="h-[22px] w-auto brightness-0 invert"
              loading="lazy"
              decoding="async"
            />
            {t("author")}
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
