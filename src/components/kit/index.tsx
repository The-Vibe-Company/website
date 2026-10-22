import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";

/**
 * Porcelaine kit, React side. The look itself lives in the `@layer components`
 * block of src/app/globals.css (its top comment says how pages use it); these
 * are the pieces pages would otherwise retype: the mascot's pointe glyph, the
 * arrow, the kicker, the two-line title, a piece, a button link.
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
