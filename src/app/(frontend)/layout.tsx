import { ClientProviders } from "@/components/ClientProviders";
import { components } from "@/lib/design-system";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientProviders />
      <div className={components.gridOverlay} />
      {children}
    </>
  );
}
