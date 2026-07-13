---
description: Archive completed GWF task and write workspace journal (after commits)
---

# /finish-work — Archive + journal

## Preconditions

1. Run `python .gwf/scripts/get_context.py --mode record`.
2. Run `git status --porcelain`.
3. Ignore dirty paths under `.gwf/workspace/` and `.gwf/tasks/` for the "must be clean" check if they are bookkeeping only; **any other dirty application code → STOP** and return to Phase 3.4 commits first.

## Steps

1. Confirm acceptance criteria for the active task are met (or user accepts remaining debt).
2. Archive: `python .gwf/scripts/task.py archive <task-id>`
3. Journal: `python .gwf/scripts/add_session.py --title "..." --commit "<hash>" --task "<id>" --summary "..."`
4. Optionally commit bookkeeping files (`.gwf/tasks/archive/...`, journal) if the project tracks them — ask user before committing.
5. Summarize what shipped.

`/finish-work` does **not** create feature commits; those happen in Phase 3.4 before this command.
