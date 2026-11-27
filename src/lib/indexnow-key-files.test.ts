import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config } from "../middleware";
import { INDEXNOW_ORIGIN } from "./indexnow";

// Key used by OpenSEO (submit_indexnow_urls). The site key in ./indexnow is
// kept alongside it: the protocol allows several key files per host.
const OPENSEO_KEY = "edd0108e87ee4f2b817e11b6be9d988e";

describe("IndexNow key files at the site root", () => {
  test("OpenSEO key file exists and its content equals its filename", () => {
    const file = `public/${OPENSEO_KEY}.txt`;
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, "utf8").trim()).toBe(OPENSEO_KEY);
  });

  test("every root key file holds exactly its own key and bypasses the i18n middleware", () => {
    const keyFiles = readdirSync("public").filter((name) => /^[a-f0-9]{32}\.txt$/.test(name));
    expect(keyFiles).toContain(`${OPENSEO_KEY}.txt`);
    for (const name of keyFiles) {
      expect(readFileSync(`public/${name}`, "utf8").trim()).toBe(name.replace(/\.txt$/, ""));
      expect(unstable_doesMiddlewareMatch({ config, url: `${INDEXNOW_ORIGIN}/${name}` })).toBe(false);
    }
  });
});
