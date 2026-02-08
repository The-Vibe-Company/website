import { pricingColors, resourcesTheme } from '@/lib/resources-theme';

interface PricingBadgeProps {
  pricing: string;
}

export function PricingBadge({ pricing }: PricingBadgeProps) {
  const colors = pricingColors[pricing];
  if (!colors) return null;

  return (
    <span
      className={`${resourcesTheme.tool.pricingBadge} ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {pricing}
    </span>
  );
}
