# Zephex agent-skills — maintainer summary

**Last updated:** June 2026  
**Repo:** [zephexMCP/agent-skills](https://github.com/zephexMCP/agent-skills)  
**Install:** `npx skills add zephexMCP/agent-skills`

Read this before editing `skills/zephex/SKILL.md` or helping an agent work on this project. It records what went wrong in past passes and what actually works.

---

## What this repo is (and is not)

| This repo | Is NOT |
|-----------|--------|
| Shipped **agent skill** + **editor MCP JSON** (`configs/`) | The mcpHub product / proxy / dashboard codebase |
| Published on **skills.sh** | The Grok-only work skill (`.grok/skills/zephex/` at workspace parent) |
| Teaches agents **which Zephex MCP tool to call** on the **user's** repo | A guide to building or operating the Zephex server |

**Product implementation** (tool schemas, CLI embed, proxy) lives in **`/Users/muntaha/mcpHub/mcp-proxy`**. When tool *names* or *behavior* change there, sync **semantics** into this skill — do not paste proxy architecture into the skill body.

---

## Three skills — do not confuse them

| Skill | Path | Audience |
|-------|------|----------|
| **skills.sh (edit this)** | `agent-skills/skills/zephex/SKILL.md` | End users; `npx skills add zephexMCP/agent-skills` |
| **CLI embed** | `mcpHub/mcp-proxy/skills/find-code/SKILL.md` | `npx zephex setup --with-skill` (`name: find-code`) |
| **Grok workspace** | `Zephex/.grok/skills/zephex/SKILL.md` | Agents editing this repo only — **not** installed via skills.sh |

Same product, different packaging. **Name must stay `zephex`** here (folder `skills/zephex/` per [agentskills.io spec](https://agentskills.io/specification)).

---

## Files in this repo

| File | Purpose |
|------|---------|
| `skills/zephex/SKILL.md` | **Main deliverable** — workflow + tool routing (~150 lines) |
| `AGENTS.md` | Short always-on gate (Claude, Gemini, OpenCode, Codex) |
| `CLAUDE.md` | Points at AGENTS.md |
| `README.md` | Humans: install, editor table, common config mistakes |
| `configs/*.json` | Per-editor MCP wiring — **not** inside SKILL.md |
| `.mcp.json` | Example stdio config for this repo |

**Do not add back:**

- `skills/zephex/references/configs.md` — duplicated `configs/`
- Multi-hundred-line `references/tools.md` — use MCP schemas on failure; keep SKILL compact

---

## How skills load (research summary)

From [agentskills.io](https://agentskills.io/specification) and [vercel-labs/skills](https://github.com/vercel-labs/skills):

1. **Startup:** only `name` + `description` (~100 tokens each) — description is the **trigger**.
2. **Activation:** full `SKILL.md` body loads.
3. **References:** optional; load only when skill says **when** (we use none today).

**Implication:** Put triggers and MUST rules in `description`. Put procedure in body. Keep body under ~500 lines / ~5k tokens. Editor setup stays in `configs/` + `npx zephex setup`.

---

## Correct SKILL.md shape (what works)

This repo teaches **MCP tool routing** — same *structure* as mcpHub `info-from-context7-skill.md` (workflow → steps → examples), **not** prose that says “Context7-style.”

### 1. YAML frontmatter

- `name: zephex` (must match folder)
- `description:` imperative — when to use, vague triggers (“use Zephex”), MUST (prefer tools over Grep; no memory answers), list all 10 tool slugs
- `compatibility:` endpoint + auth + `npx zephex setup` (one block)

### 2. Body order

1. **One-line product** — ten tools, user's project, not training data  
2. **Workflow table** — situation → tool chain (spine of the skill)  
3. **`path` / `inline_files` / 3-call cap** — under workflow  
4. **Step 1–3** — real JSON examples (`scope_task`, `read_code`, `find_code`, `keep_thinking`, etc.)  
5. **Tool reference table** — tool | when | key args (one table, not ten `###` sections)  
6. **“If they only said use Zephex”** — 4-step decision tree  
7. **Errors** + **Mistakes** — short tables (`keep_thinking` not `thinking`, etc.)

### 3. AGENTS.md

~20 lines: mini workflow table + `path` + `check_package` + pointer to `skills/zephex/SKILL.md`. No JSON cookbooks.

---

## Ten tools (canonical names)

`get_project_context`, `scope_task`, `find_code`, `read_code`, `explain_architecture`, `check_package`, `audit_package`, `audit_headers`, `keep_thinking`, `Zephex_dev_info`

- MCP names use **underscores** (`find_code`). Some UIs show `zephex:find_code` — same tools.
- Wrong name: `thinking` → **`keep_thinking`** only.

Verify against `mcpHub/mcp-proxy/dashboard/src/lib/available-tools.ts` when product changes.

---

## Mistakes we made before (do not repeat)

| Mistake | Why it hurt |
|---------|-------------|
| Edited `.grok/skills/zephex` instead of `skills/zephex/SKILL.md` | User wanted skills.sh skill, not Grok work skill |
| Pasted ~280-line find-code + 955-line tools.md | Token burn on every activation |
| Added `references/configs.md` | Duplicated `configs/`; agents don't need editor JSON in skill |
| Wrote “Context7-style” / “token rule” in skill body | Meta commentary; teaches nothing |
| Talked mcp-proxy / embed-skills in consumer skill | Wrong audience |
| Stripped all examples | Agents need JSON call patterns |
| Claimed done without `npx skills add . --list` | Skill might not parse or discover |

---

## Before you ship a change

```bash
cd agent-skills
npx skills add . --skill zephex --list    # must show 1 skill, name zephex
```

Checklist:

- [ ] `name: zephex` matches directory `skills/zephex/`
- [ ] Workflow table + Step 1–3 examples still present
- [ ] `keep_thinking` (not `thinking`) everywhere
- [ ] No install paths (`~/.cursor/...`) in SKILL.md
- [ ] No `references/configs.md` or huge tool dumps
- [ ] `AGENTS.md` workflow still aligned (shorter is fine)
- [ ] If mcpHub tools changed: diff `mcp-proxy/skills/find-code/SKILL.md` for semantics only

Publish:

```bash
git add skills/zephex/SKILL.md AGENTS.md README.md
git commit -m "..."
git push   # skills.sh picks up from GitHub
```

---

## Trigger eval (run before release)

```bash
node scripts/eval-description.mjs   # 20/20 intent checks
```

Queries: `scripts/eval-queries.json`. Results log: **`TRIGGER-EVAL.md`**.  
Live spot-check in Cursor/Claude still recommended.

## Optional hardening
- **Sync automation:** diff vs mcpHub `find-code/SKILL.md` when releasing
- **Tiny `references/params.md`:** only if agents often fail on rare args — link with “read only on validation error”

---

## Quick links

- Skills leaderboard: https://skills.sh/zephexmcp/agent-skills  
- Agent Skills spec: https://agentskills.io/specification  
- Zephex MCP: https://zephex.dev/mcp  
- Workspace entry: `../DEVELOPING.md` (parent Zephex folder)