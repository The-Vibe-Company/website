import { resourcesTheme } from '@/lib/resources-theme';

interface LeverageBarProps {
  score: number; // 0-100
  color?: string; // CSS variable name like 'domain-dev'
}

export function LeverageBar({ score, color }: LeverageBarProps) {
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/50">
          Leverage
        </span>
        <span className="text-[10px] font-mono font-semibold text-res-text">
          {clamped}%
        </span>
      </div>
      <div className={resourcesTheme.tool.leverageBar}>
        <div
          className={resourcesTheme.tool.leverageFill}
          style={{
            width: `${clamped}%`,
            backgroundColor: color ? `var(--${color})` : 'var(--res-text)',
          }}
        />
      </div>
    </div>
  );
}
