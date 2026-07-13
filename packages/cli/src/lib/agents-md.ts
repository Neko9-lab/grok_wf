import { existsSync } from "node:fs";
import { join } from "node:path";
import { readText, writeText } from "./fs.js";

const MARKER_BEGIN = "<!-- gwf:begin -->";
const MARKER_END = "<!-- gwf:end -->";

export function mergeAgentsMd(
  projectRoot: string,
  snippet: string,
): "created" | "updated" | "unchanged" {
  const path = join(projectRoot, "AGENTS.md");
  const block = `${MARKER_BEGIN}\n${snippet.trim()}\n${MARKER_END}\n`;

  if (!existsSync(path)) {
    writeText(path, block);
    return "created";
  }

  const body = readText(path);
  const begin = body.indexOf(MARKER_BEGIN);
  const end = body.indexOf(MARKER_END);

  if (begin !== -1 && end !== -1 && end > begin) {
    const next =
      body.slice(0, begin) + block + body.slice(end + MARKER_END.length).replace(/^\n?/, "");
    if (next === body) return "unchanged";
    writeText(path, next);
    return "updated";
  }

  const sep = body.endsWith("\n") || body.length === 0 ? "" : "\n";
  writeText(path, body + sep + "\n" + block);
  return "updated";
}
