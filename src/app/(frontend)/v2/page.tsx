import type { Metadata } from "next";
import { VibeRunner } from "@/components/home/runner/VibeRunner";
import { HomeSections } from "@/components/home/runner/HomeSections";

export const metadata: Metadata = {
  title: "We ship. We show. We vibe.",
  description:
    "An AI-native agency from the team behind Quivr. Most agencies wrote a landing page — we shipped a game.",
};

// Preview of the playable-runner homepage. Pinned light via the .vibe-home
// wrapper (see globals.css); grid overlay + Lenis are suppressed for /v2 in
// ConditionalGridOverlay / ClientProviders so it behaves like the homepage.
export default function V2Home() {
  return (
    <main className="vibe-home">
      <VibeRunner />
      <HomeSections />
    </main>
  );
}
