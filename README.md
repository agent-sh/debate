# debate

Structured multi-round debate between two AI tools - one proposes, one challenges, and an orchestrator delivers a verdict.

## Why

A single AI tool gives you one perspective. When the stakes are high - architecture decisions, schema design, migration strategies - you want adversarial pressure-testing. debate pits two AI tools against each other in a structured format with enforced rules: the challenger must find flaws before agreeing, both sides must cite evidence, and the orchestrator must pick a winner.

Use cases:

- Stress-test an architecture decision before committing (microservices vs monolith, event sourcing vs CRUD)
- Get adversarial review of a proposed schema or API design
- Compare two approaches with structured arguments rather than vibes
- Force a devil's advocate perspective on a plan you are leaning toward

## Installation

```bash
agentsys install debate
```

Requires at least two AI CLI tools installed. See [consult](https://github.com/agent-sh/consult) for individual tool install commands.

## Quick Start

```bash
# Codex argues for, Gemini challenges - 2 rounds about microservices
/debate codex vs gemini about microservices vs monolith

# Thorough 3-round debate with explicit flags
/debate "Should we use event sourcing?" --tools=claude,gemini --rounds=3 --effort=high

# Include the current git diff as context for both tools
/debate codex vs gemini about this refactoring approach --context=diff
```

## How It Works

1. **Parse** - extracts topic, tools, rounds, and effort from natural language or flags
2. **Detect** - scans PATH for installed AI CLI tools; requires at least two
3. **Resolve** - if parameters are missing, presents an interactive picker (proposer, challenger, effort, rounds, context)
4. **Debate** - executes rounds sequentially. Each round:
   - The proposer argues for the topic (round 1) or defends against challenges (round 2+)
   - The challenger identifies flaws, missing considerations, and alternatives
   - Both must support claims with evidence; unsupported claims are flagged
5. **Verdict** - the orchestrator (Opus) reads all exchanges and delivers a structured synthesis: winner, agreements, disagreements, unresolved questions, and an actionable recommendation

The challenger operates under adversarial rules - it must lead with what is wrong or missing before acknowledging agreements, and cannot agree with unsupported claims.

## Usage

### Natural language

```bash
/debate codex vs gemini about microservices vs monolith
/debate with claude and codex about our auth implementation
/debate thoroughly gemini vs codex about database schema design
/debate codex vs gemini 3 rounds about event sourcing
```

### Explicit flags

```bash
/debate "Redis vs PostgreSQL for caching" --tools=codex,opencode
/debate "Should we use event sourcing?" --tools=claude,gemini --rounds=3 --effort=high
/debate "Performance optimization" --tools=codex,gemini --context=diff
```

### Flags

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--tools` | TOOL1,TOOL2 | interactive | Proposer and challenger (comma-separated) |
| `--rounds` | 1-5 | 2 | Number of back-and-forth exchanges |
| `--effort` | low, medium, high, max | interactive | Reasoning depth for both tools |
| `--context` | diff, file=PATH, none | none | Codebase context shared with both tools |
| `--model-proposer` | any model identifier | from effort | Override proposer model |
| `--model-challenger` | any model identifier | from effort | Override challenger model |

### Debate output format

Each debate produces a structured result:

- **Rounds** - proposer opening, challenger response, and subsequent exchanges displayed as they complete
- **Verdict** - winner with cited evidence from the debate
- **Debate quality** - rated on genuine disagreement, evidence quality, and challenge depth
- **Agreements** - points both sides converged on, with supporting evidence
- **Disagreements** - points where they diverge, with each side's position
- **Unresolved questions** - gaps neither side addressed
- **Recommendation** - actionable next step (the orchestrator must pick a direction)

## Requirements

- [agentsys](https://github.com/agent-sh/agentsys) runtime
- Node.js (for ACP transport detection)
- At least two supported AI CLI tools on PATH (claude, gemini, codex, opencode, copilot, or kiro)

## Related Plugins

- [consult](https://github.com/agent-sh/consult) - single-tool consultation for quick second opinions
- [agentsys](https://github.com/agent-sh/agentsys) - plugin runtime and orchestration

## License

MIT
