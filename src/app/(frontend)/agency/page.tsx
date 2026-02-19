import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Who Are We",
  description:
    "The Vibe Company is an AI-native agency helping startups ship products faster with AI development, prototyping, and rapid execution.",
  alternates: {
    canonical: "/agency",
  },
};

export default function AgencyPage() {
  return (
    <>
      <TopNav />
      <main className="min-h-[calc(100vh-64px)] bg-background text-foreground px-6 md:px-12 lg:px-24 py-12 md:py-20 flex items-center justify-center">
        <section className="w-full max-w-4xl">
          <div className="mb-8 md:mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground text-center mb-5">
              Agency
            </p>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <p className="text-center text-sm md:text-[1.25rem] tracking-tight text-foreground/90 leading-[1.35] max-w-3xl mx-auto">
            We are currently too busy shipping to write our own agency page.
            <br className="hidden md:block" />
            <span className="text-muted-foreground">Ironic? Absolutely.</span>
          </p>
        </section>
      </main>
    </>
  );
}
