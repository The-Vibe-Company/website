"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/design-system";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

function writeLocaleCookie(code: string) {
  document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();

  const setLocale = (code: string) => {
    if (code === locale) return;
    writeLocaleCookie(code);
    router.refresh();
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 font-mono text-[11px] uppercase tracking-wider",
        className
      )}
      aria-label="Language"
    >
      {LOCALES.map((l, i) => (
        <span key={l.code} className="inline-flex items-center">
          {i > 0 && <span className="mx-1 text-border" aria-hidden="true">/</span>}
          <button
            type="button"
            onClick={() => setLocale(l.code)}
            aria-current={locale === l.code}
            className={cn(
              "cursor-pointer transition-colors",
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
