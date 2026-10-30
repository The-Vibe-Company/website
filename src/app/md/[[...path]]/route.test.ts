import { describe, expect, test } from "bun:test";
import { getAllContent, getContentTranslations } from "@/lib/content-source";
import { buildLlmsTxt } from "@/lib/llms";
import { GET } from "./route";

const get = (path?: string[]) => GET(new Request("https://www.thevibecompany.co/md"), {
  params: Promise.resolve({ path }),
});

describe("Markdown representations", () => {
  test("all home variants reuse llms.txt", async () => {
    for (const path of [undefined, ["fr"], ["en"]]) {
      const response = await get(path);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
      expect(response.headers.get("vary")).toBe("Accept");
      expect(await response.text()).toBe(buildLlmsTxt());
    }
  });

  test("every article returns its repository body at its canonical locale", async () => {
    for (const item of getAllContent().filter((entry) => entry.type === "article")) {
      const response = await get([item.language, "resources", "articles", item.slug]);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-location")).toEndWith(`/${item.language}/resources/articles/${item.slug}`);
      expect(await response.text()).toContain(item.body);
    }
  });

  test("wrong-language requests redirect to the translation or own canonical URL", async () => {
    for (const item of getAllContent().filter((entry) => entry.type === "article")) {
      const other = item.language === "fr" ? "en" : "fr";
      const target = getContentTranslations("article", item.slug).find((entry) => entry.language === other) ?? item;
      const response = await get([other, "resources", "articles", item.slug]);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toEndWith(`/${target.language}/resources/articles/${target.slug}`);
    }
  });

  test("unknown paths, locales and slugs are 404", async () => {
    for (const path of [["de"], ["fr", "portfolio"], ["fr", "resources", "articles", "does-not-exist"], ["fr", "resources", "articles", "..", "secret"]]) {
      expect((await get(path)).status).toBe(404);
    }
  });
});
