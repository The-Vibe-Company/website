import { domainAccentMap, domainLabels, resourcesTheme } from '@/lib/resources-theme';

interface DomainBadgeProps {
  domain: string;
  variant?: 'default' | 'dot' | 'chip';
}

export function DomainBadge({ domain, variant = 'default' }: DomainBadgeProps) {
  const colorVar = domainAccentMap[domain] || 'domain-dev';
  const label = domainLabels[domain] || domain;

  if (variant === 'dot') {
    return (
      <span className={resourcesTheme.badge.domainDot}>
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: `var(--${colorVar})` }}
        />
        {label}
      </span>
    );
  }

  if (variant === 'chip') {
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest"
        style={{
          backgroundColor: `color-mix(in srgb, var(--${colorVar}) 10%, transparent)`,
          color: `var(--${colorVar})`,
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={resourcesTheme.badge.domain}
      style={{ borderColor: `color-mix(in srgb, var(--${colorVar}) 30%, transparent)` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: `var(--${colorVar})` }}
      />
      <span style={{ color: `var(--${colorVar})` }}>{label}</span>
    </span>
  );
}
