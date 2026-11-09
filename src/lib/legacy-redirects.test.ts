import { describe, expect, test } from "bun:test";
import { legacyBareTarget } from "./legacy-redirects";

describe("legacyBareTarget", () => {
  test.each([
    ["/agency", "/"],
    ["/agency/", "/"],
    ["/resources/articles", "/resources"],
    ["/resources/articles/", "/resources"],
    ...["tools", "tutorials", "concepts", "focus", "learnings"].flatMap((type) => [
      [`/resources/${type}`, "/resources"],
      [`/resources/${type}/`, "/resources"],
      [`/resources/${type}/x`, "/resources"],
    ]),
  ])("%s → %s", (pathname, target) => {
    expect(legacyBareTarget(pathname)).toBe(target);
  });

  test.each([
    "/resources/articles/enterprise-rag",
    "/portfolio",
    "/resources",
    "/fr/agency",
    "/en/resources/tools",
    "/resources/toolsmith/x",
  ])("leaves %s to normal routing", (pathname) => {
    expect(legacyBareTarget(pathname)).toBeNull();
  });
});
