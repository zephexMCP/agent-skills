---
name: zephex
description: >-
  Use when the user works in their own codebase with Zephex MCP or the zephex
  terminal CLI: onboard a repo, find or read code, map architecture, run or
  diagnose tests, check packages before install, audit a live HTTPS URL,
  remember project facts, or debug multi-file issues — including when they only
  say "use Zephex," "use MCP," or "use the CLI." Prefer MCP tools when connected;
  use the terminal CLI for free layout (structure), deep --json orientation, or
  when the user is in a shell. Use even when built-in Grep/Read seems enough.
  Do not use for general trivia, creative writing, git/deploy chores, single-line
  typos, or third-party library docs (unless Zephex_dev_info). The ten tools are
  get_project_context, find_code, read_code, explain_architecture, check_package,
  check_test, audit_headers, project_memory, keep_thinking, Zephex_dev_info.
  If they named Zephex, call at least one tool or run one zephex command first.
compatibility: >-
  MCP: https://zephex.dev/mcp — connect with npx zephex setup.
  CLI: curl -fsSL https://zephex.dev/cli/install.sh | bash
  (same as https://zephex.dev/install.sh; Windows: irm https://zephex.dev/install.ps1 | iex).
---

# Zephex — MCP + CLI for the user's project

Zephex analyzes **their codebase and live URLs** — not training data.

| Surface | When | How |
|---------|------|-----|
| **MCP (editor)** | Zephex connected in Claude Code, Cursor, VS Code, … | Call tools by name (`find_code`, …) with `path` |
| **CLI (terminal)** | User in a shell, wants human output, free layout, or `deep --json` | Install CLI → `cd` project → `zephex <cmd>` |

Editors may show `zephex:find_code` — same as `find_code`. Same account and credits for both surfaces.

**Rule:** Prefer MCP in chat when connected (structured JSON, no shell). Prefer CLI when the user asks for terminal Mode 2, needs a free folder map, or wants the orientation packet. Max **3** identical tool calls per turn without new evidence. Always answer from tool/CLI output for claims about their repo.

---

## Workflow

| User needs | MCP | CLI (after install + `cd` project) |
|------------|-----|-------------------------------------|
| New / unknown repo | `get_project_context` topic `identity` then `run` | `zephex deep --json` or `overview --json` |
| Folder / language map only | — | `structure --agent` (**0 credits**) |
| How auth / APIs wire | `explain_architecture` | `architecture` · `--focus auth` |
| Where to start a task | find + architecture | `deep "add rate limiting"` |
| Search code | `find_code` | `find` · `defs` · `rename` · `paste` |
| Read symbol or files | `read_code` | `read` · `summarize` · `outline` · `symbol` |
| Before install / upgrade | `check_package` | `safe <pkg>` · `check-package … --task upgrade` |
| After code edits | `check_test` task `run` | `test` then `check test failures` |
| Missing tests? | `check_test` task `missing` | `check test missing` |
| Live site security | `audit_headers` | `check url https://…` · `site https://…` |
| Remember a decision | `project_memory` | `remember "…"` · `recall query` |
| Multi-step stuck debug | `keep_thinking` | `think "…"` (one-shot) |
| Generic patterns (not their repo) | `Zephex_dev_info` | `docs "…"` |

**`path`:** absolute project directory, or public `github:owner/repo` / GitHub URL. Monorepo: pass the **app package** root, or CLI `--cwd apps/web` (CLI can auto-pick densest package under `src`/`app`/`lib`).

**`inline_files`:** only when no disk — `{ "src/a.ts": "<full file body>" }` (full contents, not paths).

---

## The ten MCP tools

### `get_project_context` — project snapshot (start here on a new repo)

Reads manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, …) and returns **one topic slice per call**: stack, scripts, auth, database, deploy, env signals, monorepo layout, key paths. Cached; `force: true` refreshes.

**Topics:** `identity` · `run` · `framework` · `backend` · `frontend` · `database` · `auth` · `deploy` · `structure` · `integrations` · `security`

```
get_project_context({ "path": "/abs/project", "topic": "identity" })
get_project_context({ "path": "/abs/project", "topic": "run" })
get_project_context({ "path": "/abs/project", "topic": "auth", "force": true })
```

**Returns:** `summary`, `data.key_paths`, `hint`, `related_topics`, `next_calls`.  
**Use for:** first orientation; inventing install/test commands.  
**Not for:** symbol search or file bodies.  
**Credits:** ~7 hosted on success.

---

### `find_code` — search when location is unknown

Ripgrep + BM25 ranking + AST-aware blocks. Pick **intent**, not a pile of random flags.

| intent | When |
|--------|------|
| `snippet` | User pasted a line from the editor |
| `symbol` | Known name (`validateToken`) |
| `concept` | Topic hunt; add `also_try` synonyms |
| `everywhere` | Rename map; add `whole_word: true` |

```
find_code({ "query": "validateToken", "path": "/abs/project", "intent": "symbol" })
find_code({
  "query": "rate limit",
  "path": "/abs/project",
  "intent": "concept",
  "also_try": ["throttle", "express-rate-limit"]
})
find_code({
  "query": "OldComponent",
  "path": "/abs/project",
  "intent": "everywhere",
  "whole_word": true
})
```

**Returns:** `matches` / `files_hit` / `files_summary`, `next_calls`.  
**Next:** `read_code` on top hits.  
**Credits:** ~5 hosted.

---

### `read_code` — surgical read (not whole-repo search)

AST extract with token budget. Modes: `symbol` · `file` (batch 1–20 paths) · `outline` (TOC for large files) · `scan` · `smell` · `callers` / `blast_radius` / `dead_code` (local disk index only).

```
read_code({ "target": "handleUpload", "path": "/abs/project", "detail_level": "context" })
read_code({ "mode": "file", "path": "/abs/project", "files": ["src/a.ts", "src/b.ts"] })
read_code({ "mode": "outline", "path": "/abs/project", "files": ["src/handlers/auth.ts"] })
```

**Use for:** known symbol or paths from `find_code`. Outline before opening 300+ line files.  
**Not for:** unknown location (use `find_code` first). Files under ~50 lines → editor Read is fine.  
**Credits:** ~5 hosted.

---

### `explain_architecture` — how modules wire

Structural map: entry points, auth flow, integrations, layers, import edges. Optional Mermaid / request flows in `mode: "deep"`. Pass `concern` (any subsystem label) or `seed_files` from search. Monorepo: `subpath`.

```
explain_architecture({ "path": "/abs/project", "focus": "auth" })
explain_architecture({ "path": "/abs/project", "mode": "deep", "focus": "api" })
explain_architecture({ "path": "/abs/project", "concern": "billing" })
explain_architecture({ "path": "/abs/project", "mode": "audit", "subpath": "apps/api" })
```

**focus:** `api` · `auth` · `integrations` · `database` · `security` · `full` (and related).  
**Returns:** entry points, auth, services, edit-first files, `next_calls`.  
**Next:** `read_code` on those paths.  
**Credits:** ~7 hosted.

---

### `check_package` — before any install or bump

Live registry across **12 ecosystems** (npm, PyPI, Cargo, Maven, NuGet, …). One tool, multiple **tasks** — not separate package tools.

| task | Purpose |
|------|---------|
| `check` | Exists? Slopsquat? Quick risk (default) |
| `upgrade` / `migrate` | Breaking changes, migration steps, code examples |
| `security` | CVE / GHSA focus for a version |
| `debug` | Advisories + release detail |

```
check_package({ "package": "express", "task": "check" })
check_package({ "package": "next", "task": "upgrade", "from_version": "14.2.0" })
check_package({ "package": "prisma", "task": "security", "version": "6.0.0" })
```

**MUST** before recommending `npm install` / `pip install` / `cargo add`. If `exists: false`, do not install.  
**Credits:** ~5 hosted.

---

### `check_test` — Test Pulse (run suite + health)

Runs the detected test runner and returns structured health: `fix_first`, `broken_areas`, `failure_clusters`, coverage signals, `session_id`. **Not** for deciding which product files to edit first (use find/architecture).

| task | Credits (hosted) |
|------|------------------|
| `detect` / `missing` | 0 (inventory / test gaps) |
| `run` | ~1 on success |
| `failures` / `list` / `status` / `why` / `fix_prompt` on `session_id` | 0 after a run |

```
check_test({ "task": "missing", "path": "/abs/project" })
check_test({ "task": "run", "path": "/abs/project", "diff_base": "main" })
check_test({ "task": "failures", "session_id": "ts_from_run" })
check_test({ "task": "fix_prompt", "session_id": "ts_from_run" })
```

**Hosted:** public GitHub URL or `inline_files` (local absolute paths often blocked on pure hosted). **Stdio / CLI:** runs on the machine.  
After edits that matter: run once, then free session slices — do not re-run full suite every question.

---

### `audit_headers` — live URL audit

Public HTTPS URL: security grade, TLS/headers/cookies, health, tech stack, optional deep secret scan. Blocks localhost/private IPs. Read `plain_summary` / `fix_first` first.

```
audit_headers({ "url": "https://myapp.example.com" })
audit_headers({ "url": "https://staging.example.com", "scan_depth": "deep" })
```

---

### `project_memory` — facts across sessions

Persists decisions/gotchas/conventions **per project** (stdio local SQLite or hosted cloud with API key). Actions: `remember` · `recall` · `list` · `forget`. Use the **same** `path` bucket every time.

```
project_memory({
  "action": "remember",
  "path": "/abs/project",
  "title": "Auth uses cookie JWT",
  "content": "Session in httpOnly cookie; refresh on /api/auth/refresh",
  "type": "gotcha",
  "area": "auth"
})
project_memory({ "action": "recall", "path": "/abs/project", "query": "auth cookies" })
```

Types: `decision` · `gotcha` · `goal` · `preference` · `area_fact` · `convention`.  
**Not** for stack detection (use `get_project_context`).

---

### `keep_thinking` — multi-step reasoning

Scaffold hypotheses across tool calls. Pass `lastActions` for loop detection. Cap ~10 thoughts/session. Required: `thought`, `thoughtNumber`, `totalThoughts`, `nextThoughtNeeded`, `confidence`, `thoughtType`.

```
keep_thinking({
  "thought": "Hypothesis: rate limit runs after the upload handler",
  "thoughtNumber": 1,
  "totalThoughts": 5,
  "nextThoughtNeeded": true,
  "confidence": 0.6,
  "thoughtType": "hypothesis",
  "goalAnchor": "Add rate limiting to POST /api/upload",
  "lastActions": ["find_code(query=rateLimit)", "read_code(target=handleUpload)"],
  "area": "api"
})
```

Use when stuck after 2+ failed attempts or high-blast-radius plans (auth, billing, schema).

---

### `Zephex_dev_info` — expert playbooks (not their private repo)

Standard patterns: Stripe webhooks, Supabase RLS, CSP, Next auth, etc. Always **search** then **get** by slug.

```
Zephex_dev_info({ "operation": "search", "query": "Stripe webhook raw body", "category": "payments" })
Zephex_dev_info({ "operation": "get", "slug": "<slug-from-search>" })
```

---

## Terminal CLI (Mode 2)

### Install (required for shell commands)

```bash
# Mac / Linux (both URLs are the same installer)
curl -fsSL https://zephex.dev/cli/install.sh | bash
curl -fsSL https://zephex.dev/install.sh | bash

# Windows PowerShell
irm https://zephex.dev/install.ps1 | iex
```

Bundles Node under `~/.zephex` when needed. Then:

```bash
cd /path/to/their-project    # always — CLI uses cwd
zephex login                 # browser or paste API key
zephex                       # interactive shell — type /
```

Without install, **do not invent** CLI output — use MCP tools or tell the user to install.

### Power commands agents should know

| Command | What it does | Notes |
|---------|--------------|--------|
| `zephex overview` | Product story, stack bars, how to run | `--json` · `--full` · `--force` · `--cwd` |
| `zephex deep` | Full dossier: stack + wiring + where to look | Optional task string; **`--json`** = agent packet `schema_version: 1` |
| `zephex structure` | Folder / language map | **0 credits**; `--agent` = FACTS/NEXT/GAPS |
| `zephex architecture` | Wiring map (same brain as MCP) | `--focus auth` · `--mode deep` · `--agent` |
| `zephex find "…"` | Search | Also `defs` · `rename` · `paste` |
| `zephex read path` | File / symbol brief | `summarize` · `outline` · `symbol` |
| `zephex test` | Run Test Pulse suite | Alias: `check test` |
| `zephex check test failures` | Failure details from last run | Needs prior `test` session |
| `zephex check test missing` | Sources without tests | 0 credits, no prior run |
| `zephex check test fix-prompt --copy` | Pasteable fix prompt for the agent | After a failing run |
| `zephex check test --dry-run` | Show detected runner only | 0 credits |
| `zephex safe <pkg>` | Package safety | `check-package next --task upgrade --from-version 14` |
| `zephex deps` | Scan direct dependencies | |
| `zephex env` | `.env` vs `.env.example` gaps | Free local |
| `zephex check url https://…` | Live URL audit | Also `site https://…` |
| `zephex remember` / `recall` | Project memory | Same as MCP memory |
| `zephex learn` | Free catalog of tools/commands | No API call |
| `zephex doctor` | Key, network, editor wiring | |
| `zephex agent` | MCP vs CLI short guide | Free |

**Deep for agents:**

```bash
cd /abs/project
zephex deep --json
# optional task:
zephex deep "add rate limiting to upload API" --json
# Open likely_touch paths; follow next_commands; use run.dev / run.test
```

**Test loop (critical):**

```bash
zephex check test --dry-run          # what runner will run
zephex check test missing            # gaps (free)
zephex test                          # bills ~1; creates session
zephex check test failures           # free session slice
zephex check test fix-prompt --copy  # paste into the agent
zephex check test status             # health dashboard
```

If failures says *No recent test session* → run `test` first.

**Interactive shell:** `/overview` · `/deep` · `/structure` · `/architecture` · `/find` · `/test` · `/failures` · `/safe` · `/usage` · `/quit`. After a tool prints, press Enter to return to the TUI. Ctrl+C cancels.

**Monorepo:** `zephex overview --cwd apps/web` or `cd apps/web` first.

**Discover without burning credits:** `zephex learn` · `zephex learn deep` · `zephex cli-guide tools`.

---

## Setup (editor MCP)

```bash
npx zephex setup                 # wizard
npx zephex setup --cursor        # or --claude, --vscode, …
npx zephex doctor                # health
```

API key: [zephex.dev/dashboard/api-keys](https://zephex.dev/dashboard/api-keys).  
Manual editor templates live under `configs/` in this repo (Cursor, VS Code, JetBrains, …) if setup is not used.

---

## If they only said "use Zephex"

1. Infer the goal from their message.  
2. Pick a **Workflow** row.  
3. MCP if connected; else CLI (if installed) or ask them to connect/install.  
4. Answer only from tool or CLI results.

### Example chains

**Onboard**

```
get_project_context({ "path": "/abs/app", "topic": "identity" })
get_project_context({ "path": "/abs/app", "topic": "run" })
# or: zephex deep --json
```

**Implement a feature**

```
find_code({ "query": "POST /api/upload", "path": "/abs/app", "intent": "concept" })
read_code({ "mode": "file", "path": "/abs/app", "files": ["src/routes/upload.ts"] })
check_package({ "package": "express-rate-limit", "task": "check" })
# edit…
check_test({ "task": "run", "path": "/abs/app", "diff_base": "main" })
```

**Auth map**

```
explain_architecture({ "path": "/abs/app", "focus": "auth", "mode": "overview" })
read_code on entry/auth files from the result
```

---

## Errors

| Error | Action |
|-------|--------|
| Unauthorized / no key | `npx zephex setup` or `zephex login` |
| 429 | Tell user; retry once later |
| Missing `path` | Ask absolute project directory |
| CLI not found | Install: `curl -fsSL https://zephex.dev/cli/install.sh \| bash` |
| No test session | Run `zephex test` before `check test failures` |

## Mistakes

- Recommending install without `check_package` / `safe`
- Blind multi-file read without `find_code` or architecture first
- Confusing **structure** (folders, free) with **architecture** (wiring, ~7 credits)
- Calling `check_test` to decide what to implement (use find/architecture; use check_test **after** edits)
- Inventing CLI output when the CLI is not installed
- Spamming `deep` / architecture every turn (costs credits)
- Describing their tree from memory when Zephex is available
