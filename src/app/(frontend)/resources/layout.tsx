import { ResourcesNav } from '@/components/resources/ResourcesNav';
import { getContentTypes } from '@/lib/taxonomy';

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentTypes = await getContentTypes();

  const typeLinks = contentTypes.map((ct) => ({
    label: ct.pluralLabel,
    href: `/resources/${ct.slug}`,
  }));

  return (
    <div className="resources-theme min-h-screen bg-res-bg text-res-text">
      <ResourcesNav typeLinks={typeLinks} />
      {children}
    </div>
  );
}
