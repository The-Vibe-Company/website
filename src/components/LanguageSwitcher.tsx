"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("accessibility");
  const [isPending, startTransition] = useTransition();

  const setLocale = (code: (typeof LOCALES)[number]["code"]) => {
    if (code === locale) return;
    // Non-urgent navigation: React keeps the current page on screen until the
    // other language is ready, then swaps it in one go — no unmount flash.
    // The middleware remembers the choice in a cookie for the root redirect.
    startTransition(() => {
      const query = searchParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { locale: code });
    });
  };

  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center gap-0.5 font-mono text-[11px] uppercase tracking-wider transition-opacity duration-200",
        isPending && "opacity-60",
        className
      )}
      aria-label={t("language")}
      aria-busy={isPending}
    >
      {LOCALES.map((l, i) => (
        <span key={l.code} className="inline-flex items-center">
          {i > 0 && <span className="mx-1 text-border" aria-hidden="true">/</span>}
          <button
            type="button"
            onClick={() => setLocale(l.code)}
            disabled={isPending}
            aria-label={t(l.code === "fr" ? "french" : "english")}
            aria-pressed={locale === l.code}
            className={cn(
              "cursor-pointer transition-colors disabled:cursor-default",
              locale === l.code
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
