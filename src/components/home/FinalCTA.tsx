import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { BrandSquare } from "@/components/BrandSquare";
import { CaptureLink } from "@/components/CaptureLink";
import { ScrollScale } from "./ScrollScale";

/**
 * The closing scene every page ends on: the mascot at the start of the road,
 * map in hand, pointing at where it leads (the cover of the article on
 * funding an AI project). It stands on the left, so the copy and the call to
 * action sit over the landscape on the right.
 *
 * A server component: the copy is read on the server (so a landing's own
 * namespace never travels to the client), and only the scroll-linked scale
 * of the landscape and the two tracked links are hydrated.
 */
const SCENE = {
  src: "/images/resources/financer-projet-ia-cir-cii-france-2030/cover-mascotte-v3.webp",
  /** object-position, so a narrow screen keeps the mascot in frame. */
  focus: "28% 55%",
};

export function FinalCTA({
  rail = "wide",
  namespace = "finalCta",
}: {
  /** The page's own content width, so the copy lines up with it. */
  rail?: "wide" | "narrow";
  /** A landing can bring its own closing line; same keys as `finalCta`. */
  namespace?: string;
}) {
  const t = useTranslations(namespace);

  return (
    <section id="contact" className="relative min-h-[92svh] overflow-hidden bg-background">
      <ScrollScale from={1.18} to={1.02} still={1.04} className="absolute inset-0 origin-[60%_60%]">
        <Image src={SCENE.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: SCENE.focus }} />
      </ScrollScale>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(180deg, rgb(12 12 13 / 0.45) 0%, rgb(12 12 13 / 0) 18%)",
            "linear-gradient(0deg, rgb(12 12 13 / 0.96) 0%, rgb(12 12 13 / 0.55) 30%, rgb(12 12 13 / 0) 58%)",
            "linear-gradient(270deg, rgb(12 12 13 / 0.9) 0%, rgb(12 12 13 / 0.35) 40%, rgb(12 12 13 / 0) 62%)",
          ].join(", "),
        }}
      />
      <div
        className={`relative mx-auto flex min-h-[92svh] flex-col justify-end px-6 pb-16 md:px-10 lg:items-end lg:px-16 lg:pb-20 lg:text-right ${
          rail === "narrow" ? "max-w-[80rem]" : "max-w-[90rem]"
        }`}
      >
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground">
          <BrandSquare />
          {t("kicker")}
        </span>
        <h2 className="m-0 mt-6 text-[clamp(3.25rem,7.4vw,7.5rem)] font-bold leading-[0.88] tracking-[-0.05em] text-foreground drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 lg:flex-row-reverse">
          <CaptureLink
            href={BOOKING_URL}
            {...bookingLocation("cta_final")}
            event="contact_cta_clicked"
            properties={{ location: "final_cta" }}
            className="group inline-flex h-[60px] items-center gap-3 rounded-[2px] bg-foreground px-7 text-[17px] font-medium text-background shadow-[0_18px_70px_-14px_rgba(242,115,19,0.75)] transition-colors hover:bg-soft-foreground"
          >
            {t("bookCall")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </CaptureLink>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.2em]">
            <dt className="text-muted-foreground">{t("responseLabel")}</dt>
            <dd className="m-0 text-foreground">{t("responseValue")}</dd>
            <dt className="text-muted-foreground">{t("emailLabel")}</dt>
            <dd className="m-0">
              <CaptureLink
                href={`mailto:${CONTACT_EMAIL}`}
                event="get_in_touch_clicked"
                properties={{ location: "final_cta" }}
                className="normal-case tracking-[0.05em] text-foreground underline decoration-1 underline-offset-4 hover:text-brand"
              >
                {CONTACT_EMAIL}
              </CaptureLink>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
