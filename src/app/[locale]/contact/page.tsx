import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ContactPage, contactMetadata } from "@/components/contact/ContactPage";

/**
 * The contact page. Same segment in both languages (/fr/contact,
 * /en/contact), each canonical on its own URL and declaring the other.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return contactMetadata(locale);
}

export default async function ContactRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPage locale={locale} />;
}
