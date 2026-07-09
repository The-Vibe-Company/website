import { notFound } from "next/navigation";

// Client case studies temporarily pulled from production: the client content
// is not finalized/approved for public display yet. Restore this page once the
// case studies are validated. The underlying data still lives in
// `src/lib/customers.ts`.
export default function CaseStudyPage() {
  notFound();
}
