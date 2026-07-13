import chalk from "chalk";
import { installHooksCommand } from "../commands/install-hooks.js";
import { confirm } from "./confirm.js";
import { trustGrokFolder } from "./grok-trust.js";

export interface AutomationOptions {
  projectRoot: string;
  /** Skip prompt; enable both. */
  yes?: boolean;
  /** Skip automations entirely. */
  skip?: boolean;
  /** Force rewrite git hook block. */
  forceHooks?: boolean;
}

export interface AutomationResult {
  enabled: boolean;
  gitHooks: "installed" | "skipped" | "failed";
  grokTrust: "created" | "updated" | "unchanged" | "skipped" | "failed";
}

/**
 * Enable SessionStart auto-inject (Grok folder trust) + git pre-commit scope gate.
 * Prompts once unless yes/skip.
 */
export async function enableAutomations(
  opts: AutomationOptions,
): Promise<AutomationResult> {
  if (opts.skip) {
    return { enabled: false, gitHooks: "skipped", grokTrust: "skipped" };
  }

  let ok = Boolean(opts.yes);
  if (!opts.yes) {
    console.log(chalk.bold("\nGWF automations (recommended)"));
    console.log(
      chalk.dim(
        "  Without these, SessionStart will not inject context and you must /start manually.",
      ),
    );
    console.log(
      [
        "",
        "  1. " + chalk.cyan("Grok folder trust"),
        "     → SessionStart / UserPromptSubmit hooks auto-run (no /start)",
        "  2. " + chalk.cyan("Git pre-commit"),
        "     → block commits outside task scope.json",
        "",
      ].join("\n"),
    );
    ok = await confirm(
      "Enable both now? (second confirmation — default Yes)",
      true,
    );
  }

  if (!ok) {
    console.log(
      chalk.yellow(
        "\nSkipped. You can enable later:\n" +
          "  gwf install-hooks\n" +
          "  gwf trust\n" +
          "  or: grok --trust\n",
      ),
    );
    return { enabled: false, gitHooks: "skipped", grokTrust: "skipped" };
  }

  let gitHooks: AutomationResult["gitHooks"] = "failed";
  let grokTrust: AutomationResult["grokTrust"] = "failed";

  try {
    await installHooksCommand({
      cwd: opts.projectRoot,
      force: Boolean(opts.forceHooks),
      uninstall: false,
    });
    gitHooks = "installed";
  } catch (e) {
    console.error(
      chalk.red(
        `[gwf] git hooks failed: ${e instanceof Error ? e.message : String(e)}`,
      ),
    );
    gitHooks = "failed";
  }

  try {
    const r = trustGrokFolder(opts.projectRoot);
    grokTrust = r.action;
    console.log(
      chalk.green(
        `✓ Grok trust: ${r.action} → ${r.path}\n` +
          chalk.dim(
            "  Project hooks will auto-inject context on next Grok session in this folder.",
          ),
      ),
    );
  } catch (e) {
    console.error(
      chalk.red(
        `[gwf] Grok trust failed: ${e instanceof Error ? e.message : String(e)}`,
      ),
    );
    console.log(
      chalk.yellow("  Fallback: open Grok here with  grok --trust"),
    );
    grokTrust = "failed";
  }

  return { enabled: true, gitHooks, grokTrust };
}
