import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ToolsIndexPage, toolsMetadata } from "@/components/tools/ToolsIndexPage";

/** The free tools index. Same segment in both languages (/fr/tools, /en/tools). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return toolsMetadata(locale);
}

export default async function ToolsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToolsIndexPage locale={locale} />;
}
