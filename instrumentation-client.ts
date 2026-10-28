import posthog from "posthog-js";
import { isPostHogEnabled } from "@/lib/posthog";

// Google Translate (and some extensions) move text nodes into <font> wrappers
// behind React's back. When React later removes or inserts relative to such a
// node, the DOM throws NotFoundError and the whole page goes to "Application
// error". Skip those calls with a warning instead: the page keeps working, at
// worst a translated label goes stale. Runs before hydration.
// https://github.com/facebook/react/issues/11538
if (typeof Node === "function") {
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      console.warn("Skipped removeChild: node is no longer a child of this parent (page translated?)", child, this);
      return child;
    }
    return removeChild.call(this, child) as T;
  };

  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, reference: Node | null): T {
    if (reference && reference.parentNode !== this) {
      console.warn("Skipped insertBefore: reference node is no longer a child of this parent (page translated?)", reference, this);
      return node;
    }
    return insertBefore.call(this, node, reference) as T;
  };
}

if (isPostHogEnabled) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
