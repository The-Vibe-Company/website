import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { CLIENTS } from "@/components/home/Clients";
import { FinalCTA } from "@/components/home/FinalCTA";
import {
  Arrow,
  Chip,
  Groove,
  Kicker,
  LinkRim,
  Piece,
  SectionTitle,
} from "@/components/kit";
import {
  ABOUT_EDGE_KEYS,
  ABOUT_FACT_KEYS,
  ABOUT_FAQ_KEYS,
  ABOUT_ORIGIN_ARTICLE_PATH,
  ABOUT_PROCESS_STEPS,
  ABOUT_SERVICE_KEYS,
  ABOUT_SOCIALS,
  ABOUT_TEAM,
  QUIVR_REPO_URL,
} from "@/lib/about";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import {
  ABOUT_PATHS,
  localizedSocialMetadata,
  SITE_URL,
  splitPath,
  splitPathAlternates,
} from "@/lib/site";
import { AboutBookingCta } from "./AboutBookingCta";

/**
 * The About page, served at /fr/a-propos and /en/about. Both routes render
 * this component; each declares the other through hreflang.
 *
 * Every number on the page is sourced from work already published on the site
 * (case studies, homepage) or confirmed by the founders — see src/lib/about.ts.
 */

export async function aboutMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(ABOUT_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title,
    // and "… (YC W24) | The Vibe Company" would say it twice.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, ABOUT_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const CONTACT_LINK =
  "inline-flex min-h-11 items-center underline decoration-white/50 decoration-[1.5px] underline-offset-[5px] transition-colors [overflow-wrap:anywhere] hover:decoration-rim-hot";
const FACT_LINK =
  "inline-flex min-h-10 min-w-8 items-center justify-center underline decoration-black/55 decoration-[1.5px] underline-offset-[5px] transition-colors hover:decoration-rim hover:decoration-[3px]";

const BRAND = "The Vibe Company";

/**
 * A section title in the porcelaine two lines: the first in ink, the second
 * in grey clay. The messages hold one string, so the break goes before the
 * brand name when the title carries it, else at the word boundary closest to
 * the middle. A short title stays on one line.
 */
function splitTitle(title: string): [string, string | null] {
  const at = title.indexOf(BRAND);
  if (at > 0) return [title.slice(0, at).trim(), title.slice(at)];
  const words = title.split(" ");
  if (words.length < 2 || title.length <= 9) return [title, null];
  let best = 1;
  let bestGap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const gap = Math.abs(words.slice(0, i).join(" ").length - title.length / 2);
    if (gap < bestGap) {
      best = i;
      bestGap = gap;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/** One h2 for every section: the same size, so the h1 alone leads. */
function Title({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children?: ReactNode;
}) {
  const [line1, line2] = splitTitle(title);
  return (
    <SectionTitle
      line1={line1}
      line2={line2 ?? undefined}
      size="sm"
      className={cn("max-md:[&_h2]:text-[2.25rem]", className)}
    >
      {children}
    </SectionTitle>
  );
}

/**
 * All the multi-column parts of the page (the three services, the ledger,
 * the questions, the steps, the facts) split the wrap in thirds, and their
 * text starts 36 px inside the second third: one column line, x = 484 at 1280.
 */
const SIDE = "lg:pr-9";
const BODY = "lg:col-span-2 lg:pl-9";

/** The engraved divider between the three services: vertical from lg, else flat. */
const GROOVE_FLAT =
  "max-lg:before:inset-x-6 max-lg:before:top-0 max-lg:before:h-[2px] max-lg:before:bg-[linear-gradient(180deg,rgba(11,11,12,.1)_0_1px,rgba(255,255,255,.95)_1px_2px)]";
const GROOVE_UPRIGHT =
  "lg:before:inset-y-8 lg:before:left-0 lg:before:w-[2px] lg:before:bg-[linear-gradient(90deg,rgba(11,11,12,.1)_0_1px,rgba(255,255,255,.95)_1px_2px)]";
const GROOVE_DIVIDER = `before:pointer-events-none before:absolute before:content-[''] ${GROOVE_FLAT} ${GROOVE_UPRIGHT}`;

/** Logo heights (px, at 1280) tuned so seven logos read at one optical size on one shelf. */
const LOGO_HEIGHTS: Record<string, number> = {
  "Agence France-Presse": 34,
  "Coup de Pates": 38,
  Monka: 46,
  Trusk: 26,
  LocService: 28,
  Zapa: 24,
  Theodo: 26,
};

/** The kit's kicker clips its span (ellipsis), and with it the accent of "À" and "É": give the span room. */
const KICKER_ROOM = "[&>span]:-my-1 [&>span]:py-1";

const TEXT = "m-0 max-w-[56ch] text-base leading-[1.62] text-ink-2";

/** A rim link that leaves the site: the mono label, the underline, the ↗ arrow. */
function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("link-rim", className)}
    >
      <span className="t">{children}</span>
      <Arrow direction="up-right" />
    </a>
  );
}

/** The clay bead of the hero: a glazed sphere with the mascot's black pattern. */
function Bead({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 360"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="ab-bd" gradientUnits="userSpaceOnUse" cx="129" cy="101" r="232">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".42" stopColor="#f8f8f6" />
          <stop offset=".8" stopColor="#e2e2de" />
          <stop offset="1" stopColor="#cdcdc8" />
        </radialGradient>
        <linearGradient id="ab-lacv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#202022" />
          <stop offset=".6" stopColor="#0a0a0b" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id="ab-spec">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ab-cs">
          <stop offset="0" stopColor="#141416" stopOpacity=".26" />
          <stop offset="1" stopColor="#141416" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ab-rimg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a1f" stopOpacity="0" />
          <stop offset=".3" stopColor="#ff7a1f" />
          <stop offset=".62" stopColor="#ffb46e" />
          <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ab-bclip">
          <circle cx="170" cy="165" r="145" />
        </clipPath>
        <filter id="ab-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="184" cy="326" rx="122" ry="14" fill="url(#ab-cs)" />
      <circle cx="170" cy="165" r="145" fill="url(#ab-bd)" />
      <g clipPath="url(#ab-bclip)">
        <path
          fill="url(#ab-lacv)"
          d="M-10 -10 H350 V40 L320 42 Q312 38 306 36 Q302 72 286 98 Q274 80 260 70 Q252 106 232 132 Q216 108 200 96 Q192 132 170 158 Q148 132 140 96 Q124 108 108 132 Q88 106 80 70 Q66 80 54 98 Q38 72 34 36 Q28 38 20 42 L-10 40 Z"
        />
        <g fill="none" stroke="url(#ab-bd)" strokeWidth="7" strokeLinecap="round">
          <path d="M190 -4 Q196 50 200 96" />
          <path d="M150 -4 Q144 50 140 96" />
          <path d="M212 -4 Q248 30 260 70" />
          <path d="M128 -4 Q92 30 80 70" />
          <path d="M236 -6 Q292 8 306 36" />
          <path d="M104 -6 Q48 8 34 36" />
        </g>
      </g>
      <g clipPath="url(#ab-bclip)">
        <ellipse cx="116" cy="74" rx="58" ry="26" transform="rotate(-28 116 74)" fill="url(#ab-spec)" opacity=".55" />
        <ellipse cx="108" cy="66" rx="15" ry="7" transform="rotate(-28 108 66)" fill="#fff" opacity=".75" />
      </g>
      <path
        d="M242 40.3 A144 144 0 0 1 98 289.7"
        fill="none"
        stroke="url(#ab-rimg)"
        strokeWidth="7"
        opacity=".45"
        filter="url(#ab-soft)"
      />
      <path
        d="M242 40.3 A144 144 0 0 1 98 289.7"
        fill="none"
        stroke="url(#ab-rimg)"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export async function AboutPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "about" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tProcess = await getTranslations({ locale, namespace: "process" });
  const [h1Line1, h1Line2] = splitTitle(t("title"));

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — The one main piece: the H1, the value sentence, the call. */}
        <section className="pt-5 md:pt-6">
          <div className="wrap">
            <Piece
              tone="main"
              radius="xl"
              className="relative overflow-hidden px-5 pb-6 pt-7 max-md:rounded-[28px] md:px-14 md:pb-11 md:pt-14 [--rim-angle:118deg]"
            >
              <Bead className="pointer-events-none absolute right-3.5 top-3.5 h-[110px] w-[104px] md:right-16 md:top-8 md:h-[265px] md:w-[250px]" />
              <Kicker className={KICKER_ROOM}>{t("kicker")}</Kicker>
              <h1 className="display d-lg mt-[4.75rem] md:mt-8">
                {h1Line1}
                {h1Line2 ? (
                  <>
                    <br />
                    <span className="bisque">{h1Line2}</span>
                  </>
                ) : null}
              </h1>
              <p className="lede mt-5 md:mt-7">
                {t("lede", { audience: t("audience") })}
              </p>

              <Groove className="mt-8 md:mt-11" />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-10 gap-y-6 md:mt-7">
                <AboutBookingCta />

                {/* The same two backers as the homepage hero. */}
                <div className="flex flex-wrap items-center gap-3 max-md:w-full">
                  <span className="mr-1.5 whitespace-nowrap font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground max-md:basis-full">
                    {t("backedBy")}
                  </span>
                  <a
                    href="https://www.ycombinator.com/companies/quivr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="well inline-flex h-14 items-center rounded-[16px] px-[18px] transition-opacity hover:opacity-70"
                  >
                    <Image
                      src="/images/partners/y-combinator.svg"
                      alt="Y Combinator W24"
                      width={154}
                      height={38}
                      className="h-7 w-auto"
                    />
                  </a>
                  <span className="well inline-flex h-14 items-center rounded-[16px] px-2.5">
                    <Image
                      src="/images/partners/france-2030.svg"
                      alt="France 2030"
                      width={52}
                      height={52}
                      className="h-11 w-auto"
                    />
                  </span>
                </div>
              </div>
            </Piece>
          </div>
        </section>

        {/* 2 — What the company does: the three homepage services, one piece. */}
        <section className="section">
          <div className="wrap">
            <Title title={t("services.title")}>
              <p className="m-0">{t("services.intro")}</p>
            </Title>

            <Piece
              tone="quiet"
              radius="xl"
              className="mt-10 grid max-md:rounded-[28px] md:mt-12 lg:grid-cols-3"
            >
              {ABOUT_SERVICE_KEYS.map((key, i) => (
                <article
                  key={key}
                  className={cn(
                    "relative px-6 py-7 md:px-9 md:py-10",
                    i > 0 && GROOVE_DIVIDER,
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <Chip>{tServices(`items.${key}.tag`)}</Chip>
                  </div>
                  <h3 className="display d-xs m-0 mt-7 md:mt-8">
                    {tServices(`items.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-4 max-w-[56ch] text-[15.5px] leading-[1.6] text-muted-foreground">
                    {t(`services.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </Piece>
          </div>
        </section>

        {/* 3 — What sets us apart: a ledger on the backdrop, each claim
            carrying a figure we can source. */}
        <section className="section">
          <div className="wrap">
            <Title title={t("edge.title")}>
              <p className="m-0">{t("edge.intro")}</p>
            </Title>

            <div className="mt-10 md:mt-12">
              <Groove />
              <div className="rows">
                {ABOUT_EDGE_KEYS.map((key) => (
                  <article
                    key={key}
                    className="grid gap-5 py-9 lg:grid-cols-3 lg:gap-0 lg:py-11"
                  >
                    <div className={SIDE}>
                      <p className="display m-0 text-[clamp(2.25rem,1.5rem+2vw,3rem)] [overflow-wrap:anywhere]">
                        {t(`edge.items.${key}.figure`)}
                      </p>
                      <p className="m-0 mt-3 max-w-[30ch] text-[15px] leading-[1.45] text-muted-foreground">
                        {t(`edge.items.${key}.figureLabel`)}
                      </p>
                    </div>
                    <div className={BODY}>
                      <h3 className="display m-0 max-w-[30ch] text-[1.375rem] font-semibold leading-[1.12] md:text-[1.625rem]">
                        {t(`edge.items.${key}.title`)}
                      </h3>
                      <p className={cn(TEXT, "mt-3.5")}>
                        {t(`edge.items.${key}.desc`)}
                      </p>
                      {key === "openSource" ? (
                        <ExternalLink
                          href={QUIVR_REPO_URL}
                          className="mt-2 whitespace-normal normal-case tracking-[0.02em] [overflow-wrap:anywhere]"
                        >
                          github.com/The-Vibe-Company/quivr
                        </ExternalLink>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
              <Groove />
            </div>
          </div>
        </section>

        {/* 4 — Who works with us: the homepage logos on one shelf. */}
        <section className="section">
          <div className="wrap">
            <Title title={t("clients.title")}>
              <p className="m-0">{t("clients.intro")}</p>
            </Title>

            <Piece
              as="ul"
              tone="quiet"
              radius="xl"
              className="m-0 mt-10 flex list-none flex-wrap items-center justify-center gap-x-5 gap-y-1 md:gap-x-6 px-5 py-3 max-md:rounded-[28px] md:mt-12 md:px-9 lg:justify-between"
            >
              {CLIENTS.map((client) => (
                <li key={client.name} className="flex">
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-14 items-center px-1 transition-opacity duration-200 hover:opacity-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.src}
                      alt={t("clients.logoAlt", { name: client.name })}
                      style={{ "--h": LOGO_HEIGHTS[client.name] ?? 28 } as CSSProperties}
                      className="h-[calc(var(--h)*.78*1px)] w-auto object-contain brightness-0 md:h-[calc(var(--h)*.86*1px)] xl:h-[calc(var(--h)*1px)]"
                      loading="eager"
                      decoding="async"
                    />
                  </a>
                </li>
              ))}
            </Piece>

            <div className="mt-5">
              <LinkRim href="/case-studies">{t("clients.seeCaseStudies")}</LinkRim>
            </div>
          </div>
        </section>

        {/* 5 — The team, and where the company comes from. */}
        <section className="section">
          <div className="wrap">
            <Title title={t("team.title")}>
              <p className="m-0">{t("team.intro")}</p>
            </Title>
            <LinkRim
              href={ABOUT_ORIGIN_ARTICLE_PATH}
              className="mt-3 items-start whitespace-normal py-3 [&_.t]:box-decoration-clone [&_.t]:leading-normal"
            >
              {t("team.originLink")}
            </LinkRim>

            <div className="mt-8 grid gap-5 md:mt-10 lg:grid-cols-2 lg:gap-6">
              {ABOUT_TEAM.map((member) => (
                <Piece
                  key={member.key}
                  as="article"
                  tone="quiet"
                  radius="xl"
                  className="flex flex-col p-6 max-md:rounded-[28px] md:p-10"
                >
                  <p className={cn("kicker", KICKER_ROOM)}>
                    <span className="dot" />
                    <span>{t("team.role")}</span>
                  </p>
                  <h3 className="display m-0 mt-6 text-[clamp(2rem,1.4rem+1.6vw,2.75rem)]">
                    {member.name}
                  </h3>
                  <p className="m-0 mt-4 max-w-[54ch] text-[17px] leading-[1.6] text-ink-2">
                    {t(`team.members.${member.key}.bio`)}
                  </p>
                  <div className="mt-auto pt-8">
                    <Groove />
                    <ExternalLink href={member.linkedin} className="mt-1">
                      {t("team.linkedin")}
                    </ExternalLink>
                  </div>
                </Piece>
              ))}
            </div>
          </div>
        </section>

        {/* 6 — How working together goes: the page's one black lacquer band. */}
        <section className="section">
          <div className="wrap">
            <Piece
              tone="lacquer"
              radius="xl"
              className="grid gap-y-10 px-6 py-10 max-md:rounded-[28px] md:px-10 md:py-14 lg:grid-cols-3 lg:gap-y-0 lg:px-0 [--rim-angle:140deg]"
            >
              <div className="lg:col-start-1 lg:row-start-1 lg:pl-14 lg:pr-9">
                <Title
                  title={t("how.title")}
                  className="[&_.bisque]:text-[#a1a29f] [&_.lede]:text-[#c2c3c2]"
                >
                  <p className="m-0">{t("how.intro")}</p>
                </Title>
              </div>

              <div className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pl-9 lg:pr-14">
                <Kicker className={KICKER_ROOM}>{t("how.stepsLabel")}</Kicker>
                <ol className="m-0 mt-5 list-none p-0">
                  {ABOUT_PROCESS_STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="grid gap-4 border-t border-white/15 py-7 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-7 md:py-8"
                    >
                      <div className="flex items-baseline gap-4 sm:block">
                        <span className="display block text-[2.75rem] leading-[0.9] text-on-lacquer md:text-[4rem]">
                          {step.n}
                        </span>
                        <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-rim-hot sm:mt-3">
                          {tProcess(`steps.${step.key}.label`)}
                        </span>
                      </div>
                      <div>
                        <h3 className="display m-0 max-w-[24ch] text-[1.4375rem] font-semibold leading-[1.15] text-on-lacquer md:text-[1.625rem]">
                          {tProcess(`steps.${step.key}.title`)}
                        </h3>
                        <p className="m-0 mt-3 max-w-[54ch] text-base leading-[1.6] text-[#c2c3c2]">
                          {tProcess(`steps.${step.key}.desc`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-start-1 lg:row-start-2 lg:self-end lg:pl-14 lg:pr-9">
                <div className="border-t border-white/15 pt-7 lg:mt-12">
                  <Kicker className={KICKER_ROOM}>{t("how.contactTitle")}</Kicker>
                  <dl className="m-0 mt-5 grid gap-4">
                    <div>
                      <dt className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-on-lacquer-muted">
                        {t("how.contactCall")}
                      </dt>
                      <dd className="m-0 mt-1 text-[17px] text-on-lacquer">
                        <a
                          href={BOOKING_URL}
                          {...bookingLocation("about_contact")}
                          className={CONTACT_LINK}
                        >
                          cal.com/stangirard/thevibecompany
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-on-lacquer-muted">
                        {t("how.contactEmail")}
                      </dt>
                      <dd className="m-0 mt-1 text-[17px] text-on-lacquer">
                        <a
                          href="mailto:founders@thevibecompany.co"
                          className={CONTACT_LINK}
                        >
                          founders@thevibecompany.co
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-on-lacquer-muted">
                        {t("how.contactResponse")}
                      </dt>
                      <dd className="m-0 mt-1 text-[17px] text-on-lacquer">
                        {t("response")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Piece>
          </div>
        </section>

        {/* 7 — Key facts, as a crawlable table pressed into the surface. */}
        <section className="section">
          <div className="wrap">
            <Title title={t("facts.title")} />

            <Piece
              tone="well"
              radius="lg"
              className="mt-10 px-5 pb-3 pt-1 max-md:rounded-[22px] md:mt-12 md:px-9"
            >
              {/* `table-fixed`: an auto-layout table refuses to shrink below
                  its widest unbreakable word (the site URL) on a phone. On a
                  phone each row stacks, label over value. */}
              <table className="w-full border-collapse text-left max-md:block md:table-fixed">
                <caption className="sr-only">{t("facts.caption")}</caption>
                <thead className="max-md:sr-only">
                  <tr>
                    <th
                      scope="col"
                      className="py-5 pr-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground md:w-[38%] lg:w-[35.5%]"
                    >
                      {t("facts.columnFact")}
                    </th>
                    <th
                      scope="col"
                      className="py-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {t("facts.columnValue")}
                    </th>
                  </tr>
                </thead>
                <tbody className="max-md:block">
                  {ABOUT_FACT_KEYS.map((key) => (
                    <tr
                      key={key}
                      className="border-t border-black/10 max-md:block max-md:py-4 first:max-md:border-t-0"
                    >
                      <th
                        scope="row"
                        className="py-2 pr-6 align-middle font-mono text-xs font-medium uppercase leading-[1.4] tracking-[0.1em] text-muted-foreground max-md:block max-md:pb-1 max-md:pt-0"
                      >
                        {t(`facts.rows.${key}`)}
                      </th>
                      <td className="py-2 align-middle text-base leading-[1.45] text-foreground [overflow-wrap:anywhere] max-md:block max-md:py-0 md:text-[17px]">
                        {key === "founders" ? (
                          <span className="flex flex-wrap items-center gap-x-1.5">
                            {ABOUT_TEAM.map((member, i) => (
                              <span key={member.key} className="inline-flex items-center">
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={FACT_LINK}>
                                  {member.name}
                                </a>
                                {i < ABOUT_TEAM.length - 1 ? "," : null}
                              </span>
                            ))}
                          </span>
                        ) : key === "site" ? (
                          <a href={SITE_URL} className={FACT_LINK}>
                            {SITE_URL}
                          </a>
                        ) : key === "networks" ? (
                          <span className="flex flex-wrap items-center gap-x-3">
                            {ABOUT_SOCIALS.map((social) => (
                              <a
                                key={social.label}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={FACT_LINK}
                              >
                                {social.label}
                              </a>
                            ))}
                          </span>
                        ) : (
                          t(`facts.values.${key}`)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Piece>
          </div>
        </section>

        {/* 8 — Frequently asked questions, plain HTML, no JSON-LD. */}
        <section className="section">
          <div className="wrap">
            <Title title={t("faq.title")} />

            <div className="mt-10 md:mt-12">
              <Groove />
              <div className="rows">
                {ABOUT_FAQ_KEYS.map((key) => (
                  <article
                    key={key}
                    className="grid gap-3 py-8 lg:grid-cols-3 lg:gap-0 lg:py-9"
                  >
                    <h3 className={cn("display m-0 text-[1.25rem] font-semibold leading-[1.18] md:text-[1.5rem]", SIDE)}>
                      {t(`faq.items.${key}.q`)}
                    </h3>
                    <div className={BODY}>
                      <p className={TEXT}>{t(`faq.items.${key}.a`)}</p>
                    </div>
                  </article>
                ))}
              </div>
              <Groove />
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
