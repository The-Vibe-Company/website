"use client";

import { motion } from "framer-motion";

export function WhatWeDo() {
  return (
    <section id="learn" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:sticky md:top-32"
          >
            <div className="border-l border-foreground/30 pl-8 md:pl-12 py-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">
                01 — The Output
              </h2>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                WE<br />SHIP.
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Every project is public. Documented. Live. <br />
                We don&apos;t build visuals. We build engines.
              </p>
            </div>
            <div className="mt-12 w-full aspect-video bg-background border border-foreground relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border border-foreground px-4 py-2 font-mono text-xs tracking-widest bg-background z-10">
                  DEPLOYMENT_READY
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pt-24 md:pt-64"
          >
            <div className="border-l border-foreground pl-8 md:pl-12 py-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">
                02 — The Transfer
              </h2>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                WE<br />SHOW.
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Vibe coding training. No abstraction layers. <br />
                You see the code, the bugs, the fixes, and the feeling.
              </p>
            </div>
            <div className="mt-12 p-8 border border-foreground bg-background relative overflow-hidden group hover:shadow-[8px_8px_0px_0px_var(--foreground)] transition-all">
              <div className="font-mono text-sm space-y-2 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-4 border-b border-dashed border-foreground/30 pb-2"><span className="text-muted-foreground">01</span> <span>Thinking in Systems</span></div>
                <div className="flex gap-4 border-b border-dashed border-foreground/30 pb-2"><span className="text-muted-foreground">02</span> <span>The Art of Shipping</span></div>
                <div className="flex gap-4 border-b border-dashed border-foreground/30 pb-2"><span className="text-muted-foreground">03</span> <span>Vibe Engineering</span></div>
                <div className="flex gap-4"><span className="text-muted-foreground">04</span> <span>Full Stack Intuition</span></div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
