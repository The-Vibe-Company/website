import { ContentStats } from './ContentStats';

interface ResourcesHubHeroProps {
  stats: { label: string; count: number }[];
}

export function ResourcesHubHero({ stats }: ResourcesHubHeroProps) {
  return (
    <section className="pt-20 pb-8 border-b border-res-border">
      <div className="max-w-4xl">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
          Vibe Learning Hub
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-res-text mb-3 leading-[0.95]">
          The <span className="text-res-text-muted">Archives.</span>
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <p className="text-base text-res-text-muted leading-relaxed">
            A collection of raw build logs, tutorials, and philosophy on shipping AI-native software.
          </p>
          <div className="md:border-l md:border-res-border md:pl-8 shrink-0">
            <ContentStats stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
