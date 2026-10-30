"use client";

import { useEffect } from "react";

/** Register after hydration, without loading the tools in unsupported browsers. */
export function WebMcp() {
  useEffect(() => {
    const doc = document as Document & { modelContext?: unknown };
    const nav = navigator as Navigator & { modelContext?: unknown };
    if (!doc.modelContext && !nav.modelContext) return;
    let disposed = false;
    let unregister: (() => void) | undefined;
    void import("@/lib/webmcp").then(({ registerWebMcpTools }) => {
      if (!disposed) {
        unregister = registerWebMcpTools(
          document as Parameters<typeof registerWebMcpTools>[0],
          navigator as Parameters<typeof registerWebMcpTools>[1],
          document.documentElement.lang,
        );
      }
    }).catch(() => {});
    return () => { disposed = true; unregister?.(); };
  }, []);
  return null;
}
