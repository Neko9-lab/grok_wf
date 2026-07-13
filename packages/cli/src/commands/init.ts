import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import chalk from "chalk";
import { printScaffoldReport, scaffoldProject } from "../lib/scaffold.js";
import { GWF_DIR } from "../lib/paths.js";
import { readText } from "../lib/fs.js";
import { enableAutomations } from "../lib/enable-automations.js";

export interface InitOptions {
  user: string;
  force: boolean;
  skipExisting: boolean;
  cwd: string;
  cliVersion: string;
  /** Skip prompt; enable git hooks + Grok trust. */
  yes: boolean;
  /** Do not install hooks / trust. */
  noAutomations: boolean;
}

function sanitizeUser(name: string): string {
  const cleaned = name.trim().replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!cleaned) throw new Error("Invalid -u/--user name");
  return cleaned;
}

async function finishWithAutomations(
  projectRoot: string,
  user: string,
  cliVersion: string,
  opts: Pick<InitOptions, "yes" | "noAutomations" | "force">,
  kind: "fresh" | "join",
): Promise<void> {
  await enableAutomations({
    projectRoot,
    yes: opts.yes,
    skip: opts.noAutomations,
    forceHooks: opts.force,
  });

  if (kind === "fresh") {
    console.log(chalk.green(`\n✓ GWF ${cliVersion} ready for "${user}"`));
    console.log(`
${chalk.bold("How to use (no /start needed if automations enabled):")}
  1. ${chalk.bold("cd")} this project
  2. Open ${chalk.bold("Grok Build")} in this folder
  3. ${chalk.bold("Just describe what you want")} — SessionStart injects GWF context

${chalk.dim("If injection missing: gwf trust   or   grok --trust")}
${chalk.dim("Commit scope gate: already installed unless you declined")}
`);
  } else {
    console.log(chalk.green(`\n✓ Joined as developer "${user}"`));
    console.log(
      chalk.dim("Open Grok in this repo and describe what you want to do.\n"),
    );
  }
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
        `Already initialized (developer: ${existing || "unknown"}).`,
      ),
    );
    console.log(
      chalk.dim(
        "Re-run automations (trust + git hooks)? Use: gwf enable-automations\n" +
          "Or: gwf update | gwf doctor | gwf trust | gwf install-hooks\n",
      ),
    );
    return;
  }

  // New developer on existing project
  if (hasGwf && !hasDeveloper) {
    console.log(chalk.cyan("Existing GWF project — setting up developer identity.\n"));
    const report = scaffoldProject({
      projectRoot,
      user,
      cliVersion: opts.cliVersion,
      force: opts.force,
      skipExisting: opts.skipExisting || true,
      updateOnly: false,
      isFirstInit: false,
    });
    printScaffoldReport(report);
    await finishWithAutomations(projectRoot, user, opts.cliVersion, opts, "join");
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

  await finishWithAutomations(projectRoot, user, opts.cliVersion, opts, "fresh");
}
