#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { updateCommand } from "./commands/update.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { doctorCommand } from "./commands/doctor.js";
import { installHooksCommand } from "./commands/install-hooks.js";
import { trustCommand } from "./commands/trust.js";
import { enableAutomationsCommand } from "./commands/enable-automations.js";

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
  .description(
    "Initialize GWF (scaffolds project + prompts to enable auto-inject & git hooks)",
  )
  .requiredOption("-u, --user <name>", "Developer identity name")
  .option("-f, --force", "Overwrite conflicting template files", false)
  .option("-s, --skip-existing", "Skip files that already exist", false)
  .option(
    "-y, --yes",
    "Skip confirmation; enable Grok trust + git hooks",
    false,
  )
  .option(
    "--no-automations",
    "Do not enable Grok trust or git pre-commit hooks",
    false,
  )
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await initCommand({
      user: opts.user as string,
      force: Boolean(opts.force),
      skipExisting: Boolean(opts.skipExisting),
      cwd: opts.cwd as string,
      cliVersion: version,
      yes: Boolean(opts.yes),
      noAutomations: Boolean(opts.noAutomations),
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

program
  .command("install-hooks")
  .description("Install git pre-commit hook that runs check_scope (blast radius)")
  .option("-f, --force", "Rewrite the GWF hook block", false)
  .option("--uninstall", "Remove the GWF pre-commit block", false)
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await installHooksCommand({
      cwd: opts.cwd as string,
      force: Boolean(opts.force),
      uninstall: Boolean(opts.uninstall),
    });
  });

program
  .command("trust")
  .description(
    "Trust this folder in Grok Build so SessionStart hooks auto-inject GWF context",
  )
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await trustCommand({ cwd: opts.cwd as string });
  });

program
  .command("enable-automations")
  .description(
    "Prompt to enable Grok auto-inject (trust) + git pre-commit scope gate",
  )
  .option("-y, --yes", "Skip confirmation; enable both", false)
  .option("-f, --force", "Force rewrite git hook block", false)
  .option("--cwd <path>", "Target project directory", process.cwd())
  .action(async (opts) => {
    await enableAutomationsCommand({
      cwd: opts.cwd as string,
      yes: Boolean(opts.yes),
      force: Boolean(opts.force),
    });
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[gwf] ${msg}`);
  process.exit(1);
});
