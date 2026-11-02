import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config } from "../middleware";
import {
  INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_KEY_PATH, INDEXNOW_ORIGIN,
  indexNowPayloads, isIndexNowProduction, parseIndexNowSitemap,
  readIndexNowSitemap, selectIndexNowUrls, submitIndexNow,
  type IndexNowFetch,
} from "./indexnow";

const origin = INDEXNOW_ORIGIN;
const production = { VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main" };
const entry = (path: string, alternates: string[] = []) => ({ url: `${origin}${path}`, alternates });
const fr = "/fr/resources/articles/bonjour";
const en = "/en/resources/articles/hello";
const entries = [
  entry(fr, [`${origin}${en}`, "https://evil.example/en"]), entry(en, [`${origin}${fr}`]),
  entry("/fr/resources/skills/outil"), entry("/fr/resources/articles/seul"),
  entry("/fr/resources"), entry("/en/resources"), entry("/fr"), entry("/en"),
];
const hubs = [`${origin}/en/resources`, `${origin}/fr/resources`];

describe("IndexNow ownership and production guard", () => {
  test("public proof is exactly the 32 hex key and bypasses i18n in either language", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    expect(readFileSync(`public${INDEXNOW_KEY_PATH}`, "utf8")).toBe(INDEXNOW_KEY);
    for (const locale of ["fr", "en"]) {
      expect(unstable_doesMiddlewareMatch({ config, url: `${origin}${INDEXNOW_KEY_PATH}`,
        headers: { "accept-language": locale }, cookies: { NEXT_LOCALE: locale } })).toBe(false);
    }
  });

  test.each([
    [{}, false], [{ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "main" }, false],
    [{ VERCEL_ENV: "development", VERCEL_GIT_COMMIT_REF: "main" }, false],
    [{ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "feat/indexnow" }, false],
    [{ VERCEL_ENV: "production" }, false], [{ VERCEL_GIT_COMMIT_REF: "main" }, false],
    [production, true],
  ])("requires both production and main: %j", (env, expected) => {
    expect(isIndexNowProduction(env)).toBe(expected);
  });
});

describe("IndexNow canonical selection", () => {
  test("translated article selects its actual FR/EN slugs and resource hubs once", () => {
    expect(selectIndexNowUrls(entries, ["content/articles/bonjour.md", "content/articles/bonjour.md"]))
      .toEqual([...hubs, `${origin}${en}`, `${origin}${fr}`].sort());
  });
  test("untranslated article and skill never manufacture the other locale URL", () => {
    for (const [file, path] of [
      ["content/articles/seul.md", "/fr/resources/articles/seul"],
      ["content/skills/outil.md", "/fr/resources/skills/outil"],
    ]) expect(selectIndexNowUrls(entries, [file])).toEqual([...hubs, `${origin}${path}`].sort());
  });
  test("frontmatter slug overrides an unchanged filename, including translations", () => {
    const file = "content/articles/old-filename.md";
    expect(selectIndexNowUrls(entries, [file], { [file]: "bonjour" }))
      .toEqual([...hubs, `${origin}${en}`, `${origin}${fr}`].sort());
  });
  test("deletion/rename notifies the hubs and only existing canonical pages", () => {
    expect(selectIndexNowUrls(entries, ["content/articles/removed.md"])).toEqual(hubs.sort());
  });
  test("shared page, copy, data or images invalidate all live canonicals", () => {
    for (const file of ["src/app/(frontend)/[locale]/page.tsx", "src/lib/customers.ts", "messages/en.json", "public/images/cover.webp"]) {
      expect(selectIndexNowUrls(entries, [file])).toEqual(entries.map((entry) => entry.url).sort());
    }
    expect(selectIndexNowUrls(entries, null)).toHaveLength(entries.length);
  });
  test("docs, tests and workflow-only changes submit nothing", () => {
    expect(selectIndexNowUrls(entries, ["CLAUDE.md", ".github/workflows/indexnow.yml", "src/lib/indexnow.ts", "src/lib/site.test.ts"]))
      .toEqual([]);
  });
  test("payloads are deterministic, deduplicated, same HTTPS host and at most 10,000 URLs", () => {
    const urls = Array.from({ length: 10_001 }, (_, i) => `${origin}/fr/${i}`);
    const payloads = indexNowPayloads([...urls, urls[0], "http://www.thevibecompany.co/fr", "https://www.thevibecompany.co.evil/fr", "https://evil.example/", "https://user@www.thevibecompany.co/", "/fr"]);
    expect(payloads.map((p) => p.urlList.length)).toEqual([10_000, 1]);
    expect(payloads[0]).toMatchObject({ host: "www.thevibecompany.co", key: INDEXNOW_KEY, keyLocation: `${origin}${INDEXNOW_KEY_PATH}` });
    expect(payloads).toEqual(indexNowPayloads([...urls].reverse()));
  });
});

describe("IndexNow sitemap reader", () => {
  test("parses XML entities, CDATA, namespaces and alternates without treating them as pages", () => {
    const parsed = parseIndexNowSitemap(`<sm:urlset xmlns:sm="urn:sitemap"><!-- <url><loc>bad</loc></url> -->
      <sm:url><sm:loc><![CDATA[${origin}${fr}]]></sm:loc><xhtml:link href="${origin}${en}"/></sm:url>
      <sm:url><sm:loc>${origin}/fr?q=one&amp;page=2</sm:loc></sm:url>
      <sm:url><sm:loc>https://evil.example/page</sm:loc></sm:url></sm:urlset>`);
    expect(parsed.index).toBe(false);
    expect(parsed.entries).toEqual([entry(fr, [`${origin}${en}`]), entry("/fr?q=one&page=2")]);
    expect(() => parseIndexNowSitemap("<html>Oops</html>")).toThrow("Invalid sitemap");
  });
  test("follows nested indexes once, ignores foreign hosts, and rejects redirects", async () => {
    const calls: string[] = [];
    const pages: Record<string, string> = {
      [`${origin}/sitemap.xml`]: `<sitemapindex><sitemap><loc>${origin}/child.xml</loc></sitemap><sitemap><loc>https://evil.example/sitemap.xml</loc></sitemap></sitemapindex>`,
      [`${origin}/child.xml`]: `<sitemapindex><sitemap><loc>${origin}/sitemap.xml</loc></sitemap><sitemap><loc>${origin}/pages.xml</loc></sitemap></sitemapindex>`,
      [`${origin}/pages.xml`]: `<urlset><url><loc>${origin}${fr}</loc></url></urlset>`,
    };
    const fetcher = (async (url, options) => {
      calls.push(String(url));
      expect(options?.redirect).toBe("error");
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      return new Response(pages[String(url)]);
    }) as IndexNowFetch;
    expect(await readIndexNowSitemap(fetcher)).toEqual([entry(fr)]);
    expect(calls).toEqual(Object.keys(pages));
  });
});

describe("IndexNow submission (all network calls mocked)", () => {
  test("preview/local and dry-run never make any network call", async () => {
    const logs: string[] = [];
    const fetcher = (() => { throw new Error("Network must not be used"); }) as IndexNowFetch;
    await submitIndexNow([`${origin}${fr}`], { env: {}, fetcher, log: (s) => logs.push(s) });
    await submitIndexNow([`${origin}${fr}`], { env: production, dryRun: true, fetcher, log: (s) => logs.push(s) });
    expect(logs[0]).toBe("IndexNow: skipped (not production)");
    expect(logs[1]).toContain('"urlList"');
    expect(logs[1]).toContain(`${origin}${fr}`);
    expect(logs[1]).toContain("dry-run (no POST)");
  });
  test("production verifies the live key before a bounded JSON POST", async () => {
    const calls: string[] = [];
    const fetcher = (async (url, options) => {
      calls.push(String(url));
      expect(options?.redirect).toBe("error");
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      if (calls.length === 1) return new Response(INDEXNOW_KEY, { headers: { "content-type": "text/plain" } });
      expect(options?.method).toBe("POST");
      expect(JSON.parse(String(options?.body))).toEqual(indexNowPayloads([`${origin}${fr}`])[0]);
      return new Response(null, { status: 202 });
    }) as IndexNowFetch;
    await submitIndexNow([`${origin}${fr}`], { env: production, fetcher, log: () => {} });
    expect(calls).toEqual([`${origin}${INDEXNOW_KEY_PATH}`, INDEXNOW_ENDPOINT]);
  });
  test("missing live key, timeout, and HTTP errors always resolve without failing CI", async () => {
    for (const failure of ["key", "timeout", "http"]) {
      const logs: string[] = [];
      let calls = 0;
      const fetcher = (async () => {
        calls++;
        if (failure === "timeout") throw new Error("timeout");
        if (failure === "key") return new Response("not live", { status: 404 });
        return calls === 1 ? new Response(INDEXNOW_KEY, { headers: { "content-type": "text/plain" } }) : new Response(null, { status: 429 });
      }) as IndexNowFetch;
      await expect(submitIndexNow([`${origin}${fr}`], { env: production, fetcher, log: (s) => logs.push(s) })).resolves.toBeUndefined();
      expect(calls).toBe(failure === "http" ? 2 : 1);
      expect(logs.join()).toMatch(/ignored/);
    }
  });
});
