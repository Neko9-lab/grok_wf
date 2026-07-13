---
name: gwf-before-dev
description: >
  GWF pre-implementation checklist. Use before writing application code for a GWF task
  or non-trivial change. Triggers: before coding, start implementing, pre-dev, read specs first.
---

# gwf-before-dev

## Goal

Load the right conventions **before** editing code.

## Steps

1. Identify active task via `python .gwf/scripts/get_context.py`.
2. Read in order:
   - `prd.md` (especially **Out of scope**)
   - **`scope.json`** — if `allow_globs` is empty on a large repo, **stop** and fill blast radius first:
     `python .gwf/scripts/task.py set-blast-radius <id> --allow '…' --deny '…'`
   - `design.md` / `implement.md` if present
   - each `file` entry in `implement.jsonl` (skip `_example` lines)
3. Read relevant `.gwf/spec/**/index.md`, plus `guides/large-project-guardrails.md` when present.
4. Summarize constraints that will guide implementation (5–10 bullets), including **allowed paths**.
5. Only then implement (inline or via gwf-implement agent). Stay inside `allow_globs`.

## Do not

- Skip specs because they look like placeholders — note gaps; on large repos **tighten before coding**.
- Edit denied trees or "drive-by refactor" outside scope.
- Commit changes in this skill.
