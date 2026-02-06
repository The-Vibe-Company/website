"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { layout, typography, animations, cn, createTransition } from "@/lib/design-system";
import { TopNav } from "./TopNav";
import { HomeCenter } from "./HomeCenter";
import { ScrollOverlay } from "./ScrollOverlay";

export function HomeLaunchpad() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const overlayRef = useRef(false);
  const isTransitioning = useRef(false);
  const wheelAccumulator = useRef(0);
  const touchStartY = useRef(0);

  const WHEEL_THRESHOLD = 250;
  const TRANSITION_LOCK_MS = 800;
  const TOUCH_THRESHOLD = 80;

  // Keep ref in sync with state
  useEffect(() => {
    overlayRef.current = isOverlayOpen;
  }, [isOverlayOpen]);

  const toggleOverlay = useCallback((open: boolean) => {
    if (isTransitioning.current) return;
    if (open === overlayRef.current) return;

    isTransitioning.current = true;
    wheelAccumulator.current = 0;
    setIsOverlayOpen(open);

    setTimeout(() => {
      isTransitioning.current = false;
    }, TRANSITION_LOCK_MS);
  }, []);

  // Single consolidated event listener setup
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current) return;

      wheelAccumulator.current += e.deltaY;

      if (Math.abs(wheelAccumulator.current) > WHEEL_THRESHOLD) {
        toggleOverlay(!overlayRef.current);
        wheelAccumulator.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current) return;
      const deltaY = Math.abs(
        touchStartY.current - e.changedTouches[0].clientY
      );

      if (deltaY > TOUCH_THRESHOLD) {
        toggleOverlay(!overlayRef.current);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && overlayRef.current) {
        e.preventDefault();
        toggleOverlay(false);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleOverlay]);

  return (
    <div className={layout.viewportLock}>
      <TopNav />
      <HomeCenter />

      {/* Scroll hint */}
      {!isOverlayOpen && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={createTransition(0.6, 2)}
        >
          <span className={cn(typography.label.mono, "text-muted-foreground/50")}>
            SCROLL TO EXPLORE
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/50 animate-bounce"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      )}

      <ScrollOverlay
        isOpen={isOverlayOpen}
        onClose={() => toggleOverlay(false)}
      />
    </div>
  );
}
