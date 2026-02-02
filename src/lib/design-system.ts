/**
 * Unified Design System for The Vibe Company
 * 
 * This file serves as the single source of truth for all design tokens,
 * style compositions, and component variants across the application.
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
  
  // Opacity variants
  foregroundMuted: 'text-foreground/10',
  foregroundSubtle: 'text-foreground/60',
  borderSubtle: 'border-border/50',
  borderMuted: 'border-border/40',
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
  
  // Display text - for hero headlines
  display: {
    hero: 'text-[12vw] leading-[0.8] font-bold tracking-tighter',
    large: 'text-[14vw] font-bold leading-[0.8] tracking-tighter',
    section: 'text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]',
  },
  
  // Headings
  heading: {
    h1: 'text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter',
    h2: 'text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
    h4: 'text-xl md:text-2xl font-semibold tracking-tight',
  },
  
  // Body text
  body: {
    large: 'text-2xl md:text-3xl lg:text-4xl font-light tracking-tight',
    default: 'text-xl md:text-2xl leading-relaxed',
    small: 'text-lg md:text-xl font-medium',
  },
  
  // Labels and captions
  label: {
    default: 'text-sm font-medium uppercase tracking-widest',
    mono: 'text-xs font-mono uppercase tracking-widest',
    small: 'text-xs font-medium',
  },
  
  // Marquee text
  marquee: 'text-4xl md:text-6xl font-bold tracking-tighter',
} as const;

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing system for consistent layout
 */
export const spacing = {
  // Page padding responsive
  page: {
    x: 'px-6 md:px-12 lg:px-24',
    y: 'py-24 md:py-32',
    yLarge: 'py-32 md:py-48',
  },
  
  // Section spacing
  section: {
    padding: 'py-24 md:py-32 px-6 md:px-12 lg:px-24',
    paddingLarge: 'py-32 md:py-48 px-6 md:px-12 lg:px-24',
  },
  
  // Container max widths
  container: {
    default: 'max-w-[120rem] mx-auto',
    narrow: 'max-w-4xl mx-auto',
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
    default: 'shadow-lg',
    xl: 'shadow-2xl',
    brutal: 'shadow-[8px_8px_0px_0px_var(--foreground)]',
  },
  
  // Border radius
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded-lg',
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
  // Badge/Tag styles
  badge: {
    base: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono',
    default: 'inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-xs font-mono',
    solid: 'inline-flex items-center gap-2 px-2 py-1 bg-foreground text-background text-xs font-mono uppercase',
  },
  
  // Status indicator
  statusDot: {
    active: 'w-2 h-2 rounded-full bg-blue-500 animate-pulse',
    success: 'w-2 h-2 rounded-full bg-green-500',
    warning: 'w-2 h-2 rounded-full bg-yellow-500',
    error: 'w-2 h-2 rounded-full bg-red-500',
  },
  
  // Button styles
  button: {
    base: 'font-medium transition-all',
    primary: 'px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity',
    secondary: 'px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
    ghost: 'hover:bg-muted/20 rounded-full transition-colors',
  },
  
  // Card styles
  card: {
    base: 'border border-border bg-background',
    default: 'border border-foreground bg-background p-8 md:p-12',
    hover: 'border border-foreground bg-background p-8 md:p-12 transition-all hover:shadow-[8px_8px_0px_0px_var(--foreground)]',
    glass: 'bg-background/80 backdrop-blur-xl border border-border/50',
  },
  
  // Navigation styles
  nav: {
    dock: 'flex items-center gap-2 px-4 py-3 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl',
    link: 'relative px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
  },
  
  // Divider styles
  divider: {
    horizontal: 'border-t border-foreground',
    vertical: 'w-px h-4 bg-border/50',
    dashed: 'border-t border-dashed border-foreground/30',
  },
  
  // Container with border treatment
  bordered: {
    left: 'border-l border-foreground/30 pl-8 md:pl-12 py-4',
    leftSolid: 'border-l-2 border-foreground pl-6',
    leftDashed: 'border-l border-dashed border-foreground pl-4 py-1',
  },
  
  // Marquee container
  marquee: {
    container: 'relative flex overflow-hidden w-full border-y border-border/50 bg-background/50 backdrop-blur-sm select-none',
    content: 'animate-marquee flex gap-8 py-3 items-center',
  },
  
  // Grid overlay
  gridOverlay: 'bg-grid',
  
  // Links
  link: {
    default: 'hover:text-muted-foreground transition-colors',
    underline: 'underline underline-offset-2 hover:text-blue-400 transition-colors',
    mono: 'hover:underline decoration-1 underline-offset-4',
  },
  
  // Section headers
  sectionHeader: {
    wrapper: 'flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-foreground pb-6',
    title: 'text-sm font-medium uppercase tracking-widest flex items-center gap-2',
    indicator: 'w-2 h-2 bg-foreground',
  },
  
  // Tag grid (tech stack, features, etc.)
  tagGrid: 'grid grid-cols-2 sm:grid-cols-3 gap-0 border-t border-l border-foreground',
  tagItem: 'px-3 py-4 border-r border-b border-foreground text-xs font-mono uppercase text-center hover:bg-foreground hover:text-background transition-colors cursor-crosshair flex items-center justify-center',
  
  // Code/Terminal styles
  terminal: {
    line: 'font-mono text-lg md:text-xl border-l border-dashed border-foreground pl-4 py-1',
    cursor: 'animate-pulse bg-foreground text-background px-1',
  },
  
  // Custom cursor
  cursor: 'fixed top-0 left-0 w-8 h-8 rounded-full border border-foreground pointer-events-none z-[100] hidden md:block mix-blend-difference',
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
