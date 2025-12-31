"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl">
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
        >
          The Vibe Company
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-2xl font-light tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          We vibe. We ship. We show you how.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#products"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-all active:scale-95"
          >
            See our products
          </a>
          <a
            href="#learn"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium border border-border text-foreground rounded-full hover:bg-muted transition-all active:scale-95 hover:border-foreground/20"
          >
            Learn with us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
