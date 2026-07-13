# GWF — Grok Workflow Framework

开箱即用的 **Grok Build 专用** AI 编码工作流框架。

把规范（spec）、任务（task）、会话记忆（journal）沉淀进仓库，用 Plan → Execute → Finish 约束 AI 开发过程。可在任意项目中 `gwf init` 安装使用。

## 前置要求

- Node.js >= 18.17
- Python >= 3.9
- [Grok Build](https://x.ai/) CLI / TUI
- Git

## 安装

```bash
# 从本仓库本地开发安装
npm install
npm run build
npm link -w gwf-cli

# 或全局（npm 已发布）
npm install -g gwf-cli
```

## 在任意项目中使用

```bash
cd your-project
gwf init -u your-name
# 默认会二次确认后启用：
#   1) Grok folder trust → SessionStart 自动注入（不用每次 /start）
#   2) git pre-commit → 越界 diff 禁止提交
# 跳过确认直接全开:  gwf init -u your-name -y
# 完全不要自动化:    gwf init -u your-name --no-automations

# 直接开 Grok，描述需求即可
grok
```

## 命令

| 命令 | 作用 |
|------|------|
| `gwf init -u <name>` | 在当前项目初始化 GWF |
| `gwf update` | 把项目模板同步到当前 CLI 版本 |
| `gwf upgrade` | 升级全局 CLI 包 |
| `gwf doctor` | 检查环境与项目健康状态 |
| `gwf install-hooks` | 安装 git pre-commit（越界 diff 禁止提交） |
| `gwf version` | 显示 CLI 版本 |

## 目录结构（init 后）

```
your-project/
├── .gwf/                 # 工作流核心（进 git）
│   ├── workflow.md
│   ├── config.yaml
│   ├── scripts/          # task / context / journal
│   ├── spec/             # 团队规范
│   ├── tasks/            # 任务
│   └── workspace/        # 开发者 journal
├── .grok/                # Grok Build 适配
│   ├── skills/
│   ├── commands/
│   ├── agents/
│   └── hooks/
└── AGENTS.md             # Grok 入口 prelude
```

## 工作流

1. **Plan** — 澄清需求，写 `prd.md`（复杂任务再写 design/implement）
2. **Execute** — 按 artifacts + spec 实现，再 check
3. **Finish** — 更新 spec、commit、archive、写 journal

## 开发本仓库

```bash
npm install
npm run build
node packages/cli/bin/gwf.js --help
```

## License

MIT
