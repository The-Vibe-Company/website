"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { capturePageview, isPostHogEnabled } from "@/lib/posthog";

type Props = {
  children: React.ReactNode;
};

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    capturePageview(`${window.location.origin}${pathname}${query ? `?${query}` : ""}`);
  }, [pathname, query]);

  return null;
}

// Nothing reads PostHog through React context, so there is no provider from
// posthog-js/react: importing it would bring the whole library back into the
// first chunks (see src/lib/posthog.ts).
export function PostHogProvider({ children }: Props) {
  if (!isPostHogEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </>
  );
}
