"use client";

import { motion, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { usePointer } from "./pointer";

export interface DeepProduct {
  slug: string;
  name: string;
  logo: string;
  accent: string;
  tag: string;
  status: string;
  date: string;
}

const ORG_URL = "https://github.com/The-Vibe-Company";

/**
 * Our products laid out on a field that tips back into the dark, rows further
 * away the higher they sit. Each tile is lit from beneath by its product's own
 * colour; the one you point at lifts off the field toward you.
 */
export function ProductsField({ products }: { products: DeepProduct[] }) {
  const t = useTranslations("proof");
  const { x: px, y: py } = usePointer();
  const rotateY = useTransform(px, (v) => v * 7);
  const rotateX = useTransform(py, (v) => 20 + v * -4);

  return (
    <section id="products" className="relative z-10 overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
              <BrandSquare />
              {t("kicker")}
            </p>
            <h2 className="m-0 mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-foreground">
              {t("titleLine1")}
              <br />
              <span className="text-soft-foreground">{t("titleLine2")}</span>
            </h2>
          </div>
          <p className="m-0 text-[16px] leading-[1.6] text-muted-foreground">{t("intro")}</p>
        </div>

        <div className="mt-14 md:mt-20 lg:[perspective:1400px] lg:[perspective-origin:50%_100%]">
          <motion.ul
            style={{ rotateX, rotateY }}
            className="m-0 grid origin-bottom list-none grid-cols-1 gap-4 p-0 max-lg:transform-none! sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 lg:[transform-style:preserve-3d]"
          >
            {products.map((p, i) => (
              <li
                key={p.slug}
                style={{ "--accent": p.accent, "--row": Math.floor(i / 3) } as CSSProperties}
                className="group relative lg:[transform-style:preserve-3d]"
              >
                {/* The product's own light, pooled under its tile. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 left-[16%] right-[16%] h-14 rounded-[50%] opacity-[0.16] blur-2xl transition-opacity duration-500 group-hover:opacity-70 group-focus-within:opacity-70"
                  style={{ background: "var(--accent)" }}
                />
                <Link
                  href={`/portfolio/${p.slug}`}
                  className="relative flex h-full items-center gap-5 border border-border bg-[#111112] p-5 transition-[transform,border-color,background-color] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:bg-card focus-visible:border-border-strong lg:group-hover:[transform:translateZ(70px)] lg:group-focus-within:[transform:translateZ(70px)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px opacity-70"
                    style={{ background: "linear-gradient(to right, transparent, var(--accent), transparent)" }}
                  />
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-border bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt="" aria-hidden="true" className="h-7 w-7 object-contain" loading="lazy" decoding="async" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[19px] font-bold tracking-[-0.02em] text-foreground">{p.name}</span>
                    <span className="mt-1 block truncate text-[13px] text-muted-foreground">{p.tag}</span>
                  </span>
                  <span className="hidden shrink-0 flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:flex">
                    <span className="inline-flex items-center gap-2 text-soft-foreground">
                      <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: "var(--accent)" }} />
                      {p.status}
                    </span>
                    {p.date}
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>

        <a
          href={ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand md:mt-24"
        >
          {t("browseAll")} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
