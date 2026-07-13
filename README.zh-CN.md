# GWF — Grok 工作流框架

[English](./README.md) | **中文**

开箱即用的 **Grok Build 专用** AI 编码工作流框架。

把规范（spec）、任务（task）、会话记忆（journal）沉淀进仓库，用 **Plan → Execute → Finish** 约束开发过程。任意项目执行 `gwf init` 即可使用。

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli)（命令 `gwf`） |
| **部署与使用** | [docs/部署与使用.md](./docs/部署与使用.md) |
| **更新日志** | [CHANGELOG.zh-CN.md](./CHANGELOG.zh-CN.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

---

## 30 秒上手

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u 你的名字
# 中文提示：是否开启「自动加载工作流 + 提交前范围检查」？直接回车 = 是

grok
# 直接说需求（无需每次 /start）
```

---

## 前置要求

| 依赖 | 版本 |
|------|------|
| Node.js | >= 18.17 |
| Python | >= 3.9 |
| Git | 近期版本 |
| [Grok Build](https://x.ai/) | 已安装 |

---

## 常用命令

| 命令 | 作用 |
|------|------|
| `gwf init -u <name>` | 初始化；二次确认后开启自动加载与提交检查 |
| `gwf init -u <name> -y` | 同上，不提问直接全开 |
| `gwf enable-automations` | 已有项目补开上述两项 |
| `gwf trust` | 仅开启：打开 Grok 自动加载工作流 |
| `gwf update` | 同步项目模板到当前 CLI 版本 |
| `gwf upgrade` | 升级全局 CLI |
| `gwf doctor` | 环境与配置检查 |
| `gwf install-hooks` | 仅安装 git 提交范围检查 |

---

## init 后目录

```
your-project/
├── .gwf/          # 工作流核心（workflow / spec / tasks / scripts）
├── .grok/         # Grok skills / commands / hooks / agents
└── AGENTS.md      # Grok 入口说明
```

---

## 工作流（给 AI）

1. **Plan（规划）** — 澄清需求，写 `prd.md`，填写 `scope.json`（允许改的路径）
2. **Execute（实现）** — 在范围内实现并检查
3. **Finish（收尾）** — 更新规范、提交、归档、写 journal

**你主要负责：** 说需求、确认范围、确认提交。

---

## 开发本仓库

```bash
npm install
npm run build
npm link -w gwf-cli
```

完整说明见 [docs/部署与使用.md](./docs/部署与使用.md)。

---

## 许可

MIT
