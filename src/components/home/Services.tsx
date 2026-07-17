"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const SERVICES = [
  { n: "01", key: "build" },
  { n: "02", key: "operate" },
  { n: "03", key: "advise" },
] as const;

export function Services() {
  const reduceMotion = useReducedMotion() ?? false;
  const t = useTranslations("services");

  return (
    <section
      id="services"
      className="mx-auto max-w-[100rem] scroll-mt-24 px-6 pb-24 pt-12 md:px-12 md:pb-28 md:pt-14"
    >
      <div className="mb-12 border-b border-border pb-8 md:mb-16">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("kicker")}
        </span>
        <h2
          className="m-0 font-bold text-foreground"
          style={{
            fontSize: "clamp(44px, 6vw, 88px)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
          }}
        >
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SERVICES.map((service, i) => (
          <motion.article
            key={service.n}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: reduceMotion ? 0 : i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group flex flex-col border border-foreground bg-background p-7 transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
          >
            <div className="mb-8 flex items-start justify-between gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                {service.n}
              </span>
              <div className="flex flex-col items-end gap-1">
                <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  {t(`items.${service.key}.tag`)}
                </span>
              </div>
            </div>

            <h3 className="m-0 mb-3 hyphens-auto text-[32px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:min-h-[2.1em] md:text-[clamp(26px,3vw,36px)]">
              {t(`items.${service.key}.title`)}
            </h3>
            <p className="m-0 mb-6 text-[15px] leading-[1.5] text-muted-foreground md:min-h-[113px]">
              {t(`items.${service.key}.desc`)}
            </p>

            <ul className="m-0 flex flex-1 flex-col gap-2 p-0">
              {t.raw(`items.${service.key}.bullets`).map((b: string) => (
                <li
                  key={b}
                  className="flex gap-2.5 text-sm leading-[1.4] text-foreground"
                >
                  <span aria-hidden="true" className="font-mono text-muted-foreground">
                    —
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
