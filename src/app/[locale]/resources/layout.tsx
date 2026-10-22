import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="resources-theme flex min-h-screen flex-col bg-res-bg text-res-text [&>main]:flex-1">
      <TopNav />
      {children}
      {/* The footer every other page ends with. */}
      <Footer />
    </div>
  );
}
