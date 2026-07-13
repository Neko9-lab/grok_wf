import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";

export function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function writeText(path: string, content: string): void {
  ensureDir(dirname(path));
  writeFileSync(path, content, "utf8");
}

export function listFilesRecursive(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];

  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      if (name === ".git" || name === "node_modules") continue;
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else out.push(full);
    }
  }

  walk(root);
  return out;
}

/** Relative posix-style path from root. */
export function relPosix(from: string, to: string): string {
  return relative(from, to).split(sep).join("/");
}

export type CopyMode = "write" | "skip" | "overwrite";

export interface CopyResult {
  rel: string;
  action: "created" | "overwritten" | "skipped" | "identical";
}

/**
 * Copy template file into dest. Returns what happened.
 * - force: overwrite always
 * - skipExisting: never overwrite
 * - default: overwrite only if content differs? For init first time files don't exist.
 *   If exists and content same → identical. If different → skip unless force.
 */
export function copyTemplateFile(
  src: string,
  dest: string,
  opts: { force?: boolean; skipExisting?: boolean; dryRun?: boolean } = {},
): CopyResult {
  const rel = dest;
  const exists = existsSync(dest);
  if (!exists) {
    if (!opts.dryRun) {
      ensureDir(dirname(dest));
      copyFileSync(src, dest);
    }
    return { rel, action: "created" };
  }

  const srcBody = readFileSync(src);
  const destBody = readFileSync(dest);
  if (srcBody.equals(destBody)) {
    return { rel, action: "identical" };
  }

  if (opts.skipExisting) {
    return { rel, action: "skipped" };
  }
  if (!opts.force) {
    // Protect user edits by default when content differs
    return { rel, action: "skipped" };
  }

  if (!opts.dryRun) {
    ensureDir(dirname(dest));
    copyFileSync(src, dest);
  }
  return { rel, action: "overwritten" };
}

export function pathExists(p: string): boolean {
  return existsSync(p);
}
