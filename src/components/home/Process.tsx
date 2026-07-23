"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const STEPS = [
  { n: "01", key: "brief" },
  { n: "02", key: "design" },
  { n: "03", key: "build" },
  { n: "04", key: "operate" },
] as const;

export function Process() {
  const reduceMotion = useReducedMotion() ?? false;
  const t = useTranslations("process");

  return (
    <section
      id="process"
      className="border-y-2 border-foreground bg-foreground text-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-14 border-b border-white/15 pb-8 md:mb-20">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-white/55">
            {t("kicker")}
          </span>
          <h2
            className="m-0 font-bold text-background"
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

        <ol className="m-0 flex list-none flex-col p-0">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 gap-6 border-t border-white/15 py-8 md:grid-cols-[200px_1fr] md:gap-12 md:py-9"
            >
              <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                <span className="text-5xl font-bold leading-none tracking-[-0.05em] text-background md:text-[64px]">
                  {step.n}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                  {t(`steps.${step.key}.label`)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="m-0 max-w-[540px] text-[26px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[32px]">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="m-0 max-w-[540px] text-base leading-[1.55] text-white/70">
                  {t(`steps.${step.key}.desc`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
