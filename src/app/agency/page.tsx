import type { Metadata } from "next";
import { typography, cn } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "Agency",
  description:
    "AI-native products, from zero to production. No fluff, no decks, just working software.",
};

export default function AgencyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className={cn(typography.label.mono, "text-muted-foreground mb-4")}>
        AGENCY
      </p>
      <h1 className={cn(typography.heading.h2, "text-center mb-6")}>
        Coming soon.
      </h1>
      <p className={cn(typography.body.default, "text-muted-foreground text-center max-w-lg")}>
        We&apos;re too busy shipping products to finish this page. Ironic, right?
      </p>
      <a
        href="/"
        className="mt-12 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; BACK HOME
      </a>
    </main>
  );
}
