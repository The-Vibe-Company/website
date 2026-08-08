import { permanentRedirect } from "@/i18n/navigation";

export default async function WeBuildItRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect({ href: "/portfolio", locale });
}
