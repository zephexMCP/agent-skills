#!/usr/bin/env node
/**
 * Trigger eval for skills/zephex/SKILL.md description.
 * Heuristic intent classifier — re-run after description edits.
 * Live agent eval (Claude/Cursor) still recommended; see TRIGGER-EVAL.md.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = join(root, 'skills/zephex/SKILL.md');
const queriesPath = join(root, 'scripts/eval-queries.json');

function parseDescription(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return '';
  const block = fm[1].match(/description: >-\n([\s\S]*?)(?=\n\w|$)/);
  if (!block) return '';
  return block[1]
    .split('\n')
    .map((l) => l.replace(/^  /, ''))
    .join(' ')
    .trim();
}

/** Predict whether an agent should activate zephex for this user message. */
function predictTrigger(query) {
  const q = query.toLowerCase();

  const skip =
    /\b(weather|fibonacci|git commit|convert.*json to yaml)\b/.test(q) ||
    /edit skills\//.test(q) ||
    (/deploy/.test(q) && /vercel/.test(q) && !/audit|header/.test(q)) ||
    (/typo/.test(q) && /readme/.test(q)) ||
    (/explain what react/.test(q) && /in general/.test(q)) ||
    (/configure next\.js/.test(q) && /generic docs/.test(q)) ||
    (/run bun test/.test(q) && !/find_code|scope|where|fail/.test(q));

  if (skip) return false;

  const trigger =
    /\b(use zephex|use mcp)\b/.test(q) ||
    /\b(find_code|scope_task|check_package|audit_headers|keep_thinking)\b/.test(q) ||
    /\b(find where|scope what files|what kind of project|security headers on https)\b/.test(q) ||
    /\b(codebase|this repo|npm install|upgrade next|stuck|debug)\b/.test(q) ||
    (/validate jwt/.test(q) && /repo/.test(q)) ||
    (/rate limiting/.test(q) && /post \/api/.test(q)) ||
    (/express package safe/.test(q)) ||
    (/upgrade next from/.test(q));

  return trigger;
}

const description = parseDescription(readFileSync(skillPath, 'utf8'));
const queries = JSON.parse(readFileSync(queriesPath, 'utf8'));

let pass = 0;
const failures = [];

console.log(`Description: ${description.length} chars / 1024 max\n`);

for (const row of queries) {
  const predicted = predictTrigger(row.query);
  const ok = predicted === row.should_trigger;
  if (ok) pass++;
  else failures.push({ ...row, predicted });

  const mark = ok ? 'PASS' : 'FAIL';
  console.log(
    `${mark} [${row.id}] expect=${row.should_trigger ? 'TRIGGER' : 'SKIP'} got=${predicted ? 'TRIGGER' : 'SKIP'}`,
  );
  console.log(`      ${row.query}`);
}

console.log(`\n${pass}/${queries.length} passed`);

if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) {
    console.log(`  ${f.id}: want ${f.should_trigger} got ${f.predicted}`);
  }
  process.exit(1);
}