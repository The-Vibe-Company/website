/** Editorial order shared by the home links and the resources article cards. */
export const PRIORITY_ARTICLES = {
  fr: [
    { key: 'chooseAgency', slug: 'choisir-agence-ia-esn-freelance' },
    { key: 'healthData', slug: 'ia-donnees-de-sante-hds' },
    { key: 'aiNative', slug: 'agence-ia-native' },
  ],
  en: [
    { key: 'chooseAgency', slug: 'how-to-choose-an-ai-agency' },
    { key: 'healthData', slug: 'ai-health-data-hds-france' },
    { key: 'aiNative', slug: 'ai-native-agency' },
  ],
} as const;
