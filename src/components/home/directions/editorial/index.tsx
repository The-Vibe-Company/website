import type { ContentLocale } from "@/lib/customers";
import type { RunnerItem } from "@/lib/runner-worlds";
import { useTranslations } from "next-intl";
import { MobileBookingBar } from "../../MobileBookingBar";
import { CaseIndex } from "./CaseIndex";
import { Chapter, ChapterTitle } from "./Chapter";
import { ClientsLedger } from "./ClientsLedger";
import { Closing } from "./Closing";
import { EditorialHero } from "./EditorialHero";
import { EditorialHeroMobile } from "./EditorialHeroMobile";
import { serif } from "./fonts";
import { ProductsIndex } from "./ProductsIndex";
import { PullQuote } from "./PullQuote";
import { ServicesIndex } from "./ServicesIndex";

/**
 * Direction A, "Éditorial": the homepage as a studio magazine at night. Geist
 * keeps the voice; a Bodoni italic is the second voice, for emphasis words,
 * figures and the pull quote. Below the hero the page reads in numbered
 * chapters, each with its number held in a left rail.
 */
export function DirectionHome({ locale, runnerItems }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  const tCases = useTranslations("caseStudy");
  const tServices = useTranslations("services");
  const tProof = useTranslations("proof");
  const word = locale === "fr" ? "Chapitre" : "Chapter";

  return (
    <div className={serif.variable}>
      <EditorialHeroMobile />
      <EditorialHero runnerItems={runnerItems} />
      <ClientsLedger />

      <Chapter id="cases" n={1} label={tCases("kicker")} word={word}>
        <ChapterTitle line1={tCases("titleLine1")} line2={tCases("titleLine2")} />
        <div className="mt-14 md:mt-20">
          <CaseIndex locale={locale} />
        </div>
      </Chapter>

      <PullQuote />

      <Chapter id="savoir-faire" n={2} label={tServices("kicker")} word={word}>
        <ChapterTitle line1={tServices("titleLine1")} line2={tServices("titleLine2")} />
        <div className="mt-14 md:mt-20">
          <ServicesIndex />
        </div>
      </Chapter>

      <Chapter id="proof" n={3} label={tProof("kicker")} word={word}>
        <ChapterTitle line1={tProof("titleLine1")} line2={tProof("titleLine2")} />
        <p className="m-0 mt-8 max-w-[38rem] text-[18px] leading-[1.6] text-muted-foreground">{tProof("intro")}</p>
        <div className="mt-14 md:mt-16">
          <ProductsIndex locale={locale} />
        </div>
      </Chapter>

      <Closing />
      <MobileBookingBar />
    </div>
  );
}
