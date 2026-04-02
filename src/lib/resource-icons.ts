import {
  LayoutGrid,
  Lightbulb,
  FileText,
  type LucideIcon,
} from 'lucide-react';

/** Map content-type slugs to their nav/header icon */
export const RESOURCE_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  daily: Lightbulb,
  article: FileText,
};
