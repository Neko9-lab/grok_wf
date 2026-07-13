---
name: gwf-brainstorm
description: >
  GWF planning skill. Use when the user agreed to create a GWF task, when clarifying
  requirements for a feature, or when drafting/updating prd.md / design.md / implement.md.
  Triggers: brainstorm, write PRD, plan task, clarify requirements, gwf plan.
---

# gwf-brainstorm

## Goal

Turn a consented full task into clear planning artifacts under `.gwf/tasks/<id>/`.

## Steps

1. If no task directory yet:
   ```bash
   python .gwf/scripts/task.py create "<title>" --slug <slug>
   ```
2. Survey existing code, tests, specs, and related tasks **before** asking questions.
3. Write/iterate `prd.md`: goal, requirements, acceptance criteria, out of scope.
4. Ask **one question at a time**, with a recommended answer when possible.
5. If complex (multi-layer, new APIs, data model): add `design.md` and `implement.md`.
6. Put research findings in `research/*.md` if needed.
7. Curate `implement.jsonl` / `check.jsonl` with **spec and research paths only**:
   ```bash
   python .gwf/scripts/task.py add-context <task> implement ".gwf/spec/..." "reason"
   python .gwf/scripts/get_context.py --mode packages
   ```
8. When the user approves the plan:
   ```bash
   python .gwf/scripts/task.py start <task-id>
   ```

## Do not

- Start large code edits in this skill.
- Put source file paths into jsonl manifests.
