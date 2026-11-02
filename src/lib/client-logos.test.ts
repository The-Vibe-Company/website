import { describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { CLIENTS } from "@/components/home/Clients";
import { CLIENT_LOGO_SIZES } from "./client-logos";
import { getCustomers } from "./customers";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const LOGO_DIR = path.join(PUBLIC_DIR, "images/clients");

describe("client logos", () => {
  test.each(Object.entries(CLIENT_LOGO_SIZES))("%s matches its file's intrinsic size", async (src, size) => {
    const meta = await sharp(path.join(PUBLIC_DIR, src)).metadata();
    expect({ width: meta.width, height: meta.height }).toEqual(size);
  });

  test("every logo file has a declared size", async () => {
    const files = (await fs.readdir(LOGO_DIR, { withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => `/images/clients/${entry.name}`);
    expect(files.filter((src) => !CLIENT_LOGO_SIZES[src])).toEqual([]);
  });

  test("every logo the site renders has a declared size", () => {
    const rendered = [
      ...CLIENTS.map((client) => client.src),
      ...getCustomers("fr").map((customer) => customer.logo),
      ...getCustomers("en").map((customer) => customer.logo),
    ];
    expect(rendered.filter((src) => !CLIENT_LOGO_SIZES[src])).toEqual([]);
  });
});
