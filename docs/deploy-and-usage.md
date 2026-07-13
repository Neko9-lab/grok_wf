# Deploy & usage

[English](./deploy-and-usage.md) | [中文](./部署与使用.md)

How to install **gwf-cli**, initialize any project, and use it with **Grok Build**.

| | |
|--|--|
| **Package** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) (`gwf`) |
| **Repository** | https://github.com/Neko9-lab/grok_wf |
| **Changelog** | [CHANGELOG.md](../CHANGELOG.md) |

---

## 1. Requirements

| Dependency | Version |
|------------|---------|
| Node.js | >= 18.17 |
| Python | >= 3.9 (task scripts / scope checks) |
| Git | recent |
| Grok Build | `grok` available in terminal |

---

## 2. Install the CLI (once)

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/
gwf -V
```

> If your default registry is a mirror and the latest version is missing, pass  
> `--registry https://registry.npmjs.org/`.

**Upgrade:**

```bash
npm install -g gwf-cli@latest --registry https://registry.npmjs.org/
# or
gwf upgrade
```

After upgrading the CLI, in **each already-initialized project**:

```bash
gwf update
```

---

## 3. Deploy into a project (once per repo)

```bash
cd your-project
gwf init -u your-name
```

### 3.1 Confirmation prompt (Enter = Yes)

After scaffolding, GWF asks in plain Chinese whether to enable two recommended items:

| Item | Effect |
|------|--------|
| ① Allow this project to auto-load the workflow | Grok SessionStart injects context — **no `/start` every time** |
| ② Check change scope before commit | Git pre-commit blocks out-of-scope files |

```text
是否开启以上两项？ [Y/n，直接回车=是]
```

Other options:

```bash
gwf init -u your-name -y                 # no prompt, enable both
gwf init -u your-name --no-automations   # enable neither
```

Already initialized?

```bash
gwf enable-automations
# or
gwf trust              # auto-load only
gwf install-hooks      # commit check only
```

### 3.2 Commit scaffold (recommended)

```bash
git add .gwf .grok AGENTS.md .gitignore
git commit -m "chore: init GWF workflow"
```

---

## 4. Daily use

```bash
cd your-project
grok
# e.g. “Add user login”
```

**Recommended path:** `init` (confirm) → open Grok → describe the goal.

| Situation | What you do |
|-----------|-------------|
| Small change | Just ask; task optional |
| Large change | Confirm task + **scope** |
| During work | AI should stay inside scope |
| Before commit | Pre-commit may block out-of-scope diffs |
| Done | `/finish-work` or ask AI to archive |

### 4.1 What is scope?

- **A limit:** which paths this task may change, to protect large repos.
- **Usually drafted by AI:** AI fills `scope.json`; you confirm or say “only touch `src/xxx`”.
- **Machine check:**

```bash
python .gwf/scripts/check_scope.py --strict-missing
```

---

## 5. Command reference

| Command | Purpose |
|---------|---------|
| `gwf init -u <name>` | Init + confirm automations |
| `gwf update` | Sync templates |
| `gwf upgrade` | Upgrade global CLI |
| `gwf doctor` | Health check (trust, hooks, version) |
| `gwf trust` | Grok auto-load only |
| `gwf enable-automations` | Prompt again for both items |
| `gwf install-hooks` | Git scope gate only |
| `gwf -V` | Show version |

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Grok ignores GWF | `gwf trust` or `gwf doctor` |
| No auto context | Open Grok at **repo root**; run `gwf enable-automations` |
| Commit rejected | Diff outside `scope.json`; fix files or update scope |
| `gwf` not found | Reinstall global package; reopen terminal |
| Mirror missing latest | Use `--registry https://registry.npmjs.org/` |

---

## 7. Develop & publish

```bash
git clone https://github.com/Neko9-lab/grok_wf.git
cd grok_wf
npm install
npm run build
npm link -w gwf-cli
```

Publish to npm (login + 2FA or granular token):

```bash
npm publish -w gwf-cli --access public --registry https://registry.npmjs.org/
```

---

## 8. Version notes

| gwf-cli | Notes |
|---------|--------|
| 0.1.0 | First npm release |
| 0.1.1 | Init trust + git hooks |
| 0.1.2 | Plain Chinese confirm |
| 0.1.3 | Deploy guide + CHANGELOG |
| 0.1.4+ | Separate EN / 中文 docs with language switch links |

```bash
npm install -g gwf-cli@latest --registry https://registry.npmjs.org/
```
