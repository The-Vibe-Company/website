import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    optimizePackageImports: ['framer-motion'],
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
