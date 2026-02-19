"use client";

import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderBase } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const isPostHogEnabled = process.env.NODE_ENV === "production" && Boolean(posthogKey);

type Props = {
  children: React.ReactNode;
};

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    if (!isPostHogEnabled) return;

    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    posthog.capture("$pageview", {
      $current_url: url,
    });
  }, [pathname, query]);

  return null;
}

export function PostHogProvider({ children }: Props) {
  useEffect(() => {
    if (!isPostHogEnabled) return;

    // Check if already initialized to prevent duplicate init calls
    if (posthog.__loaded) return;

    posthog.init(posthogKey!, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
    });

    if (process.env.NODE_ENV === "development") {
      (window as Window & { posthog?: typeof posthog }).posthog = posthog;
    }
  }, []);

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
