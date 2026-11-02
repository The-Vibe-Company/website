/**
 * Resources design tokens, now on the porcelaine kit.
 *
 * The resources pages used to carry their own softer, rounded "calm studio"
 * card style. There is one kit for the whole site now (see the top comment of
 * src/app/globals.css): these strings are thin names over its classes, kept so
 * the resources components that import them follow the direction. Text is 12px
 * at least; there is no dark variant (the surface is light only).
 */

export const resourcesTheme = {
  card: {
    // Repeated items are quiet pieces: flat clay on a hairline, a small rise on
    // hover. The page's one featured piece takes the full treatment.
    base: 'clay-quiet lift rounded-plate',
    hover: '',
    featured: 'clay rim rim-warm rounded-slab overflow-hidden',
  },

  badge: {
    type: 'chip',
    domain: 'chip',
    domainDot:
      'inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.08em] text-res-text-muted',
  },

  flag: {
    base: 'inline-flex items-center leading-none select-none',
    card: '',
    sidebar: '',
    inline: '',
  },

  nav: {
    container: 'fixed top-0 left-0 right-0 z-50 bg-res-bg/80 backdrop-blur-md',
    inner: 'wrap flex items-center justify-between h-14',
    breadcrumb: 'text-xs font-mono uppercase tracking-[0.14em] text-res-text-muted',
    brandLink: 'text-xs font-mono uppercase tracking-[0.14em] text-res-text hover:text-res-text-muted transition-colors',
  },

  // The type rail is the kit's segmented control: the container is `seg`, its
  // items are the links, the current one carries `on`.
  typeNav: {
    container: 'seg',
    pill: 'gap-1.5',
    pillActive: 'on',
    pillInactive: '',
  },

  filter: {
    pill: 'chip transition-colors hover:text-res-text',
    pillInactive: 'text-res-text-muted',
  },

  section: {
    // The page edge: the same container as the header.
    padding: 'wrap',
    header: 'kicker mb-8 w-full',
    headerIndicator: 'dot',
  },

  search: {
    // A pressed-in field; callers add left padding for the magnifier.
    input: 'field',
    compact: 'field field-sm',
  },

  skill: {
    sourceBadgeNative: 'chip',
    sourceBadgeExternal: 'chip chip-dark transition-[filter] hover:brightness-125',
    promptBlock:
      'relative well rounded-piece font-mono text-[13px] leading-relaxed text-res-text overflow-hidden',
    promptBlockBody:
      'overflow-y-auto p-4 sm:p-5 pt-20 sm:pt-16 whitespace-pre-wrap break-words transition-[max-height] duration-300',
    promptBlockToolbar:
      'absolute top-0 left-0 right-0 flex items-center justify-between gap-3 px-3 sm:px-4 py-2 bg-res-bg-secondary/95 backdrop-blur-sm z-10',
    promptBlockLabel:
      'inline-flex min-w-0 items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-res-text-muted',
    installBlock: 'clay-quiet rounded-plate overflow-hidden',
    installTabs: 'seg m-3',
    installTab: '',
    installTabActive: 'on',
    installTabInactive: '',
    installCommand:
      'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 pb-4 pt-1 font-mono text-[13px] text-res-text overflow-x-auto',
    generatorWrap: 'clay-quiet rounded-plate p-4 sm:p-5 space-y-5',
    generatorTargetGroup: 'seg',
    generatorTarget: '',
    generatorTargetActive: 'on',
    generatorTargetInactive: '',
    generatorOutput:
      'well rounded-piece max-h-[260px] sm:max-h-[360px] overflow-auto p-4 text-[13px] leading-relaxed font-mono text-res-text whitespace-pre-wrap break-words',
    metaSidebarLabel:
      'text-xs font-mono uppercase tracking-[0.14em] text-res-text-muted',
    metaSidebarValue: 'text-sm text-res-text',
    copyButton: 'btn btn-sm btn-clay shrink-0',
    copyButtonPrimary: 'btn btn-sm btn-lacquer shrink-0',
    copyButtonSuccess: 'btn btn-sm btn-clay shrink-0 text-emerald-700',
  },

  stats: {
    container: 'flex items-center gap-6 text-xs font-mono text-res-text-muted',
    separator: 'hidden',
    number: 'font-semibold text-res-text mr-1.5',
  },
  tool: {
    card: 'clay-quiet lift rounded-plate',
    cardInner: 'p-6 flex flex-col h-full',
    logoWrap:
      'well rounded-piece w-12 h-12 flex items-center justify-center overflow-hidden shrink-0',
    leverageBar: 'h-1.5 well rounded-full overflow-hidden',
    leverageFill: 'h-full rounded-full transition-all duration-500',
    pricingBadge: 'chip',
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
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  freemium: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  paid: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  enterprise: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
};

// Content types are static config in '@/lib/content-types'.
