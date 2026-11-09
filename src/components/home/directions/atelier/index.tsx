import { contentPath, getContentForLanguage, getContentItem } from "@/lib/content-source";
import type { ContentLocale } from "@/lib/customers";
import type { RunnerItem } from "@/lib/runner-worlds";
import styles from "./atelier.module.css";
import { AtelierHero } from "./AtelierHero";
import { Clientele } from "./Clientele";
import { Closing } from "./Closing";
import { LitQuote } from "./LitQuote";
import { Offers } from "./Offers";
import { Tools } from "./Tools";
import { Workbench } from "./Workbench";
import { CLOSING_SCENE, type Scene, type SceneSource } from "./scenes";

/** A scene with the version of its article that this language should open. */
function resolve(source: SceneSource, locale: ContentLocale): Scene {
  const item = getContentItem("article", source.slug);
  if (!item) throw new Error(`Atelier: no article "${source.slug}" for its scene`);
  const target = getContentForLanguage("article", source.slug, locale) ?? item;
  return {
    src: item.featuredImage?.url ?? "",
    alt: item.featuredImage?.alt ?? "",
    focus: source.focus,
    title: target.title,
    href: contentPath(target),
    locale: target.language,
  };
}

/**
 * G · Atelier: the approved hero with the mascot alone on the ink, then the
 * page turns to warm paper with a clean cut at the mascot's floor, the client
 * quote as one ink band in the middle, and the closing scene full width: the
 * only rendered scene on the page. The runner game is hidden in the hero: the
 * mascot jumps into it.
 */
export function DirectionHome({ locale, runnerItems }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  return (
    <>
      <div aria-hidden="true" className={styles.grain} />
      <AtelierHero runnerItems={runnerItems} />
      <div className={styles.paper}>
        <Clientele />
        <Offers />
        <Workbench />
      </div>
      <LitQuote />
      <div className={styles.paper}>
        <Tools />
      </div>
      <Closing scene={resolve(CLOSING_SCENE, locale)} />
    </>
  );
}
