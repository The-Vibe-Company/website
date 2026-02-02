"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  components,
  animations,
  createTransition,
} from "@/lib/design-system";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Products", href: "#products" },
  { label: "Learn", href: "#learn" },
];

export function DockNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={animations.variants.slideUp.initial}
        animate={animations.variants.slideUp.animate}
        transition={createTransition(0.8, 1)}
        className={components.nav.dock}
      >
        {navItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={components.nav.link}
          >
            {hoveredIndex === index && (
              <motion.div
                layoutId="dock-hover"
                className="absolute inset-0 bg-muted/20 rounded-full -z-10"
                transition={animations.easing.bounce}
              />
            )}
            {item.label}
          </a>
        ))}
        <div className={components.divider.vertical + " mx-2"} />
        <button className={components.button.primary}>Get Started</button>
      </motion.nav>
    </div>
  );
}
