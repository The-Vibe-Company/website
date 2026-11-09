import { cn } from "@/lib/design-system";

/**
 * The two backers, set in type on the ink page: Y Combinator's own orange
 * square beside its name, and the France 2030 roundel in paper. Shared by the
 * desktop and phone heroes so both read the same.
 */
export function Backers({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-x-12 gap-y-4", className)}>
      <a
        href="https://www.ycombinator.com/companies/quivr"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-75"
      >
        <svg viewBox="0 0 38 38" aria-hidden="true" focusable="false" className="h-[34px] w-[34px] shrink-0">
          <rect width="38" height="38" fill="#f26522" />
          <path
            fill="#fff"
            d="m11 8.8 6.5 12.2v8h2.5v-7.9l6.6-12.3h-2.8l-3.9 7.7c-.6 1.2-1.1 2.3-1.1 2.3s-.5-1.1-1-2.3L14 8.8z"
          />
        </svg>
        <span className="flex flex-col gap-1 leading-none">
          <span className="text-[13px] font-bold tracking-[-0.01em] text-foreground">Y Combinator</span>
          <span className="text-[10px] font-bold tracking-[0.08em] text-foreground">W24</span>
        </span>
      </a>
      <span className="inline-flex items-center gap-3">
        {/* Plain <img>: an SVG gains nothing from the image optimizer. Low
            priority, so React does not preload this small mark in <head>
            ahead of the hero's fonts, CSS and mascot. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/partners/france-2030.svg"
          alt=""
          aria-hidden="true"
          width={34}
          height={34}
          className="h-[34px] w-[34px] brightness-0 invert"
          decoding="async"
          fetchPriority="low"
        />
        <span className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">France 2030</span>
      </span>
    </div>
  );
}
