import { resolve } from "node:path";
import { enableAutomations } from "../lib/enable-automations.js";

export interface EnableAutomationsCmdOptions {
  cwd: string;
  yes: boolean;
  force: boolean;
}

export async function enableAutomationsCommand(
  opts: EnableAutomationsCmdOptions,
): Promise<void> {
  await enableAutomations({
    projectRoot: resolve(opts.cwd),
    yes: opts.yes,
    skip: false,
    forceHooks: opts.force,
  });
}
