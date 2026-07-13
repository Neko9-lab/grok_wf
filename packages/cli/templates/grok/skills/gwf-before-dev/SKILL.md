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
   - `prd.md`
   - `design.md` / `implement.md` if present
   - each `file` entry in `implement.jsonl` (skip `_example` lines)
3. Read relevant `.gwf/spec/**/index.md` and listed guidelines.
4. Summarize constraints that will guide implementation (5–10 bullets).
5. Only then implement (inline or via gwf-implement agent).

## Do not

- Skip specs because they look like placeholders — note gaps and proceed carefully.
- Commit changes in this skill.
