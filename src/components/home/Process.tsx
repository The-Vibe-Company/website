import { useTranslations } from "next-intl";
import { Kicker, Piece } from "@/components/kit";

const STEPS = [
  { n: "01", key: "brief" },
  { n: "02", key: "design" },
  { n: "03", key: "build" },
  { n: "04", key: "operate" },
] as const;

/**
 * How a project runs, brief to production: the one black lacquer band of the
 * page, four numbered rows engraved with hairlines. Plain markup: nothing waits
 * for a scroll-in animation.
 */
export function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="section">
      <div className="wrap">
        <Piece tone="lacquer" radius="xl" className="px-6 py-12 md:px-14 md:py-[72px]">
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="display d-md m-0 mt-5">
            {t("titleLine1")}
            <br />
            <span className="text-on-lacquer-muted">{t("titleLine2")}</span>
          </h2>

          <ol className="m-0 mt-10 flex list-none flex-col p-0 md:mt-14">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="grid grid-cols-1 gap-5 border-t border-white/15 py-8 md:grid-cols-[200px_1fr] md:gap-12 md:py-9"
              >
                <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                  <span className="display text-5xl leading-none md:text-[64px]">{step.n}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-orange-400">
                    {t(`steps.${step.key}.label`)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="display m-0 max-w-[540px] text-[26px] leading-[1.05] md:text-[32px]">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="m-0 max-w-[54ch] text-base leading-[1.55] text-on-lacquer-muted">
                    {t(`steps.${step.key}.desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Piece>
      </div>
    </section>
  );
}
