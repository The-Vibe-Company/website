"use client";

import { motion } from "framer-motion";

const links = [
  { label: "Products", href: "#products" },
  { label: "Learn", href: "#learn" },
  { label: "Twitter/X", href: "https://twitter.com", external: true },
  { label: "GitHub", href: "https://github.com", external: true },
];

export function Footer() {
  return (
    <footer className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-border/40">
      <div className="max-w-[120rem] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          <nav className="flex flex-col gap-4">
            <span className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-widest">Navigation</span>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-lg md:text-xl font-medium hover:text-muted-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="text-right">
            <p className="text-lg md:text-xl font-light text-muted-foreground max-w-sm ml-auto mb-8">
              Vibe coding is the art of shipping software that feels like magic.
            </p>
            <div className="text-sm font-mono text-muted-foreground">
              &copy; 2025 THE VIBE COMPANY.
            </div>
          </div>
        </div>

        <motion.div
          className="relative select-none"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[14vw] font-bold leading-[0.8] tracking-tighter text-center md:text-left -ml-2 sm:-ml-4 opacity-10 md:opacity-100 transition-opacity">
            THE VIBE CO.
          </h1>
        </motion.div>
      </div>
    </footer>
  );
}
