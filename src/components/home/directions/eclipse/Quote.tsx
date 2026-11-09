import { useTranslations } from "next-intl";
import { clientLogoSize } from "@/lib/client-logos";
import { cn } from "@/lib/design-system";
import styles from "./eclipse.module.css";
import { DISPLAY } from "./font";
import { CONTAINER } from "./shared";

/**
 * The client quote, set large in the dark with an anamorphic flare drawn
 * across the page behind it, the way a lens catches a low sun: one long thin
 * streak, a hot core, breathing slowly. The phrase that sums the work up is lit.
 */
export function Quote() {
  const t = useTranslations("quote");

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2", styles.flare)}>
        <span className="block h-px w-full bg-[linear-gradient(90deg,transparent_2%,rgba(242,115,19,0.35)_25%,#ffd3a1_50%,rgba(242,115,19,0.35)_75%,transparent_98%)] shadow-[0_0_18px_3px_rgba(242,115,19,0.55)]" />
        <span className="absolute left-1/2 top-1/2 h-40 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(242,115,19,0.22),transparent)]" />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff1df] shadow-[0_0_40px_14px_rgba(255,170,90,0.65)]" />
      </div>

      <figure className={cn(CONTAINER, "relative m-0")}>
        <blockquote
          className={cn(
            DISPLAY,
            "m-0 mx-auto max-w-[22ch] text-balance text-center text-[clamp(2.4rem,5.4vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.005em] text-foreground [text-shadow:0_2px_30px_rgba(12,12,13,0.9)]",
          )}
        >
          <span aria-hidden="true" className="text-brand">«&nbsp;</span>
          {t.rich("text", {
            em: (chunks) => (
              <em className="not-italic text-[#ffb067] [text-shadow:0_0_24px_rgba(242,115,19,0.8),0_2px_30px_rgba(12,12,13,0.9)]">
                {chunks}
              </em>
            ),
          })}
          <span aria-hidden="true" className="text-brand">&nbsp;»</span>
        </blockquote>
        <figcaption className="mt-10 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
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
      </figure>
    </section>
  );
}
