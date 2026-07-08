import { permanentRedirect } from "next/navigation";

export default async function WeBuildItRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/portfolio`);
}
