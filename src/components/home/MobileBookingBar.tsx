"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";

/**
 * On phones, the booking call rides under the thumb once the hero has scrolled
 * away, and steps aside again when the closing call to action comes into view:
 * the page never shows two of them at once.
 */
export function MobileBookingBar() {
  const t = useTranslations("finalCta");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-mobile");
    const end = document.getElementById("contact");
    if (!hero || !end) return;

    let pastHero = false;
    let atEnd = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const above = entry.boundingClientRect.top < 0;
        if (entry.target === hero) pastHero = !entry.isIntersecting && above;
        else atEnd = entry.isIntersecting || above;
      }
      setShow(pastHero && !atEnd);
    });
    observer.observe(hero);
    observer.observe(end);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!show || undefined}
      inert={!show || undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-foreground bg-background/90 px-6 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:hidden",
        show ? "translate-y-0" : "translate-y-[110%]"
      )}
    >
      <a
        href={BOOKING_URL}
        onClick={() => captureEvent("discovery_call_clicked", { location: "mobile_bar" })}
        className="flex items-center justify-between bg-foreground px-[18px] py-[15px] text-[15px] font-semibold text-background"
      >
        <span>
          {t("bookCall")}
          <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-background/60">
            · {t("responseValue")}
          </span>
        </span>
        <span aria-hidden="true" className="text-lg leading-none">
          →
        </span>
      </a>
    </div>
  );
}
