import { existsSync } from "node:fs";
import { join } from "node:path";
import { readText, writeText } from "./fs.js";

const MARKER_BEGIN = "# >>> gwf";
const MARKER_END = "# <<< gwf";

const DEFAULT_BLOCK = `${MARKER_BEGIN}
.gwf/.developer
.gwf/.runtime/
.gwf/**/__pycache__/
.gwf/**/*.pyc
${MARKER_END}
`;

export function ensureGitignore(projectRoot: string): "created" | "updated" | "unchanged" {
  const path = join(projectRoot, ".gitignore");
  if (!existsSync(path)) {
    writeText(path, DEFAULT_BLOCK);
    return "created";
  }

  const body = readText(path);
  if (body.includes(MARKER_BEGIN) && body.includes(MARKER_END)) {
    return "unchanged";
  }

  const sep = body.endsWith("\n") || body.length === 0 ? "" : "\n";
  writeText(path, body + sep + "\n" + DEFAULT_BLOCK);
  return "updated";
}
