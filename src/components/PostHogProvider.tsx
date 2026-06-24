"use client";

import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderBase } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { isPostHogEnabled } from "@/lib/posthog";

type Props = {
  children: React.ReactNode;
};

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    posthog.capture("$pageview", {
      $current_url: url,
    });
  }, [pathname, query]);

  return null;
}

export function PostHogProvider({ children }: Props) {
  if (!isPostHogEnabled) {
    return <>{children}</>;
  }

  return (
    <PostHogProviderBase client={posthog}>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </PostHogProviderBase>
  );
}
