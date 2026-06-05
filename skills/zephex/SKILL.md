---
name: zephex
description: >-
  Use this skill when the user works in their own codebase with Zephex MCP connected:
  find or read code, scope a feature or fix, map architecture, check a package before install,
  audit a live HTTPS URL, or debug after failed attempts — including when they only say
  "use Zephex," "use MCP," or a wrong tool name. Prefer Zephex tools over Grep/Read for their
  repo; do not describe their code from memory if MCP is connected. Triggers: find_code,
  read_code, scope_task, get_project_context, explain_architecture, check_package,
  audit_package, audit_headers, keep_thinking, Zephex_dev_info.
compatibility: >-
  Requires Zephex MCP at https://zephex.dev/mcp. API key or OAuth (OpenCode, Kiro, Gemini CLI,
  Cline). Connect with npx zephex setup.
---

# Zephex MCP

Ten tools at `https://zephex.dev/mcp` for **the user's project** — not training data.

They may only say *"use Zephex"* or *"use MCP."* You choose the tool and call it (`find_code`, `read_code`, …). Some editors show `zephex:find_code` — same tool.

## Workflow

| Situation | Chain |
|-----------|--------|
| New repo | `get_project_context` → optional `explain_architecture` |
| Feature, fix, refactor | `scope_task` → `read_code` on `focus_files` |
| Unknown location | `find_code` → `read_code` |
| Large rename | `find_code` + `exhaustive: true` → `files_summary` |
| Add or upgrade dependency | `check_package` → `audit_package` if needed |
| Stuck after 2+ tries | `keep_thinking` ↔ `find_code` / `read_code` |
| Production URL | `audit_headers` |
| Generic patterns (not their repo) | `Zephex_dev_info` search → get |

**`path`** on every repo tool: absolute folder (`/Users/jane/api`) or `github:owner/repo`. Monorepo: `path` = app root, not empty parent.

**`inline_files`:** only without disk access — `{ "rel/path": "<full file text>" }`.

Max **3** calls of the same tool per turn without new evidence.

### Step 1 — Orient or scope

New repo or vague ask:

```
get_project_context({ "path": "/abs/project", "detail_level": "brief" })
```

Before reading many files for a task:

```
scope_task({
  "task": "Add rate limiting to POST /api/upload",
  "path": "/abs/project",
  "hint_symbols": ["handleUpload"]
})
```

Use `focus_files`, `callers_at_risk`, `suggested_approach`. Good `task`: one clear sentence. Bad: `"fix it"`.

### Step 2 — Read or search

Known symbol:

```
read_code({ "target": "handleUpload", "path": "/abs/project" })
```

Unknown location:

```
find_code({ "query": "validateToken", "path": "/abs/project", "scope": "definitions" })
```

Then `read_code` on the best hit. Skip `find_code` if you already know the symbol.

### Step 3 — Package, architecture, URL, reasoning

```
check_package({ "package": "express", "ecosystem": "npm" })
```

```
explain_architecture({ "path": "/abs/project", "focus": "auth" })
```

```
audit_headers({ "url": "https://example.com" })
```

```
keep_thinking({
  "thought": "Hypothesis: rate limit runs after handler",
  "thoughtNumber": 1,
  "totalThoughts": 5,
  "nextThoughtNeeded": true,
  "confidence": 0.6,
  "thoughtType": "hypothesis",
  "goalAnchor": "Add rate limiting to POST /api/upload",
  "lastActions": ["find_code(query=rateLimit)"]
})
```

Tool name is **`keep_thinking`**, not `thinking`.

```
Zephex_dev_info({ "operation": "search", "query": "Stripe webhook signature" })
```

Then `operation: "get"` with the slug from search.

## Tool reference

| Tool | When | Key args |
|------|------|----------|
| `get_project_context` | New session | `path`, `force?` |
| `scope_task` | Task before bulk reads | `task`, `path`, `hint_symbols?`, `max_files?` (1–15) |
| `find_code` | Don't know where | `query`, `path`, `scope?`, `exhaustive?` |
| `read_code` | Known symbol/files | `target` or `mode`+`files`, `path` |
| `check_package` | Before install | `package`, `ecosystem` |
| `audit_package` | Upgrade/CVE | `package`, `task`, `from_version?` |
| `explain_architecture` | How this repo works | `path`, `focus?` |
| `audit_headers` | User gave URL | `url` |
| `keep_thinking` | Stuck / risky change | `thought`, `thoughtNumber`, `goalAnchor`, `lastActions` |
| `Zephex_dev_info` | Playbooks | `operation`: search → get |

`read_code` `callers` / `blast_radius`: local `path` only — on `github:` use `find_code` usages.

## If they only said "use Zephex"

1. Guess the goal from their message.
2. Pick a **Workflow** row.
3. Call with `path` + specific args.
4. Answer from tool JSON only.

## Errors

| Error | Action |
|-------|--------|
| Unauthorized | `npx zephex setup` |
| 429 | Tell user; retry once |
| Missing `path` | Ask absolute project directory |

## Mistakes

- Install without `check_package`
- Many reads without `scope_task`
- `find_code` when `target` is known
- `thinking` instead of `keep_thinking`
- Repo answers from memory when Zephex is connected