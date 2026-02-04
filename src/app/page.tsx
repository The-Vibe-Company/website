import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { WhatWeDo } from "@/components/WhatWeDo";
import { Philosophy } from "@/components/Philosophy";
import { Footer } from "@/components/Footer";
import { layout } from "@/lib/design-system";

export default function Home() {
  return (
    <main className={layout.fullScreen}>
      <Hero />
      <Mission />
      <WhatWeDo />
      <Philosophy />
      <Footer />
    </main>
  );
}
