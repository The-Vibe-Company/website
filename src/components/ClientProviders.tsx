"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SmoothScroller = dynamic(
  () => import("@/components/SmoothScroller").then((m) => m.SmoothScroller),
  { ssr: false }
);

export function ClientProviders() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isResources = pathname.startsWith("/resources");
  const isWeBuildIt = pathname.startsWith("/we-build-it");

  return (
    <>
      {!isHomepage && !isResources && !isWeBuildIt && <SmoothScroller />}
    </>
  );
}
