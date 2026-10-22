"use client";

import { useTranslations } from "next-intl";
import { Arrow } from "@/components/kit";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { cn } from "@/lib/design-system";
import { captureEvent } from "@/lib/posthog";

interface ContactMenuProps {
  /** Reported as `location` by the analytics events fired from the control. */
  location: "nav" | "mobile_menu";
  /** "bar" sits in the header pill; "stack" is the centred pair of the phone sheet. */
  variant?: "bar" | "stack";
  className?: string;
  /** Called after a choice is made, e.g. to close the mobile sheet. */
  onSelect?: () => void;
}

/**
 * The header's contact action. It used to be a menu button called "Nous
 * contacter" that opened "Prendre rendez-vous"; the same action is now named
 * one way everywhere (`nav.bookCall`, like the hero and the closing call) and
 * is the button itself. The e-mail address stays one tap away, as a labelled
 * icon button beside it.
 *
 * The cal.com link is tracked as `booking_link_clicked` by BookingLinkTracker,
 * the e-mail link as `contact_email_clicked`.
 */
export function ContactMenu({
  location,
  variant = "bar",
  className,
  onSelect,
}: ContactMenuProps) {
  const t = useTranslations("nav");
  const stacked = variant === "stack";

  const book = (
    <a
      href={BOOKING_URL}
      {...bookingLocation(location === "nav" ? "header_contact_menu" : "header_mobile_menu")}
      onClick={() => {
        captureEvent("discovery_call_clicked", { location });
        onSelect?.();
      }}
      className={cn("btn btn-lacquer", stacked ? "btn-lg" : "btn-sm")}
    >
      {t("bookCall")}
      <Arrow />
    </a>
  );

  const onMail = () => {
    captureEvent("contact_email_clicked", { location });
    onSelect?.();
  };

  if (stacked) {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {book}
        <a href={`mailto:${CONTACT_EMAIL}`} onClick={onMail} className="link-rim">
          <span className="t">{t("contactEmail")}</span>
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        onClick={onMail}
        aria-label={t("contactEmail")}
        title={t("contactEmail")}
        className="round round-sm well"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </a>
      {book}
    </div>
  );
}
