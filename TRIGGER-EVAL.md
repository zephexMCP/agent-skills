# Trigger evaluation — `skills/zephex/SKILL.md`

Agents decide whether to load a skill from the YAML **`description`** (and platform-specific skill indexes). A weak description causes **false skips** (user says "use Zephex", agent uses Grep) or **false triggers** (burns tokens on weather / git chores).

This repo uses **two layers**:

1. **Heuristic script** — fast regression gate before every push  
2. **Live agent spot-check** — optional but recommended when changing description wording

---

## Quick run (required before ship)

```bash
cd agent-skills
node scripts/eval-description.mjs
```

Expect:

```
Description: <N> chars / 1024 max
...
20/20 passed
```

Also:

```bash
npx skills add . --skill zephex --list
# → 1 skill, name: zephex
```

---

## Heuristic script (`scripts/eval-description.mjs`)

**What it does:** Parses folded YAML `description` from `SKILL.md`, classifies each query in `eval-queries.json` with regex/heuristic `predictTrigger()`, compares to `should_trigger`.

**What it does not do:** Simulate Claude/Cursor/Grok skill loaders. It can pass while a live model still misfires — hence spot-check below.

**When to edit the script:** You add new eval queries that the heuristics do not cover. Keep script logic aligned with **description text**, not with SKILL body prose.

**Exit code:** `1` on any mismatch (CI-friendly).

---

## Eval query set (20)

### Should TRIGGER (10)

| ID | Query | Rationale |
|----|-------|-----------|
| t01 | Use zephex to find where we validate JWT tokens in this repo | Explicit product + repo search |
| t02 | Scope what files I'd need to touch to add rate limiting to POST /api/upload | concrete multi-file task → find/architecture/deep |
| t03 | Is the express package safe to add? I'm about to npm install | `check_package` before install |
| t04 | Audit security headers on https://myapp.com production | `audit_headers` + URL |
| t05 | use MCP — I don't know this codebase yet | Bare MCP + onboarding |
| t06 | What kind of project is this? package manager and test scripts? | `get_project_context` |
| t07 | find_code all usages of handleUpload before I change the signature | Tool name + exhaustive search |
| t08 | What breaks if we upgrade next from 14 to 15? | `check_package` task=upgrade |
| t09 | use zephex | Minimal trigger — must not skip |
| t10 | I've tried three fixes for the upload bug and I'm stuck — help me debug | `keep_thinking` / stuck debugging |

### Should SKIP (10)

| ID | Query | Rationale |
|----|-------|-----------|
| f01 | Write a fibonacci function in Python | Greenfield snippet, no repo |
| f02 | Fix the typo on line 12 of README.md | Trivial edit, no MCP needed |
| f03 | What's the weather in Austin today? | General knowledge |
| f04 | How do I configure Next.js 15 middleware? (generic docs, not my repo) | Third-party docs — not `Zephex_dev_info` unless user repo |
| f05 | Deploy this app to Vercel step by step | Deploy chore (explicit negative in description) |
| f06 | Explain what React useEffect cleanup does in general | Conceptual, not their tree |
| f07 | Run bun test and fix any failures | Test runner task — not "find in repo" unless scoped |
| f08 | Edit skills/zephex/SKILL.md to add a new section | Meta: editing skill files |
| f09 | git commit and push my changes | Git chore |
| f10 | Convert this JSON file to YAML | Format conversion |

Full JSON: `scripts/eval-queries.json`.

---

## Tuning the `description`

**Location:** `skills/zephex/SKILL.md` frontmatter only (`description: >-`).

### Positive triggers (include)

- User's **own codebase** / repo intelligence
- Tool names: `find_code`, `read_code`, `check_package`, `check_test`, …
- Bare **"use Zephex"** / **"use MCP"** / wrong tool name
- **MUST** language: call Zephex before answering from memory when connected
- Package safety, HTTPS audit, stuck debugging

### Negative triggers (include)

- General knowledge, creative writing
- Git / deploy chores
- Editing **agent skill files**
- Single-line typo fixes
- Third-party library API docs (unless `Zephex_dev_info`)

### Length

- skills.sh / agentskills.io: **1024 char max** on description  
- Current baseline: ~867 chars (room for small additions)  
- Prefer tightening SKILL body, not description, for new content

### Example failure → fix

| Symptom | Fix |
|---------|-----|
| f05 still triggers | Strengthen "git/deploy chores" in description; extend script `skip` regex |
| t09 skips | Add "only say use Zephex" clause |
| f04 triggers | Add "third-party library API docs" negative |
| t03 skips | Ensure "verify a package before install" in description |

After edits: re-run script → update this doc's **Results** section.

---

## Live agent spot-check protocol

Run when description changes **wording** (not just typo), or after a failed user report.

### Setup

1. Fresh session in target editor (Cursor, Claude Code, etc.).
2. Install skill: `npx skills add zephexMCP/agent-skills --skill zephex -y`
3. Zephex MCP connected (`npx zephex setup` or test key).
4. Open a **real** small repo (e.g. agent-skills itself).

### Procedure

For each query in `eval-queries.json`:

1. Paste query as **only** user message (no "load zephex skill" hint).
2. Record:
   - **Activated?** (skill visible / agent mentions Zephex workflow / calls MCP tool)
   - **First tool** called (if any)
   - **False positive?** (used Zephex for SKIP cases)

### Pass criteria

- **10/10 TRIGGER** queries: at least one Zephex tool call OR explicit "I'll use Zephex MCP" with tool call in same turn
- **10/10 SKIP** queries: no Zephex tool calls; built-in edit/search OK

### Spot-check subset (5 min)

If full 20 is too heavy, minimum smoke:

| Type | IDs |
|------|-----|
| Trigger | t05, t09, t03 |
| Skip | f01, f05, f08 |

Document results in **Results** below.

---

## Results log

| Date | Description chars | Script | Live spot-check | Notes |
|------|-------------------|--------|-----------------|-------|
| 2026-06-06 | ~867 | 20/20 | Not run in CI | Added Do-not-use negatives; t09/t05 pass |

*Append a row after each release.*

---

## CI suggestion (optional)

```yaml
# .github/workflows/skill-eval.yml
- run: node scripts/eval-description.mjs
  working-directory: .
```

Does not replace live eval; catches description regressions on PRs.

---

## Related files

- [SKILL-MAINTAINER.md](SKILL-MAINTAINER.md) — ship checklist, sync from mcpHub  
- [AGENTS.md](AGENTS.md) — short workflow (must agree with SKILL)  
- mcpHub embed description: `mcp-proxy/skills/find-code/SKILL.md` (different name `find-code`, similar triggers)

---

## Adding new eval queries

1. Add object to `eval-queries.json` with unique `id`, `should_trigger`, `query`.
2. Extend `predictTrigger()` in `eval-description.mjs` so script stays 100% aligned.
3. Document rationale in table above.
4. Run script; fix description or heuristic until green.

Prefer **real user phrases** from support/discord over synthetic tool names.