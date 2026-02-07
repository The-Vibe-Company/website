import Link from 'next/link';
import { resourcesTheme, typeLabels, domainLabels } from '@/lib/resources-theme';
import { DomainBadge } from './DomainBadge';

interface ContentCardProps {
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: string[];
  publishedAt?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function ContentCard({
  title,
  summary,
  type,
  slug,
  domain,
  publishedAt,
}: ContentCardProps) {
  const firstDomain = domain?.[0];

  return (
    <Link href={`/resources/${type}/${slug}`} className="group block h-full">
      <article className={`h-full p-6 ${resourcesTheme.card.base} ${resourcesTheme.card.hover}`}>
        <div className="flex items-center gap-3 mb-4">
          {firstDomain && <DomainBadge domain={firstDomain} variant="dot" />}
          <span className={resourcesTheme.badge.type}>
            {typeLabels[type] || type}
          </span>
          {publishedAt && (
            <span className="text-[11px] font-mono text-res-text-muted">
              {formatDate(publishedAt)}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold tracking-tight mb-2 text-res-text leading-snug">
          {title}
        </h3>
        <p className="text-sm text-res-text-muted leading-relaxed line-clamp-2">
          {summary}
        </p>
        {domain && domain.length > 1 && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-res-border/30">
            {domain.slice(1).map((d) => (
              <span
                key={d}
                className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50"
              >
                {domainLabels[d] || d}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
