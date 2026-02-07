import { resourcesTheme } from '@/lib/resources-theme';

interface DailyDateGroupProps {
  label: string;
  children: React.ReactNode;
}

export function DailyDateGroup({ label, children }: DailyDateGroupProps) {
  return (
    <div>
      <div className={resourcesTheme.daily.dateHeader}>{label}</div>
      <div>{children}</div>
    </div>
  );
}
