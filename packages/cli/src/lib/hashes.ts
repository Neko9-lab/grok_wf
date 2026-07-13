import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listFilesRecursive, readText, relPosix, writeText } from "./fs.js";
import { GWF_DIR } from "./paths.js";

export type HashMap = Record<string, string>;

export function sha256(content: Buffer | string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function hashFile(path: string): string {
  return sha256(readFileSync(path));
}

export function loadTemplateHashes(projectRoot: string): HashMap {
  const p = join(projectRoot, GWF_DIR, ".template-hashes.json");
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readText(p)) as HashMap;
  } catch {
    return {};
  }
}

export function saveTemplateHashes(projectRoot: string, hashes: HashMap): void {
  const p = join(projectRoot, GWF_DIR, ".template-hashes.json");
  writeText(p, JSON.stringify(hashes, null, 2) + "\n");
}

/**
 * Build hash map for all files under template roots mapped to project-relative paths.
 * keys are project-relative posix paths like ".gwf/workflow.md" or ".grok/skills/..."
 */
export function buildHashMap(
  pairs: Array<{ absSrc: string; projectRel: string }>,
): HashMap {
  const map: HashMap = {};
  for (const { absSrc, projectRel } of pairs) {
    map[projectRel] = hashFile(absSrc);
  }
  return map;
}

export function collectTemplatePairs(
  coreRoot: string,
  grokRoot: string,
): Array<{ absSrc: string; projectRel: string }> {
  const pairs: Array<{ absSrc: string; projectRel: string }> = [];

  for (const abs of listFilesRecursive(coreRoot)) {
    const rel = relPosix(coreRoot, abs);
    // core templates map under .gwf/
    pairs.push({ absSrc: abs, projectRel: `${GWF_DIR}/${rel}` });
  }

  for (const abs of listFilesRecursive(grokRoot)) {
    const rel = relPosix(grokRoot, abs);
    // skip meta files used only by scaffolder
    if (rel === "AGENTS.snippet.md" || rel === "gitignore.snippet") continue;
    pairs.push({ absSrc: abs, projectRel: `.grok/${rel}` });
  }

  return pairs;
}

/** True if file is unchanged from last installed template (or missing hashes → treat as managed only if matches current template). */
export function isUnmodifiedTemplate(
  projectRoot: string,
  projectRel: string,
  currentTemplateHash: string,
  stored: HashMap,
): boolean {
  const abs = join(projectRoot, ...projectRel.split("/"));
  if (!existsSync(abs)) return true; // missing → safe to write
  const actual = hashFile(abs);
  const prev = stored[projectRel];
  if (prev) {
    // User hasn't edited if on-disk still equals the hash we installed
    return actual === prev;
  }
  // No stored hash: only overwrite if identical to current template
  return actual === currentTemplateHash;
}
