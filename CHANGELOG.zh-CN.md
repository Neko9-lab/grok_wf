# 更新日志

[English](./CHANGELOG.md) | **中文**

**GWF / gwf-cli** 的重要变更记录于本文件。

格式参考 [Keep a Changelog](https://keepachangelog.com/)。  
0.x 阶段尽量遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [0.1.5] - 2026-07-13

### 变更

- 文档改为 **中英文分页面**，页首通过链接切换语言（不再在同一页中英混排）

---

## [0.1.4] - 2026-07-13

### 新增

- 双语文档尝试（0.1.5 起改为分页面切换）

### 变更

- 扩展部署指南与包 README

---

## [0.1.3] - 2026-07-13

### 新增

- 部署与使用文档、CHANGELOG
- 根目录与包 README 补充安装与日常用法

### 变更

- npm 包 README 指向完整部署文档

---

## [0.1.2] - 2026-07-13

### 变更

- init / enable-automations 确认文案改为中文白话
- 避免术语，用效果说明
- 确认提示支持 是/否 与 y/n

---

## [0.1.1] - 2026-07-13

### 新增

- `gwf init` 脚手架后集成推荐自动化：
  - Grok 目录信任 → SessionStart 自动注入
  - Git pre-commit → 拦截范围外提交
- 二次确认（默认是）；`-y` / `--no-automations`
- 命令：`gwf trust`、`gwf enable-automations`
- `gwf doctor` 报告 Grok 信任状态

---

## [0.1.0] - 2026-07-13

### 新增

- **gwf-cli** 首次公开发布（命令 `gwf`）
- `gwf init` / `update` / `upgrade` / `doctor` / `install-hooks`
- 可移植 `.gwf/` 核心与仅 Grok 的 `.grok/` 适配
- 改动范围控制：`scope.json`、`check_scope.py`
- 面向 Grok Build 的 Plan → Execute → Finish 工作流

---

## 链接

- npm: https://www.npmjs.com/package/gwf-cli
- 仓库: https://github.com/Neko9-lab/grok_wf
- 部署: [docs/部署与使用.md](./docs/部署与使用.md)
- Releases: https://github.com/Neko9-lab/grok_wf/releases

[0.1.5]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.5
[0.1.4]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.4
[0.1.3]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.3
[0.1.2]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.0
