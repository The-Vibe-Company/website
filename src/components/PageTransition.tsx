/// <reference types="react/canary" />
import { ViewTransition } from "react";

// Wraps a route's content so a client-side navigation plays as one page
// leaving and the next arriving (the page-exit / page-enter keyframes in
// globals.css). It is rendered from the template.tsx of every segment whose
// child changes on a navigation, because a template remounts exactly then.
// Nothing animates on updates in place (a search query, a filter), and in a
// browser without View Transitions the page simply swaps as before.
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="none" enter="page-enter" exit="page-exit">
      {children}
    </ViewTransition>
  );
}
