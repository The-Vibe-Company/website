import { ClientProviders } from "@/components/ClientProviders";
import { ConditionalGridOverlay } from "@/components/resources/ConditionalGridOverlay";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientProviders />
      <ConditionalGridOverlay />
      {children}
    </>
  );
}
