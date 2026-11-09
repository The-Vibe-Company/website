"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { clientLogoSize } from "@/lib/client-logos";
import s from "./profondeur.module.css";

/**
 * The client's words surfacing from a bank of fog: blurred and far as the
 * section arrives, sharp and near by the time it is centred, the phrase that
 * sums the work up glowing in the orange light.
 */
export function QuoteFog() {
  const t = useTranslations("quote");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const blur = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const fog = useTransform(scrollYProgress, [0.3, 1], [0.9, 0.25]);

  return (
    <section ref={ref} aria-label="Monka" className="relative z-10 flex min-h-[80svh] items-center overflow-hidden py-24">
      <motion.div aria-hidden="true" style={{ opacity: fog }} className="pointer-events-none absolute inset-0">
        <div className={s.fog} style={{ top: "18%", left: "-8%", width: "70%", height: "46%", background: "radial-gradient(closest-side, rgb(46 38 34 / 0.85), transparent)" }} />
        <div className={s.fog} style={{ top: "42%", right: "-10%", width: "66%", height: "48%", background: "radial-gradient(closest-side, rgb(58 36 22 / 0.7), transparent)", animationDelay: "-9s" }} />
      </motion.div>
      <motion.figure style={{ filter, scale, opacity }} className="relative m-0 mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <span aria-hidden="true" className="block font-extrabold leading-none text-brand text-[96px] [text-shadow:0_0_40px_rgb(242_115_19/0.6)] md:text-[140px]">“</span>
        <blockquote className="m-0 -mt-6 max-w-[22ch] text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-foreground md:-mt-10">
          {t.rich("text", {
            em: (chunks) => <em className="not-italic text-brand [text-shadow:0_0_32px_rgb(242_115_19/0.45)]">{chunks}</em>,
          })}
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span aria-hidden="true" className="h-px w-12 bg-border-strong" />
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
      </motion.figure>
    </section>
  );
}
