"use client";

import { motion } from "framer-motion";

export function Products() {
  return (
    <section id="products" className="py-32 md:py-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-[120rem] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-foreground pb-6">
            <h2 className="text-sm font-medium uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-foreground" />
              SYSTEM_STATUS
            </h2>
            <div className="flex items-center gap-4 text-xs font-mono mt-4 md:mt-0">
              <span className="border border-foreground px-2 py-1">VIBE_PROTOCOL: ACTIVE</span>
              <span className="border border-foreground px-2 py-1">UPTIME: 99.9%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-5">
              <motion.h3
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-none mb-8 text-transparent stroke-text"
                style={{ WebkitTextStroke: "1px var(--foreground)" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                THE <br />
                LABORATORY
              </motion.h3>
              <p className="text-xl md:text-2xl font-light leading-relaxed max-w-sm border-l-2 border-foreground pl-6">
                We are building in public. <br />
                No stealth mode. <br />
                Just raw output.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="relative group overflow-hidden border border-foreground bg-background p-8 md:p-12 transition-all hover:shadow-[8px_8px_0px_0px_var(--foreground)]">
                <div className="absolute top-0 right-0 p-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square"><rect x="2" y="2" width="20" height="20" /><path d="M12 2v20" /><path d="M2 12h20" /></svg>
                </div>

                <h4 className="text-xs font-mono mb-6 uppercase tracking-widest bg-foreground text-background inline-block px-2">Current_Objective</h4>
                <div className="space-y-6">
                  <div className="font-mono text-lg md:text-xl border-l-[1px] border-dashed border-foreground pl-4 py-1">
                    &gt; Initializing Vibe Protocol... <br />
                    &gt; Compiling Next.js Archetypes... <br />
                    &gt; <span className="animate-pulse bg-foreground text-background px-1">Waiting for input_</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 border-t border-l border-foreground mt-8">
                    {["Next.js", "AI Agents", "Design Systems", "Vercel", "Turbopack", "React Server Components"].map((tag) => (
                      <div key={tag} className="px-3 py-4 border-r border-b border-foreground text-xs font-mono uppercase text-center hover:bg-foreground hover:text-background transition-colors cursor-crosshair flex items-center justify-center">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex justify-between items-center text-sm font-medium border-t border-foreground pt-6">
                  <span>Follow transmission</span>
                  <div className="flex gap-6 font-mono text-xs">
                    <a href="https://twitter.com" className="hover:underline decoration-1 underline-offset-4">[X_TWITTER]</a>
                    <a href="https://github.com" className="hover:underline decoration-1 underline-offset-4">[GITHUB]</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
