'use client';

import { useEffect, useRef } from 'react';

/**
 * A thin reading line along the top edge: black lacquer ending in a rim of
 * light, scaled from the left by how far the page has been read.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function paint() {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
      style={{
        transform: 'scaleX(0)',
        background:
          'linear-gradient(90deg, var(--lacquer) 0 78%, var(--rim) 94%, var(--rim-hot))',
      }}
    />
  );
}
