# Changelog

## [Unreleased]

## [1.1.0] - 2026-09-24

### Changed
- Rewrote the command, agent and skill for current models: the failure policy, safety rules and verdict rules stated once with reasons, instead of repeating step scripts and MUST lists in three files. The round prompts keep their demands (evidence for every claim, challenger leads with flaws, concessions held) at a normal register.
- How to run a turn (transport, templates, models, parsing, redaction) moved to `skills/debate/references/tools.md`.
- debate-orchestrator inherits the session model instead of pinning `opus`.
- Defaults when AskUserQuestion is missing: the first two installed tools, high effort, 2 rounds, no context.
- Default models: Claude `claude-haiku-4-5` / `claude-sonnet-5` / `claude-opus-5-5` / `claude-fable-5-1`; Codex `gpt-6-sol` (low, medium) and `gpt-6-astra` (high, max); Gemini `gemini-3.5-flash-lite` / `gemini-3.8-flash` / `gemini-3.1-pro-preview`.

### Fixed
- The ACP path called `node acp/run.js`, relative to the user's repo. This plugin has no `acp/` directory; the runner is the consult plugin's. Turns now locate it next to this plugin and fall back to the CLI.
- The command told the model never to use `Skill: consult`, while the agent told it always to. Both now run turns directly.
- The Claude CLI template lacked `env -u CLAUDECODE`, so Claude turns failed from inside a Claude Code session. The Codex template lacked the trust-gated `{SKIP_GIT_FLAG}`.
- The command and the agent loaded the debate skill with `Skill(debate)`, which resolves to the `/debate` command itself. Both now read the skill file; the agent no longer has the Skill tool.
- Retired model ids (`gpt-5.3-codex`, `claude-opus-4-6`, `claude-sonnet-4-6`, `gemini-3-flash-preview`).


## [1.0.1] - 2026-04-26

### Changed

- SKILL.md reorders External Tool Quick Reference to prefer consult's ACP transport (hardened spawn + stdio:pipe + secret redaction) over raw CLI shell-outs. Raw patterns demoted to "fallback when ACP unavailable".

### Fixed

- harden debate orchestrator failure handling for consult timeouts, status failures, and parse errors
- add template regression checks for failure-first orchestration and terminal error contracts

## [1.0.0] - 2026-02-21

Initial release. Extracted from [agentsys](https://github.com/agent-sh/agentsys) monorepo.
