import { describe, expect, test } from "bun:test";

import { PROJECT_SLUGS, getProject, type ContentLocale } from "./projects";

const LOCALES: ContentLocale[] = ["en", "fr"];

describe("project SEO overrides", () => {
  test("VibeDrift carries its own search title and snippet in both languages", () => {
    const en = getProject("vibedrift", "en");
    const fr = getProject("vibedrift", "fr");
    expect(en?.seoTitle).toBe("VibeDrift: Claude Code drift tracker | The Vibe Company");
    expect(en?.metaDescription).toBe(
      "VibeDrift is a VS Code extension that counts your Claude Code prompts, crosses them with git metadata and scores session drift live, commit by commit.",
    );
    expect(fr?.seoTitle).toBe("VibeDrift : mesurer la dérive Claude Code | The Vibe Company");
    expect(fr?.metaDescription).toBe(
      "VibeDrift, extension VS Code : compte vos prompts Claude Code, les croise avec git et calcule un score de dérive en direct, remis à zéro à chaque commit.",
    );
  });

  test("projects with an SEO title keep title and snippet within search limits", () => {
    for (const locale of LOCALES) {
      for (const slug of PROJECT_SLUGS) {
        const project = getProject(slug, locale)!;
        if (!project.seoTitle) continue;
        expect(project.seoTitle.length).toBeLessThanOrEqual(60);
        expect(project.seoTitle.endsWith("| The Vibe Company")).toBe(true);
        expect(project.metaDescription.length).toBeLessThanOrEqual(160);
      }
    }
  });

  test("projects without an override keep the default title", () => {
    expect(getProject("vanish", "en")?.seoTitle).toBeUndefined();
  });
});
