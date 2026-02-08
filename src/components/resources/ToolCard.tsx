import Image from 'next/image';
import Link from 'next/link';
import {
  resourcesTheme,
  categoryLabels,
} from '@/lib/resources-theme';
import { normalizeDomains } from '@/lib/taxonomy';
import { DomainBadge } from './DomainBadge';
import { PricingBadge } from './PricingBadge';

interface ToolCardProps {
  name: string;
  slug: string;
  description: string;
  logo?: { url: string; alt?: string } | null;
  category?: string[] | null;
  domain?: unknown;
  pricing?: string | null;
  rating?: number | null;
  costPerMonth?: number | null;
  licensesCount?: number | null;
  leverageScore?: number | null;
}

export function ToolCard({
  name,
  slug,
  description,
  logo,
  category,
  domain,
  pricing,
  rating,
  costPerMonth,
  licensesCount,
  leverageScore,
}: ToolCardProps) {
  const domains = normalizeDomains(domain);
  const firstDomain = domains[0];
  const firstCategory = category?.[0];
  const logoUrl = logo?.url;
  const color = firstDomain?.color || '#666';

  const hasStackInfo =
    (costPerMonth != null && costPerMonth > 0) ||
    (licensesCount != null && licensesCount > 0) ||
    (leverageScore != null && leverageScore > 0);

  return (
    <Link href={`/resources/tools/${slug}`} className="group block h-full">
      <article className={`h-full ${resourcesTheme.tool.card} ${resourcesTheme.tool.cardInner}`}>
        {/* Header: Logo + Category */}
        <div className="flex items-start gap-3 mb-4">
          <div className={resourcesTheme.tool.logoWrap}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={48}
                height={48}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span
                className="text-lg font-bold text-res-text-muted"
                style={{ color }}
              >
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {firstDomain && <DomainBadge domain={firstDomain} variant="dot" />}
            {firstDomain && firstCategory && (
              <span className="text-res-text-muted/50 text-[10px]">&middot;</span>
            )}
            {firstCategory && (
              <span className={resourcesTheme.badge.type}>
                {categoryLabels[firstCategory] || firstCategory}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tighter mb-2 text-res-text leading-[1.1] group-hover:underline decoration-1 underline-offset-4">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-res-text-muted leading-relaxed line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        {/* Stack Metrics */}
        {hasStackInfo && (
          <div className="mb-4 space-y-3">
            {/* Leverage Bar */}
            {leverageScore != null && leverageScore > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
                    Leverage
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-res-text">
                    {leverageScore}%
                  </span>
                </div>
                <div className={resourcesTheme.tool.leverageBar}>
                  <div
                    className={resourcesTheme.tool.leverageFill}
                    style={{
                      width: `${Math.min(100, leverageScore)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Cost + Licenses row */}
            <div className="flex items-center gap-4">
              {costPerMonth != null && costPerMonth > 0 && (
                <span className="text-[10px] font-mono text-res-text-muted flex items-center gap-1">
                  <span className="font-semibold text-res-text">
                    &euro;{costPerMonth % 1 === 0 ? costPerMonth : costPerMonth.toFixed(2)}
                  </span>
                  /mo
                </span>
              )}
              {licensesCount != null && licensesCount > 0 && (
                <span className="text-[10px] font-mono text-res-text-muted flex items-center gap-1">
                  <span className="font-semibold text-res-text">{licensesCount}</span>
                  {licensesCount === 1 ? 'license' : 'licenses'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer: Rating + Pricing + Arrow */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-res-border/50">
          <div className="flex items-center gap-3">
            {rating != null && rating > 0 && (
              <span className="text-[10px] font-mono text-res-text-muted flex items-center gap-1">
                <span className="text-amber-500">&#9733;</span>
                {rating.toFixed(1)}
              </span>
            )}
            {pricing && <PricingBadge pricing={pricing} />}
          </div>
          <span className="text-res-text-muted group-hover:translate-x-1 transition-transform duration-300">
            &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
}
