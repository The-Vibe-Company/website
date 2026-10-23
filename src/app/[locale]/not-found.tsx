import { getLocale } from "next-intl/server";
import { ButtonLink, Kicker } from "@/components/kit";
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
      <main id="main-content" tabIndex={-1} className="flex-1 pt-4 md:pt-6">
        <div className="wrap">
          {/* The page's one main piece: clay with the rim light. */}
          <section className="clay rim rim-warm rounded-slab px-6 py-14 md:px-14 md:py-24">
            <Kicker>404</Kicker>
            <h1 className="display d-lg m-0 mt-6 max-w-[14ch]">{t.title}</h1>
            <p className="lede mt-6">{t.body}</p>
            <ButtonLink href="/" variant="lacquer" size="lg" arrow className="mt-10">
              {t.cta}
            </ButtonLink>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
