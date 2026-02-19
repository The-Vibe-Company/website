"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { PostHogProvider } from "@/components/PostHogProvider";

const SmoothScroller = dynamic(
  () => import("@/components/SmoothScroller").then((m) => m.SmoothScroller),
  { ssr: false }
);

export function ClientProviders() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isResources = pathname.startsWith("/resources");
  const isPortfolio = pathname.startsWith("/portfolio");

  return (
    <PostHogProvider>
      {!isHomepage && !isResources && !isPortfolio && <SmoothScroller />}
    </PostHogProvider>
  );
}
