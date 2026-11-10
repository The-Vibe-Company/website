import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";
import { CLIENT_MESSAGE_NAMESPACES, pickClientMessages } from "./client-messages";

const SRC = resolve(import.meta.dir, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(path);
  }
  return out;
}

function resolveImport(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Every module that can end up in the client bundle: the "use client"
 *  modules and everything they import, statically or dynamically. */
function clientModules(): string[] {
  const files = walk(SRC);
  const queue = files.filter((file) => /^\s*["']use client["']/m.test(readFileSync(file, "utf8").slice(0, 200)));
  const seen = new Set(queue);
  while (queue.length) {
    const file = queue.pop()!;
    const source = readFileSync(file, "utf8");
    const specs = [...source.matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g)].map((m) => m[1]);
    for (const spec of specs) {
      const target = resolveImport(file, spec);
      if (target && !seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
  return [...seen];
}

describe("client messages", () => {
  const modules = clientModules();

  test("every namespace a client module reads is handed to the client", () => {
    const missing: string[] = [];
    for (const file of modules) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/\buse(?:Translations|Messages)\(([^)]*)\)/g)) {
        const arg = match[1].trim();
        const literal = /^["']([^"']+)["']$/.exec(arg);
        // A client module must name its namespace, so it can be checked here.
        if (!literal) {
          missing.push(`${file.slice(SRC.length)}: ${match[0]}`);
          continue;
        }
        const root = literal[1].split(".")[0];
        if (!(CLIENT_MESSAGE_NAMESPACES as readonly string[]).includes(root)) {
          missing.push(`${file.slice(SRC.length)}: ${match[0]}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test("every namespace handed to the client is read by a client module", () => {
    const read = new Set<string>();
    for (const file of modules) {
      for (const match of readFileSync(file, "utf8").matchAll(/\buse(?:Translations|Messages)\(\s*["']([^"'.]+)/g)) read.add(match[1]);
    }
    expect(CLIENT_MESSAGE_NAMESPACES.filter((ns) => !read.has(ns))).toEqual([]);
  });

  test("the picked namespaces exist in both languages", () => {
    for (const messages of [fr, en] as Record<string, unknown>[]) {
      const picked = pickClientMessages(messages);
      expect(Object.keys(picked).sort()).toEqual([...CLIENT_MESSAGE_NAMESPACES].sort());
      for (const ns of CLIENT_MESSAGE_NAMESPACES) expect(picked[ns]).toEqual(messages[ns]);
    }
  });
});
