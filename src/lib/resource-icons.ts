import {
  LayoutGrid,
  Lightbulb,
  GraduationCap,
  FileText,
  Target,
  Shapes,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Map content-type slugs to their nav/header icon */
export const RESOURCE_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  daily: Lightbulb,
  tutorial: GraduationCap,
  article: FileText,
  'tool-focus': Target,
  'concept-focus': Shapes,
  tools: Wrench,
};
