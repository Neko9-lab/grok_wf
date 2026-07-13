# Deploy & usage / 部署与使用

**English** | **中文** (same content, bilingual)

How to install **gwf-cli**, initialize any project, and use it with **Grok Build**.

如何安装 **gwf-cli**、在任意项目中初始化，并在 **Grok Build** 中直接写需求。

| | |
|--|--|
| **Package / 包名** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) (`gwf`) |
| **Repository / 仓库** | https://github.com/Neko9-lab/grok_wf |
| **Changelog / 更新日志** | [CHANGELOG.md](../CHANGELOG.md) |

> Alias path for Chinese links: [部署与使用.md](./部署与使用.md) (same document).

---

## 1. Requirements / 环境要求

| Dependency / 依赖 | Version / 版本 |
|-------------------|----------------|
| Node.js | >= 18.17 |
| Python | >= 3.9 (task scripts / scope checks) |
| Git | recent |
| Grok Build | `grok` available in terminal |

---

## 2. Install the CLI (once) / 安装 CLI（全局，装一次）

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/
gwf -V
```

> If your default registry is a mirror and the latest version is missing, pass  
> `--registry https://registry.npmjs.org/`.  
> 若默认用了国内镜像、暂时装不到最新版，请加上官方源参数。

**Upgrade / 升级：**

```bash
npm install -g gwf-cli@latest --registry https://registry.npmjs.org/
# or / 或
gwf upgrade
```

After upgrading the CLI, in **each already-initialized project**:

每个**已 init 的项目**升级 CLI 后建议再执行：

```bash
gwf update
```

---

## 3. Deploy into a project (once per repo) / 在项目中部署（每个项目一次）

```bash
cd your-project
gwf init -u your-name
```

### 3.1 Confirmation prompt / 二次确认（Enter = Yes）

After scaffolding, GWF asks in **plain Chinese** whether to enable two items (recommended):

脚手架结束后会用**中文白话**询问是否开启两项（推荐都开）：

| Item / 项 | Effect / 效果 |
|-----------|----------------|
| ① Allow this project to auto-load the workflow · 允许本项目自动加载工作流 | Grok SessionStart injects context — **no `/start` every time** · 打开 Grok 自动带任务/规范，**不用每次 `/start`** |
| ② Check change scope before commit · 提交代码前检查改动范围 | Git pre-commit blocks out-of-scope files · 防止范围外改动被提交 |

```text
是否开启以上两项？ [Y/n，直接回车=是]
Enable both items above? [Y/n, Enter = Yes]
```

Other options / 其他方式：

```bash
gwf init -u your-name -y                 # no prompt, enable both / 不提问，两项都开
gwf init -u your-name --no-automations   # enable neither / 都不开（需自己 /start）
```

Already initialized? / 已 init 过、想补开：

```bash
gwf enable-automations
# or / 或
gwf trust              # auto-load only / 只开「自动加载」
gwf install-hooks      # commit check only / 只开「提交检查」
```

### 3.2 Commit scaffold (recommended) / 提交脚手架（建议）

```bash
git add .gwf .grok AGENTS.md .gitignore
git commit -m "chore: init GWF workflow"
```

---

## 4. Daily use / 日常使用

```bash
cd your-project
grok
# e.g. “Add user login” / 例如：加一个用户登录功能
```

**Recommended path / 推荐路径：** `init` (confirm) → open Grok → describe the goal.

| Situation / 场景 | What you do / 你做什么 |
|------------------|------------------------|
| Small change / 小改 | Just ask; task optional / 直接说，可不建任务 |
| Large change / 大改 | Confirm task + **scope** / 确认建任务与**改动范围** |
| During work / 实现中 | AI should stay inside scope / AI 应只在范围内改 |
| Before commit / 提交前 | Pre-commit may block out-of-scope diffs / 钩子可能拦截越界 |
| Done / 结束 | `/finish-work` or ask AI to archive / 归档并写 journal |

### 4.1 What is scope? / scope（改动范围）是什么？

- **A limit / 是限制：** which paths this task may change, to protect large repos.  
  限制「这次允许改哪些路径」，防大仓乱改。  
- **Usually drafted by AI / 通常不用手写：** AI fills `scope.json`; you confirm or say “only touch `src/xxx`”.  
  AI 起草，你确认或口头指定。  
- **Machine check / 机器检查：**

```bash
python .gwf/scripts/check_scope.py --strict-missing
```

---

## 5. Command reference / 常用命令

| Command / 命令 | Purpose / 作用 |
|----------------|----------------|
| `gwf init -u <name>` | Init + confirm automations / 初始化 + 二次确认自动化 |
| `gwf update` | Sync templates / 同步项目模板 |
| `gwf upgrade` | Upgrade global CLI / 升级全局 CLI |
| `gwf doctor` | Health check (trust, hooks, version) / 环境与配置检查 |
| `gwf trust` | Grok auto-load only / 仅开启自动加载工作流 |
| `gwf enable-automations` | Prompt again for both items / 再次确认开启两项 |
| `gwf install-hooks` | Git scope gate only / 仅安装 git 提交范围检查 |
| `gwf -V` | Show version / 显示版本 |

---

## 6. Troubleshooting / 故障排查

| Symptom / 现象 | Fix / 处理 |
|----------------|------------|
| Grok ignores GWF / 像不认识 GWF | `gwf trust` or `gwf doctor` |
| No auto context / 无自动上下文 | Open Grok at **repo root**; run `gwf enable-automations` |
| Commit rejected / commit 被拒 | Diff outside `scope.json`; fix files or update scope |
| `gwf` not found / 找不到命令 | Reinstall global package; reopen terminal |
| Mirror missing latest / 镜像无新版 | Use `--registry https://registry.npmjs.org/` |

---

## 7. Develop & publish / 开发与发版

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

## 8. Version notes / 版本对应

| gwf-cli | Notes / 说明 |
|---------|----------------|
| 0.1.0 | First npm release / 首发 |
| 0.1.1 | Init trust + git hooks / init 集成自动化 |
| 0.1.2 | Plain Chinese confirm / 中文白话确认 |
| 0.1.3 | Deploy guide + CHANGELOG / 部署文档与更新日志 |
| 0.1.4+ | Bilingual docs / 文档中英双语 |

```bash
npm install -g gwf-cli@latest --registry https://registry.npmjs.org/
```
