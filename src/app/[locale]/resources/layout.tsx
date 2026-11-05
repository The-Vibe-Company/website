import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="resources-theme min-h-screen bg-res-bg text-res-text">
      <TopNav showResourcesSearch />
      {children}
      {/* The site footer, on the homepage tokens it is drawn with, so every
          resource page links to Contact and Privacy like the rest of the site. */}
      <div data-variant="hybrid">
        <Footer showPriorityArticles />
      </div>
    </div>
  );
}
