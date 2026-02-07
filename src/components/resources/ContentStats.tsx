import { resourcesTheme } from '@/lib/resources-theme';

interface ContentStatsProps {
  stats: { label: string; count: number }[];
}

export function ContentStats({ stats }: ContentStatsProps) {
  return (
    <div className={resourcesTheme.stats.container}>
      {stats.map((stat, i) => (
        <span key={stat.label} className="flex items-center gap-1.5">
          {i > 0 && <span className={`${resourcesTheme.stats.separator} mr-1.5`}>&middot;</span>}
          <span className={resourcesTheme.stats.number}>{stat.count}</span>
          <span>{stat.label}</span>
        </span>
      ))}
    </div>
  );
}
