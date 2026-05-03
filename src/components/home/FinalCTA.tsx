"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FinalCTA() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b-2 border-foreground bg-background"
    >
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

      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-32">
        <motion.span
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          {'// 04 — NOW BOARDING'}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="m-0 mb-8 flex flex-col font-bold text-foreground"
          style={{
            fontSize: "clamp(56px, 9vw, 144px)",
            lineHeight: 0.88,
            letterSpacing: "-0.05em",
          }}
        >
          <span>Got a problem</span>
          <span
            style={{
              WebkitTextStroke: "2px var(--foreground)",
              color: "transparent",
            }}
          >
            that AI should solve?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="m-0 mb-12 max-w-[640px] text-[19px] leading-[1.5] text-muted-foreground"
        >
          30 minutes. No deck, no sales pitch. We tell you whether we can help,
          what we&apos;d build, and what it would cost. If we can&apos;t, we&apos;ll tell you
          who can.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start justify-between gap-8 border-t border-border pt-8 md:flex-row md:items-end"
        >
          <a
            href="mailto:founders@thevibecompany.co"
            className="inline-flex items-center border-2 border-foreground bg-foreground px-7 py-5 text-[17px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
          >
            Book a discovery call
            <span aria-hidden="true" className="ml-3">
              →
            </span>
          </a>

          <dl className="grid w-full grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground md:w-auto md:justify-end md:text-right">
            <dt className="text-muted-foreground md:text-right">RESPONSE</dt>
            <dd className="m-0 md:text-left">WITHIN 24H</dd>
            <dt className="text-muted-foreground md:text-right">EMAIL</dt>
            <dd className="m-0 md:text-left">founders@thevibecompany.co</dd>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
