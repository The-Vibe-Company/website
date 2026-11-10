/**
 * Resources design tokens
 *
 * Class sets for the /resources pages, in the landing's theme: the page header
 * on ink, the reading on warm paper bands. Written against the shared tokens,
 * so they follow a band from ink to paper on their own.
 */

export const resourcesTheme = {
  /**
   * The landing's page frame, shared by every resources page: an ink header
   * in the orange bloom, then the reading on warm paper bands
   * (`data-surface="paper"`), which turn the tokens below over to ink on paper.
   */
  page: {
    /** Same container as the nav, the footer and every other page. */
    container: 'mx-auto w-full max-w-[90rem] px-6 md:px-10 lg:px-16',
    /** Kicker on the ink header, opened by <BrandSquare />. */
    heroKicker: 'block font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground',
    /** The ink header's lede, hung from a hairline like the About page's. */
    heroLede:
      'm-0 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]',
    h2: 'm-0 font-bold text-foreground text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.04em]',
    mono: 'font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground',
    /** Mono link with an underline, the landing's secondary action. */
    link: 'inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground',
    /** A small mono tag (Focus, Tools, Skill) drawn in a hairline. */
    tag: 'inline-flex items-center border border-border-strong px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-foreground',
    /** The orange light behind an ink header, as on the About page. */
    bloom:
      'radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)',
    /** The short orange bar a lamp card hangs from, with its glow. */
    lamp: 'absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]',
  },

  card: {
    base: 'bg-card border border-border hover:border-border-strong transition-colors duration-200',
    featured:
      'bg-card border border-border overflow-hidden transition-colors duration-300 hover:border-border-strong',
  },

  badge: {
    type: 'px-2 py-0.5 border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text-muted',
    domain:
      'inline-flex items-center gap-1.5 px-2 py-0.5 border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text',
    domainDot: 'inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-res-text-muted',
  },

  flag: {
    base: 'inline-flex items-center leading-none select-none',
    card: 'text-base opacity-80 motion-safe:group-hover:scale-110 motion-safe:group-hover:opacity-100 transition-all duration-300',
    sidebar: 'self-start text-xl',
    inline: 'text-base',
  },

  nav: {
    container:
      'fixed top-0 left-0 right-0 z-50 bg-res-bg/80 backdrop-blur-md border-b border-res-border',
    inner: 'flex items-center justify-between h-14 px-6 md:px-10 lg:px-16',
    breadcrumb: 'text-xs font-mono uppercase tracking-widest text-res-text-muted',
    brandLink: 'text-xs font-mono uppercase tracking-widest text-res-text hover:text-res-text-muted transition-colors',
  },

  typeNav: {
    container: 'flex items-center gap-px bg-res-border p-px overflow-x-auto',
    pill: 'flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border-r border-res-border last:border-r-0',
    pillActive: 'bg-res-text text-res-surface',
    pillInactive:
      'bg-res-surface text-res-text-muted hover:text-res-text hover:bg-res-bg-secondary',
  },

  filter: {
    pill: 'px-3 py-1.5 border border-res-border text-[10px] font-mono uppercase tracking-widest transition-all hover:border-res-text-muted',
    pillInactive: 'text-res-text-muted bg-res-surface',
  },

  section: {
    padding: 'mx-auto w-full max-w-[90rem] px-6 md:px-10 lg:px-16',
    header:
      'text-xs font-mono uppercase tracking-widest text-res-text flex items-center gap-3 mb-8 pb-4 border-b border-res-border w-full',
    headerIndicator: 'w-2 h-2 bg-res-text',
  },

  search: {
    // Same look as the big search box on /resources (surface, warm border,
    // mono type, rounded-md); callers add left padding for the magnifier.
    input:
      'w-full bg-res-surface border border-res-border px-4 py-2 text-sm font-mono placeholder:text-res-text-muted/60 focus:outline-none focus:border-res-text transition-colors text-res-text rounded-md',
    compact:
      'w-full bg-res-surface border border-res-border px-3 py-1.5 text-xs font-mono placeholder:text-res-text-muted/60 focus:outline-none focus:border-res-text transition-colors text-res-text rounded-md',
  },

  skill: {
    sourceBadgeNative:
      'inline-flex items-center gap-1.5 px-2 py-1 border border-res-border bg-res-surface text-[10px] font-mono uppercase tracking-widest text-res-text',
    sourceBadgeExternal:
      'inline-flex items-center gap-1.5 px-2 py-1 border border-res-text/40 bg-res-text text-res-surface text-[10px] font-mono uppercase tracking-widest hover:bg-res-text/85 transition-colors',
    promptBlock:
      'relative bg-card border border-border font-mono text-[13px] leading-relaxed text-foreground overflow-hidden',
    promptBlockBody:
      'overflow-y-auto p-4 sm:p-5 pt-20 sm:pt-20 whitespace-pre-wrap break-words transition-[max-height] duration-300',
    promptBlockToolbar:
      'absolute top-0 left-0 right-0 flex items-center justify-between gap-3 px-3 sm:px-4 py-2 bg-card/95 backdrop-blur-sm border-b border-border z-10',
    promptBlockLabel:
      'inline-flex min-w-0 items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground',
    installBlock:
      'border border-res-border bg-res-surface overflow-hidden',
    installTabs:
      'flex items-center gap-px bg-res-border border-b border-res-border overflow-x-auto',
    installTab:
      'min-h-11 px-4 py-2 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors',
    installTabActive: 'bg-res-text text-res-surface',
    installTabInactive:
      'bg-res-surface text-res-text-muted hover:text-res-text hover:bg-res-bg-secondary',
    installCommand:
      'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 font-mono text-[13px] text-res-text overflow-x-auto',
    generatorWrap:
      'border border-res-text/25 bg-res-bg-secondary p-4 sm:p-5 space-y-5 shadow-[0_18px_60px_-12px_rgba(0,0,0,0.6)]',
    generatorTargetGroup: 'grid grid-cols-2 sm:flex sm:items-center gap-px bg-res-border p-px overflow-hidden',
    generatorTarget:
      'min-h-11 px-3 py-2 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors',
    generatorTargetActive: 'bg-res-text text-res-surface',
    generatorTargetInactive:
      'bg-res-surface text-res-text-muted hover:text-res-text',
    generatorOutput:
      'max-h-[260px] sm:max-h-[360px] overflow-auto p-4 text-[12px] sm:text-[13px] leading-relaxed font-mono text-res-text whitespace-pre-wrap break-words',
    metaSidebarLabel:
      'text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted',
    metaSidebarValue: 'text-sm text-res-text',
    copyButton:
      'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[2px] px-3 py-2 text-[11px] font-mono uppercase tracking-wider border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors',
    copyButtonPrimary:
      'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[2px] px-3 py-2 text-[11px] font-mono uppercase tracking-wider border border-foreground bg-foreground text-background hover:bg-soft-foreground hover:border-soft-foreground transition-colors',
    copyButtonSuccess:
      'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[2px] px-3 py-2 text-[11px] font-mono uppercase tracking-wider border border-foreground bg-card text-foreground',
  },

  stats: {
    container: 'flex items-center gap-6 text-xs font-mono text-res-text-muted border-l border-res-border pl-6',
    separator: 'hidden',
    number: 'font-semibold text-res-text mr-1.5',
  },
  tool: {
    card: 'bg-res-surface border border-res-border hover:border-res-text-muted/50 transition-all duration-200 hover:shadow-sm',
    cardInner: 'p-6 flex flex-col h-full',
    logoWrap:
      'w-12 h-12 rounded-lg bg-res-bg-secondary border border-res-border flex items-center justify-center overflow-hidden shrink-0',
    leverageBar: 'h-1.5 bg-res-bg-secondary rounded-full overflow-hidden',
    leverageFill: 'h-full rounded-full transition-all duration-500',
    pricingBadge: 'px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border',
  },
} as const;

export const categoryLabels: Record<string, string> = {
  'ai-llm': 'AI / LLM',
  development: 'Development',
  design: 'Design',
  productivity: 'Productivity',
  deployment: 'Deployment',
  analytics: 'Analytics',
  communication: 'Communication',
};

export const pricingColors: Record<string, { bg: string; text: string; border: string }> = {
  free: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  freemium: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  paid: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  enterprise: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

// Content types are static config in '@/lib/content-types'.
