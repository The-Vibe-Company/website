#!/usr/bin/env node
/**
 * render_scene.mjs — render an .excalidraw file to PNG locally, with headless Chromium and the official
 * Excalidraw export (exportToSvg from @excalidraw/excalidraw, pinned version, loaded from the jsDelivr CDN).
 * No Excalidraw+ account needed. Needs network access to cdn.jsdelivr.net (library + fonts).
 *
 *   node render_scene.mjs --in diagram.excalidraw --out diagram.png [--scale 2] [--dark]
 *   node render_scene.mjs --in diagram.excalidraw --out zoom.png --crop 400,120,600,300 --scale 2
 *
 * Options
 *   --in <file>        scene to render (required)
 *   --out <file.png>   output PNG (default: <in>.png)
 *   --scale <n>        pixel density, 1 = 100 % (default 1; use 2 for zoomed checks)
 *   --dark             dark-mode export (Excalidraw's own inversion filter)
 *   --crop x,y,w,h     render only this region, in SCENE coordinates (the x/y you see in the generator)
 *   --padding <px>     margin around the scene (default 20)
 *   --remeasure        re-measure text widths with the real fonts before rendering (what a fresh paste into
 *                      Excalidraw would do); by default the widths stored in the file are kept, like opening it
 *   --text-report      list texts whose real width differs from the width stored in the file by > 4 px
 *   --timeout <s>      overall timeout (default 90)
 *
 * One-time setup (any folder OUTSIDE the skill; the script finds Playwright from the current directory,
 * NODE_PATH, or PLAYWRIGHT_NODE_MODULES):
 *   mkdir -p ~/render-env && cd ~/render-env && npm i playwright && npx playwright install chromium
 *   cd ~/render-env && node <skill>/scripts/render_scene.mjs --in … --out …
 * If the browser build expected by Playwright is missing, the script falls back to any Chromium found in the
 * Playwright cache or to CHROMIUM_PATH.
 *
 * Exit codes: 0 rendered, 1 render failed, 2 bad arguments, 3 Playwright or Chromium missing.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const EXCALIDRAW_VERSION = "0.18.1";
const CDN = `https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@${EXCALIDRAW_VERSION}`;
const ORIGIN = "https://render.local/";

function usage(msg) {
  if (msg) console.error("error:", msg);
  console.error("usage: node render_scene.mjs --in scene.excalidraw [--out scene.png] [--scale 2] [--dark] " +
    "[--crop x,y,w,h] [--padding 20] [--remeasure] [--text-report]");
  process.exit(2);
}

function parseArgs(argv) {
  const o = { scale: 1, dark: false, padding: 20, remeasure: false, textReport: false, timeout: 90 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => { if (i + 1 >= argv.length) usage(`${a} needs a value`); return argv[++i]; };
    if (a === "--in") o.in = next();
    else if (a === "--out") o.out = next();
    else if (a === "--scale") o.scale = parseFloat(next());
    else if (a === "--dark") o.dark = true;
    else if (a === "--padding") o.padding = parseFloat(next());
    else if (a === "--remeasure") o.remeasure = true;
    else if (a === "--text-report") o.textReport = true;
    else if (a === "--timeout") o.timeout = parseFloat(next());
    else if (a === "--crop") {
      const v = next().split(",").map(Number);
      if (v.length !== 4 || v.some(Number.isNaN) || v[2] <= 0 || v[3] <= 0) usage("--crop expects x,y,w,h");
      o.crop = v;
    } else if (a === "-h" || a === "--help") usage();
    else if (!o.in && !a.startsWith("-")) o.in = a;
    else usage(`unknown argument ${a}`);
  }
  if (!o.in) usage("--in is required");
  if (!(o.scale > 0 && o.scale <= 8)) usage("--scale must be in (0, 8]");
  o.out = o.out || o.in.replace(/\.excalidraw(\.json)?$/, "") + ".png";
  return o;
}

async function loadPlaywright() {
  const bases = [path.join(process.cwd(), "x.js")];
  for (const d of [process.env.PLAYWRIGHT_NODE_MODULES, ...(process.env.NODE_PATH || "").split(path.delimiter)]) {
    if (d) bases.push(path.join(path.resolve(d), "..", "x.js"), path.join(path.resolve(d), "x.js"));
  }
  for (const name of ["playwright", "playwright-core"]) {
    try { return await import(name); } catch { /* not next to the script */ }
    for (const b of bases) {
      try { return createRequire(b)(name); } catch { /* try the next base */ }
    }
  }
  console.error("Playwright is not installed. One-time setup, in a folder outside the skill:\n" +
    "  npm i playwright && npx playwright install chromium\n" +
    "then run this script from that folder (or set NODE_PATH=<that folder>/node_modules).");
  process.exit(3);
}

function cachedChromium() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH,
    path.join(os.homedir(), "Library", "Caches", "ms-playwright"),
    path.join(os.homedir(), ".cache", "ms-playwright"),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "ms-playwright")].filter(Boolean);
  const exes = ["chrome-headless-shell", "chrome-headless-shell.exe", "chrome", "chrome.exe",
    "Google Chrome for Testing", "Chromium"];
  const found = [];
  const walk = (dir, depth) => {
    if (depth > 6) return;
    let ents = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (exes.includes(e.name) && !p.includes("Helpers")) found.push(p);
    }
  };
  for (const r of roots) {
    let dirs = [];
    try { dirs = fs.readdirSync(r).filter((d) => /^chromium/.test(d)); } catch { continue; }
    dirs.sort((a, b) => (b.includes("headless") - a.includes("headless")) ||
      (parseInt(b.split("-").pop()) - parseInt(a.split("-").pop())));
    for (const d of dirs) walk(path.join(r, d), 0);
  }
  return found[0];
}

async function launch(pw) {
  const chromium = pw.chromium || (pw.default && pw.default.chromium);
  try {
    return await chromium.launch();
  } catch (err) {
    const exe = cachedChromium();
    if (exe) {
      try { return await chromium.launch({ executablePath: exe }); } catch { /* fall through */ }
    }
    console.error("Chromium could not be started: " + String(err.message).split("\n")[0] +
      "\nInstall it once with: npx playwright install chromium   (or set CHROMIUM_PATH)");
    process.exit(3);
  }
}

// Runs inside the page.
async function renderInPage({ scene, cdn, opts }) {
  window.EXCALIDRAW_ASSET_PATH = cdn + "/dist/prod/";
  const lib = await import(cdn + "/+esm");
  const files = scene.files || {};
  const appState = {
    ...(scene.appState || {}),
    exportBackground: true,
    exportWithDarkMode: !!opts.dark,
    viewBackgroundColor: (scene.appState && scene.appState.viewBackgroundColor) || "#ffffff",
  };
  const live = (scene.elements || []).filter((e) => !e.isDeleted);
  let elements = lib.restoreElements(live, null);

  const host = document.getElementById("host");
  const exportSvg = async (els) => lib.exportToSvg({ elements: els, appState, files, exportPadding: opts.padding });

  // first pass: the export inlines the @font-face rules it needs; load them before anything is measured or drawn
  let svg = await exportSvg(elements);
  host.replaceChildren(svg);
  const fams = new Set();
  for (const e of elements) {
    if (e.type === "text") fams.add(lib.FONT_FAMILY && Object.keys(lib.FONT_FAMILY).find((k) => lib.FONT_FAMILY[k] === e.fontFamily));
  }
  await Promise.all([...fams].filter(Boolean).map((f) => document.fonts.load(`20px "${f}"`).catch(() => null)));
  await document.fonts.ready;

  const canvas = document.createElement("canvas").getContext("2d");
  const familyName = (id) => (Object.keys(lib.FONT_FAMILY).find((k) => lib.FONT_FAMILY[k] === id) || "sans-serif");
  const measure = (e) => {
    canvas.font = `${e.fontSize}px "${familyName(e.fontFamily)}"`;
    return Math.max(...String(e.text).split("\n").map((l) => canvas.measureText(l).width));
  };
  const report = [];
  for (const e of elements) {
    if (e.type !== "text" || e.containerId) continue;
    const real = measure(e);
    if (Math.abs(real - e.width) > 4) {
      report.push({ id: e.id, text: String(e.text).split("\n")[0].slice(0, 40), fileWidth: Math.round(e.width),
        realWidth: Math.round(real), x: Math.round(e.x), y: Math.round(e.y) });
    }
  }
  const missing = [...fams].filter((f) => f && !document.fonts.check(`20px "${f}"`));

  if (opts.remeasure) {
    elements = lib.restoreElements(live, null, { refreshDimensions: true });
  }
  svg = await exportSvg(elements);
  host.replaceChildren(svg);
  await document.fonts.ready;
  const imgs = [...svg.querySelectorAll("image")];
  await Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => null) : null)));

  // scale as vector (crisp at any zoom, and independent of the browser's device-pixel handling)
  const w0 = parseFloat(svg.getAttribute("width")), h0 = parseFloat(svg.getAttribute("height"));
  svg.setAttribute("width", String(w0 * opts.scale));
  svg.setAttribute("height", String(h0 * opts.scale));
  const [minX, minY] = lib.getCommonBounds(elements);
  const r = { width: w0, height: h0 };
  return { width: r.width, height: r.height, minX, minY, report, missing, count: elements.length };
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  let scene;
  try {
    scene = JSON.parse(fs.readFileSync(o.in, "utf8"));
  } catch (e) {
    console.error(`cannot read ${o.in}: ${e.message}`);
    process.exit(2);
  }
  const pw = await loadPlaywright();
  const browser = await launch(pw);
  const timer = setTimeout(() => { console.error(`timeout after ${o.timeout}s`); process.exit(1); }, o.timeout * 1000);
  try {
    const ctx = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: 1200, height: 800 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message)));
    await page.route(ORIGIN + "**", (route) => route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><head><meta charset='utf-8'><style>html,body{margin:0;padding:0;background:transparent}" +
        "#host{position:absolute;left:0;top:0;line-height:0}</style></head><body><div id='host'></div></body></html>",
    }));
    await page.goto(ORIGIN);
    let res;
    try {
      res = await page.evaluate(renderInPage,
        { scene, cdn: CDN, opts: { dark: o.dark, padding: o.padding, remeasure: o.remeasure, scale: o.scale } });
    } catch (e) {
      console.error("render failed in the page: " + String(e.message).split("\n")[0]);
      if (errors.length) console.error(errors.slice(0, 3).join("\n"));
      console.error(`(the page loads ${CDN} — check network access)`);
      process.exit(1);
    }
    const k = o.scale;
    await page.setViewportSize({ width: Math.ceil(res.width * k) + 2, height: Math.ceil(res.height * k) + 2 });
    let clip = { x: 0, y: 0, width: res.width, height: res.height };
    if (o.crop) {
      const [cx, cy, cw, ch] = o.crop;
      const x = cx - res.minX + o.padding, y = cy - res.minY + o.padding;
      const x0 = Math.max(0, x), y0 = Math.max(0, y);
      const x1 = Math.min(res.width, x + cw), y1 = Math.min(res.height, y + ch);
      if (x1 <= x0 || y1 <= y0) {
        console.error(`--crop ${o.crop.join(",")} is outside the scene (scene starts at ${Math.round(res.minX)},${Math.round(res.minY)})`);
        process.exit(2);
      }
      clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
    }
    clip = { x: clip.x * k, y: clip.y * k, width: clip.width * k, height: clip.height * k };
    fs.mkdirSync(path.dirname(path.resolve(o.out)), { recursive: true });
    await page.screenshot({ path: o.out, clip, omitBackground: false });
    const px = (v) => Math.round(v);
    console.log(`saved ${o.out} (${px(clip.width)}x${px(clip.height)} px, scale ${o.scale}${o.dark ? ", dark" : ""}, ` +
      `${res.count} elements, Excalidraw ${EXCALIDRAW_VERSION}; scene origin ${Math.round(res.minX)},${Math.round(res.minY)})`);
    if (res.missing.length) console.error(`warning: fonts not loaded: ${res.missing.join(", ")} — text is drawn with a fallback font`);
    if (o.textReport) {
      for (const t of res.report) {
        console.log(`text width: '${t.text}' at ${t.x},${t.y} is ${t.realWidth}px with the real font, ${t.fileWidth}px in the file`);
      }
      console.log(`${res.report.length} text(s) differ from their stored width by more than 4 px`);
    }
  } finally {
    clearTimeout(timer);
    await browser.close();
  }
}

main().catch((e) => { console.error(e && e.stack ? e.stack.split("\n").slice(0, 3).join("\n") : e); process.exit(1); });
