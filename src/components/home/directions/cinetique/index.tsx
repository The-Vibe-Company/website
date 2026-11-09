import { getTranslations } from "next-intl/server";
import type { ContentLocale } from "@/lib/customers";
import type { RunnerItem } from "@/lib/runner-worlds";
import { TagBand, TapeCross } from "./Bands";
import { Cases } from "./Cases";
import { Closing } from "./Closing";
import { Figures } from "./Figures";
import { anybody } from "./font";
import { CinetiqueHero } from "./Hero";
import { Products } from "./Products";
import { Quote } from "./Quote";
import { Services } from "./Services";

/**
 * Direction C · Cinétique: the homepage as a poster that moves. Giant words in
 * Anybody stretch and squeeze on its width axis with the scroll; bands drift,
 * cases stack, figures unfold, products slide sideways.
 */
export async function DirectionHome({ locale }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  const t = await getTranslations({ locale, namespace: "services" });
  const tags = (["build", "operate", "advise"] as const).map((key) => t(`items.${key}.tag`));

  return (
    <div className={anybody.variable}>
      <CinetiqueHero />
      <TapeCross locale={locale} />
      <Cases locale={locale} />
      <Figures locale={locale} />
      <Quote />
      <Services />
      <TagBand tags={tags} />
      <Products locale={locale} />
      <Closing />
    </div>
  );
}
