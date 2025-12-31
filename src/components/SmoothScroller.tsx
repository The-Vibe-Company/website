"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroller() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.5, // Much snappier (was 1.2)
            easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic out for responsiveness
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.2,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null; // Logic only component
}
