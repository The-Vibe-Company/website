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
          className="w-1.5 h-1.5 bg-current"
          style={{ color: `var(--${colorVar})` }}
        />
        {label}
      </span>
    );
  }

  if (variant === 'chip') {
    return (
      <span
        className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest border"
        style={{
          borderColor: `var(--${colorVar})`,
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
      style={{ borderColor: `var(--${colorVar})` }}
    >
      <span
        className="w-1.5 h-1.5 bg-current"
        style={{ color: `var(--${colorVar})` }}
      />
      <span style={{ color: `var(--${colorVar})` }}>{label}</span>
    </span>
  );
}
