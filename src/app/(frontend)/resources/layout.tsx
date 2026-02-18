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
    </div>
  );
}
