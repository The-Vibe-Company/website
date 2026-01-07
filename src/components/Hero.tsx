"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Marquee } from "./Marquee";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end pb-32 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 px-6 md:px-12 lg:px-24 mb-12"
      >
        <div className="max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-xs font-mono mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            a project from the{" "}
            <a
              href="https://quivr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-400 transition-colors"
            >
              Quivr
            </a>
            {" "}team
          </motion.div>

          <motion.h1
            className="text-[12vw] leading-[0.8] font-bold tracking-tighter mb-8"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            The Vibe
            <br />
            Company
          </motion.h1>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mt-12 border-t border-foreground pt-8">
            <motion.p
              className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-light max-w-2xl tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              We vibe. We ship. We show you how.
            </motion.p>

          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Marquee>
          <span className="text-4xl md:text-6xl font-bold px-8 text-foreground/10 tracking-tighter">WE SHIP PRODUCTS</span>
          <span className="text-4xl md:text-6xl font-bold px-8 text-foreground/10 tracking-tighter">•</span>
          <span className="text-4xl md:text-6xl font-bold px-8 text-foreground/10 tracking-tighter">WE BUILD IN PUBLIC</span>
          <span className="text-4xl md:text-6xl font-bold px-8 text-foreground/10 tracking-tighter">•</span>
          <span className="text-4xl md:text-6xl font-bold px-8 text-foreground/10 tracking-tighter">NO STEALTH MODE</span>
          <span className="text-4xl md:text-6xl font-bold px-8 text-foreground/10 tracking-tighter">•</span>
        </Marquee>
      </motion.div>
    </section>
  );
}
