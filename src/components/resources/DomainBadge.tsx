import { resourcesTheme } from '@/lib/resources-theme';

interface DomainObject {
  slug: string;
  shortLabel: string;
  color: string;
  colorDark?: string | null;
}

interface DomainBadgeProps {
  domain: DomainObject | string;
  variant?: 'default' | 'dot' | 'chip';
}

function resolveDomain(domain: DomainObject | string): { color: string; label: string } {
  if (typeof domain === 'object' && domain !== null) {
    return {
      color: domain.color || '#666',
      label: domain.shortLabel || domain.slug,
    };
  }
  // Fallback for string domains (backward compat)
  return { color: '#666', label: domain };
}

export function DomainBadge({ domain, variant = 'default' }: DomainBadgeProps) {
  const { color, label } = resolveDomain(domain);

  if (variant === 'dot') {
    return (
      <span className={resourcesTheme.badge.domainDot}>
        <span
          className="w-1.5 h-1.5 bg-current"
          style={{ color }}
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
          borderColor: color,
          color,
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={resourcesTheme.badge.domain}
      style={{ borderColor: color }}
    >
      <span
        className="w-1.5 h-1.5 bg-current"
        style={{ color }}
      />
      <span style={{ color }}>{label}</span>
    </span>
  );
}
