import { Hero } from "@/components/Hero";
import { WhatWeDo } from "@/components/WhatWeDo";
import { Products } from "@/components/Products";
import { Philosophy } from "@/components/Philosophy";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhatWeDo />
      <Products />
      <Philosophy />
      <Footer />
    </main>
  );
}
