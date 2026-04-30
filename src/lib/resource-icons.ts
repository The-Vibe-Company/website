import {
  LayoutGrid,
  Sparkles,
  FileText,
  type LucideIcon,
} from 'lucide-react';

/** Map content-type slugs to their nav/header icon */
export const RESOURCE_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  skill: Sparkles,
  article: FileText,
};
