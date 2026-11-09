import { cn } from "@/lib/design-system";
import { DISPLAY } from "./font";

/** Sunlit type: paper at the top, molten orange at the foot. */
export const SUNLIT_TEXT =
  "bg-[linear-gradient(180deg,#fff3e3_0%,#ffbf7a_38%,#f27313_72%,#b23c0a_100%)] bg-clip-text text-transparent [-webkit-background-clip:text]";

/**
 * A section title in the eclipse voice: the first line in paper, the second
 * caught in the light, set in the display face.
 */
export function LitTitle({
  kicker,
  line1,
  line2,
  as: Tag = "h2",
  className,
}: {
  kicker?: string;
  line1: string;
  line2: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={className}>
      {kicker ? (
        <p className="m-0 mb-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
          <span aria-hidden="true" className="h-2 w-2 bg-brand shadow-[0_0_12px_2px_rgba(242,115,19,0.7)]" />
          {kicker}
        </p>
      ) : null}
      <Tag className={cn(DISPLAY, "m-0 text-[clamp(3rem,7.4vw,7.5rem)] font-black leading-[0.86] tracking-[-0.01em]")}>
        <span className="block text-foreground">{line1}</span>
        <span className={cn("block pb-[0.08em] drop-shadow-[0_0_28px_rgba(242,115,19,0.35)]", SUNLIT_TEXT)}>{line2}</span>
      </Tag>
    </div>
  );
}

/** The page container shared by every section. */
export const CONTAINER = "mx-auto w-full max-w-[90rem] px-6 md:px-10 lg:px-16";
