"use client";

import { motion } from "framer-motion";
import {
  typography,
  spacing,
  components,
  animations,
  cn,
  createTransition,
} from "@/lib/design-system";

const links = [
  { label: "Mission", href: "#mission" },
  { label: "Learn", href: "#learn" },
  { label: "Twitter/X", href: "https://x.com/thevibecompany", external: true },
  { label: "GitHub", href: "https://github.com/The-Vibe-Company", external: true },
];

export function Footer() {
  return (
    <footer
      className={cn(
        "relative py-24 overflow-hidden border-t border-border/40",
        spacing.page.x
      )}
    >
      <div className={cn(spacing.container.default, "relative z-10")}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          {/* Navigation */}
          <nav className="flex flex-col gap-4">
            <span
              className={cn(
                typography.label.mono,
                "text-muted-foreground mb-4"
              )}
            >
              Navigation
            </span>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={cn(typography.body.small, components.link.default)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Quote Section */}
          <div className="text-right">
            <p
              className={cn(
                typography.body.small,
                "font-light text-muted-foreground max-w-sm ml-auto mb-8"
              )}
            >
              Vibe coding is the art of shipping software that feels like magic.
            </p>
            <div
              className={cn(
                typography.label.small,
                typography.fonts.mono,
                "text-muted-foreground"
              )}
            >
              &copy; {new Date().getFullYear()} THE VIBE COMPANY.
            </div>
          </div>
        </div>

        {/* Large Footer Text */}
        <motion.div
          className="relative select-none"
          initial={animations.variants.fadeInUpLarge.initial}
          whileInView={animations.variants.fadeInUpLarge.animate}
          viewport={{ once: true }}
          transition={createTransition(1)}
        >
          <h1
            className={cn(
              typography.display.large,
              "text-center md:text-left -ml-2 sm:-ml-4 opacity-10 md:opacity-100 transition-opacity"
            )}
          >
            THE VIBE CO.
          </h1>
        </motion.div>
      </div>
    </footer>
  );
}
