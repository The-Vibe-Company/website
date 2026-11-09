/**
 * The one rendered scene this direction keeps: the mascot at the start of the
 * road, map in hand, pointing at where it leads, taken from an article's own
 * cover. It stands on the left, so the closing copy sits over the landscape.
 */
export interface SceneSource {
  /** Article slug; its cover is the scene. */
  slug: string;
  /** CSS object-position, so a narrow screen keeps the mascot in frame. */
  focus: string;
}

export const CLOSING_SCENE: SceneSource = { slug: "financer-projet-ia-cir-cii-france-2030", focus: "28% 55%" };

/** A scene resolved on the server: its image and the article it opens. */
export interface Scene {
  src: string;
  alt: string;
  focus: string;
  title: string;
  href: string;
  locale: "fr" | "en";
}
