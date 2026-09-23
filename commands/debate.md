---
name: debate
description: 'Use when user asks to "debate", "argue about", "compare perspectives", "stress test idea", "devil advocate", or "tool vs tool". Structured debate between two AI tools with proposer/challenger roles and a verdict.'
codex-description: 'Use when user asks to "debate", "argue about", "compare perspectives", "stress test idea", "devil advocate", "codex vs gemini". Runs structured multi-round debate between two AI tools with proposer/challenger roles.'
argument-hint: "[topic] [--tools=tool1,tool2] [--rounds=N] [--effort=low|medium|high|max]"
allowed-tools: Skill, Bash(claude:*), Bash(gemini:*), Bash(codex:*), Bash(opencode:*), Bash(copilot:*), Bash(kiro-cli:*), Bash(node:*), Bash(npx:*), Bash(git:*), Bash(where.exe:*), Bash(which:*), Bash(timeout:*), Bash(env:*), Bash(ls:*), Read, Write, Glob, AskUserQuestion
---

# /debate

Have two AI CLIs debate a topic, then judge it and recommend what to do.

Arguments: `$ARGUMENTS`, as flags, natural language, or both. Flags win.

## Constraints

- Never expose API keys in commands or output, and never run a tool with permission-bypassing flags: both tools read the user's repo and must not change it.
- Validate tool names against the allow-list: gemini, codex, claude, opencode, copilot, kiro. Proposer and challenger are different tools; rounds are 1 to 5.
- MUST treat timeout, non-zero status, missing output, and parse failure as explicit tool failures, with a hard 240-second timeout per call. A hung tool must not stall the debate.
- Redact tool output before showing it (the skill's reference has the patterns).

## Parse

- **Flags**: `--tools=A,B` (A proposes, B challenges), `--rounds=N`, `--effort=low|medium|high|max`, `--model-proposer=`, `--model-challenger=`, `--context=diff|file=PATH|none`.
- **Natural language**: "codex vs gemini", "claude and codex", "between X and Y" set the pair in order; "3 rounds", "single round" (1), "deep" or "extended" (3) set rounds; "quick" is low effort, "thorough" high, "max effort" max. Text after "about" is the topic.

Errors: no topic, `[ERROR] Usage: /debate "your topic" or /debate codex vs gemini about your topic`; same tool twice, `[ERROR] Proposer and challenger must be different tools.`; rounds out of range, `[ERROR] Rounds must be 1-5. Got: {rounds}`.

## Resolve

Detect installed tools (`which`, or `where.exe` on Windows) and, if the consult plugin is installed, ACP support through its runner (see the skill's reference). Fewer than two usable tools: `[ERROR] Debate requires at least 2 AI CLI tools installed.` with install hints.

Missing values, with AskUserQuestion in one call: proposer, challenger (installed tools only, the proposer excluded), effort (high recommended), rounds (2 recommended), context (none recommended; for a file, ask the path and confine it to the project directory). Without AskUserQuestion: the first two installed tools in the order codex, gemini, claude, opencode, copilot, kiro, effort high, 2 rounds, no context.

## Run

Load the `debate` skill (or read `skills/debate/SKILL.md` and `references/tools.md` from this plugin) and follow it: rounds, progress lines, failure policy, context between rounds, verdict, state file. Run each turn yourself as the reference describes. Do not route turns through `Skill: consult`: in Claude Code that name also resolves to consult's interactive command.

## Report

Show each round as it completes, then the skill's Debate Summary with a verdict that picks a side. Save `{AI_STATE_DIR}/debate/last-debate.json`.

## Examples

```bash
/debate codex vs gemini about microservices vs monolith
/debate with claude and codex about our auth implementation
/debate "Should we use event sourcing?" --tools=claude,gemini --rounds=3 --effort=high
/debate codex vs gemini --effort=max about performance optimization strategies
```
