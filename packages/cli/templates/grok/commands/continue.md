---
description: Advance the current GWF task to the next workflow step
---

# /continue — Advance current task

1. Run `python .gwf/scripts/get_context.py` and `python .gwf/scripts/get_context.py --mode workflow-state`.
2. Read active task `task.json`, `prd.md`, and any design/implement docs.
3. Decide the next step from `.gwf/workflow.md` (Plan / Execute / Finish).
4. Perform only that next step (or a tight sequence if already mid-step).
5. Tell the user what you did and what the next `/continue` would do.

If there is no active task, help pick or create one (with consent).
