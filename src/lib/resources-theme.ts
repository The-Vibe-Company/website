/**
 * Resources "Calm Studio" Design Tokens
 *
 * Scoped design tokens for the /resources section.
 * These complement the main design-system.ts for the warm knowledge platform feel.
 */

export const resourcesTheme = {
  card: {
    base: 'bg-res-surface border border-res-border hover:border-res-text-muted/50 transition-colors duration-200',
    hover: 'hover:shadow-sm',
    featured:
      'bg-res-surface border border-res-border overflow-hidden transition-all duration-300 hover:border-res-text-muted/50',
  },

  badge: {
    type: 'px-2 py-0.5 border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text-muted',
    domain:
      'inline-flex items-center gap-1.5 px-2 py-0.5 border border-res-border text-[10px] font-mono uppercase tracking-widest text-res-text',
    domainDot: 'inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-res-text-muted',
  },

  nav: {
    container:
      'fixed top-0 left-0 right-0 z-50 bg-res-bg/80 backdrop-blur-md border-b border-res-border',
    inner: 'flex items-center justify-between h-14 px-6 md:px-12 lg:px-24',
    breadcrumb: 'text-xs font-mono uppercase tracking-widest text-res-text-muted',
    brandLink: 'text-xs font-mono uppercase tracking-widest text-res-text hover:text-res-text-muted transition-colors',
  },

  typeNav: {
    container: 'flex items-center gap-px bg-res-border p-px overflow-x-auto',
    pill: 'px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border-r border-res-border last:border-r-0',
    pillActive: 'bg-res-text text-res-surface',
    pillInactive:
      'bg-res-surface text-res-text-muted hover:text-res-text hover:bg-res-bg-secondary',
  },

  filter: {
    pill: 'px-3 py-1.5 border border-res-border text-[10px] font-mono uppercase tracking-widest transition-all hover:border-res-text-muted',
    pillInactive: 'text-res-text-muted bg-res-surface',
  },

  section: {
    padding: 'px-6 md:px-12 lg:px-24',
    header:
      'text-xs font-mono uppercase tracking-widest text-res-text flex items-center gap-3 mb-8 pb-4 border-b border-res-border w-full',
    headerIndicator: 'w-2 h-2 bg-res-text',
  },

  search: {
    input:
      'w-full bg-res-surface border border-res-border px-4 py-2 text-sm font-mono placeholder:text-res-text-muted/50 focus:outline-none focus:border-res-text transition-colors text-res-text rounded-none',
    compact:
      'w-48 lg:w-64 bg-res-surface border border-res-border px-3 py-1.5 text-xs font-mono placeholder:text-res-text-muted/50 focus:outline-none focus:w-72 focus:border-res-text transition-all text-res-text rounded-none',
  },

  daily: {
    dateHeader:
      'text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted py-3 sticky top-14 bg-res-bg z-10 border-b border-res-border/50 backdrop-blur-sm',
    card: 'flex items-baseline gap-6 py-4 border-b border-res-border/50 hover:bg-res-surface transition-colors -mx-6 px-6',
  },

  stats: {
    container: 'flex items-center gap-6 text-xs font-mono text-res-text-muted border-l border-res-border pl-6',
    separator: 'hidden',
    number: 'font-semibold text-res-text mr-1.5',
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
  daily: 'Learning',
  tutorial: 'Tutorial',
  article: 'Article',
  'tool-focus': 'Focus',
  'concept-focus': 'Concept',
};
