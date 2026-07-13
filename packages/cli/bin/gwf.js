#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distEntry = join(__dirname, "..", "dist", "index.js");

if (!existsSync(distEntry)) {
  console.error(
    "[gwf] dist/ not found. Run `npm run build` in packages/cli first.",
  );
  process.exit(1);
}

await import(pathToFileURL(distEntry).href);
