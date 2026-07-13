import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import chalk from "chalk";
import { printScaffoldReport, scaffoldProject } from "../lib/scaffold.js";
import { GWF_DIR } from "../lib/paths.js";
import { readText } from "../lib/fs.js";

export interface InitOptions {
  user: string;
  force: boolean;
  skipExisting: boolean;
  cwd: string;
  cliVersion: string;
}

function sanitizeUser(name: string): string {
  const cleaned = name.trim().replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!cleaned) throw new Error("Invalid -u/--user name");
  return cleaned;
}

export async function initCommand(opts: InitOptions): Promise<void> {
  const projectRoot = resolve(opts.cwd);
  const user = sanitizeUser(opts.user);
  const gwfDir = join(projectRoot, GWF_DIR);
  const developerPath = join(gwfDir, ".developer");
  const hasGwf = existsSync(gwfDir) && existsSync(join(gwfDir, "workflow.md"));
  const hasDeveloper = existsSync(developerPath);

  console.log(chalk.bold(`\nGWF init`), chalk.dim(`@ ${projectRoot}\n`));

  if (hasGwf && hasDeveloper) {
    const existing = readText(developerPath).trim();
    console.log(
      chalk.yellow(
        `Already initialized (developer: ${existing || "unknown"}). Nothing to do.`,
      ),
    );
    console.log(
      chalk.dim(
        `Tips: gwf update  (sync templates)  |  gwf doctor  |  gwf init -u other-name on a fresh clone without .developer`,
      ),
    );
    return;
  }

  // New developer on existing project
  if (hasGwf && !hasDeveloper) {
    console.log(chalk.cyan("Existing GWF project — setting up developer identity only.\n"));
    const report = scaffoldProject({
      projectRoot,
      user,
      cliVersion: opts.cliVersion,
      force: opts.force,
      skipExisting: opts.skipExisting || true,
      updateOnly: false,
      isFirstInit: false,
    });
    // Force developer + workspace even when skipExisting on templates
    printScaffoldReport(report);
    console.log(chalk.green(`\n✓ Joined as developer "${user}"`));
    console.log(chalk.dim("Open Grok Build in this repo and describe what you want to do."));
    return;
  }

  // Fresh init
  console.log(chalk.cyan("First-time setup — scaffolding .gwf/ and .grok/\n"));
  const report = scaffoldProject({
    projectRoot,
    user,
    cliVersion: opts.cliVersion,
    force: opts.force,
    skipExisting: opts.skipExisting,
    updateOnly: false,
    isFirstInit: true,
  });
  printScaffoldReport(report);

  console.log(chalk.green(`\n✓ GWF ${opts.cliVersion} initialized for "${user}"`));
  console.log(`
Next steps:
  1. ${chalk.bold("git add .gwf .grok AGENTS.md .gitignore")} and commit
  2. ${chalk.bold("gwf install-hooks")}   # pre-commit blocks out-of-scope diffs
  3. Open Grok Build in this project directory
  4. Trust project hooks (optional SessionStart):
       ${chalk.bold("grok --trust")}   or type ${chalk.bold("/hooks-trust")} / open ${chalk.bold("/hooks")}
  5. ${chalk.bold("/start")} or: python .gwf/scripts/get_context.py
  6. Describe a feature — Plan (fill scope.json) → Execute → ${chalk.bold("/finish-work")}

  Notes:
  - Grok SessionStart hooks are optional; /start still works without them.
  - Git pre-commit scope gate is separate (gwf install-hooks).
`);
}
