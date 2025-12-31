"use client";

import { motion } from "framer-motion";

export function WhatWeDo() {
  return (
    <section id="learn" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">
              01 — We Build
            </h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              Shipping is the heartbeat.
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              We ship products. Every project is public, documented, and live. No stealth mode, no vapor — just work you can see, touch, and use.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">
              02 — We Teach
            </h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              No bullshit, just practice.
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              We train people in vibe coding. Learn by doing, alongside people who actually ship. We strip away the theory that doesn&apos;t matter and focus on the intuition that does.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
