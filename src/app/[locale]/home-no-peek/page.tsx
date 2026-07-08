import type { Metadata } from "next";
import { HomeLaunchpad } from "@/components/HomeLaunchpad";

// Test variant: same infinite manual loop as /home-peek, but the cards sit
// flush (no overflow) — the version Victor prefers. Not indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HomeNoPeekPage() {
  return <HomeLaunchpad caseStudyVariant="loop" />;
}
