# Trigger eval — zephex skill description

**Date:** June 2026  
**Skill:** `skills/zephex/SKILL.md`

## What we did

1. **20 eval queries** — 10 should trigger, 10 should not (near-misses included).  
   File: `scripts/eval-queries.json`

2. **Heuristic classifier** — `node scripts/eval-description.mjs`  
   Intent-based (repo intelligence vs git/deploy/trivia/skill-editing).

3. **Description tuned** — added **Do not use** boundary (aligned with mcpHub `zephex.md` rule):
   - general knowledge, creative writing  
   - git/deploy chores  
   - editing agent skill files  
   - single-line typo fixes  
   - third-party library API docs (unless `Zephex_dev_info`)

## Result

```bash
cd agent-skills
node scripts/eval-description.mjs
# 20/20 passed (after description update)
```

## Re-run before release

```bash
node scripts/eval-description.mjs
npx skills add . --skill zephex --list
```

## Limitation

This script is a **lint**, not a live agent. For production confidence, spot-check 5 prompts in Cursor/Claude with the skill installed and confirm it activates only on repo-intelligence tasks.

## Query set summary

| Should trigger | Examples |
|----------------|----------|
| Yes | "use zephex", scope feature, find in repo, package safety, audit URL, stuck debugging |
| No | fibonacci, weather, git commit, edit SKILL.md, deploy Vercel, generic React docs, README typo |