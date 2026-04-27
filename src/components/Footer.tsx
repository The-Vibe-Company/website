"use client";

import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

const SITE_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Resources", href: "/resources" },
  { label: "Mission", href: "/agency" },
];

const ELSEWHERE_LINKS: NavLink[] = [
  { label: "X / Twitter", href: "https://x.com/thevibecompany", external: true },
  {
    label: "GitHub",
    href: "https://github.com/The-Vibe-Company",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/thevibecompany",
    external: true,
  },
];

const STATUS_ITEMS = [
  "Building in public",
  "Shipping daily",
  "Open to projects",
];

const buildYear = new Date().getUTCFullYear();

function FooterLink({ link }: { link: NavLink }) {
  const className =
    "inline-flex items-center gap-1.5 text-sm text-background/85 transition-opacity hover:opacity-70";
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label}
        <span aria-hidden="true" className="text-background/50">
          ↗
        </span>
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      <div className="mx-auto max-w-[120rem] px-6 pb-6 pt-16 md:px-12 md:pt-20">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12">
          <div className="flex flex-col">
            <h2 className="m-0 mb-4 text-5xl font-bold leading-[0.9] tracking-[-0.04em] md:text-[56px]">
              The Vibe Co.
            </h2>
            <p className="m-0 mb-4 max-w-[280px] text-sm text-background/60">
              An AI native agency. Paris.
            </p>
            <a
              href="mailto:founders@thevibecompany.co"
              className="font-mono text-xs text-background underline underline-offset-4 hover:opacity-70"
            >
              founders@thevibecompany.co
            </a>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background/60">
              SITE
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {SITE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background/60">
              ELSEWHERE
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {ELSEWHERE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background/60">
              STATUS
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {STATUS_ITEMS.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 text-sm text-background/85"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-background"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-background/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-background/50">
          <span>© {buildYear} THE VIBE COMPANY</span>
          <span>YC W24 · MADE IN FRANCE</span>
          <span>BUILDING IN PUBLIC · SHIPPING DAILY</span>
        </div>
      </div>
    </footer>
  );
}
