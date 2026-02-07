/**
 * Resources "Calm Studio" Design Tokens
 *
 * Scoped design tokens for the /resources section.
 * These complement the main design-system.ts for the warm knowledge platform feel.
 */

export const resourcesTheme = {
  card: {
    base: 'bg-res-surface rounded-xl border border-res-border/50 transition-all duration-300',
    hover: 'hover:shadow-lg hover:-translate-y-0.5',
    featured:
      'bg-res-surface rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
  },

  badge: {
    type: 'px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest',
    domain:
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border',
    domainDot: 'inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest',
  },

  nav: {
    container:
      'fixed top-0 left-0 right-0 z-50 bg-res-surface/90 backdrop-blur-md border-b border-res-border',
    inner: 'flex items-center justify-between h-14 px-6 md:px-12 lg:px-24',
    breadcrumb: 'text-xs font-mono uppercase tracking-widest text-res-text-muted',
    brandLink: 'text-xs font-mono uppercase tracking-widest text-res-text hover:text-res-text-muted transition-colors',
  },

  typeNav: {
    container: 'flex items-center gap-2 overflow-x-auto pb-1',
    pill: 'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap shrink-0',
    pillActive: 'bg-res-text text-res-surface',
    pillInactive:
      'text-res-text-muted hover:text-res-text hover:bg-res-bg-secondary border border-res-border/50',
  },

  filter: {
    pill: 'px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all border',
    pillInactive: 'text-res-text-muted border-res-border hover:border-res-text-muted/50',
  },

  section: {
    padding: 'px-6 md:px-12 lg:px-24',
    header:
      'text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted flex items-center gap-2 mb-8',
    headerIndicator: 'w-1.5 h-1.5 rounded-full bg-res-text-muted',
  },

  search: {
    input:
      'w-full rounded-full bg-res-bg-secondary border border-res-border px-4 py-2 text-sm font-sans placeholder:text-res-text-muted/50 focus:outline-none focus:border-res-text-muted/50 transition-colors text-res-text',
    compact:
      'w-48 lg:w-64 rounded-full bg-res-bg-secondary border border-res-border px-3 py-1.5 text-xs font-sans placeholder:text-res-text-muted/50 focus:outline-none focus:w-72 transition-all text-res-text',
  },

  daily: {
    dateHeader:
      'text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted py-3 sticky top-14 bg-res-bg z-10',
    card: 'flex items-baseline gap-6 py-3.5 rounded-lg hover:bg-res-bg-secondary transition-colors -mx-3 px-3',
  },

  stats: {
    container: 'flex items-center gap-4 text-xs font-mono text-res-text-muted',
    separator: 'text-res-border',
    number: 'font-semibold text-res-text',
  },
} as const;

export const domainAccentMap: Record<string, string> = {
  dev: 'domain-dev',
  design: 'domain-design',
  ops: 'domain-ops',
  business: 'domain-business',
  'ai-automation': 'domain-ai',
  marketing: 'domain-marketing',
};

export const domainLabels: Record<string, string> = {
  dev: 'Dev',
  design: 'Design',
  ops: 'Ops',
  business: 'Business',
  'ai-automation': 'AI',
  marketing: 'Marketing',
};

export const typeLabels: Record<string, string> = {
  daily: 'Daily',
  tutorial: 'Tutorial',
  article: 'Article',
  'tool-focus': 'Tool Focus',
  'concept-focus': 'Concept',
};
