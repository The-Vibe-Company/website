"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SmoothScroller = dynamic(
  () => import("@/components/SmoothScroller").then((m) => m.SmoothScroller),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export function ClientProviders() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <>
      {!isHomepage && <SmoothScroller />}
      <CustomCursor />
    </>
  );
}
