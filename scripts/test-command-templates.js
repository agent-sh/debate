#!/usr/bin/env node
// test-command-templates.js - pins the debate contract: failure policy, safety rules, templates, model ids

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

const command = read('commands/debate.md');
const agent = read('agents/debate-orchestrator.md');
const skill = read('skills/debate/SKILL.md');
const tools = read('skills/debate/references/tools.md');
const failures = [];

function has(text, pattern, message) {
  if (!pattern.test(text)) failures.push(message);
}
function lacks(text, pattern, message) {
  if (pattern.test(text)) failures.push(message);
}

// Failure policy and progress, stated once in the skill.
has(skill, /hard 240-second timeout, enforced by something that can cancel\/kill the underlying command/, 'SKILL.md must require a killable 240s timeout.');
has(skill, /Check the result envelope before parsing/, 'SKILL.md must check the envelope before parsing.');
has(skill, /`PARSE_ERROR:<type>:<code>` \(redact secrets, strip control characters, max 200 chars - never raw stdout\/stderr snippets\)/, 'SKILL.md must pin sanitized parse-error metadata.');
has(skill, /\[INFO\] Running round \{round\} proposer \(\{proposer\}\) - timeout 240s/, 'SKILL.md must pin the proposer progress line.');
has(skill, /\[ERROR\] Debate aborted: proposer \(\{tool\}\) failed on opening round\./, 'SKILL.md must abort when the proposer fails round 1.');
has(skill, /\[WARN\] Challenger \(\{tool\}\) failed on round 1\. Proceeding with uncontested proposer position\./, 'SKILL.md must continue when the challenger fails round 1.');
has(skill, /\[ERROR\] Debate failed: all tool invocations timed out\./, 'SKILL.md must define the all-timeout error.');
has(skill, /\[ERROR\] Debate failed: no successful exchanges were recorded\./, 'SKILL.md must define the no-exchange error.');
has(skill, /as soon as it has succeeded/, 'SKILL.md must show a response only after the call succeeded.');

// Templates and judging.
for (const t of ['Round 1: Proposer Opening', 'Round 1: Challenger Response', 'Round 2+: Proposer Defense', 'Round 2+: Challenger Follow-up']) {
  has(skill, new RegExp(`### ${t.replace(/[+]/g, '\\+')}`), `SKILL.md must keep the "${t}" template.`);
}
has(skill, /every concession as a verbatim quote/, 'SKILL.md must keep concessions verbatim in summaries.');
has(skill, /"both approaches have merit" is not a verdict/, 'SKILL.md must require the verdict to pick a side.');
has(skill, /last-debate\.json/, 'SKILL.md must define the state file.');

// Command contract.
has(command, /MUST treat timeout, non-zero status, missing output, and parse failure as explicit tool failures/, 'commands/debate.md must keep the explicit failure rule.');
has(command, /gemini, codex, claude, opencode, copilot, kiro/, 'commands/debate.md must keep the tool allow-list.');
has(command, /Bash\(node:\*\)/, 'commands/debate.md must allow node for the ACP runner.');
has(command, /Bash\(kiro-cli:\*\)/, 'commands/debate.md must allow kiro-cli.');
has(command, /Without AskUserQuestion:/, 'commands/debate.md must state defaults for harnesses without AskUserQuestion.');
for (const [name, text] of [['commands/debate.md', command], ['debate-orchestrator.md', agent]]) {
  has(text, /do not route turns through `Skill: consult`/i, `${name} must not route turns through Skill: consult.`);
}

// Transport: the runner lives in the consult plugin, never a cwd-relative acp/.
lacks(command + agent + skill + tools, /node acp\/run\.js/, 'No file may call a cwd-relative acp/run.js; debate ships no acp/ directory.');
has(tools, /node <consult>\/acp\/run\.js --provider="claude" --question-file="\{AI_STATE_DIR\}\/consult\/question\.tmp" --timeout=240000/, 'references/tools.md must pin the ACP runner call.');
has(tools, /node <consult>\/acp\/run\.js --detect --provider=/, 'references/tools.md must pin ACP detection.');
has(tools, /Exit 3/, 'references/tools.md must handle the runner fallback exit code.');
has(tools, /Kiro is ACP-only/, 'references/tools.md must note Kiro is ACP-only.');

// CLI templates keep the safe forms.
has(tools, /env -u CLAUDECODE claude -p - --output-format json --model "MODEL" --max-turns TURNS --allowedTools "Read,Glob,Grep" < "\{AI_STATE_DIR\}\/consult\/question\.tmp"/, 'Claude template must unset CLAUDECODE and stay read-only.');
has(tools, /codex exec "\$\(cat "\{AI_STATE_DIR\}\/consult\/question\.tmp"\)" --json -m "MODEL" \{SKIP_GIT_FLAG\} -c model_reasoning_effort="LEVEL"/, 'Codex template must use the trust-gated SKIP_GIT_FLAG.');
has(tools, /Never take it from the environment/, 'SKIP_GIT_FLAG must not come from the environment.');
lacks(tools, /\| Claude \| `claude -p/, 'Claude template must not omit env -u CLAUDECODE.');
lacks(command + agent + skill + tools, /--dangerously-skip-permissions`? *\|/, 'No template may carry a permission bypass.');

// Model ids: current, none retired.
lacks(command + agent + skill + tools, /gpt-5\.[0-9]-codex|claude-(opus|sonnet)-4-[0-9]|gemini-3-flash-preview|gemini-3-pro-preview/, 'No file may name retired model ids.');
for (const id of ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-5-5', 'claude-fable-5-1', 'gpt-6-sol', 'gpt-6-astra', 'gemini-3.8-flash']) {
  has(tools, new RegExp(id.replace(/\./g, '\\.')), `references/tools.md model table must include ${id}.`);
}

// The skill shares its name with the command, so both read the file instead of Skill(debate).
lacks(agent, /^\s+- Skill$/m, 'debate-orchestrator must not list the Skill tool.');
lacks(command, /allowed-tools:.*\bSkill\b/, 'commands/debate.md must not rely on the Skill tool.');

// The judge inherits the session model.
lacks(agent, /^model:/m, 'debate-orchestrator must inherit the session model.');

if (failures.length > 0) {
  console.error('[FAIL] Debate template regression checks failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('[PASS] Debate template regression checks passed.');
