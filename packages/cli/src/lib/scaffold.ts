import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  copyTemplateFile,
  ensureDir,
  listFilesRecursive,
  pathExists,
  readText,
  relPosix,
  writeText,
  type CopyResult,
} from "./fs.js";
import {
  buildHashMap,
  collectTemplatePairs,
  hashFile,
  isUnmodifiedTemplate,
  loadTemplateHashes,
  saveTemplateHashes,
  type HashMap,
} from "./hashes.js";
import { mergeAgentsMd } from "./agents-md.js";
import { ensureGitignore } from "./gitignore.js";
import {
  coreTemplateRoot,
  grokTemplateRoot,
  GWF_DIR,
  GROK_DIR,
} from "./paths.js";

export interface ScaffoldOptions {
  projectRoot: string;
  user: string;
  cliVersion: string;
  force?: boolean;
  skipExisting?: boolean;
  dryRun?: boolean;
  /** When true, only update managed templates; do not re-create developer/bootstrap. */
  updateOnly?: boolean;
  /** First-time full init (creates bootstrap task). */
  isFirstInit?: boolean;
}

export interface ScaffoldReport {
  results: CopyResult[];
  agentsMd: "created" | "updated" | "unchanged" | "skipped";
  gitignore: "created" | "updated" | "unchanged" | "skipped";
  developer: "created" | "exists" | "skipped";
  workspace: "created" | "exists" | "skipped";
  bootstrapTask: "created" | "exists" | "skipped";
  hashesUpdated: boolean;
}

function copyTree(
  templateRoot: string,
  destRoot: string,
  opts: { force?: boolean; skipExisting?: boolean; dryRun?: boolean },
  projectRoot: string,
  stored: HashMap,
  currentHashes: HashMap,
  projectRelPrefix: string,
): CopyResult[] {
  const results: CopyResult[] = [];
  for (const absSrc of listFilesRecursive(templateRoot)) {
    const rel = relPosix(templateRoot, absSrc);
    if (projectRelPrefix === `${GROK_DIR}/`) {
      if (rel === "AGENTS.snippet.md" || rel === "gitignore.snippet") continue;
    }
    const dest = join(destRoot, ...rel.split("/"));
    const projectRel = `${projectRelPrefix}${rel}`;
    const tplHash = currentHashes[projectRel];

    // Protect user-modified files unless --force
    if (
      !opts.force &&
      !opts.skipExisting &&
      pathExists(dest) &&
      tplHash &&
      !isUnmodifiedTemplate(projectRoot, projectRel, tplHash, stored)
    ) {
      results.push({ rel: projectRel, action: "skipped" });
      continue;
    }

    if (opts.skipExisting && pathExists(dest)) {
      results.push({ rel: projectRel, action: "skipped" });
      continue;
    }

    // If template unchanged vs last install, skip write when identical
    if (
      !opts.force &&
      pathExists(dest) &&
      stored[projectRel] &&
      tplHash &&
      stored[projectRel] === tplHash &&
      hashFile(dest) === tplHash
    ) {
      results.push({ rel: projectRel, action: "identical" });
      continue;
    }

    const r = copyTemplateFile(absSrc, dest, {
      force: opts.force || Boolean(stored[projectRel]),
      skipExisting: opts.skipExisting,
      dryRun: opts.dryRun,
    });
    // When file differs and not force, copyTemplateFile skips — map rel to projectRel
    results.push({ rel: projectRel, action: r.action });
  }
  return results;
}

function writeDeveloper(
  projectRoot: string,
  user: string,
  dryRun?: boolean,
): "created" | "exists" {
  const p = join(projectRoot, GWF_DIR, ".developer");
  if (existsSync(p)) return "exists";
  if (!dryRun) writeText(p, `${user}\n`);
  return "created";
}

function ensureWorkspace(
  projectRoot: string,
  user: string,
  dryRun?: boolean,
): "created" | "exists" {
  const dir = join(projectRoot, GWF_DIR, "workspace", user);
  const index = join(dir, "index.md");
  if (existsSync(index)) return "exists";
  if (!dryRun) {
    ensureDir(dir);
    writeText(
      index,
      `# ${user}'s workspace\n\nSession journals are appended by /finish-work.\n`,
    );
    writeText(
      join(dir, "journal-1.md"),
      `# Journal — ${user}\n\n<!-- entries appended by gwf finish-work -->\n`,
    );
  }
  return "created";
}

function ensureBootstrapTask(
  projectRoot: string,
  user: string,
  dryRun?: boolean,
): "created" | "exists" {
  const name = "00-bootstrap-guidelines";
  const taskDir = join(projectRoot, GWF_DIR, "tasks", name);
  if (existsSync(join(taskDir, "task.json"))) return "exists";
  if (dryRun) return "created";

  ensureDir(taskDir);
  const today = new Date().toISOString().slice(0, 10);
  const task = {
    id: name,
    name: "bootstrap-guidelines",
    title: "Bootstrap project guidelines",
    description:
      "Fill .gwf/spec/ from the real codebase and project decisions. First-session onboarding task.",
    status: "planning",
    priority: "P1",
    creator: user,
    assignee: user,
    createdAt: today,
    completedAt: null,
    branch: null,
    base_branch: null,
    scope: null,
    package: null,
    subtasks: [
      { name: "Survey repo structure and tech stack", status: "pending" },
      { name: "Fill frontend/backend/guides specs", status: "pending" },
      { name: "Update spec index status to Filled", status: "pending" },
    ],
    children: [],
    parent: null,
    relatedFiles: [],
    notes: "",
    meta: { bootstrap: true },
  };
  writeFileSync(join(taskDir, "task.json"), JSON.stringify(task, null, 2) + "\n", "utf8");
  writeText(
    join(taskDir, "prd.md"),
    `# PRD — Bootstrap project guidelines

## Goal

Produce a usable first version of \`.gwf/spec/\` so later GWF tasks can load real conventions instead of empty placeholders.

## Acceptance criteria

- [ ] Tech stack and directory layout documented
- [ ] At least one frontend and one backend guideline filled (or marked N/A with reason)
- [ ] guides/ thinking docs filled or slimmed to what applies
- [ ] Spec index tables show Filled / N/A status

## Out of scope

- Implementing product features
- Rewriting application code
`,
  );
  // Seed jsonl like task.py create (spec/research paths only)
  const seed =
    JSON.stringify({
      _example:
        'Fill with {"file": "<path>", "reason": "<why>"}. Spec/research only. Delete this line when done.',
    }) + "\n";
  writeText(join(taskDir, "implement.jsonl"), seed);
  writeText(join(taskDir, "check.jsonl"), seed);
  ensureDir(join(taskDir, "research"));

  // Point default session at bootstrap so get_context shows an active task
  const sessionPath = join(
    projectRoot,
    GWF_DIR,
    ".runtime",
    "sessions",
    "default.json",
  );
  writeText(
    sessionPath,
    JSON.stringify(
      {
        task_id: name,
        updated_at: new Date().toISOString(),
        session_key: "default",
      },
      null,
      2,
    ) + "\n",
  );
  return "created";
}

function writeVersion(projectRoot: string, version: string, dryRun?: boolean): void {
  if (dryRun) return;
  writeText(join(projectRoot, GWF_DIR, ".version"), `${version}\n`);
}

function ensureRuntimeDirs(projectRoot: string, dryRun?: boolean): void {
  if (dryRun) return;
  mkdirSync(join(projectRoot, GWF_DIR, ".runtime", "sessions"), {
    recursive: true,
  });
  mkdirSync(join(projectRoot, GWF_DIR, "tasks", "archive"), { recursive: true });
}

function refreshHashes(
  projectRoot: string,
  pairs: Array<{ absSrc: string; projectRel: string }>,
  currentHashes: HashMap,
  stored: HashMap,
  results: CopyResult[],
): void {
  const next: HashMap = { ...stored };
  for (const r of results) {
    if (r.action === "created" || r.action === "overwritten" || r.action === "identical") {
      if (currentHashes[r.rel]) next[r.rel] = currentHashes[r.rel];
    }
  }
  for (const { absSrc, projectRel } of pairs) {
    const abs = join(projectRoot, ...projectRel.split("/"));
    if (!existsSync(abs)) continue;
    try {
      if (hashFile(abs) === hashFile(absSrc)) {
        next[projectRel] = currentHashes[projectRel];
      }
    } catch {
      /* ignore */
    }
  }
  saveTemplateHashes(projectRoot, next);
}

export function scaffoldProject(opts: ScaffoldOptions): ScaffoldReport {
  const {
    projectRoot,
    user,
    cliVersion,
    force = false,
    skipExisting = false,
    dryRun = false,
    updateOnly = false,
    isFirstInit = false,
  } = opts;

  const coreRoot = coreTemplateRoot();
  const grokRoot = grokTemplateRoot();
  const pairs = collectTemplatePairs(coreRoot, grokRoot);
  const currentHashes = buildHashMap(pairs);
  const stored = loadTemplateHashes(projectRoot);
  const copyOpts = { force, skipExisting, dryRun };

  const results = [
    ...copyTree(
      coreRoot,
      join(projectRoot, GWF_DIR),
      copyOpts,
      projectRoot,
      stored,
      currentHashes,
      `${GWF_DIR}/`,
    ),
    ...copyTree(
      grokRoot,
      join(projectRoot, GROK_DIR),
      copyOpts,
      projectRoot,
      stored,
      currentHashes,
      `${GROK_DIR}/`,
    ),
  ];

  let agentsMd: ScaffoldReport["agentsMd"] = "skipped";
  let gitignore: ScaffoldReport["gitignore"] = "skipped";
  let developer: ScaffoldReport["developer"] = "skipped";
  let workspace: ScaffoldReport["workspace"] = "skipped";
  let bootstrapTask: ScaffoldReport["bootstrapTask"] = "skipped";

  if (!dryRun) {
    ensureRuntimeDirs(projectRoot, dryRun);
    writeVersion(projectRoot, cliVersion, dryRun);

    const snippetPath = join(grokRoot, "AGENTS.snippet.md");
    if (existsSync(snippetPath)) {
      agentsMd = mergeAgentsMd(projectRoot, readText(snippetPath));
    }
    gitignore = ensureGitignore(projectRoot);

    if (!updateOnly) {
      developer = writeDeveloper(projectRoot, user, dryRun);
      workspace = ensureWorkspace(projectRoot, user, dryRun);
      if (isFirstInit) {
        bootstrapTask = ensureBootstrapTask(projectRoot, user, dryRun);
      }
    }

    refreshHashes(projectRoot, pairs, currentHashes, stored, results);
  } else if (!updateOnly) {
    developer = existsSync(join(projectRoot, GWF_DIR, ".developer"))
      ? "exists"
      : "created";
    workspace = existsSync(join(projectRoot, GWF_DIR, "workspace", user, "index.md"))
      ? "exists"
      : "created";
    bootstrapTask = existsSync(
      join(projectRoot, GWF_DIR, "tasks", "00-bootstrap-guidelines", "task.json"),
    )
      ? "exists"
      : isFirstInit
        ? "created"
        : "skipped";
  }

  return {
    results,
    agentsMd,
    gitignore,
    developer,
    workspace,
    bootstrapTask,
    hashesUpdated: !dryRun,
  };
}

export function printScaffoldReport(report: ScaffoldReport): void {
  const counts = { created: 0, overwritten: 0, skipped: 0, identical: 0 };
  for (const r of report.results) counts[r.action] += 1;

  console.log(
    `  files: ${counts.created} created, ${counts.overwritten} overwritten, ${counts.identical} identical, ${counts.skipped} skipped`,
  );
  if (report.agentsMd !== "skipped") console.log(`  AGENTS.md: ${report.agentsMd}`);
  if (report.gitignore !== "skipped") console.log(`  .gitignore: ${report.gitignore}`);
  if (report.developer !== "skipped") console.log(`  developer: ${report.developer}`);
  if (report.workspace !== "skipped") console.log(`  workspace: ${report.workspace}`);
  if (report.bootstrapTask !== "skipped") {
    console.log(`  bootstrap task: ${report.bootstrapTask}`);
  }
}
