import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeLaunchpad } from "@/components/HomeLaunchpad";
import { localizedAlternates, localizedSocialMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("homeTitle");
  const description = t("description");

  return {
    title: { absolute: title },
    description,
    alternates: localizedAlternates(locale),
    ...localizedSocialMetadata({
      locale,
      title,
      description,
    }),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeLaunchpad locale={locale === "fr" ? "fr" : "en"} />;
}
