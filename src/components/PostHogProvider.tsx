"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureEvent, isPostHogEnabled } from "@/lib/posthog";

type Props = {
  children: React.ReactNode;
};

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    // Passed explicitly: if PostHog is still loading, the pageview waits in a
    // queue and must not pick up the URL of a later page (see captureEvent()).
    captureEvent("$pageview", {
      $current_url: url,
      $pathname: pathname,
    });
  }, [pathname, query]);

  return null;
}

export function PostHogProvider({ children }: Props) {
  if (!isPostHogEnabled) {
    return <>{children}</>;
  }

  // No posthog-js/react context: nothing reads it, and importing it would pull
  // posthog-js back into the page bundle (see loadPostHog()).
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </>
  );
}
