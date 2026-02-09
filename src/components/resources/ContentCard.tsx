import Link from 'next/link';
import { resourcesTheme } from '@/lib/resources-theme';
import { getTypeSlug, getTypeLabel, normalizeDomains } from '@/lib/taxonomy-utils';
import { DomainBadge } from './DomainBadge';

interface ContentCardProps {
  title: string;
  summary: string;
  type: unknown;
  slug: string;
  domain?: unknown;
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
  const typeSlug = getTypeSlug(type);
  const typeLabel = getTypeLabel(type);
  const domains = normalizeDomains(domain);
  const firstDomain = domains[0];

  return (
    <Link href={`/resources/${typeSlug}/${slug}`} className="group block h-full">
      <article className={`h-full p-6 flex flex-col ${resourcesTheme.card.base} ${resourcesTheme.card.hover}`}>
        <div className="flex items-center gap-2 mb-6 border-b border-res-border/50 pb-4">
          {firstDomain && <DomainBadge domain={firstDomain} variant="dot" />}
          <span className="text-res-text-muted/50 text-[10px]">&bull;</span>
          <span className={resourcesTheme.badge.type}>
            {typeLabel || typeSlug}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tighter mb-3 text-res-text leading-[1.1] group-hover:underline decoration-1 underline-offset-4">
          {title}
        </h3>

        <p className="text-sm text-res-text-muted leading-relaxed line-clamp-3 mb-6 flex-1">
          {summary}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-res-border/50">
          {publishedAt && (
            <span className="text-[10px] font-mono text-res-text-muted uppercase tracking-widest">
              {formatDate(publishedAt)}
            </span>
          )}
          <span className="text-res-text-muted group-hover:translate-x-1 transition-transform duration-300">
            &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
}
