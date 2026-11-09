"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";
import { cn } from "@/lib/design-system";
import { SERIF } from "./fonts";

/** Each client's own colour, sampled from its logo: the field its card shows. */
const CLIENT_FIELD: Record<string, string> = {
  monka: "#0b6f5d",
  afp: "#325aff",
  locservice: "#0087c3",
  "coup-de-pates": "#c8202b",
  theodo: "#ff512c",
};

/** The card that trails the cursor: the client's colour field and its name. */
function FieldCard({ c, label }: { c: Customer; label: string }) {
  const visual = c.visuals.find((v) => v.placement === "wide");
  return (
    <div
      className="w-[320px] overflow-hidden rounded-[2px] text-white shadow-[0_40px_90px_-24px_rgba(0,0,0,0.85)]"
      style={{ background: CLIENT_FIELD[c.slug] ?? "#4a4946" }}
    >
      <div className="flex items-center justify-between px-5 pt-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.logo} alt="" {...clientLogoSize(c.logo)} className="h-6 w-auto brightness-0 invert" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">{label}</span>
      </div>
      {visual ? (
        <Image
          src={visual.src}
          alt=""
          width={visual.width}
          height={visual.height}
          sizes="280px"
          className="mx-5 mt-5 block h-[150px] w-[calc(100%-40px)] rounded-[2px] object-cover object-left-top"
        />
      ) : (
        // The sector's first word as a magazine department: "Presse.", "Location."
        <p className={`${SERIF} m-0 px-5 pt-9 text-[56px] leading-[0.9] tracking-[-0.02em]`}>
          {c.sector.split("·")[0].trim()}.
        </p>
      )}
      <p className="m-0 px-5 pb-5 pt-5 font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-white/80">
        {visual ? c.sector : c.sector.split("·").slice(1).join("·").trim() || c.client}
      </p>
    </div>
  );
}

/**
 * The cases as a magazine's table of contents: one ruled row per client, its
 * figure set huge in the serif. On a mouse, the client's colour field trails
 * the cursor across the list; on keyboard focus it settles at the row's end.
 */
export function CaseIndex({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("caseStudy");
  const customers = getCustomers(locale);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 260, damping: 28, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const place = (clientX: number, clientY: number, jump = false) => {
    const box = listRef.current?.getBoundingClientRect();
    if (!box) return;
    const nx = clientX - box.left + 28;
    const ny = clientY - box.top - 120;
    x.set(nx);
    y.set(ny);
    if (jump || reduce) {
      sx.jump(nx);
      sy.jump(ny);
    }
  };

  const onEnter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    place(e.clientX, e.clientY, active === null);
    setActive(i);
  };

  const onFocus = (i: number) => (e: FocusEvent<HTMLAnchorElement>) => {
    const row = e.currentTarget.getBoundingClientRect();
    // Over the figure column, clear of the caption a keyboard reader needs.
    place(row.left + row.width * 0.42, row.top + row.height / 2, true);
    setActive(i);
  };

  return (
    <div
      ref={listRef}
      className="relative"
      onPointerMove={(e) => e.pointerType === "mouse" && place(e.clientX, e.clientY)}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="m-0 list-none border-t border-border p-0">
        {customers.map((c, i) => {
          const long = (c.metric ?? "").length > 13;
          return (
            <li key={c.slug} className="border-b border-border">
              <Link
                href={`/case-studies/${c.slug}?from=home`}
                onPointerEnter={onEnter(i)}
                onFocus={onFocus(i)}
                onBlur={() => setActive(null)}
                className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-4 py-8 no-underline outline-offset-[-2px] md:grid-cols-[2.5rem_minmax(0,11rem)_minmax(0,1fr)_minmax(0,15rem)] md:items-center md:gap-x-8 md:py-10"
              >
                <span className="pt-1 font-mono text-[11px] tracking-[0.2em] text-muted-foreground md:pt-0">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="flex flex-col gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.logo}
                    alt={c.client}
                    {...clientLogoSize(c.logo)}
                    className="h-6 w-auto self-start object-contain brightness-0 invert md:h-7"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-muted-foreground">
                    {c.sector}
                  </span>
                </span>

                <span
                  className={cn(
                    SERIF,
                    "col-span-2 block text-balance leading-[0.92] tracking-[-0.03em] text-foreground transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3 md:col-span-1",
                    long ? "text-[clamp(40px,4.4vw,72px)]" : "text-[clamp(56px,7vw,116px)]",
                  )}
                >
                  {c.metric ?? c.client}
                </span>

                <span className="col-span-2 flex flex-col gap-4 md:col-span-1">
                  <span className="text-[15px] leading-[1.5] text-muted-foreground">{c.metricLabel ?? c.summary}</span>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                    <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">{t("readCase")}</span>
                    <span aria-hidden="true" className="text-brand transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(hover:hover)]:md:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={customers[active].slug}
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0"
            >
              <FieldCard c={customers[active]} label={locale === "fr" ? "Cas client" : "Case study"} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-10">
        <Link
          href="/case-studies"
          className="group inline-flex min-h-11 items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground no-underline"
        >
          <span className="underline decoration-1 underline-offset-4">{t("seeAll")}</span>
          <span aria-hidden="true" className="text-brand transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
