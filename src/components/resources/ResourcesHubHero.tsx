import { ContentStats } from './ContentStats';

interface ResourcesHubHeroProps {
  stats: { label: string; count: number }[];
}

export function ResourcesHubHero({ stats }: ResourcesHubHeroProps) {
  return (
    <section className="py-16 md:py-24">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-4">
        Resources
      </span>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-res-text mb-4">
        Vibe Learning
      </h1>
      <p className="text-lg text-res-text-muted max-w-2xl mb-8 leading-relaxed">
        Tutorials, articles, and daily insights to level up your craft.
      </p>
      <ContentStats stats={stats} />
    </section>
  );
}
