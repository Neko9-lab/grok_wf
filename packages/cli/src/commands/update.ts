import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import chalk from "chalk";
import { printScaffoldReport, scaffoldProject } from "../lib/scaffold.js";
import { GWF_DIR } from "../lib/paths.js";
import { readText } from "../lib/fs.js";

export interface UpdateOptions {
  force: boolean;
  skipExisting: boolean;
  dryRun: boolean;
  cwd: string;
  cliVersion: string;
}

export async function updateCommand(opts: UpdateOptions): Promise<void> {
  const projectRoot = resolve(opts.cwd);
  const gwfDir = join(projectRoot, GWF_DIR);
  if (!existsSync(join(gwfDir, "workflow.md"))) {
    throw new Error(
      `No GWF project found at ${projectRoot}. Run: gwf init -u <name>`,
    );
  }

  let projectVersion = "unknown";
  const verPath = join(gwfDir, ".version");
  if (existsSync(verPath)) {
    projectVersion = readText(verPath).trim() || "unknown";
  }

  console.log(chalk.bold(`\nGWF update`), chalk.dim(`@ ${projectRoot}`));
  console.log(
    chalk.dim(
      `  project ${projectVersion}  →  CLI ${opts.cliVersion}${opts.dryRun ? "  (dry-run)" : ""}\n`,
    ),
  );

  let user = "developer";
  const devPath = join(gwfDir, ".developer");
  if (existsSync(devPath)) user = readText(devPath).trim() || user;

  const report = scaffoldProject({
    projectRoot,
    user,
    cliVersion: opts.cliVersion,
    force: opts.force,
    skipExisting: opts.skipExisting,
    dryRun: opts.dryRun,
    updateOnly: true,
    isFirstInit: false,
  });
  printScaffoldReport(report);

  if (opts.dryRun) {
    console.log(chalk.yellow("\nDry-run only — no files written."));
  } else {
    console.log(chalk.green(`\n✓ Project templates synced to CLI ${opts.cliVersion}`));
    console.log(
      chalk.dim(
        "User content under .gwf/spec/, .gwf/tasks/, .gwf/workspace/ is never overwritten by templates.",
      ),
    );
  }
}
