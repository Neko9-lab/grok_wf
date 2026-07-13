# GWF (Grok Workflow Framework)

This project uses **GWF** for structured AI development. Prefer GWF over ad-hoc large changes.

## When to use GWF

- Multi-file features, non-trivial bugs, refactors → create a GWF task (ask user first).
- Simple Q&A or tiny one-line fixes → no task required.

## Session orientation

**Preferred:** Grok folder is trusted so SessionStart injects `get_context.py` output automatically — the user should **not** need `/start` every time.

If context is missing (untrusted folder), immediately run:

```bash
python .gwf/scripts/get_context.py
```

Then continue. To re-enable auto-inject: `gwf trust` or `gwf enable-automations` or `grok --trust`.

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
