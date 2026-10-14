"use client";

import { BookingLinkTracker } from "@/components/BookingLinkTracker";
import { PostHogProvider } from "@/components/PostHogProvider";

// Scrolling is native on every page: no smooth-scroll layer, so the wheel
// feels the same on the homepage, case studies, portfolio, and resources.
export function ClientProviders() {
  return (
    <PostHogProvider>
      <BookingLinkTracker />
    </PostHogProvider>
  );
}
