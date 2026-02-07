import Link from 'next/link';
import { resourcesTheme } from '@/lib/resources-theme';

interface DailyCardProps {
  title: string;
  summary: string;
  slug: string;
  publishedAt?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function DailyCard({ title, slug, publishedAt }: DailyCardProps) {
  return (
    <Link
      href={`/resources/daily/${slug}`}
      className={`group ${resourcesTheme.daily.card}`}
    >
      {publishedAt && (
        <span className="text-[11px] font-mono text-res-text-muted/60 shrink-0 w-14 tabular-nums">
          {formatDate(publishedAt)}
        </span>
      )}
      <span className="text-[15px] font-medium tracking-tight text-res-text group-hover:text-res-text-muted transition-colors truncate flex-1">
        {title}
      </span>
      <span className="text-xs text-res-text-muted/30 shrink-0 group-hover:text-res-text-muted/60 transition-colors hidden sm:block">
        &rarr;
      </span>
    </Link>
  );
}
