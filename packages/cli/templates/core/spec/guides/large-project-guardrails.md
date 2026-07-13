# Large project guardrails

> Use on mid/large repos where unrestricted AI edits can break the product.

## Mandatory rules

#### Required

1. **Every full task has `scope.json`** before `task.py start` (or before first code edit).
2. **Deny high-risk trees** by default (core package, migrations, lockfiles, CI secrets).
3. **Prefer vertical slices**: one module + its tests + minimal docs — not “drive-by refactors”.
4. **Run `python .gwf/scripts/check_scope.py --strict-missing` in gwf-check**.
5. **Install git gate**: `gwf install-hooks` so `git commit` runs `check_scope.py --pre-commit`.
6. **Run the smallest relevant test command** before finish (not only “it imports”).
7. **If scope must expand**: stop, update `prd.md` + `scope.json`, get user consent, then continue.

#### Forbidden

- Touching core packages “while here” without scope update
- Mass formatting / renames mixed with feature work
- Deleting or weakening tests to go green
- Committing without gwf-check after multi-file edits

## `scope.json` template

```json
{
  "allow_globs": [
    "path/to/feature/**",
    "tests/path/to/feature/**"
  ],
  "deny_globs": [
    "**/migrations/**",
    "**/vendor/**",
    "package-lock.json",
    "uv.lock",
    "pnpm-lock.yaml"
  ],
  "max_changed_files": 25
}
```

Paths are matched with `fnmatch` (use `**` for recursion).  
`.gwf/**`, `.grok/**`, and `AGENTS.md` are always allowed.

## Spec quality bar (large repos)

Good specs for large systems are **executable**:

| Good | Bad |
|------|-----|
| “Public API lives in `pkg/`; tests in `tests/`” | “Write clean code” |
| “Do not change OpenAPI without tests X,Y” | “Be careful with API” |
| “Errors use HTTPException; no raw status dicts” | “Handle errors properly” |
| Explicit deny list for core dirs | No blast radius |

## Failure modes GWF is meant to catch

1. **Scope creep** — extra files → `check_scope.py` fails  
2. **Missing contract** — empty placeholder specs → before-dev / check should refuse or warn  
3. **No verification** — gwf-check without tests on risky paths  
4. **Silent core edits** — deny_globs on package root  

## Human gates (still required)

- Approve `prd.md` + `scope.json` before coding  
- Approve commit plan in Phase 3.4  
- For public API / data / security: extra human review beyond AI check  
