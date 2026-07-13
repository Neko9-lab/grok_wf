# Changelog / 更新日志

**English** | **中文**

All notable changes to **GWF / gwf-cli** are documented in this file.  
**GWF / gwf-cli** 的重要变更记录于本文件。

Format based on [Keep a Changelog](https://keepachangelog.com/).  
Versioning follows [SemVer](https://semver.org/) where practical for 0.x.  
格式参考 Keep a Changelog；0.x 阶段尽量遵循语义化版本。

---

## [0.1.4] - 2026-07-13

### Added / 新增

- Bilingual documentation (EN + 中文) across README, deploy guide, changelog, and release notes  
  文档中英双语：README、部署指南、更新日志、Release 说明

### Changed / 变更

- `docs/deploy-and-usage.md` as canonical deploy guide; `docs/部署与使用.md` kept in sync  
  部署文档以 `deploy-and-usage.md` 为准，`部署与使用.md` 同步同一内容

---

## [0.1.3] - 2026-07-13

### Added / 新增

- Deployment guide: `docs/部署与使用.md` / `docs/deploy-and-usage.md`  
  部署与使用文档  
- Root and package README refreshed for npm install and daily usage  
  根目录与包 README 补充安装与日常用法

### Changed / 变更

- npm package README points to full deployment docs  
  npm 包 README 指向完整部署文档

---

## [0.1.2] - 2026-07-13

### Changed / 变更

- Init / enable-automations confirmation copy rewritten in plain Chinese  
  init / enable-automations 确认文案改为中文白话  
- Avoid jargon such as “Enable both”; explain effects in everyday language  
  避免 “Enable both” 等术语，用效果说明  
- Confirm prompt accepts 是/否 as well as y/n  
  确认提示同时支持 是/否 与 y/n

---

## [0.1.1] - 2026-07-13

### Added / 新增

- `gwf init` integrates recommended automations after scaffold:  
  `gwf init` 脚手架后集成推荐自动化：  
  - Grok folder trust → SessionStart auto-inject (no `/start` every time)  
    Grok 目录信任 → SessionStart 自动注入（不必每次 `/start`）  
  - Git pre-commit → block out-of-scope commits  
    Git pre-commit → 拦截范围外提交  
- Second confirmation prompt (default Yes); `-y` to skip; `--no-automations` to skip all  
  二次确认（默认是）；`-y` 跳过提问；`--no-automations` 全部关闭  
- Commands: `gwf trust`, `gwf enable-automations`  
  新命令：`gwf trust`、`gwf enable-automations`  
- `gwf doctor` reports Grok auto-inject trust status  
  `gwf doctor` 报告 Grok 自动注入信任状态

---

## [0.1.0] - 2026-07-13

### Added / 新增

- First public release of **gwf-cli** on npm (`gwf` binary)  
  **gwf-cli** 首次公开发布（命令 `gwf`）  
- `gwf init` / `update` / `upgrade` / `doctor` / `install-hooks`  
- Portable `.gwf/` core: workflow, specs, tasks, Python scripts  
  可移植 `.gwf/` 核心：workflow、spec、tasks、Python 脚本  
- Grok-only adapters under `.grok/`: skills, commands, agents, hooks  
  仅 Grok 的 `.grok/` 适配：skills、commands、agents、hooks  
- Blast-radius control: `scope.json`, `check_scope.py`, fail-closed empty allow list  
  改动范围控制：`scope.json`、`check_scope.py`、空 allow 默认失败  
- Git pre-commit installer for scope gate  
  范围门禁的 git pre-commit 安装器  
- Plan → Execute → Finish workflow for Grok Build  
  面向 Grok Build 的 Plan → Execute → Finish 工作流

---

## Links / 链接

- npm: https://www.npmjs.com/package/gwf-cli  
- repo: https://github.com/Neko9-lab/grok_wf  
- deploy guide: [docs/deploy-and-usage.md](./docs/deploy-and-usage.md) · [部署与使用](./docs/部署与使用.md)  
- releases: https://github.com/Neko9-lab/grok_wf/releases  

[0.1.4]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.4  
[0.1.3]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.3  
[0.1.2]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.1...v0.1.2  
[0.1.1]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.0...v0.1.1  
[0.1.0]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.0  
