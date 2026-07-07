import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TopNav } from "@/components/TopNav";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("agency");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: "/agency",
    },
  };
}

export default async function AgencyPage() {
  const t = await getTranslations("agency");
  return (
    <>
      <TopNav />
      <main className="min-h-[calc(100vh-64px)] bg-background text-foreground px-6 md:px-12 lg:px-24 py-12 md:py-20 flex items-center justify-center">
        <section className="w-full max-w-4xl">
          <h1 className="sr-only">The Vibe Company Agency</h1>
          <div className="mb-8 md:mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground text-center mb-5">
              {t("kicker")}
            </p>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <p className="text-center text-sm md:text-[1.25rem] tracking-tight text-foreground/90 leading-[1.35] max-w-3xl mx-auto">
            {t("body")}
            <br className="hidden md:block" />
            <span className="text-muted-foreground">{t("bodyIronic")}</span>
          </p>
        </section>
      </main>
    </>
  );
}
