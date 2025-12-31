"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 px-4 py-3 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl"
            >
                {navItems.map((item, index) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        {hoveredIndex === index && (
                            <motion.div
                                layoutId="dock-hover"
                                className="absolute inset-0 bg-muted/20 rounded-full -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {item.label}
                    </a>
                ))}
                <div className="w-px h-4 bg-border/50 mx-2" />
                <button className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                    Get Started
                </button>
            </motion.nav>
        </div>
    );
}
