"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/**
 * A div that marks itself `data-play` the first time it is mostly on screen,
 * then stops watching. The Quivr page's CSS (quivr.module.css) holds every
 * animation paused until that attribute is set, so each picture plays its
 * one beat once, as it scrolls in. No state, no re-render: the attribute is
 * set on the node directly.
 */
export function PlayOnView({
  threshold = 0.4,
  ...props
}: ComponentPropsWithoutRef<"div"> & { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        node.dataset.play = "";
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return <div ref={ref} {...props} />;
}
