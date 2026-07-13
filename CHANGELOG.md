# Changelog

Notable changes to **gwf-cli**.

**Policy:** Doc-only fixes ship on `main` without a new npm version or GitHub Release.  
Version bumps and releases require explicit confirmation from the maintainer.

## [0.1.6] - 2026-07-13

### Added

- Init-time automations (with confirm): Grok folder trust + git pre-commit scope check
- Commands: `gwf trust`, `gwf enable-automations`
- User guide: `docs/使用说明.md`
- GitHub README language switch: [English](./README.md) / [中文](./README.zh-CN.md)

### Changed

- Init confirmation in plain Chinese (accepts y/n and Chinese yes/no)
- Docs: bilingual homepage via language tabs; deep guide in Chinese only
- Collapsed noisy intermediate 0.1.4/0.1.5 doc-only publishes; **0.1.6** is the clean cut after 0.1.3  
  (npm permanently reserves unpublished version numbers, so 0.1.4 could not be reused)

## [0.1.3] - 2026-07-13

### Added

- Early deploy notes and CHANGELOG

## [0.1.2] - 2026-07-13

### Changed

- Plain Chinese init prompt

## [0.1.1] - 2026-07-13

### Added

- Init automations first implementation

## [0.1.0] - 2026-07-13

### Added

- First public **gwf-cli** release
- `gwf init` / `update` / `upgrade` / `doctor` / `install-hooks`
- `.gwf/` + `.grok/` adapters, scope checks

## Links

- https://www.npmjs.com/package/gwf-cli
- https://github.com/Neko9-lab/grok_wf
- https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.6

[0.1.6]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.6
[0.1.3]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.3
[0.1.0]: https://github.com/Neko9-lab/grok_wf/releases/tag/v0.1.0
