import Link from 'next/link';
import {
  resourcesTheme,
  domainAccentMap,
  typeLabels,
  domainLabels,
} from '@/lib/resources-theme';

interface FeaturedCardProps {
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: string[];
  publishedAt?: string;
  readingTime?: number;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FeaturedCard({
  title,
  summary,
  type,
  slug,
  domain,
  publishedAt,
  readingTime,
}: FeaturedCardProps) {
  const firstDomain = domain?.[0];
  const colorVar = firstDomain ? domainAccentMap[firstDomain] || 'domain-dev' : 'domain-dev';

  return (
    <Link href={`/resources/${type}/${slug}`} className="block group">
      <article className={resourcesTheme.card.featured}>
        {/* Domain accent top stripe */}
        <div
          className="h-[3px] w-full"
          style={{ backgroundColor: `var(--${colorVar})` }}
        />

        <div className="p-8 md:p-10 lg:p-14">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={resourcesTheme.badge.type}
              style={{
                backgroundColor: `color-mix(in srgb, var(--${colorVar}) 10%, transparent)`,
                color: `var(--${colorVar})`,
              }}
            >
              {typeLabels[type] || type}
            </span>
            {publishedAt && (
              <span className="text-[11px] font-mono text-res-text-muted">
                {formatDate(publishedAt)}
              </span>
            )}
            {readingTime && (
              <span className="text-[11px] font-mono text-res-text-muted">
                {readingTime} MIN READ
              </span>
            )}
          </div>

          <h2
            className="text-3xl md:text-4xl font-bold tracking-tighter leading-[0.95] mb-6 text-res-text transition-colors duration-300"
            style={
              {
                '--hover-color': `var(--${colorVar})`,
              } as React.CSSProperties
            }
          >
            <span className="group-hover:text-[var(--hover-color)] transition-colors duration-300">
              {title}
            </span>
          </h2>

          <p className="text-lg text-res-text-muted leading-relaxed max-w-3xl mb-8">
            {summary}
          </p>

          {domain && domain.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {domain.map((d) => (
                <span
                  key={d}
                  className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/60"
                >
                  {domainLabels[d] || d}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
