import Link from 'next/link';
import {
  domainAccentMap,
  typeLabels,
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
    <Link href={`/resources/${type}/${slug}`} className="block group mb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-res-text pt-8">
        {/* Meta / Sidebar */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <span
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: `var(--${colorVar})` }}
          >
            {typeLabels[type] || type}
          </span>
          <div className="flex flex-col gap-1 text-[10px] font-mono text-res-text-muted uppercase tracking-widest">
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
            {readingTime && <span>{readingTime} min read</span>}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-9">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-6 text-res-text group-hover:text-res-text-muted transition-colors duration-300">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-res-text-muted leading-relaxed max-w-3xl mb-8">
            {summary}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-res-text group-hover:underline decoration-1 underline-offset-4">
              Read Article
            </span>
            <span className="text-lg text-res-text transition-transform group-hover:translate-x-2 duration-300">
              &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
