import { Hero } from "@/components/Hero";
import { layout } from "@/lib/design-system";

export default function Home() {
  return <main className={layout.fullScreen}>{Hero && <Hero />}</main>;
}
