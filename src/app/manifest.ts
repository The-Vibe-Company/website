import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Served at /manifest.webmanifest. Icons only: `display: "browser"` keeps the
// site a plain website rather than an installable app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: "#fdfbf7",
    theme_color: "#fdfbf7",
    icons: [
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
