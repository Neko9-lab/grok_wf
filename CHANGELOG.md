# Changelog

All notable changes to **GWF / gwf-cli** are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/).  
Versioning follows [SemVer](https://semver.org/) where practical for 0.x.

---

## [0.1.3] - 2026-07-13

### Added

- Chinese deployment guide: `docs/部署与使用.md`
- Root and package README refreshed for npm install and daily usage

### Changed

- npm package README points to full deployment docs

---

## [0.1.2] - 2026-07-13

### Changed

- Init / enable-automations confirmation copy rewritten in plain Chinese
- Avoid jargon such as “Enable both”; explain effects in everyday language
- Confirm prompt accepts 是/否 as well as y/n

---

## [0.1.1] - 2026-07-13

### Added

- `gwf init` integrates recommended automations after scaffold:
  - Grok folder trust → SessionStart auto-inject (no `/start` every time)
  - Git pre-commit → block out-of-scope commits
- Second confirmation prompt (default Yes); `-y` to skip; `--no-automations` to skip all
- Commands: `gwf trust`, `gwf enable-automations`
- `gwf doctor` reports Grok auto-inject trust status

---

## [0.1.0] - 2026-07-13

### Added

- First public release of **gwf-cli** on npm (`gwf` binary)
- `gwf init` / `update` / `upgrade` / `doctor` / `install-hooks`
- Portable `.gwf/` core: workflow, specs, tasks, Python scripts
- Grok-only adapters under `.grok/`: skills, commands, agents, hooks
- Blast-radius control: `scope.json`, `check_scope.py`, fail-closed empty allow list
- Git pre-commit installer for scope gate
- Plan → Execute → Finish workflow for Grok Build

---

## Links

- npm: https://www.npmjs.com/package/gwf-cli
- repo: https://github.com/Neko9-lab/grok_wf
- deploy guide: https://github.com/Neko9-lab/grok_wf/blob/main/docs/部署与使用.md

[0.1.3]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.3
[0.1.2]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.0
