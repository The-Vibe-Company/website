/**
 * Unified Design System for The Vibe Company: porcelaine.
 *
 * Class-string compositions over the kit in src/app/globals.css (its top
 * comment says how pages use it: tokens, utility classes, components). The
 * names below are the ones pages already import; their values now point at
 * the porcelaine kit, so a page that uses them follows the direction.
 * 
 * Usage:
 * import { typography, colors, spacing, animations, components } from '@/lib/design-system';
 */

// =============================================================================
// COLORS
// =============================================================================

/**
 * Color tokens using CSS custom properties defined in globals.css
 * These map to Tailwind's theme colors for consistency
 */
export const colors = {
  // Semantic colors
  background: 'bg-background',
  foreground: 'text-foreground',
  
  // Card colors
  card: 'bg-card',
  cardForeground: 'text-card-foreground',
  
  // Popover colors
  popover: 'bg-popover',
  popoverForeground: 'text-popover-foreground',
  
  // Muted colors for secondary text
  muted: 'text-muted',
  mutedForeground: 'text-muted-foreground',
  
  // Accent colors for highlights
  accent: 'bg-accent',
  accentForeground: 'text-accent-foreground',
  
  // Border color
  border: 'border-border',

  // Opacity variants (only commonly used ones)
  backgroundTranslucent: 'bg-background/50',
  backgroundOpaque: 'bg-background/80',
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Typography scale and styles
 * All text styles use Tailwind classes for consistency
 */
export const typography = {
  // Font families
  fonts: {
    sans: 'font-sans',
    mono: 'font-mono',
  },
  
  // Display text: Bricolage, tight, two lines with the second in grey clay
  // (wrap it in `bisque`). Sizes are fluid clamps, phone to desktop.
  display: {
    hero: 'display d-xl',
    large: 'display d-xl',
    section: 'display d-md',
  },

  // Headings
  heading: {
    h1: 'display d-lg',
    h2: 'display d-md',
    h3: 'display d-sm',
    h4: 'display d-xs',
  },

  // Body text
  body: {
    large: 'lede text-2xl md:text-3xl',
    default: 'lede',
    small: 'text-lg md:text-xl font-medium',
  },

  // Labels and captions: mono, 12px at least
  label: {
    default: 'text-sm font-medium uppercase tracking-[0.14em]',
    mono: 'text-xs font-mono uppercase tracking-[0.14em]',
    small: 'text-xs font-medium',
  },

  // Marquee text
  marquee: 'display text-4xl md:text-6xl',
} as const;

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing system for consistent layout
 */
export const spacing = {
  // Page padding: the kit's gutter (24px phone, 48px from 768px), the same
  // edge as the header.
  page: {
    x: 'px-[var(--gut)]',
    y: 'py-20 md:py-28',
    yLarge: 'py-28 md:py-40',
  },

  // Section spacing
  section: {
    padding: 'py-20 md:py-28 px-[var(--gut)]',
    paddingLarge: 'py-28 md:py-40 px-[var(--gut)]',
  },

  // Container: one width for the header, the content and the closing call
  container: {
    default: 'wrap',
    narrow: 'mx-auto max-w-4xl',
    medium: 'max-w-2xl',
  },

  // Gap sizes
  gap: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12',
    xl: 'gap-24',
  },
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

/**
 * Animation presets for Framer Motion
 * Use these for consistent motion across the application
 */
export const animations = {
  // Easing curves
  easing: {
    smooth: [0.16, 1, 0.3, 1], // Smooth ease-out
    bounce: { type: 'spring', bounce: 0.2, duration: 0.6 },
    spring: { type: 'spring', stiffness: 500, damping: 28 },
    springGentle: { type: 'spring', stiffness: 700, damping: 25 },
  },
  
  // Duration presets (seconds)
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.8,
    slower: 1,
  },
  
  // Common animation variants
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInUpLarge: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    slideUp: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
  },
  
  // Tailwind animation classes
  classes: {
    pulse: 'animate-pulse',
    marquee: 'animate-marquee',
    shimmer: 'animate-shimmer',
  },
} as const;

// =============================================================================
// EFFECTS
// =============================================================================

/**
 * Visual effects and treatments
 */
export const effects = {
  // Backdrop blur effects
  blur: {
    sm: 'backdrop-blur-sm',
    default: 'backdrop-blur',
    xl: 'backdrop-blur-xl',
  },
  
  // Shadow effects
  shadow: {
    none: 'shadow-none',
    default: 'shadow-sm',
    xl: 'shadow-md',
    // Retired with the brutalist look; kept so old imports compile. Use the
    // kit's pieces (clay / clay-quiet) instead of a hard offset shadow.
    brutal: 'shadow-none',
  },
  
  // Border radius
  radius: {
    none: 'rounded-none',
    sm: 'rounded-pebble',
    default: 'rounded-piece',
    full: 'rounded-full',
  },
  
  // Transitions
  transition: {
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    all: 'transition-all',
    transform: 'transition-transform',
  },
} as const;

// =============================================================================
// COMPONENT STYLES
// =============================================================================

/**
 * Reusable component style compositions
 * Import and spread these to maintain consistency
 */
export const components = {
  // Badge/Tag styles: pressed-in tags (mono, 12px)
  badge: {
    base: 'chip',
    default: 'chip',
    solid: 'chip chip-dark',
  },

  // Status indicator
  statusDot: {
    active: 'dot dot-rim',
    success: 'dot dot-rim',
    warning: 'dot',
    error: 'dot',
  },

  // Button styles: lacquer is the primary, clay the secondary, quiet a text button
  button: {
    base: 'btn',
    primary: 'btn btn-lacquer',
    secondary: 'btn btn-clay',
    ghost: 'btn btn-quiet',
  },

  // Piece styles: one main piece per page, the rest quiet
  card: {
    base: 'clay-quiet rounded-plate',
    default: 'clay-quiet rounded-plate p-6 md:p-8',
    hover: 'clay-quiet lift rounded-plate p-6 md:p-8',
    glass: 'clay-quiet rounded-plate',
    main: 'clay rim rim-warm rounded-slab p-6 md:p-12',
  },

  // Navigation styles
  nav: {
    dock: 'nav clay rim rounded-full',
    link: 'nav-link',
  },

  // Divider styles
  divider: {
    horizontal: 'groove',
    vertical: 'w-px h-4 bg-border',
    dashed: 'groove',
  },

  // Container with a drawn lacquer bar on the left (no side border)
  bordered: {
    left: 'lede-bar py-4',
    leftSolid: 'lede-bar',
    leftDashed: 'lede-bar',
  },

  // Marquee container
  marquee: {
    container: 'relative flex overflow-hidden w-full select-none py-2',
    content: 'animate-marquee flex py-3 items-center whitespace-nowrap',
  },

  // Grid overlay: retired (the backdrop is a seamless studio grey)
  gridOverlay: 'hidden',

  // Links
  link: {
    default: 'transition-colors hover:text-muted-foreground',
    underline: 'underline decoration-rim decoration-[1.5px] underline-offset-4 hover:decoration-[3px] transition-all',
    mono: 'underline decoration-rim decoration-[1.5px] underline-offset-4 hover:decoration-[3px]',
  },

  // Section headers: kicker with the pointe, then a groove
  sectionHeader: {
    wrapper: 'flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4',
    title: 'kicker',
    indicator: 'pointe',
  },

  // Tag grid (tech stack, features, etc.): pressed-in tags, no hard grid
  tagGrid: 'flex flex-wrap gap-2',
  tagItem: 'chip',

  // Code/Terminal styles
  terminal: {
    line: 'font-mono text-lg md:text-xl lede-bar py-1',
    cursor: 'animate-pulse bg-foreground text-background px-1',
  },

  // Custom cursor
  cursor: 'fixed top-0 left-0 w-2 h-2 rounded-full bg-foreground pointer-events-none z-[100] hidden md:block mix-blend-difference',
} as const;

// =============================================================================
// LAYOUT
// =============================================================================

/**
 * Common layout patterns
 */
export const layout = {
  // Flex patterns
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-start',
    col: 'flex flex-col',
    row: 'flex flex-row',
  },
  
  // Grid patterns
  grid: {
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-3',
    cols12: 'grid grid-cols-1 lg:grid-cols-12',
  },
  
  // Full screen sections
  fullScreen: 'min-h-screen',

  // Sticky positioning
  sticky: {
    top: 'sticky top-0',
    topOffset: 'md:sticky md:top-32',
  },
  
  // Z-index layers
  z: {
    base: 'z-0',
    content: 'z-10',
    overlay: 'z-40',
    modal: 'z-50',
    cursor: 'z-[100]',
  },
} as const;

// =============================================================================
// RESPONSIVE BREAKPOINTS (reference)
// =============================================================================

/**
 * Tailwind breakpoint reference (for documentation)
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Combines multiple class strings into one
 * Useful for merging component styles with custom overrides
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates a motion transition config with consistent easing
 */
export function createTransition(duration = 0.8, delay = 0) {
  return {
    duration,
    delay,
    ease: animations.easing.smooth,
  };
}

/**
 * Creates viewport animation config for scroll-triggered animations
 */
export function createViewportConfig(margin = '-100px') {
  return {
    once: true,
    margin,
  };
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;
export type SpacingToken = keyof typeof spacing;
export type AnimationToken = keyof typeof animations;
export type ComponentToken = keyof typeof components;
