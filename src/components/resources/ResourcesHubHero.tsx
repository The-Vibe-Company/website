export function ResourcesHubHero() {
  return (
    <section className="pt-20 pb-8 border-b border-res-border">
      <div className="max-w-4xl">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
          Vibe Learning Hub
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-res-text mb-3 leading-[0.95]">
          The <span className="text-res-text-muted">Archives.</span>
        </h1>
        <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
          A collection of raw build logs, tutorials, and philosophy on shipping AI-native software.
        </p>
      </div>
    </section>
  );
}
