# GWF Workflow

Grok Workflow Framework — Plan → Execute → Finish.

This file is the **source of truth** for how Grok Build should run development work in this repo.

## Turn classification

Before creating a task, classify the user request:

| Type | When | Action |
|------|------|--------|
| Simple chat | Q&A, explanation, no repo changes | No task. Answer directly. |
| Inline small change | Single-turn, local, easy to verify | Ask once if a GWF task is wanted; if no, implement inline. |
| Full task | Multi-file, needs lasting plan, or non-trivial feature/bugfix | Ask to create a GWF task and enter **Plan**. |

Do **not** silently start large work without consent for a full task.

## Phase 1 — Plan

1.0 Create task: `python .gwf/scripts/task.py create "<title>"` (optional `--slug`, `--priority`, `--assignee`).
1.1 Activate **gwf-brainstorm**: clarify requirements one question at a time; write/iterate `prd.md`.
1.2 Complex tasks: write `design.md` and `implement.md` before coding.
1.3 Research notes go under `tasks/<id>/research/`.
1.4 Curate `implement.jsonl` / `check.jsonl` with **spec + research paths only** (no source code paths).
1.4b **Blast radius**: fill `scope.json` (`allow_globs` / `deny_globs` / `max_changed_files`). On large repos this is mandatory before coding. Helper: `python .gwf/scripts/task.py set-blast-radius <id> --allow 'src/foo/**' --deny 'vendor/**'`.
1.5 After user reviews plan artifacts + scope: `python .gwf/scripts/task.py start <task-dir-or-id>`.

## Phase 2 — Execute

2.1 Activate **gwf-before-dev**: read relevant specs and task artifacts before editing.
2.2 Implement against `prd.md` (+ design/implement if present) **and stay inside `scope.json`**. Prefer **gwf-implement** agent for larger changes. Do not git commit inside implement.
2.3 Activate **gwf-check** (or **gwf-check** agent):
    - `python .gwf/scripts/check_scope.py --strict-missing`
    - review diff vs specs / acceptance criteria
    - run lint/typecheck/test if available; self-fix when safe
    - if scope must grow: stop and get user consent, update scope.json first

## Phase 3 — Finish

3.1 Final **gwf-check**.
3.2 Optional **gwf-break-loop** after a hard bugfix.
3.3 **gwf-update-spec**: promote durable learnings into `.gwf/spec/`.
3.4 Propose a batched commit plan; wait for user confirmation; then `git commit` (no amend, no push unless asked).
3.5 `/finish-work`: archive completed task + append workspace journal (only after work commits exist; refuse if non-gwf dirty files remain).

## Commands

| Command | Purpose |
|---------|---------|
| `/start` | Orient session: workflow, context, active tasks |
| `/continue` | Advance current task to the next workflow step |
| `/finish-work` | Archive + journal after commits |

## Skills (auto-trigger)

- `gwf-brainstorm` — planning / PRD
- `gwf-before-dev` — pre-code checklist
- `gwf-check` — verify + self-fix
- `gwf-update-spec` — write back conventions
- `gwf-break-loop` — hard-bug retrospective

## Agents

- `gwf-research` — read-only investigation → `research/`
- `gwf-implement` — write code, no commit
- `gwf-check` — review + fix loop

## Workflow-state breadcrumbs

Hooks inject the matching block based on active task status.

[workflow-state:no_task]
No active GWF task for this session.
- Classify the user request (chat / inline / full task).
- For full tasks: ask consent, then create task and enter Plan.
- For orientation: run `python .gwf/scripts/get_context.py` and read `.gwf/workflow.md`.
[/workflow-state:no_task]

[workflow-state:planning]
Active task is in **planning**.
- Continue brainstorm / PRD (and design/implement docs if complex).
- Curate implement.jsonl / check.jsonl with specs + research only.
- When user approves the plan: `python .gwf/scripts/task.py start <id>` then move to Execute.
- Use `/continue` if unsure of the next step.
[/workflow-state:planning]

[workflow-state:in_progress]
Active task is **in_progress**.
- Implement against prd (+ design/implement), after gwf-before-dev.
- Run gwf-check; iterate until green enough.
- Then Finish: update-spec → commit plan → `/finish-work`.
- Use `/continue` to advance.
[/workflow-state:in_progress]

[workflow-state:completed]
Task marked completed/archived. Prefer starting a new task or picking another active one.
[/workflow-state:completed]
