export const SITE_NAME = "The Vibe Company";
export const SITE_URL = "https://www.thevibecompany.co";
export const SITE_DESCRIPTION =
  "An AI-native agency. Everything 50–100× faster with AI — products, ops, training. Our agency runs on AI too.";

export type SiteRoute = {
  path: string;
  title: string;
  description: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

export const INDEXABLE_STATIC_ROUTES: SiteRoute[] = [
  {
    path: "/",
    title: SITE_NAME,
    description:
      "The Vibe Company is an AI-native agency. We make every part of your business 50–100× faster with AI — products, agent ops, training.",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/agency",
    title: "Agency",
    description:
      "About The Vibe Company and its AI-native product execution work.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/portfolio",
    title: "Projects",
    description:
      "A selection of projects built by The Vibe Company.",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/resources",
    title: "Resources",
    description:
      "Shareable AI skills and articles from The Vibe Company.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
