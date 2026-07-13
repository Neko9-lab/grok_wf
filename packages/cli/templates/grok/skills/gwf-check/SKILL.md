---
name: gwf-check
description: >
  GWF verification skill. Use after implementing a change, before finish-work, or when the
  user asks to review/verify against specs and tests. Triggers: check work, verify, review diff,
  run tests, gwf-check, blast radius, scope check.
---

# gwf-check

## Goal

Verify the current diff against **blast radius**, task acceptance criteria, and project specs; self-fix safe issues. Prevent large-repo chaos.

## Steps (order matters)

### 0. Scope gate (mandatory on mid/large projects)

```bash
python .gwf/scripts/check_scope.py --strict-missing
# or: python .gwf/scripts/check_scope.py <task-id> --strict-missing
```

- Exit code **1** → **stop**. Do not keep coding. Either revert out-of-scope files or update `scope.json` + `prd.md` after user consent.
- Missing `scope.json` with `--strict-missing` → fail (create via `task.py set-blast-radius`).

### 1. Inventory

```bash
git diff --name-only HEAD
git status --porcelain
```

### 2. Spec + PRD review

- Load active task `prd.md`, `check.jsonl` specs, `design.md` / `implement.md` if present.
- Confirm acceptance criteria still make sense for the files actually touched.

### 3. Quality commands

- Prefer project scripts / `pytest` / `npm test` / typecheck for **touched areas**.
- Read `.gwf/config.yaml` `quality:` overrides when set.
- For library cores: run the smallest relevant subset, not only "file imports".

### 4. Fix loop

- Fix issues you can safely fix **inside scope**.
- Re-run `check_scope.py` and tests.
- Report: passed / failed / residual risks / any scope pressure.

## Fail closed when

| Signal | Action |
|--------|--------|
| Diff hits `deny_globs` | Revert or re-scope with user OK |
| Files outside `allow_globs` | Same |
| Core package edited "while here" | Treat as incident; break-loop + update-spec |
| Tests deleted/weakened to pass | Reject; restore tests |
| Placeholder specs only ("write clean code") | Warn; tighten specs before more edits |

## Do not

- Force-push, amend published commits, or push without request.
- Expand scope without updating `scope.json` and user consent.
- Mark done if `check_scope.py` fails.
