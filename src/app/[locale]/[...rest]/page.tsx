import { notFound } from "next/navigation";

// Any unmatched path under a locale (e.g. /fr/does-not-exist) falls through to
// here and renders the localized not-found page (inside the [locale] layout),
// instead of Next's bare default 404.
export default function CatchAllNotFound() {
  notFound();
}
