import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { AGENT_LINK_HEADER } from "./src/lib/agent-discovery";
import { INDEXNOW_KEY_PATH } from "./src/lib/indexnow";

const nextConfig: NextConfig = {
  env: {
    // Vercel's deployment environment ("production" | "preview" |
    // "development"), inlined for the client. PostHog only initializes when it
    // is "production"; it is empty locally and in CI.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "",
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // The stylesheet ships inside the HTML rather than as a separate
    // render-blocking request. On a phone-emulated load (Lighthouse), the
    // `<meta viewport>` makes Chrome fade the old page's overlay scrollbar
    // about 130ms later; if the new page has not committed its first frame by
    // then, those fade frames are drawn for a surface the browser no longer
    // shows, and the compositor stops sending frames to the page for up to a
    // second per round. The external stylesheet, sharing the connection with
    // the scripts, fonts and the mascot, regularly arrived after that point.
    inlineCss: true,
    optimizePackageImports: ['framer-motion'],
    // Page-to-page transitions use React's <ViewTransition> (PageTransition).
    viewTransition: true,
  },
  async redirects() {
    // "The Companion" was renamed Skillpack in Sep 2026. Links to the old
    // portfolio URL are out in the wild (articles, posts), so they land on the
    // new page for good. These run before the middleware, so the language the
    // visitor arrived with is kept; a prefix-less hit still gets its locale
    // chosen by the middleware on the second hop.
    return [
      {
        source: "/:locale(fr|en)/portfolio/the-companion",
        destination: "/:locale/portfolio/skillpack",
        permanent: true,
      },
      {
        source: "/portfolio/the-companion",
        destination: "/portfolio/skillpack",
        permanent: true,
      },
      // Quivr is presented as one of our projects. /quivr is the short URL
      // the quivr.com redirects and shared links point to.
      {
        source: "/:locale(fr|en)/quivr",
        destination: "/:locale/portfolio/quivr",
        permanent: true,
      },
      {
        source: "/quivr",
        destination: "/portfolio/quivr",
        permanent: true,
      },
      // /agency was removed; old URLs still 404 in Search Console.
      // The agency now lives on the home page, preserving the visitor's locale.
      {
        source: "/:locale(fr|en)/agency",
        destination: "/:locale",
        permanent: true,
      },
      // Replaces the 307 from the [type] page redirect; article slugs stay intact.
      {
        source: "/:locale(fr|en)/resources/articles",
        destination: "/:locale/resources",
        permanent: true,
      },
      // Bare legacy URLs are resolved by middleware in one localized 308.
      // These content types were removed; old URLs still 404 in Search Console.
      // Land on /resources directly to avoid the /resources/articles redirect.
      {
        source: "/:locale(fr|en)/resources/:type(tools|tutorials|concepts|focus)",
        destination: "/:locale/resources",
        permanent: true,
      },
      {
        source: "/:locale(fr|en)/resources/:type(tools|tutorials|concepts|focus)/:path*",
        destination: "/:locale/resources",
        permanent: true,
      },
      // /resources/learnings was removed; old URLs still 404 in Search Console.
      // They land on the /resources index directly.
      {
        source: "/:locale(fr|en)/resources/learnings",
        destination: "/:locale/resources",
        permanent: true,
      },
      {
        source: "/:locale(fr|en)/resources/learnings/:path*",
        destination: "/:locale/resources",
        permanent: true,
      },
      // The legal notice lives on the privacy page. Its conventional URLs
      // never had a page of their own, so they land there with a plain 301,
      // whichever language prefix they arrive with.
      {
        source: "/fr/mentions-legales",
        destination: "/fr/confidentialite",
        statusCode: 301,
      },
      {
        source: "/en/legal-notice",
        destination: "/en/privacy",
        statusCode: 301,
      },
      {
        source: "/en/mentions-legales",
        destination: "/en/privacy",
        statusCode: 301,
      },
      {
        source: "/fr/legal-notice",
        destination: "/fr/confidentialite",
        statusCode: 301,
      },
      // Without a prefix the slug's own language decides, in one hop: these
      // rules run before the middleware's locale redirect.
      {
        source: "/mentions-legales",
        destination: "/fr/confidentialite",
        statusCode: 301,
      },
      {
        source: "/legal-notice",
        destination: "/en/privacy",
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: INDEXNOW_KEY_PATH,
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/:path*",
        headers: [{ key: "Link", value: AGENT_LINK_HEADER }],
      },
      ...["/", "/:locale(fr|en)", "/:locale(fr|en)/resources/articles/:slug"].map((source) => ({
        source,
        headers: [{ key: "Vary", value: "Accept" }],
      })),
      {
        source: "/.well-known/agent-skills/:name/SKILL.md",
        headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }],
      },
      {
        source: "/auth.md",
        headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }],
      },
      {
        source: "/mcp/server-card",
        headers: [{ key: "Content-Type", value: "application/mcp-server-card+json" }],
      },
      {
        source: "/.well-known/ai-catalog.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        // Brand assets live here only so email signatures have a stable
        // absolute URL. They are reachable by link, never surfaced by the
        // site, and must stay out of search and image indexes. The path is
        // deliberately absent from robots.txt: a Disallow rule would publish
        // the directory name to anyone reading it.
        source: "/brand/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, noimageindex, nofollow" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
