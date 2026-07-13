import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Register project folder as trusted in Grok Build so project hooks
 * (SessionStart / UserPromptSubmit) run without manual /hooks-trust.
 *
 * Format observed in ~/.grok/trusted_folders.toml:
 *
 *   [folders.'C:\path\to\project']
 *   trusted = true
 *   decided_at = 1710000000
 */
export function grokTrustStorePath(): string {
  return join(homedir(), ".grok", "trusted_folders.toml");
}

function sectionHeader(absPath: string): string {
  // Match Grok's quoting: single-quoted path key
  return `[folders.'${absPath}']`;
}

export function isGrokFolderTrusted(projectRoot: string): boolean {
  const store = grokTrustStorePath();
  if (!existsSync(store)) return false;
  const body = readFileSync(store, "utf8");
  const header = sectionHeader(projectRoot);
  if (!body.includes(header)) {
    // try forward-slash variant
    const alt = sectionHeader(projectRoot.replace(/\\/g, "/"));
    if (!body.includes(alt)) return false;
  }
  // naive: after header, look for trusted = true before next [
  const idx = body.indexOf(header);
  const slice = body.slice(idx, idx + 400);
  return /trusted\s*=\s*true/.test(slice);
}

export function trustGrokFolder(projectRoot: string): {
  path: string;
  action: "created" | "updated" | "unchanged";
} {
  const store = grokTrustStorePath();
  const dir = join(homedir(), ".grok");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const header = sectionHeader(projectRoot);
  const decided = Math.floor(Date.now() / 1000);
  const block = `${header}\ntrusted = true\ndecided_at = ${decided}\n`;

  if (!existsSync(store)) {
    writeFileSync(store, block + "\n", "utf8");
    return { path: store, action: "created" };
  }

  let body = readFileSync(store, "utf8");
  if (isGrokFolderTrusted(projectRoot)) {
    return { path: store, action: "unchanged" };
  }

  // Remove existing section for this path if present but untrusted / partial
  const re = new RegExp(
    `\\[folders\\.'${escapeRegExp(projectRoot)}'\\][^\\[]*`,
    "m",
  );
  const reAlt = new RegExp(
    `\\[folders\\.'${escapeRegExp(projectRoot.replace(/\\/g, "/"))}'\\][^\\[]*`,
    "m",
  );
  if (re.test(body)) {
    body = body.replace(re, "");
  } else if (reAlt.test(body)) {
    body = body.replace(reAlt, "");
  }

  body = body.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n\n" + block + "\n";
  writeFileSync(store, body, "utf8");
  return { path: store, action: "updated" };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
