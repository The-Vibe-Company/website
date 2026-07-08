import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

// Strings kept inline (not in messages/) so this page doesn't collide with the
// translation work happening in parallel. Two short strings per language.
const COPY = {
  fr: {
    title: "Page introuvable.",
    body: "La page que vous cherchez n'existe pas ou a été déplacée.",
    cta: "Retour à l'accueil",
  },
  en: {
    title: "Page not found.",
    body: "The page you are looking for doesn't exist or has moved.",
    cta: "Back home",
  },
} as const;

export default async function NotFound() {
  const locale = (await getLocale()) === "fr" ? "fr" : "en";
  const t = COPY[locale];

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main className="flex flex-1 items-center justify-center px-6 py-24 md:px-12">
        <div className="w-full max-w-lg text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-orange-500">
            404
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t.body}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 border-2 border-foreground bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
          >
            {t.cta}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
