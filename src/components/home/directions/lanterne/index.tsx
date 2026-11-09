import type { ContentLocale } from "@/lib/customers";
import type { RunnerItem } from "@/lib/runner-worlds";
import { CaseGallery } from "./CaseGallery";
import { ClientsShelf } from "./ClientsShelf";
import { Lamps } from "./Lamps";
import { LanternClosing } from "./LanternClosing";
import { LanternHero } from "./LanternHero";
import { CursorLight } from "./light";
import { NightQuote } from "./NightQuote";
import { Windows } from "./Windows";
import s from "./lantern.module.css";

/**
 * Direction D, "Lanterne": the homepage as a dark room lit by one lantern.
 * Light is the subject: the hero's lantern follows the mouse and relights the
 * mascot, its shadow and the headline; below it the cases hang in a gallery
 * whose spotlights come on as you arrive, the quote comes out of the dark word
 * by word, each offer hangs under its own lamp, the products are the lit
 * windows of a building at night, and the booking slab is the last light on.
 * The visitor's mouse carries a small light of its own across the page.
 */
export function DirectionHome({ locale }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  return (
    <div className="relative bg-[#070707]">
      <LanternHero />
      <ClientsShelf />
      <CaseGallery locale={locale} />
      <NightQuote />
      <Lamps />
      <Windows locale={locale} />
      <LanternClosing />
      <CursorLight />
      <div aria-hidden="true" className={s.grain} />
    </div>
  );
}
