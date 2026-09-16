'use client';

import { usePathname } from '@/i18n/navigation';
import { ENSEMBLE_PATH } from '@/lib/coup-de-pates-ensemble';

const GRID_OVERLAY_CLASS = 'bg-grid';

export function ConditionalGridOverlay() {
  const pathname = usePathname();
  if (
    pathname === '/' ||
    pathname === '/v2' ||
    pathname.startsWith('/resources') ||
    pathname.startsWith('/portfolio') ||
    pathname === ENSEMBLE_PATH
  ) return null;
  return <div className={GRID_OVERLAY_CLASS} />;
}
