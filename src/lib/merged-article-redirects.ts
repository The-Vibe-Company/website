// Kept free of `@/` imports: next.config.ts loads this module at build time.

/**
 * Articles folded into another one. Their URLs had been indexed, so every form
 * of the old URL (both language prefixes and the prefix-less one) lands on the
 * surviving article in a single permanent redirect, never through a chain.
 */
export interface MergedArticle {
  /** Slug of the removed article. */
  from: string;
  /** Slug of the article it was merged into. */
  to: string;
  /** Language of the surviving article. */
  language: "fr" | "en";
}

export const MERGED_ARTICLES: readonly MergedArticle[] = [
  // Nov 2026: the CIR story was merged into the CIR playbook, which ranked
  // better in Search Console.
  {
    from: "comment-on-a-ecrit-notre-cir-pour-recuperer-150-000-euros-grace-a-lia",
    to: "laisser-lia-faire-votre-cir-sans-la-laisser-inventer",
    language: "fr",
  },
];

export interface MergedArticleRedirect {
  source: string;
  destination: string;
  permanent: true;
}

export function mergedArticleRedirects(
  merged: readonly MergedArticle[] = MERGED_ARTICLES
): MergedArticleRedirect[] {
  return merged.flatMap(({ from, to, language }) => {
    const destination = `/${language}/resources/articles/${to}`;
    return [
      { source: `/:locale(fr|en)/resources/articles/${from}`, destination, permanent: true },
      { source: `/resources/articles/${from}`, destination, permanent: true },
    ];
  });
}
