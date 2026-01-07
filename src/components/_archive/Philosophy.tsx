"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest mb-16">
            Philosophy
          </h2>
          <blockquote className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-16">
            &ldquo;Vibe coding isn&apos;t chaos. It&apos;s disciplined intuition.&rdquo;
          </blockquote>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light max-w-2xl mx-auto">
            We trust the process. We move fast but we don&apos;t cut corners. We build things that work, document what we learn, and share it all. That&apos;s the vibe.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
