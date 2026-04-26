"use client";

import { TopNav } from "./TopNav";
import { HomeCenter } from "./HomeCenter";
import { HomeNextSection } from "./HomeNextSection";

export function HomeLaunchpad() {
  return (
    <div className="relative h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory min-h-0">
        <HomeCenter />
        <HomeNextSection />
      </div>
    </div>
  );
}
