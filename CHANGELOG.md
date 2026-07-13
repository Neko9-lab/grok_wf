# Changelog

**English** | [中文](./CHANGELOG.zh-CN.md)

All notable changes to **GWF / gwf-cli** are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/).  
Versioning follows [SemVer](https://semver.org/) where practical for 0.x.

---

## [0.1.5] - 2026-07-13

### Changed

- Documentation is split into **separate English and Chinese pages** with language switch links at the top (not mixed on one page)

---

## [0.1.4] - 2026-07-13

### Added

- Bilingual documentation effort (later refined in 0.1.5 to split-page language switch)

### Changed

- Deploy guide and package README expanded

---

## [0.1.3] - 2026-07-13

### Added

- Deployment guide and CHANGELOG
- Root and package README refreshed for npm install and daily usage

### Changed

- npm package README points to full deployment docs

---

## [0.1.2] - 2026-07-13

### Changed

- Init / enable-automations confirmation copy rewritten in plain Chinese
- Avoid jargon; explain effects in everyday language
- Confirm prompt accepts 是/否 as well as y/n

---

## [0.1.1] - 2026-07-13

### Added

- `gwf init` integrates recommended automations after scaffold:
  - Grok folder trust → SessionStart auto-inject
  - Git pre-commit → block out-of-scope commits
- Second confirmation prompt (default Yes); `-y` / `--no-automations`
- Commands: `gwf trust`, `gwf enable-automations`
- `gwf doctor` reports Grok trust status

---

## [0.1.0] - 2026-07-13

### Added

- First public release of **gwf-cli** on npm (`gwf` binary)
- `gwf init` / `update` / `upgrade` / `doctor` / `install-hooks`
- Portable `.gwf/` core and Grok-only `.grok/` adapters
- Blast-radius control: `scope.json`, `check_scope.py`
- Plan → Execute → Finish workflow for Grok Build

---

## Links

- npm: https://www.npmjs.com/package/gwf-cli
- repo: https://github.com/Neko9-lab/grok_wf
- deploy: [docs/deploy-and-usage.md](./docs/deploy-and-usage.md)
- releases: https://github.com/Neko9-lab/grok_wf/releases

[0.1.5]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.5
[0.1.4]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.4
[0.1.3]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.3
[0.1.2]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Neko9-lab/grok_wf/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.0
