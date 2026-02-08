import { Suspense } from 'react';
import { ResourcesNav } from '@/components/resources/ResourcesNav';
import { getNavContentTypes } from '@/lib/content-types';

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentTypes = getNavContentTypes();

  const typeLinks = contentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.slug}`,
  }));

  return (
    <div className="resources-theme min-h-screen bg-res-bg text-res-text">
      <Suspense fallback={null}>
        <ResourcesNav typeLinks={typeLinks} />
      </Suspense>
      {children}
    </div>
  );
}
