#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function assertContains(text, pattern, message, failures) {
  if (!pattern.test(text)) failures.push(message);
}

function assertNotContains(text, pattern, message, failures) {
  if (pattern.test(text)) failures.push(message);
}

function countMatches(text, pattern) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const globalPattern = new RegExp(pattern.source, flags);
  return (text.match(globalPattern) || []).length;
}

function assertMatchCountAtLeast(text, pattern, minCount, message, failures) {
  if (countMatches(text, pattern) < minCount) failures.push(message);
}

const command = read('commands/debate.md');
const agent = read('agents/debate-orchestrator.md');
const skill = read('skills/debate/SKILL.md');
const failures = [];

assertContains(
  command,
  /MUST treat timeout, non-zero status, missing output, and parse failure as explicit tool failures/,
  'commands/debate.md must require explicit failure handling for timeout/status/output/parse cases.',
  failures
);

assertContains(
  command,
  /hard 240-second timeout/,
  'commands/debate.md must require hard 240-second timeout enforcement.',
  failures
);

assertContains(
  command,
  /cancel\/kill the underlying command/,
  'commands/debate.md must require timeout cancellation/kill behavior.',
  failures
);

assertMatchCountAtLeast(
  command,
  /1\. Check the consult result envelope first \(status\/exit\/error\/timed_out\)/,
  2,
  'commands/debate.md must enforce failure-order step 1 for proposer and challenger.',
  failures
);

assertMatchCountAtLeast(
  command,
  /2\. If timed out, failed, or empty output: treat as (?:proposer|challenger) failure immediately/,
  2,
  'commands/debate.md must enforce failure-order step 2 for proposer and challenger.',
  failures
);

assertMatchCountAtLeast(
  command,
  /3\. Only after a successful envelope, parse structured output/,
  2,
  'commands/debate.md must enforce failure-order step 3 for proposer and challenger.',
  failures
);

assertMatchCountAtLeast(
  command,
  /4\. If structured parse fails, treat it as (?:proposer|challenger) failure and include only sanitized parse metadata in `\{error\}` using `PARSE_ERROR:<type>:<code>`/,
  2,
  'commands/debate.md must enforce canonical PARSE_ERROR format in parse-failure step 4 for proposer and challenger.',
  failures
);

assertContains(
  command,
  /redact secrets, strip control characters, max 200 chars - never raw stdout\/stderr snippets/,
  'commands/debate.md must constrain parse-error details to sanitized metadata only.',
  failures
);

assertContains(
  command,
  /\[ERROR\] Debate failed: all tool invocations timed out\./,
  'commands/debate.md must define all-timeouts terminal error.',
  failures
);

assertContains(
  command,
  /\[INFO\] Running round \{round\} proposer \(\{proposer\}\) - timeout 240s/,
  'commands/debate.md must print proposer progress before invocation.',
  failures
);

assertContains(
  command,
  /\[INFO\] Running round \{round\} challenger \(\{challenger\}\) - timeout 240s/,
  'commands/debate.md must print challenger progress before invocation.',
  failures
);

assertContains(
  command,
  /Display to user immediately ONLY after the proposer call is confirmed successful:/,
  'commands/debate.md must guard proposer display on successful call.',
  failures
);

assertContains(
  command,
  /Display to user immediately ONLY after the challenger call is confirmed successful:/,
  'commands/debate.md must guard challenger display on successful call.',
  failures
);

assertContains(
  command,
  /\[ERROR\] Debate failed: no successful exchanges were recorded\./,
  'commands/debate.md must define no-successful-exchanges terminal error.',
  failures
);

assertNotContains(
  command,
  /Parse the JSON result\./,
  'commands/debate.md must not rely on parse-first wording.',
  failures
);

assertContains(
  agent,
  /hard 240-second timeout/,
  'agents/debate-orchestrator.md must require hard 240-second timeout enforcement.',
  failures
);

assertContains(
  agent,
  /cancel\/kill the underlying command/,
  'agents/debate-orchestrator.md must require timeout cancellation/kill behavior.',
  failures
);

assertMatchCountAtLeast(
  agent,
  /1\. Check the consult result envelope first \(status\/exit\/error\/timed_out\)/,
  2,
  'agents/debate-orchestrator.md must enforce failure-order step 1 for proposer and challenger.',
  failures
);

assertMatchCountAtLeast(
  agent,
  /2\. If timed out, failed, or empty output: treat as (?:proposer|challenger) failure immediately/,
  2,
  'agents/debate-orchestrator.md must enforce failure-order step 2 for proposer and challenger.',
  failures
);

assertMatchCountAtLeast(
  agent,
  /3\. Only after a successful envelope, parse structured output/,
  2,
  'agents/debate-orchestrator.md must enforce failure-order step 3 for proposer and challenger.',
  failures
);

assertMatchCountAtLeast(
  agent,
  /4\. If structured parse fails, treat it as (?:proposer|challenger) failure and include only sanitized parse metadata in `\{error\}` using `PARSE_ERROR:<type>:<code>`/,
  2,
  'agents/debate-orchestrator.md must enforce canonical PARSE_ERROR format in parse-failure step 4 for proposer and challenger.',
  failures
);

assertContains(
  agent,
  /redact secrets, strip control characters, max 200 chars - never raw stdout\/stderr snippets/,
  'agents/debate-orchestrator.md must constrain parse-error details to sanitized metadata only.',
  failures
);

assertContains(
  agent,
  /\[ERROR\] Debate failed: all tool invocations timed out\./,
  'agents/debate-orchestrator.md must define all-timeouts terminal error.',
  failures
);

assertContains(
  agent,
  /\[INFO\] Running round \{round\} proposer \(\{proposer\}\) - timeout 240s/,
  'agents/debate-orchestrator.md must print proposer progress before invocation.',
  failures
);

assertContains(
  agent,
  /\[INFO\] Running round \{round\} challenger \(\{challenger\}\) - timeout 240s/,
  'agents/debate-orchestrator.md must print challenger progress before invocation.',
  failures
);

assertContains(
  agent,
  /Display to user immediately ONLY after the proposer call is confirmed successful:/,
  'agents/debate-orchestrator.md must guard proposer display on successful call.',
  failures
);

assertContains(
  agent,
  /Display to user immediately ONLY after the challenger call is confirmed successful:/,
  'agents/debate-orchestrator.md must guard challenger display on successful call.',
  failures
);

assertContains(
  agent,
  /\[ERROR\] Debate failed: no successful exchanges were recorded\./,
  'agents/debate-orchestrator.md must define no-successful-exchanges terminal error.',
  failures
);

assertNotContains(
  agent,
  /Parse the JSON result\./,
  'agents/debate-orchestrator.md must not rely on parse-first wording.',
  failures
);

assertContains(
  skill,
  /Consult result envelope indicates failure \(status\/exit\/error\/empty output\)/,
  'skills/debate/SKILL.md must define consult-envelope failure semantics.',
  failures
);

assertContains(
  skill,
  /Structured parse fails after successful envelope/,
  'skills/debate/SKILL.md must define parse-failure semantics.',
  failures
);

assertContains(
  skill,
  /`PARSE_ERROR:<type>:<code>`/,
  'skills/debate/SKILL.md parse-failure policy must require canonical PARSE_ERROR metadata.',
  failures
);

assertContains(
  skill,
  /All rounds timeout/,
  'skills/debate/SKILL.md must define all-timeouts terminal error policy.',
  failures
);

assertContains(
  skill,
  /No successful exchanges recorded \(non-timeout\)/,
  'skills/debate/SKILL.md must define non-timeout no-success terminal policy.',
  failures
);

assertContains(
  skill,
  /No successful exchanges recorded/,
  'skills/debate/SKILL.md must define no-successful-exchanges error.',
  failures
);

assertContains(
  skill,
  /Parse discipline:\s*1\. Evaluate execution status first/,
  'skills/debate/SKILL.md must require status-before-parse discipline.',
  failures
);

assertContains(
  skill,
  /2\. Parse only when execution status is successful\./,
  'skills/debate/SKILL.md must require parse-discipline step 2.',
  failures
);

assertContains(
  skill,
  /3\. If parse fails, surface only sanitized parse metadata/,
  'skills/debate/SKILL.md must require parse-discipline step 3 with sanitized metadata.',
  failures
);

if (failures.length > 0) {
  console.error('[FAIL] Debate template regression checks failed:');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log('[PASS] Debate template regression checks passed.');
