import { spawnSync } from "node:child_process";
import chalk from "chalk";

export interface UpgradeOptions {
  tag: string;
  dryRun: boolean;
}

export async function upgradeCommand(opts: UpgradeOptions): Promise<void> {
  const pkg = "gwf-cli";
  const spec = `${pkg}@${opts.tag}`;
  const cmd = `npm install -g ${spec}`;

  console.log(chalk.bold("\nGWF upgrade"));
  console.log(chalk.dim(`  ${cmd}\n`));

  if (opts.dryRun) {
    console.log(chalk.yellow("Dry-run — not executing."));
    return;
  }

  const result = spawnSync(
    "npm",
    ["install", "-g", spec, "--registry", "https://registry.npmjs.org/"],
    {
      stdio: "inherit",
      shell: true,
    },
  );

  if (result.status !== 0) {
    throw new Error(
      `npm install failed (exit ${result.status ?? "unknown"}). If the package is not published yet, use local: npm run build && npm link -w gwf-cli`,
    );
  }

  console.log(
    chalk.green(
      `\n✓ CLI upgraded. In each project run: ${chalk.bold("gwf update")}`,
    ),
  );
}
