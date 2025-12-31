"use client";

import { motion } from "framer-motion";

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-12">
            The Laboratory
          </h2>

          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <motion.h3
                className="text-3xl md:text-4xl font-medium tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                We are building. <br />
                <span className="text-muted-foreground">Right now.</span>
              </motion.h3>
            </div>

            <div className="md:col-span-7 space-y-8">
              <motion.div
                className="p-8 border border-border rounded-2xl bg-muted/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Status: Active Development</span>
                </div>
                <p className="text-lg leading-relaxed mb-6">
                  We don&apos;t do stealth mode. We&apos;re currently crafting our first suite of tools for the vibe coding era.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-background border border-border text-xs font-mono">
                    Project V01
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-background border border-border text-xs font-mono">
                    Next.js
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-background border border-border text-xs font-mono">
                    AI Agents
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-muted-foreground">
                  Follow the build process on{" "}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    Twitter/X
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
