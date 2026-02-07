import { ResourcesNav } from '@/components/resources/ResourcesNav';

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="resources-theme min-h-screen bg-res-bg text-res-text">
      <ResourcesNav />
      {children}
    </div>
  );
}
