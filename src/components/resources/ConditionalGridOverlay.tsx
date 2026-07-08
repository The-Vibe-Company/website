'use client';

import { usePathname } from '@/i18n/navigation';

const GRID_OVERLAY_CLASS = 'bg-grid';

export function ConditionalGridOverlay() {
  const pathname = usePathname();
  if (
    pathname === '/' ||
    pathname === '/v2' ||
    pathname.startsWith('/resources') ||
    pathname.startsWith('/portfolio')
  ) return null;
  return <div className={GRID_OVERLAY_CLASS} />;
}
