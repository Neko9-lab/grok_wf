# GWF — Grok Workflow Framework

**English** | **中文**

An out-of-the-box **AI coding workflow framework for Grok Build only**.

开箱即用的 **Grok Build 专用** AI 编码工作流框架。

It persists specs, tasks, and session journals in your repo, and runs a **Plan → Execute → Finish** loop so agents follow project standards. Install into any project with `gwf init`.

把规范（spec）、任务（task）、会话记忆（journal）沉淀进仓库，用 **Plan → Execute → Finish** 约束开发过程。任意项目执行 `gwf init` 即可使用。

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) (command: `gwf`) |
| **Deploy & usage** | [docs/deploy-and-usage.md](./docs/deploy-and-usage.md) · [部署与使用](./docs/部署与使用.md) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

---

## 30-second start / 30 秒上手

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# Confirm in Chinese: enable auto-load + commit scope check? Enter = Yes
# 中文提示：是否开启「自动加载工作流 + 提交前范围检查」？直接回车 = 是

grok
# Describe what you want / 直接说需求（无需每次 /start）
```

---

## Prerequisites / 前置要求

| Requirement / 依赖 | Version / 版本 |
|--------------------|----------------|
| Node.js | >= 18.17 |
| Python | >= 3.9 |
| Git | recent |
| [Grok Build](https://x.ai/) | installed |

---

## Common commands / 常用命令

| Command / 命令 | Purpose / 作用 |
|----------------|----------------|
| `gwf init -u <name>` | Init project; confirm auto-load + commit checks · 初始化；二次确认后开启自动加载与提交检查 |
| `gwf init -u <name> -y` | Same, no prompt · 不提问，直接全开 |
| `gwf enable-automations` | Re-enable the two setup items · 已有项目补开上述两项 |
| `gwf trust` | Trust folder for Grok auto context · 仅开启：打开 Grok 自动加载工作流 |
| `gwf update` | Sync project templates to CLI version · 同步项目模板到当前 CLI 版本 |
| `gwf upgrade` | Upgrade global CLI · 升级全局 CLI |
| `gwf doctor` | Health check · 环境与配置检查 |
| `gwf install-hooks` | Git pre-commit scope gate only · 仅安装 git 提交范围检查 |

---

## Layout after init / init 后目录

```
your-project/
├── .gwf/          # Core workflow / 工作流核心 (workflow, spec, tasks, scripts)
├── .grok/         # Grok skills / commands / hooks / agents
└── AGENTS.md      # Grok entry instructions / Grok 入口说明
```

---

## Workflow (for the agent) / 工作流（给 AI）

1. **Plan** — Clarify requirements, write `prd.md`, fill `scope.json` (allowed paths)  
   **规划** — 澄清需求，写 `prd.md`，填写 `scope.json`（允许改的路径）  
2. **Execute** — Implement within scope + check  
   **实现** — 在范围内实现并检查  
3. **Finish** — Update specs, commit, archive, journal  
   **收尾** — 更新规范、提交、归档、写 journal  

**You mainly:** state the goal, confirm scope, approve commits.  
**你主要负责：** 说需求、确认范围、确认提交。

---

## Develop this repo / 开发本仓库

```bash
npm install
npm run build
npm link -w gwf-cli
# or / 或: node packages/cli/bin/gwf.js --help
```

Full guide: [docs/deploy-and-usage.md](./docs/deploy-and-usage.md).

---

## License / 许可

MIT
