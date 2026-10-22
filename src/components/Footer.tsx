"use client";

import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { PRIORITY_ARTICLES } from "@/lib/priority-articles";
import { ABOUT_PATHS, splitPath } from "@/lib/site";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}


const ELSEWHERE_LINKS: NavLink[] = [
  { label: "X", href: "https://x.com/thevibecompany", external: true },
  {
    label: "GitHub",
    href: "https://github.com/The-Vibe-Company",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/thevibeco",
    external: true,
  },
];

const buildYear = new Date().getUTCFullYear();

function FooterLink({ link }: { link: NavLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
        {/* A drawn icon rather than the ↗ glyph, which rendered thin, pale
            and off the baseline. */}
        <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
      </a>
    );
  }
  return <Link href={link.href}>{link.label}</Link>;
}

export function Footer({ showPriorityArticles = false }: { showPriorityArticles?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  // Same sections as the top nav, so both cover every key page. "Case studies"
  // reuses the nav label (no extra footer translation key).
  // "About" is the one page whose URL segment is translated (/en/about,
  // /fr/a-propos), so its href is picked per language.
  const siteLinks: NavLink[] = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: splitPath(ABOUT_PATHS, locale) },
    { label: t("portfolio"), href: "/portfolio" },
    { label: tNav("caseStudies"), href: "/case-studies" },
    { label: t("resources"), href: "/resources" },
    ...(showPriorityArticles
      ? PRIORITY_ARTICLES[locale === "fr" ? "fr" : "en"].map(({ key, slug }) => ({
          label: t(`priorityArticles.${key}`),
          href: `/resources/articles/${slug}`,
        }))
      : []),
  ];

  return (
    <footer className="footer lacquer" data-surface="inverse">
      {/* The mascot's black V, with a line of orange light along its edge. */}
      <svg
        className="vneck"
        viewBox="0 0 260 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="footer-vrim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff7a1f" stopOpacity="0" />
            <stop offset=".5" stopColor="#ffb46e" />
            <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 0 L130 78 L260 0" fill="none" stroke="url(#footer-vrim)" strokeWidth="2.4" />
      </svg>

      <div className="wrap">
        {/* On a phone the two link lists sit side by side under the wordmark:
            stacked, the footer alone ran past a full screen. */}
        <div className="foot-grid">
          <div className="foot-brand">
            <strong className="display">The Vibe Co.</strong>
            <p>{t("tagline")}</p>
            <a href="mailto:founders@thevibecompany.co">founders@thevibecompany.co</a>
          </div>

          <div className="foot-col">
            <h4>{t("siteHeading")}</h4>
            <ul>
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h4>{t("elsewhereHeading")}</h4>
            <ul>
              {ELSEWHERE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-base">
          <span>© {buildYear} THE VIBE COMPANY</span>
          <span>YC W24 · {t("madeInFrance")}</span>
          <span>{t("builtWithAi")}</span>
          <span>{t("openToProjects")}</span>
        </div>
      </div>
    </footer>
  );
}
