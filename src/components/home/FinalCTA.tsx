"use client";

import { useTranslations } from "next-intl";
import { Arrow, Groove, Kicker } from "@/components/kit";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";

/**
 * The closing call of every page: a clay slab with the orange rim light but no
 * warm bounce (that is the page's one main piece's alone, the hero, the cover),
 * the title in two lines (the second in grey clay), then the booking action, named
 * like the hero's and the header's (`finalCta.bookCall`), and the two facts
 * that make it safe to click (reply time, e-mail).
 *
 * It is plain markup: nothing waits for a scroll-in animation, so a full-page
 * capture, a fast scroll or a reduced-motion setting always finds it whole.
 * It sits on the same `.wrap` as the header and the page content, so the
 * `rail` prop that used to pick between two widths is kept for callers but no
 * longer changes anything.
 */
export function FinalCTA({ rail }: { rail?: "wide" | "narrow" } = {}) {
  void rail;
  const t = useTranslations("finalCta");

  return (
    <section id="contact" className="section">
      <div className="wrap">
        <div className="final-slab clay rim">
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="display d-lg">
            {t("titleLine1")}
            <br />
            <span className="bisque">{t("titleLine2")}</span>
          </h2>
          <Groove />
          <div className="final-row">
            <a
              href={BOOKING_URL}
              {...bookingLocation("cta_final")}
              onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
              className="btn btn-lg btn-lacquer"
            >
              {t("bookCall")}
              <Arrow />
            </a>

            <dl className="facts">
              <dt>{t("responseLabel")}</dt>
              <dd>{t("responseValue")}</dd>
              <dt>{t("emailLabel")}</dt>
              <dd>
                <a
                  href="mailto:founders@thevibecompany.co"
                  onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                >
                  founders@thevibecompany.co
                </a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
