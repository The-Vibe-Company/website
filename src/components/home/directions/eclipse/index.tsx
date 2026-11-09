import type { ContentLocale } from "@/lib/customers";
import type { RunnerItem } from "@/lib/runner-worlds";
import { Afterglow } from "./Afterglow";
import { Cases } from "./Cases";
import { Constellation } from "./Constellation";
import { Dawn } from "./Dawn";
import { EclipseHero } from "./EclipseHero";
import { darker } from "./font";
import { Horizon } from "./Horizon";
import { Quote } from "./Quote";
import { Services } from "./Services";

/**
 * Direction F · Éclipse. The mascot's head eclipses a burning orange sun, and
 * scrolling the page is the day going down and coming back: the sun sets
 * behind the mascot, the clients stand on the horizon, the cases glow in the
 * afterglow, the products come out as a constellation at night, and the
 * closing call is the sunrise.
 */
export function DirectionHome({ locale }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  return (
    <div className={`${darker.variable} relative isolate`}>
      <EclipseHero />
      <Afterglow>
        <Horizon />
        <Cases locale={locale} />
        <Quote />
        <Services />
        <Constellation locale={locale} />
      </Afterglow>
      <Dawn />
    </div>
  );
}
