# debate

> Structured multi-round debate between AI tools with proposer/challenger roles and verdict

## Overview

An agentsys plugin: the `/debate` command, the `debate-orchestrator` agent and the `debate` skill (with `skills/debate/references/tools.md` for running one turn) are Markdown prompts. `scripts/test-command-templates.js` pins their contract: failure policy, safety rules, templates and model ids. `lib/` is synced from [agent-core](https://github.com/agent-sh/agent-core); change shared code there, since a local edit is overwritten by the next sync PR.

## Conventions

- Output is plain text with the status markers `[OK]`, `[ERROR]`, `[WARN]`, `[CRITICAL]`, and no emojis or ASCII art. People read it in terminals and other plugins parse it.
- In prose, write a spaced single dash (` - `), not ` -- ` or an em dash.
- Put summaries, plans and audit notes in the PR or issue, not in committed files: committed notes go stale.
- Changes reach main through a PR. A feature or fix is done when tests that cover it pass.
- Keep git hooks on. `scripts/setup-hooks.sh` installs a pre-push hook that runs `npm test`.
- When a script or tool fails, report the failure before working around it, so the tool gets fixed.
- When goals conflict, rank them: plugin users' experience, automation that needs no babysitting, token cost, output quality, simplicity.

## Agents

- debate-orchestrator

## Skills

- debate

## Commands

- debate

## Dev commands

```bash
npm test                        # prompt contract checks
npm run validate                # same checks
agnix --config .agnix.toml .    # agent config lint, also run in CI
```

## References

- Part of the [agentsys](https://github.com/agent-sh/agentsys) ecosystem
- https://agentskills.io
