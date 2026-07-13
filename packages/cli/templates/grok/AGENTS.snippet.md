# GWF (Grok Workflow Framework)

This project uses **GWF** for structured AI development. Prefer GWF over ad-hoc large changes.

## When to use GWF

- Multi-file features, non-trivial bugs, refactors → create a GWF task (ask user first).
- Simple Q&A or tiny one-line fixes → no task required.

## Workflow

Follow `.gwf/workflow.md`: **Plan → Execute → Finish**.

1. Orient: run `python .gwf/scripts/get_context.py` (or rely on SessionStart hook output).
2. Plan: `python .gwf/scripts/task.py create "..."`, brainstorm into `prd.md`, then `task.py start`.
3. Execute: read specs + artifacts; implement; run **gwf-check**.
4. Finish: update specs if needed; commit with user approval; `/finish-work`.

## Paths

| Path | Purpose |
|------|---------|
| `.gwf/workflow.md` | Workflow contract |
| `.gwf/spec/` | Team conventions |
| `.gwf/tasks/` | Active tasks |
| `.gwf/workspace/` | Developer journals |
| `.grok/skills/` | GWF skills |
| `.grok/commands/` | `/start` `/continue` `/finish-work` |

## Skills

Use when relevant: `gwf-brainstorm`, `gwf-before-dev`, `gwf-check`, `gwf-update-spec`, `gwf-break-loop`.

## Agents

Spawn when helpful: `gwf-research` (readonly), `gwf-implement` (code, no commit), `gwf-check` (verify/fix).
