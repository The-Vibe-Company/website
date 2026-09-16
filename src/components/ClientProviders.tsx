"use client";

import dynamic from "next/dynamic";
import { usePathname } from "@/i18n/navigation";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ENSEMBLE_PATH } from "@/lib/coup-de-pates-ensemble";

const SmoothScroller = dynamic(
  () => import("@/components/SmoothScroller").then((m) => m.SmoothScroller),
  { ssr: false }
);

export function ClientProviders() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isPreviewHome = pathname === "/v2";
  const isResources = pathname.startsWith("/resources");
  const isPortfolio = pathname.startsWith("/portfolio");
  const isClientPage = pathname === ENSEMBLE_PATH;

  return (
    <PostHogProvider>
      {!isHomepage && !isPreviewHome && !isResources && !isPortfolio && !isClientPage && (
        <SmoothScroller />
      )}
    </PostHogProvider>
  );
}
