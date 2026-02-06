import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { components } from "@/lib/design-system";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thevibecompany.com"),
  title: {
    default: "The Vibe Company",
    template: "%s | The Vibe Company",
  },
  description:
    "An AI native agency. 100x efficiency. We build with AI, ship fast, and show everything.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Vibe Company",
    title: "The Vibe Company",
    description:
      "An AI native agency. 100x efficiency. We build with AI, ship fast, and show everything.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vibe Company",
    description:
      "An AI native agency. 100x efficiency. We build with AI, ship fast, and show everything.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders />
        <div className={components.gridOverlay} />
        {children}
      </body>
    </html>
  );
}
