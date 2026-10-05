"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { FitText } from "./FitText";

/**
 * Rendered on six routes that do not share a rail: the homepage and the two
 * index pages run on 100rem, the two detail pages on 80rem. The width used to
 * be hard-coded to 1400px, which matched neither — so its kicker never lined
 * up with the page around it. Each caller states its own rail now.
 */
export function FinalCTA({ rail = "wide" }: { rail?: "wide" | "narrow" }) {
  const reduceMotion = useReducedMotion() ?? false;
  const t = useTranslations("finalCta");

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b-2 border-foreground bg-background"
    >
      {/* Phones: the closing poster, on ink so it runs straight into the
          footer as one dark slab, with the call to action inverted to paper. */}
      <div data-surface="inverse" className="bg-foreground px-6 pb-10 pt-14 text-background md:hidden">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-background/60">{`// ${t("kicker")}`}</span>
        {/* Looser than the hero's poster: this pair carries accents ("à",
            "è") that would otherwise cut into the line above. */}
        <h2 className="m-0 mt-5 font-extrabold leading-[0.92] tracking-[-1px] [container-type:inline-size]">
          <FitText>{t("titleLine1")}</FitText>
          <FitText className="text-transparent [-webkit-text-stroke:2px_var(--background)]">{t("titleLine2")}</FitText>
        </h2>
        <a
          href={BOOKING_URL}
          onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
          className="mt-9 inline-flex items-center gap-3 bg-background px-6 py-4 text-[15px] font-semibold text-foreground"
        >
          {t("bookCall")}
          <span aria-hidden="true" className="text-lg leading-none">
            →
          </span>
        </a>
        <div className="mt-2 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-background/60">
          <span>
            {t("responseLabel")} {t("responseValue")}
          </span>
          <a
            href="mailto:founders@thevibecompany.co"
            onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
            className="inline-flex min-h-11 items-center normal-case tracking-[0.04em] text-background underline decoration-1 underline-offset-4"
          >
            founders@thevibecompany.co
          </a>
        </div>
      </div>

      <div className="hidden md:block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
          }}
        />

        <div className={`relative mx-auto px-6 py-28 md:px-12 md:py-32 ${
            rail === "narrow" ? "max-w-[80rem]" : "max-w-[100rem]"
          }`}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            {`// ${t("kicker")}`}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              delay: reduceMotion ? 0 : 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="m-0 mb-8 flex flex-col font-bold text-foreground"
            style={{
              fontSize: "clamp(56px, 9vw, 144px)",
              lineHeight: 0.88,
              letterSpacing: "-0.05em",
            }}
          >
            <span>{t("titleLine1")}</span>
            <span
              style={{
                WebkitTextStroke: "2px var(--foreground)",
                color: "transparent",
              }}
            >
              {t("titleLine2")}
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-start justify-between gap-8 border-t border-border pt-8 md:flex-row md:items-end"
          >
            <a
              href={BOOKING_URL}
              onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
              className="inline-flex items-center border-2 border-foreground bg-foreground px-7 py-5 text-[17px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </a>

            <dl className="grid w-full grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground md:w-auto md:justify-end md:text-right">
              <dt className="text-muted-foreground md:text-right">{t("responseLabel")}</dt>
              <dd className="m-0 md:text-left">{t("responseValue")}</dd>
              <dt className="text-muted-foreground md:text-right">{t("emailLabel")}</dt>
              <dd className="m-0 md:text-left">
                <a
                  href="mailto:founders@thevibecompany.co"
                  onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                  className="normal-case tracking-[0.05em] underline decoration-1 underline-offset-4 hover:text-muted-foreground"
                >
                  founders@thevibecompany.co
                </a>
              </dd>
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
