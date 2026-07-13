---
name: gwf-check
description: >
  GWF verification skill. Use after implementing a change, before finish-work, or when the
  user asks to review/verify against specs and tests. Triggers: check work, verify, review diff,
  run tests, gwf-check.
---

# gwf-check

## Goal

Verify the current diff against task acceptance criteria and project specs; self-fix safe issues.

## Steps

1. `git diff --name-only HEAD` and `git status --porcelain` (and unstaged diffs).
2. Load active task `prd.md` + `check.jsonl` specs.
3. Review changes against acceptance criteria and specs.
4. Run project quality commands if known (`package.json` scripts, `pytest`, etc.).
   Check `.gwf/config.yaml` `quality:` overrides when set.
5. Fix issues you can safely fix; re-run checks.
6. Report: what passed, what failed, residual risks.

## Do not

- Force-push, amend published commits, or push without request.
- Expand scope beyond the task without asking.
