import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";

/**
 * Porcelaine kit, React side. The look itself lives in the `@layer components`
 * block of src/app/globals.css (its top comment says how pages use it); these
 * are the pieces pages would otherwise retype: the mascot's pointe glyph and
 * bead, the arrow, the kicker, the two-line title, a piece, a button link.
 *
 * Everything here is server-compatible (no hooks, no handlers).
 */

/** The mascot's swept-back pattern, drawn in currentColor. */
export function Pointe({ className }: { className?: string }) {
  return (
    <svg className={cn("pointe", className)} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M10.2 1 C10.4 8 11.3 15 12 22 C12.7 15 13.6 8 13.8 1Z" />
      <path fill="currentColor" d="M8.4 1 C8.4 6 6.6 11 3.4 15 C5 10.6 5.9 5.8 5.7 1Z" />
      <path fill="currentColor" d="M15.6 1 C15.6 6 17.4 11 20.6 15 C19 10.6 18.1 5.8 18.3 1Z" />
    </svg>
  );
}

/**
 * The mascot's head as a white clay bead: the black swept-back pattern painted
 * on top, a soft specular, and the orange rim light along its far edge. Pure
 * decoration, for the corner of a page's main piece (the home hero, the about
 * page); the caller sizes and places it with `className`. Gradient ids carry a
 * prefix so they never meet another inline svg's, and two beads on one page
 * define the same gradients, so sharing the ids is harmless.
 */
export function Bead({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 340 360" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="bead-bd" gradientUnits="userSpaceOnUse" cx="129" cy="101" r="232">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".42" stopColor="#f8f8f6" />
          <stop offset=".8" stopColor="#e2e2de" />
          <stop offset="1" stopColor="#cdcdc8" />
        </radialGradient>
        <linearGradient id="bead-lac" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#202022" />
          <stop offset=".6" stopColor="#0a0a0b" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id="bead-spec">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bead-cs">
          <stop offset="0" stopColor="#141416" stopOpacity=".26" />
          <stop offset="1" stopColor="#141416" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bead-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a1f" stopOpacity="0" />
          <stop offset=".3" stopColor="#ff7a1f" />
          <stop offset=".62" stopColor="#ffb46e" />
          <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
        </linearGradient>
        <clipPath id="bead-clip">
          <circle cx="170" cy="165" r="145" />
        </clipPath>
        <filter id="bead-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="184" cy="326" rx="122" ry="14" fill="url(#bead-cs)" />
      <circle cx="170" cy="165" r="145" fill="url(#bead-bd)" />
      <g clipPath="url(#bead-clip)">
        <path
          fill="url(#bead-lac)"
          d="M-10 -10 H350 V40 L320 42 Q312 38 306 36 Q302 72 286 98 Q274 80 260 70 Q252 106 232 132 Q216 108 200 96 Q192 132 170 158 Q148 132 140 96 Q124 108 108 132 Q88 106 80 70 Q66 80 54 98 Q38 72 34 36 Q28 38 20 42 L-10 40 Z"
        />
        <g fill="none" stroke="url(#bead-bd)" strokeWidth="7" strokeLinecap="round">
          <path d="M190 -4 Q196 50 200 96" />
          <path d="M150 -4 Q144 50 140 96" />
          <path d="M212 -4 Q248 30 260 70" />
          <path d="M128 -4 Q92 30 80 70" />
          <path d="M236 -6 Q292 8 306 36" />
          <path d="M104 -6 Q48 8 34 36" />
        </g>
      </g>
      <g clipPath="url(#bead-clip)">
        <ellipse cx="116" cy="74" rx="58" ry="26" transform="rotate(-28 116 74)" fill="url(#bead-spec)" opacity=".55" />
        <ellipse cx="108" cy="66" rx="15" ry="7" transform="rotate(-28 108 66)" fill="#fff" opacity=".75" />
      </g>
      <path
        d="M242 40.3 A144 144 0 0 1 98 289.7"
        fill="none"
        stroke="url(#bead-rim)"
        strokeWidth="7"
        opacity=".45"
        filter="url(#bead-soft)"
      />
      <path d="M242 40.3 A144 144 0 0 1 98 289.7" fill="none" stroke="url(#bead-rim)" strokeWidth="2.4" />
    </svg>
  );
}

/** A drawn arrow (never the → glyph, which sits off the baseline). */
export function Arrow({
  direction = "right",
  className,
}: {
  direction?: "right" | "left" | "up-right";
  className?: string;
}) {
  const d =
    direction === "left"
      ? "M20 12H5M10.5 6.5 5 12l5.5 5.5"
      : direction === "up-right"
        ? "M7 17 17 7M8 7h9v9"
        : "M4 12h15M13.5 6.5 19 12l-5.5 5.5";
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mono uppercase label with the pointe: the head of every section. */
export function Kicker({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("kicker", className)}>
      <Pointe />
      <span>{children}</span>
    </Tag>
  );
}

/** An engraved line. */
export function Groove({ className }: { className?: string }) {
  return <hr className={cn("groove", className)} />;
}

const SIZES = { xl: "d-xl", lg: "d-lg", md: "d-md", sm: "d-sm", xs: "d-xs" } as const;

/**
 * Kicker, then a display title in two lines (the second in grey "unglazed
 * clay"), then an optional intro. One per section, h1 once per page.
 */
export function SectionTitle({
  kicker,
  line1,
  line2,
  as: Heading = "h2",
  size = "md",
  children,
  className,
}: {
  kicker?: ReactNode;
  line1: ReactNode;
  line2?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  /** The intro paragraph under the title. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <Heading className={cn("display m-0", SIZES[size], kicker ? "mt-5" : undefined)}>
        {line1}
        {line2 ? (
          <>
            <br />
            <span className="bisque">{line2}</span>
          </>
        ) : null}
      </Heading>
      {children ? <div className="lede mt-6">{children}</div> : null}
    </div>
  );
}

type PieceTone = "main" | "quiet" | "lacquer" | "well";

const TONES: Record<PieceTone, string> = {
  // The page's one main piece: full clay, the orange rim light and its bounce.
  main: "clay rim rim-warm",
  // Everything else: flat clay held by a hairline.
  quiet: "clay-quiet",
  // The one dark band a page may carry.
  lacquer: "lacquer rim",
  // A surface pressed into the clay.
  well: "well",
};

/** A piece of porcelaine. Give a page one "main", the rest "quiet". */
export function Piece<T extends ElementType = "div">({
  as,
  tone = "quiet",
  radius = "lg",
  className,
  children,
  ...rest
}: {
  as?: T;
  tone?: PieceTone;
  radius?: "md" | "lg" | "xl";
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">) {
  const Tag: ElementType = as ?? "div";
  const r = radius === "xl" ? "rounded-slab" : radius === "md" ? "rounded-piece" : "rounded-plate";
  return (
    <Tag
      className={cn(TONES[tone], r, className)}
      {...(tone === "lacquer" ? { "data-surface": "inverse" } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

/**
 * The one button. `lacquer` (black, rim line) is the primary action, `clay`
 * the secondary, `quiet` a text button. Internal paths go through the locale
 * router, URLs and mailto: stay plain anchors.
 */
export function ButtonLink({
  href,
  variant = "lacquer",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: "lacquer" | "clay" | "quiet";
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  const classes = cn(
    "btn",
    variant === "lacquer" ? "btn-lacquer" : variant === "clay" ? "btn-clay" : "btn-quiet",
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    className,
  );
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

/** The mono "READ MORE" link with the orange underline. */
export function LinkRim({
  href,
  children,
  className,
  arrow = true,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  const content = (
    <>
      <span className="t">{children}</span>
      {arrow ? <Arrow /> : null}
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={cn("link-rim", className)} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn("link-rim", className)} {...rest}>
      {content}
    </Link>
  );
}

/** A pressed-in tag. `dark` is the lacquer one (day number, "Next"). */
export function Chip({
  children,
  dark = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return <span className={cn("chip", dark && "chip-dark", className)}>{children}</span>;
}
