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
license: MIT
metadata:
  version: "2.2.1"
  author: zephexMCP
compatibility: >-
  MCP (user connects once via setup): official host https://zephex.dev/mcp —
  run `npx zephex setup` with the user's own API key from zephex.dev.
  CLI (optional): curl -fsSL https://zephex.dev/cli/install.sh | bash
  (same as https://zephex.dev/install.sh; Windows: irm https://zephex.dev/install.ps1 | iex).
---

# Zephex — MCP + CLI for the user's project

Zephex is **codebase intelligence for the user's own repo** (not training data, not library docs). One account, one credit pool, **ten tools**, three ways to run them:

| Surface | When | How |
|---------|------|-----|
| **Mode 1 · Editor MCP** | Agent in Cursor / Claude Code / VS Code / … | Call tools by name (`find_code`, …) with `path` |
| **Mode 2 · Terminal CLI** | Human or agent in a real shell; JSON pack; free layout | `cd` their project → `zephex <command>` |
| **Web terminal** | Browser demo, no install, public GitHub | dashboard terminal — same command words as CLI |

Same backend. `zephex:find_code` is the same as `find_code`. CLI `zephex find` is the same brain as MCP `find_code`. If you do not know which **command** to type, use the CLI map below — do not invent flags.

If they asked you to use Zephex, you MUST call at least one Zephex tool (or one `zephex` command on their tree) before answering about their code. Do not call the same tool more than **3 times** per turn without new evidence.

**Prefer MCP** when connected. **Prefer CLI** for Mode 2, free `structure` / `env`, or `zephex deep --json`.

**Removed — never call:** `scope_task`, `inspect_url`, `audit_package`, bare `thinking`.

---

## Workflow

| Situation | MCP | CLI (`cd` project first) |
|-----------|-----|---------------------------|
| New / unfamiliar repo | `get_project_context` topic `identity` then `run` | `zephex deep --json` or `overview` |
| "What is this app?" | `get_project_context` | `zephex overview` / `overview --json` |
| Folder layout only | — | `zephex structure --agent` (**0 credits**) |
| How it is wired / auth | `explain_architecture` | `zephex architecture` · `arch --focus auth` |
| Task orientation | find + architecture | `zephex deep "the task"` |
| Unknown location | `find_code` → `read_code` | `zephex find "…"` → `read` path |
| Large rename | `find_code` intent `everywhere` | `zephex rename Name` |
| Add / bump a package | `check_package` (task check then upgrade/security/migrate) | `zephex safe pkg` |
| After edits / tests | `check_test` task `run`, then failures on session | `zephex test` then `check test failures` |
| Live URL they pasted | `audit_headers` | `zephex check url https://…` |
| Remember a decision | `project_memory` | `zephex remember` / `recall` |
| Stuck after 2+ fails | `keep_thinking` | `zephex think "…"` (one-shot) |
| Generic playbook (not their repo) | `Zephex_dev_info` | `zephex docs "…"` |

You MUST call `check_test` (or `zephex test`) after substantive edits when they care about green tests. You MUST call `check_package` (or `zephex safe`) before recommending install.

**`path`:** absolute project dir, or public `github:owner/repo` / GitHub URL. Monorepo: pass the **app package** root (or CLI `--cwd`).

**`inline_files`:** `{ "src/a.ts": "<full file body>" }` only when there is no disk.

---

## Tool: `get_project_context`

**What it does:** Reads manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, …) and returns **one topic slice** — stack, scripts, auth, deploy — not file bodies.

**Call when:** First look at a repo; “what is this?”; you need run/test commands.

**DO NOT call when:** You already know the file (`read_code`) or you are hunting a symbol (`find_code`).

**Example — user: “what stack is this?”**

```
get_project_context({ "path": "/abs/project", "topic": "identity" })
get_project_context({ "path": "/abs/project", "topic": "run" })
```

**After it returns:** Use `data.key_paths` and `summary` as truth. Follow `related_topics` / `next_calls`. Do not invent scripts from memory.

Topics: `identity` · `run` · `framework` · `backend` · `frontend` · `database` · `auth` · `deploy` · `structure` · `integrations` · `security`. Cached; `force: true` refreshes. ~7 credits.

CLI: `zephex overview` · `overview --json` · `get-context --topic run`.

---

## Tool: `find_code`

**What it does:** Ripgrep + **BM25** ranking + AST blocks. Search when you do **not** know the path.

| intent | Example |
|--------|---------|
| `snippet` | User pasted a line from the editor |
| `symbol` | Known name `validateToken` |
| `concept` | “rate limit” + `also_try` synonyms |
| `everywhere` | Rename map; set `whole_word: true` |

**Call when:** Location unknown.

**DO NOT call when:** Path + symbol already known → `read_code`.

**Example — user: “where is upload rate limiting?”**

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

**After it returns:** `read_code` the top hit in `files_hit` / `next_calls`. Do not open the whole repo.

CLI: `zephex find "rate limit"` · `defs` · `rename` · `paste`.

---

## Tool: `read_code`

**What it does:** Surgical AST read — symbol, file batch (1–20), outline, scan, smell. Local-disk only: `callers` / `blast_radius` / `dead_code`.

**Call when:** You have a path or symbol from `find_code`.

**DO NOT call when:** Location unknown. Files under ~50 lines → editor Read is fine.

**Example — user: “show me handleUpload”**

```
read_code({ "target": "handleUpload", "path": "/abs/project", "detail_level": "context" })
read_code({ "mode": "file", "path": "/abs/project", "files": ["src/routes/upload.ts"] })
read_code({ "mode": "outline", "path": "/abs/project", "files": ["src/handlers/auth.ts"] })
```

**After it returns:** Edit from the returned body/signature. Outline first on 300+ line files.

CLI: `read` · `summarize` · `outline` · `symbol`. After `find`, prefer `read <path>` — bare `symbol Name` can return 0 matches.

---

## Tool: `explain_architecture`

**What it does:** Wiring map — entry points, auth flow, integrations, layers. `mode: deep` adds request flows + Mermaid. `concern` is any subsystem name.

**Call when:** Cross-cutting change (auth, billing, API); “how does X work?”

**DO NOT call when:** Stack only (`get_project_context`) or one file body (`read_code`) or folder list (CLI `structure`).

**Example — user: “how does auth work here?”**

```
explain_architecture({ "path": "/abs/project", "focus": "auth" })
explain_architecture({ "path": "/abs/project", "mode": "deep", "focus": "api" })
explain_architecture({ "path": "/abs/project", "concern": "billing" })
```

**After it returns:** `read_code` on `entry_points` / edit-first files. Then implement.

CLI: `zephex architecture` · `arch --focus auth --mode deep`.

---

## Tool: `check_package`

**What it does:** Live registry check across 12 ecosystems. One tool, tasks `check` | `upgrade` | `security` | `migrate` | `debug` — not a second package tool.

**Call when:** Before any install, bump, or “is this package safe?”

**DO NOT call when:** Searching their code or running tests.

**Example — user: “add lodash” / “upgrade Next from 14”**

```
check_package({ "package": "lodash", "task": "check" })
check_package({ "package": "next", "task": "upgrade", "from_version": "14.2.0" })
check_package({ "package": "prisma", "task": "security", "version": "6.0.0" })
```

**After it returns:** If `exists: false`, do **not** install. Use `breaking_changes` before writing a bump.

CLI: `zephex safe lodash` · `check-package next --task upgrade --from-version 14`.

---

## Tool: `check_test`

**What it does:** Test Pulse — runs the suite and returns `fix_first`, `broken_areas`, `failure_clusters`, `session_id`. Not for choosing which product files to edit.

**Call when:** After edits; “do tests pass?”; missing coverage.

**DO NOT call when:** Finding symbols or deciding what to implement.

**Example — user: “did my change break tests?”**

```
check_test({ "task": "missing", "path": "/abs/project" })
check_test({ "task": "run", "path": "/abs/project", "diff_base": "main" })
check_test({ "task": "failures", "session_id": "ts_from_run" })
check_test({ "task": "fix_prompt", "session_id": "ts_from_run" })
```

**After it returns:** Fix `fix_first` / `broken_areas`. Reuse `session_id` — do not re-`run` unless code changed. `detect` / `missing` are 0 credits; `run` ~1; session slices free.

CLI: `zephex test` then `check test failures` · `check test fix-prompt --copy`.

---

## Tool: `audit_headers`

**What it does:** Live HTTPS grade for a **URL the user pasted**. Headers, TLS, health. Blocks localhost.

**Call when:** They give a staging/prod URL.

**DO NOT call when:** Repo search, tests, or random third-party pages.

**Example — user: “is https://myapp.vercel.app healthy?”**

```
audit_headers({ "url": "https://myapp.vercel.app" })
```

**After it returns:** Read `plain_summary` / `fix_first` first.

CLI: `zephex check url https://…` · `site https://…`. Do **not** pass `site --fast`.

---

## Tool: `project_memory`

**What it does:** Save/recall facts **not** in source — decisions, gotchas, conventions. Same `path` every time.

**Call when:** User says remember/recall; after a non-obvious decision.

**DO NOT call when:** Stack scan (`get_project_context`) or a fact already in this chat.

**Example — user: “remember we use cookie JWT”**

```
project_memory({
  "action": "remember",
  "path": "/abs/project",
  "title": "Auth uses cookie JWT",
  "content": "Access in httpOnly cookie; refresh on /api/auth/refresh",
  "type": "gotcha",
  "area": "auth"
})
project_memory({ "action": "recall", "path": "/abs/project", "query": "auth cookies" })
```

CLI: `zephex remember "…"` · `zephex recall auth` · `memory list` (not `memory recall`).

---

## Tool: `keep_thinking`

**What it does:** Multi-step plan/debug with loop detection. Required: `thought`, `thoughtNumber`, `totalThoughts`, `nextThoughtNeeded`, `confidence`, `thoughtType`. Pass `lastActions`.

**Call when:** Stuck after 2+ failed attempts; high-blast-radius plan (auth, billing, schema).

**DO NOT call when:** The fix is already known.

**Wrong MCP name:** `thinking` → use **`keep_thinking` only**.

**Example — user: “logout loop, two fixes failed”**

```
keep_thinking({
  "thought": "Hypothesis: refresh token is not rotated on logout",
  "thoughtNumber": 1,
  "totalThoughts": 5,
  "nextThoughtNeeded": true,
  "confidence": 0.6,
  "thoughtType": "hypothesis",
  "goalAnchor": "Fix auth logout loop",
  "lastActions": ["find_code(query=refreshToken)", "read_code(target=authMiddleware)"]
})
```

CLI: `zephex think "…"` — one-shot only. Multi-turn stays in the editor.

---

## Tool: `Zephex_dev_info`

**What it does:** Expert playbooks (Stripe webhooks, RLS, CSP) — **not** their private repo. Always `search` then `get` by slug.

**Call when:** Generic “how do Stripe webhooks work?” after repo tools.

**DO NOT call when:** You need *their* files (`find_code`) or a package CVE (`check_package`).

**Example — user: “Stripe webhook raw body in Next”**

```
Zephex_dev_info({ "operation": "search", "query": "Stripe webhook raw body", "category": "payments" })
Zephex_dev_info({ "operation": "get", "slug": "<from-search>" })
```

CLI: `zephex docs "…"` · `ask "…"`.

---

## Terminal CLI — Mode 2 (full command map)

If the CLI is not installed, **do not invent** output — use MCP or tell them to install.

```bash
# Mac / Linux (both URLs are the same installer)
curl -fsSL https://zephex.dev/cli/install.sh | bash
curl -fsSL https://zephex.dev/install.sh | bash
# Windows: irm https://zephex.dev/install.ps1 | iex

cd /path/to/their-project          # always — CLI uses cwd
zephex login                       # browser OAuth or paste API key
zephex                             # interactive TUI — type /
zephex learn                       # free catalog of every command (0 credits)
zephex agent                       # MCP vs CLI cheat sheet (free)
zephex doctor                      # key + network + editor wiring
```

### Which CLI command = which MCP tool

| You type | Same as MCP | Use it when |
|----------|-------------|-------------|
| `zephex overview` / `get-context` / `stack` | `get_project_context` | “What is this app? How do I run it?” |
| `zephex deep` / `dossier` / `know` | context + architecture (+ find if you pass a task) | First serious session; “where do I start for *this* task?” |
| `zephex structure` | *(CLI only, 0 credits)* | Folder / language map — not wiring |
| `zephex architecture` / `arch` | `explain_architecture` | “How does auth / API wire?” |
| `zephex find` / `find-code` / `defs` / `rename` / `paste` | `find_code` | Location unknown |
| `zephex read` / `summarize` / `outline` / `symbol` / `files` | `read_code` | Path or symbol known |
| `zephex safe` / `check-package` | `check_package` | Before install or bump |
| `zephex test` / `check test` | `check_test` | After edits |
| `zephex check url` / `site` | `audit_headers` | They pasted a live HTTPS URL |
| `zephex remember` / `recall` | `project_memory` | Facts across sessions |
| `zephex think` / `reason` | `keep_thinking` | Stuck (CLI is one-shot) |
| `zephex docs` / `ask` | `Zephex_dev_info` | Generic playbooks, not their files |

### Four orientation commands (do not swap them)

| Command | Question it answers | Credits |
|---------|---------------------|---------|
| `overview` | What *is* this product? Stack? How do I run it? | ~7 |
| `structure` | What folders exist? Language mix? | **0** |
| `architecture` | How does control/auth/data *wire*? | ~7 |
| `deep` | Full dossier + optional task: where to touch? | multi (~14+) |

```bash
# overview — product brief
zephex overview
zephex overview --json
zephex overview --full
zephex overview --force              # bust cache
zephex overview --cwd apps/web
zephex overview github:owner/repo

# structure — free layout (NOT architecture)
zephex structure
zephex structure --agent             # FACTS / NEXT / GAPS for agents
zephex structure --focus src --depth 4
zephex structure --json

# architecture — wiring
zephex architecture
zephex arch --focus auth
zephex architecture --focus api --mode deep
zephex architecture --mode audit --subpath apps/api
zephex architecture --agent
zephex architecture --json

# deep — orientation packet (not a separate MCP tool)
zephex deep
zephex deep "add rate limiting to upload"
zephex deep --json                   # schema_version: 1 — agents start here
zephex deep "fix auth" --json -o .zephex/deep.json
zephex deep --full
zephex deep --cwd apps/web "add dark mode"
zephex deep github:owner/repo
# aliases: dossier · know
```

**After `deep --json`:** open `likely_touch[0..2]`, follow `plan[]` and `next_commands`, use `run` for dev/test/build. If `honesty` says the wrong monorepo package was indexed, re-run with `--cwd`. Do not spam `deep` every turn.

### Search, read, packages, site, memory

```bash
zephex find "AuthError"
zephex find encrypt --also cipher,E2E
zephex defs Symbol
zephex rename OldName
zephex paste 'export async function foo('
zephex read path/to/file.ts
zephex summarize a.ts b.ts
zephex outline src/handlers/auth.ts
zephex symbol Name                   # can 0-match after find — prefer read <path>
zephex who validateToken

zephex safe lodash
zephex check-package next --task upgrade --from-version 14
zephex deps
zephex env                           # .env vs .env.example — free local

zephex check url https://example.com
zephex site https://example.com
# never: site --fast

zephex remember "auth uses cookie JWT"
zephex recall auth
zephex memory list                   # not: memory recall
```

### Test Pulse loop (must keep this order)

```bash
zephex check test --dry-run          # 0 credits — which runner
zephex check test missing            # 0 credits — sources without tests
zephex test                          # ~1 credit; creates session_id
zephex check test failures           # free; needs that session
zephex check test fix-prompt --copy
zephex check test status
```

If you see `No recent test session` → run `zephex test` first, then `failures`.

### Interactive TUI (`zephex` with no args)

Type `/` then: `/overview` · `/deep` · `/structure` · `/architecture` · `/find` · `/test` · `/failures` · `/safe` · `/learn` · `/doctor` · `/usage` · `/quit`.

Enter runs. After output, Enter returns to the TUI. Ctrl+C cancels.

### Free discovery (no analysis credits)

`zephex learn` · `learn deep` · `learn architecture` · `learn find_code` · `cli-guide tools` · `cli-guide agent` · `cli-guide project` · `check test learn`

### Setup / account (no analysis credits)

`zephex setup` · `login` · `logout` · `connect --cursor` (or `--claude` / `--vscode` / `--codex` / …) · `doctor` · `status` · `reconnect` · `repair` · `usage` · `update` · `uninstall`

### Shared flags

`--json` (parse the **last** JSON object; progress lines may print first) · `--cwd <pkg>` · `--path github:owner/repo` · `--no-local` · `--api-key` · `-q` · `--force` (context cache).

Monorepo: CLI auto-picks the densest package under `src`/`app`/`lib`. Wrong tree → `cd apps/web` or `--cwd`.

---

## If they only said “use Zephex”

1. Infer the goal.  
2. Pick a **Workflow** row.  
3. Call the tool.  
4. Answer only from the result.

**Onboard**

```
get_project_context({ "path": "/abs/app", "topic": "identity" })
get_project_context({ "path": "/abs/app", "topic": "run" })
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
explain_architecture({ "path": "/abs/app", "focus": "auth" })
# then read_code on the entry/auth files it returns
```

---

## Legacy aliases (still route)

| Wrong name | Use instead |
|------------|-------------|
| `thinking` | `keep_thinking` only |
| `scope_task` | `find_code` + `explain_architecture`, or CLI `deep "task"` |
| `audit_package` | `check_package` with `task=upgrade` or `task=security` |

---

## Common mistakes

- Answering about their repo without a Zephex call when they said “use Zephex”
- Using `scope_task`, `audit_package`, or `thinking`
- `find_code` when path+symbol already known
- `check test failures` before any `test` run
- Install without `check_package` / `safe`
- Confusing **structure** (layout, free) with **architecture** (wiring)
- Spamming `deep` / architecture every turn
- `site --fast` (unknown flag)
- `memory recall` instead of `recall`
- Wrong monorepo package — use `--cwd` or `cd` into the app

## Error handling

- **Unauthorized** — `npx zephex setup` / `zephex login`
- **429** — tell the user; retry once
- **Missing path** — ask for the absolute project directory
- **CLI session errors** — run the prerequisite (`test` before `failures`)

Do not silently answer from training data about **their** codebase.
