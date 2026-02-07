'use client';

import { usePathname } from 'next/navigation';
import { components } from '@/lib/design-system';

export function ConditionalGridOverlay() {
  const pathname = usePathname();
  if (pathname.startsWith('/resources')) return null;
  return <div className={components.gridOverlay} />;
}
