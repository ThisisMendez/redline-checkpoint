import { readFileSync, readdirSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * `npm run smoke` and `npm run eval` run the product's own TypeScript through plain
 * Node, which strips types without compiling. Strip-only mode refuses any syntax that
 * emits runtime code: a constructor parameter property, an enum, a namespace,
 * `import x = require()`. Vitest and Next compile all of those happily, so neither the
 * suite nor the build notices when one lands, and the first sign is the acceptance
 * script failing to start.
 *
 * That happened once already. A parameter property in the PDF seam broke `npm run
 * smoke` from the commit that added it, and nothing caught it until someone ran smoke.
 * This test asks Node's own stripper about every file the scripts can reach, so the
 * same mistake fails here, on every commit, instead.
 */

const ROOTS = ["src", "scripts"];

function typeScriptFilesUnder(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...typeScriptFilesUnder(path));
    else if (/\.m?ts$/.test(entry.name) && !entry.name.endsWith(".d.ts")) found.push(path);
  }
  return found;
}

const files = ROOTS.flatMap(typeScriptFilesUnder);

describe("the files npm run smoke and npm run eval load through plain Node", () => {
  it("finds the files it is meant to check", () => {
    expect(files).toContain(join("src", "extraction", "pdf.ts"));
    expect(files).toContain(join("scripts", "smoke.ts"));
  });

  it.each(files)("%s strips without needing a compiler", (file) => {
    const source = readFileSync(file, "utf8");
    expect(() => stripTypeScriptTypes(source, { mode: "strip" })).not.toThrow();
  });
});
