'use client';

import { usePathname } from 'next/navigation';

const GRID_OVERLAY_CLASS = 'bg-grid';

export function ConditionalGridOverlay() {
  const pathname = usePathname();
  if (pathname.startsWith('/resources')) return null;
  return <div className={GRID_OVERLAY_CLASS} />;
}
