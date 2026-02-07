import { ContentStats } from './ContentStats';

interface ResourcesHubHeroProps {
  stats: { label: string; count: number }[];
}

export function ResourcesHubHero({ stats }: ResourcesHubHeroProps) {
  return (
    <section className="py-20 md:py-32 border-b border-res-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted/80 sticky top-24">
            Vibe Learning Hub
          </span>
        </div>

        <div className="md:col-span-9">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-res-text mb-8 leading-[0.9]">
            The <span className="text-res-text-muted">Archives.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <p className="text-xl text-res-text-muted leading-relaxed">
              A collection of raw build logs, tutorials, and philosophy on shipping AI-native software.
            </p>
            <div className="md:border-l md:border-res-border md:pl-12">
              <ContentStats stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
