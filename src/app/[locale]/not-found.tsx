import Image from "next/image";
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
      {/* The homepage's ink and its mascot, standing in its orange light,
          a little lost. */}
      <main id="main-content" tabIndex={-1} className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(242 115 19 / 0.22), rgb(242 115 19 / 0.07) 55%, transparent)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 px-6 py-20 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:px-16 lg:py-28">
          <div>
            <span className="text-lit block text-[clamp(6rem,16vw,13rem)] font-bold leading-[0.85] tracking-[-0.06em]">
              404
            </span>
            <h1 className="m-0 mt-8 text-[clamp(2.5rem,5.6vw,5.25rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground">
              {t.title}
            </h1>
            <p className="m-0 mt-6 max-w-md text-[17px] leading-[1.6] text-muted-foreground">{t.body}</p>
            <Link
              href="/"
              className="group mt-10 inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-foreground px-6 text-[15px] font-medium text-background shadow-[0_18px_60px_-18px_rgba(242,115,19,0.6)] transition-colors hover:bg-soft-foreground"
            >
              {t.cta}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          <Image
            src="/images/home/mascot-cutout.webp"
            alt=""
            aria-hidden="true"
            width={488}
            height={672}
            sizes="(min-width: 1024px) 26rem, 60vw"
            className="mx-auto h-auto w-[min(60vw,22rem)] lg:w-full"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
