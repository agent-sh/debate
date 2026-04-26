# Changelog

## [Unreleased]

## [1.0.1] - 2026-04-26

### Changed

- SKILL.md reorders External Tool Quick Reference to prefer consult's ACP transport (hardened spawn + stdio:pipe + secret redaction) over raw CLI shell-outs. Raw patterns demoted to "fallback when ACP unavailable".

### Fixed

- harden debate orchestrator failure handling for consult timeouts, status failures, and parse errors
- add template regression checks for failure-first orchestration and terminal error contracts

## [1.0.0] - 2026-02-21

Initial release. Extracted from [agentsys](https://github.com/agent-sh/agentsys) monorepo.
