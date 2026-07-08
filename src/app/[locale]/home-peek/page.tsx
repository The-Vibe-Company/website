import type { Metadata } from "next";
import { HomeLaunchpad } from "@/components/HomeLaunchpad";

// Test-only variant of the homepage: the case-study carousel lets the next
// card peek to tease more. Not indexed; the canonical homepage stays at "/".
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HomePeekPage() {
  return <HomeLaunchpad caseStudyVariant="peek" />;
}
