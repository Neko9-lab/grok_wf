#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { updateCommand } from "./commands/update.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { doctorCommand } from "./commands/doctor.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readPkgVersion(): string {
  try {
    const pkgPath = join(__dirname, "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const version = readPkgVersion();
const program = new Command();

program
  .name("gwf")
  .description("Grok Workflow Framework — AI coding workflow for Grok Build")
  .version(version, "-V, --version", "Show CLI version");

program
  .command("init")
  .description("Initialize GWF in the current project")
  .requiredOption("-u, --user <name>", "Developer identity name")
  .option("-f, --force", "Overwrite conflicting template files", false)
  .option("-s, --skip-existing", "Skip files that already exist", false)
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await initCommand({
      user: opts.user as string,
      force: Boolean(opts.force),
      skipExisting: Boolean(opts.skipExisting),
      cwd: opts.cwd as string,
      cliVersion: version,
    });
  });

program
  .command("update")
  .description("Sync project templates to the installed CLI version")
  .option("-f, --force", "Overwrite locally modified template files", false)
  .option("-s, --skip-existing", "Skip locally modified template files", false)
  .option("--dry-run", "Preview changes without writing", false)
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await updateCommand({
      force: Boolean(opts.force),
      skipExisting: Boolean(opts.skipExisting),
      dryRun: Boolean(opts.dryRun),
      cwd: opts.cwd as string,
      cliVersion: version,
    });
  });

program
  .command("upgrade")
  .description("Upgrade the global GWF CLI package")
  .option("--tag <tag>", "npm dist-tag", "latest")
  .option("--dry-run", "Print the npm command only", false)
  .action(async (opts) => {
    await upgradeCommand({
      tag: opts.tag as string,
      dryRun: Boolean(opts.dryRun),
    });
  });

program
  .command("doctor")
  .description("Check environment and project health")
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await doctorCommand({
      cwd: opts.cwd as string,
      cliVersion: version,
    });
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[gwf] ${msg}`);
  process.exit(1);
});
