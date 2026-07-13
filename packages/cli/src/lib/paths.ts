import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Package root: packages/cli */
export function packageRoot(): string {
  // dist/lib → packages/cli
  return join(__dirname, "..", "..");
}

/** Templates live in dist/templates after build; fall back to source for dev. */
export function templatesRoot(): string {
  const built = join(packageRoot(), "dist", "templates");
  if (existsSync(built)) return built;
  const src = join(packageRoot(), "templates");
  if (existsSync(src)) return src;
  throw new Error(
    "GWF templates not found. Run `npm run build` in packages/cli.",
  );
}

export function coreTemplateRoot(): string {
  return join(templatesRoot(), "core");
}

export function grokTemplateRoot(): string {
  return join(templatesRoot(), "grok");
}

export const GWF_DIR = ".gwf";
export const GROK_DIR = ".grok";
