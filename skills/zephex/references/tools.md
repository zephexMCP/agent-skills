Zephex tools — per-tool agent reference

│ Auth groups, in your existing terminology:
│ stdio + API key = Claude Code, Zed, Goose, Factory AI
│ HTTP Bearer = Cursor, Windsurf, JetBrains
│ OAuth = OpenCode, Kiro, Gemini CLI, Cline
│
│ All 10 tools work over all three groups. The transport is per-editor, not per-tool. The notes below mark "Auth group: all three" everywhere — keep that or strip it; your call.
│
│ The path parameter on every code-reading tool (scope_task, get_project_context, read_code, find_code, explain_architecture) accepts BOTH a local absolute directory (macOS / Linux /
Windows / WSL) AND a GitHub / GitLab / Bitbucket URL (https://github.com/owner/repo or short-form github:owner/repo). Private repos work when the server has GITHUB_PAT set, or once
per-user GitHub OAuth ships.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

1. zephex:scope_task

Call when: ALWAYS FIRST, before any non-trivial coding task. Replaces blindly reading 20 files.

Input parameters

┌──────────────┬──────────┬─────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Parameter    │ Type     │ Required    │ Description                                                                                              │
├──────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ task         │ string   │ yes         │ Plain-English description of what to build / fix / refactor. 1–2000 chars.                               │
├──────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ path         │ string   │ conditional │ Local absolute directory or a GitHub / GitLab / Bitbucket URL. Required unless inline_files is provided. │
├──────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ inline_files │ object   │ conditional │ Fallback: { "<rel-path>": "<full file contents>" }. 10–40 source files. Used when path isn't accessible. │
├──────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ hint_symbols │ string[] │ no          │ Up to 10 known target symbol names (e.g. ["validateToken"]). Bypasses auto-extraction.                   │
├──────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ max_files    │ number   │ no          │ Default 7, range 1–15. Use 2–3 for tiny fixes, 8–12 for cross-cutting changes.                           │
├──────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ detail_level │ enum     │ no          │ minimal (~150 tok) | standard (~450 tok, default) | full (~800 tok with snippets).                       │
└──────────────┴──────────┴─────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Example call

{
  "name": "scope_task",
  "arguments": {
    "path": "https://github.com/sindresorhus/is-online",
    "task": "add a timeout option to the isOnline function",
    "max_files": 5,
    "detail_level": "standard"
  }
}

Example output (abbreviated)

{
  "task": "add a timeout option to the isOnline function",
  "search_anchors": ["timeout", "isOnline", "option"],
  "focus_files": [
    { "path": "index.js", "role": "contains_target",
      "reason": "defines isOnline on line 138" },
    { "path": "test.js", "role": "tests",
      "reason": "covers isOnline option behaviour" }
  ],
  "reusable_utilities": [
    { "name": "AbortSignal.timeout", "location": "stdlib",
      "reason": "use this instead of building a Promise race" }
  ],
  "callers_at_risk": [
    { "file": "browser.js", "line": 60, "severity": "likely_affected",
      "reason": "shadows isOnline; signature change must mirror" }
  ],
  "risk_assessment": "low — isolated function, full test coverage",
  "suggested_approach": "Add `timeout` to options, default 5000, use AbortSignal.timeout."
}

Error states

1. Path inaccessible → returns an ACTION_REQUIRED instruction. Recover: retry with inline_files containing 10–40 source files from the user's open workspace.
2. Task too short / vague (-32602) → returns invalid-params error. Recover: rephrase the task in plain English with a verb and an object ("add X to Y", "fix bug Z in W").
3. Rate limited (-32002 with Retry-After) → wait and retry; free tier 30/hr, pro 100/hr, max 300/hr.

Depends on

Nothing. Always called first. May be followed by find_code, read_code, explain_architecture.

Auth group

All three.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

2. zephex:get_project_context

  Call when: Once per session on a new repo, OR when the user mentions "this project / my repo / what's the stack". Replaces reading package.json / pyproject.toml / go.mod / pom.xml /
  Cargo.toml / Gemfile / composer.json / *.csproj / build.gradle(.kts) / pubspec.yaml / Podfile / Package.swift.

  Input parameters

  ┌───────────────────┬─────────┬─────────────┬───────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter         │ Type    │ Required    │ Description                                                                       │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ path              │ string  │ conditional │ Local absolute directory or GitHub URL. Required unless inline_files is supplied. │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ inline_files      │ object  │ conditional │ Fallback. Include the project-definition file plus 2–4 source files.              │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ force             │ boolean │ no          │ Re-detect even if cached. Use after git pull brings dep changes.                  │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ detail_level      │ enum    │ no          │ brief (≤500 tok, default) | standard (full fields) | full (+ file tree).          │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ include_structure │ boolean │ no          │ Include file tree (also implied by detail_level: 'full').                         │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ structure_depth   │ number  │ no          │ Default 3, max 6.                                                                 │
  ├───────────────────┼─────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────┤
  │ focus_on          │ string  │ no          │ Subdirectory to narrow tree (e.g. 'services/api').                                │
  └───────────────────┴─────────┴─────────────┴───────────────────────────────────────────────────────────────────────────────────┘

  Example call

  {
    "name": "get_project_context",
    "arguments": {
      "path": "github:vercel/next.js",
      "detail_level": "full",
      "include_structure": true,
      "structure_depth": 3
    }
  }

  Example output (abbreviated)

  {
    "stack": {
      "language": "TypeScript",
      "framework": "Next.js",
      "runtime": "Node.js",
      "packageManager": "pnpm"
    },
    "conventions": { "monorepo": true, "srcLayout": "packages/*" },
    "scripts": ["build", "test", "dev", "lint"],
    "test_command": "pnpm test",
    "dev_command": "pnpm dev",
    "build_command": "pnpm build",
    "entry_points": ["packages/next/src/server/next.ts"],
    "module_system": "esm",
    "ci_cd": ["GitHub Actions"],
    "dependency_versions": { "react": "^19.0.0", "typescript": "^5.9.3" },
    "version_health": { "outdated_count": 3, "majors_behind": 1 }
  }

  Error states

  1. No project root detected → returns "No project root found" and a hint. Recover: pass a more specific path inside the project subdirectory.
  2. Permission denied (macOS Full Disk Access) → returns specific instruction with steps. Recover: instruct the user to grant their editor Full Disk Access in System Settings →
  Privacy & Security.
  3. Path "X" doesn't exist in HTTP-mode (hosted) → returns ACTION_REQUIRED. Recover: retry with inline_files.

  Depends on

  Nothing. Often called before read_code / find_code so the agent knows the stack and conventions.

  Auth group

  All three.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

  3. zephex:read_code

  Call when: You want a specific symbol or file content, surgically. Don't read whole files when you can extract a function.

  Input parameters

  ┌──────────────────────┬──────────┬─────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter            │ Type     │ Required    │ Description                                                                                                          │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ mode                 │ enum     │ no          │ symbol (default) | file | outline | callers | blast_radius | dead_code.                                              │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ path                 │ string   │ conditional │ Local dir or GitHub URL. Required unless inline_files.                                                               │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ inline_files         │ object   │ conditional │ Fallback.                                                                                                            │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ target               │ string   │ conditional │ Symbol name. Required for mode:'symbol' unless symbol_id is provided. Supports fuzzy matching ("auth" matches        │
  │                      │          │             │ "handleAuth").                                                                                                       │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ targets              │ string[] │ no          │ Up to 8 additional symbols to batch-search.                                                                          │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ symbol_id            │ string   │ no          │ Stable ID like 'src/auth.ts::hashApiKey#function'. Bypasses fuzzy.                                                   │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ kind                 │ enum     │ no          │ function | class | method | interface | type | variable | struct | enum | trait | protocol | module | namespace |    │
  │                      │          │             │ hook | component | decorator | macro.                                                                                │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ files                │ string[] │ conditional │ For mode:'file' or 'outline'. Up to 20.                                                                              │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ offset_line          │ number   │ no          │ For mode:'file'. 1-indexed.                                                                                          │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ limit_lines          │ number   │ no          │ For mode:'file'. Max lines per file.                                                                                 │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ compact              │ boolean  │ no          │ Omit line numbers, save tokens.                                                                                      │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ detail_level         │ enum     │ no          │ signature (~100 tok) | body (default) | context (body + imports).                                                    │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ max_tokens           │ number   │ no          │ Default 2000, max 8000.                                                                                              │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ max_results          │ number   │ no          │ Default 3, max 10. With targets[], applies PER target.                                                               │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ confidence_threshold │ number   │ no          │ 0.0–1.0. Default 0.5. Raise to 0.8 for exact, lower to 0.3 for exploration.                                          │
  ├──────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ session_id           │ string   │ no          │ Dedup across calls (previously-returned symbols return a stub).                                                      │
  └──────────────────────┴──────────┴─────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Example calls

  Mode: symbol (most common)

  {
    "name": "read_code",
    "arguments": {
      "path": "https://github.com/sindresorhus/is-online",
      "mode": "symbol",
      "target": "isOnline",
      "max_results": 1,
      "detail_level": "body"
    }
  }

  Mode: file (read a specific file)

  {
    "name": "read_code",
    "arguments": {
      "path": "github:sindresorhus/is-online",
      "mode": "file",
      "files": ["index.js", "browser.js"],
      "max_tokens": 2000
    }
  }

  Mode: outline (file structure first, before drilling in)

  {
    "name": "read_code",
    "arguments": {
      "path": "github:sindresorhus/is-online",
      "mode": "outline",
      "files": ["index.js"]
    }
  }

  Example output (mode: symbol)

  {
    "target": "isOnline",
    "symbols": [
      {
        "name": "isOnline",
        "kind": "function",
        "file": "index.js",
        "line": 138,
        "end_line": 202,
        "language": "javascript",
        "signature": "export default async function isOnline(options =",
        "body": "138 | async function isOnline(options = {}) {\n139 | ...",
        "is_definition": true,
        "is_exported": true,
        "confidence": 1.0,
        "token_estimate": 596
      }
    ],
    "total_found": 1,
    "tokens_saved_vs_full_files": 4500
  }

  Error states

  1. Symbol not found (mode:'symbol') → returns symbols: [] with error_hint suggesting to lower confidence_threshold or call find_code first to locate it by pattern.
  2. File not found (mode:'file') → entry has content: "// File not found: X". Recover: confirm the file exists in the repo (use mode:'outline' on a known file or find_code
   with file_pattern).
  3. Modes callers / blast_radius / dead_code require an index (built lazily after the first call). First call may return a hint to retry after the index builds (~5–15s
  background).

  Depends on

  Often called after find_code (which locates symbols by pattern) or scope_task (which returns a focus-file shortlist).

  Auth group

  All three.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

  4. zephex:find_code

  Call when: You're searching by pattern, not by name. Replaces native Grep / ripgrep / Glob / find. Always call before implementing anything new (search for existing
  utilities first).

  Input parameters

  ┌─────────────────┬──────────┬─────────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter       │ Type     │ Required    │ Description                                                                                  │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ query           │ string   │ yes         │ Search text. Format depends on query_mode.                                                   │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ path            │ string   │ conditional │ Local dir or GitHub URL. Required unless inline_files.                                       │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ inline_files    │ object   │ conditional │ Fallback.                                                                                    │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ queries         │ string[] │ no          │ Up to 4 additional queries. Results merged, deduped, ranked together. Use for synonyms.      │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ query_mode      │ enum     │ no          │ literal (default, exact) | regex (ripgrep) | boolean (AND / OR / NOT).                       │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ scope           │ enum     │ no          │ all (default) | definitions | usages | tests | config | imports | comments.                  │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ file_pattern    │ string   │ no          │ Glob, e.g. "*.{ts,tsx}", "src/**/*.py".                                                      │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ language        │ string   │ no          │ ripgrep --type. e.g. typescript, python, go, rust, swift, kotlin.                            │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ max_results     │ number   │ no          │ Default 10, max 50.                                                                          │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ response_format │ enum     │ no          │ concise (default, ~50 tok/result) | detailed (full AST blocks).                              │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ max_tokens      │ number   │ no          │ Default 8000.                                                                                │
  ├─────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ exhaustive      │ boolean  │ no          │ Return EVERY match (up to 500) as compact file:line list. Use before renames / global edits. │
  └─────────────────┴──────────┴─────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘

  Example calls

  Boolean query, definitions only

  {
    "name": "find_code",
    "arguments": {
      "path": "github:vercel/next.js",
      "query": "stripe AND webhook NOT test",
      "query_mode": "boolean",
      "scope": "definitions",
      "max_results": 10
    }
  }

  Exhaustive (before renaming a symbol)

  {
    "name": "find_code",
    "arguments": {
      "path": "/Users/alice/myapp",
      "query": "OldUserModel",
      "exhaustive": true,
      "scope": "all"
    }
  }

  Example output (concise)

  {
    "query": "isOnline",
    "query_mode": "literal",
    "scope": "definitions",
    "matches": [
      {
        "file": "./browser.js",
        "line": 60,
        "content": "export default async function isOnline(options = {}) {",
        "enclosing_block": "...",
        "block_start": 60,
        "block_end": 92,
        "symbol_name": "isOnline",
        "symbol_type": "function",
        "is_definition": true,
        "bm25_score": 0.0116,
        "token_estimate": 217
      }
    ]
  }

  Error states

  1. No matches → matches: [] with hint to broaden the query, drop the scope filter, or use query_mode:'boolean'.
  2. Path not found → ACTION_REQUIRED; retry with inline_files.
  3. Regex compile error (when query_mode:'regex') → returns the parser error; recover by escaping or simplifying.

  Depends on

  Often called before read_code (find first, then extract by name). Often called after scope_task or get_project_context to narrow the area.

  Auth group

  All three.

---

5. zephex:explain_architecture

  Call when: User asks anything architectural — auth flow, data flow, request tracing, design questions, "how does this work", "where does X happen".

  Input parameters

  ┌───────────────┬────────┬─────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter     │ Type   │ Required    │ Description                                                                                                                   │
  ├───────────────┼────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ path          │ string │ conditional │ Local dir or GitHub URL. (Also accepts project_path as alias.)                                                                │
  ├───────────────┼────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ inline_files  │ object │ conditional │ Fallback. Include 10–50 source files.                                                                                         │
  ├───────────────┼────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ focus         │ enum   │ no          │ auth | api | database | billing | data_flow | error_handling | full (default).                                                │
  ├───────────────┼────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ mode          │ enum   │ no          │ overview (fast, 3 analyzers + service diagram, default) | deep (5–7 analyzers + sequence diagram) | audit (complexity +       │
  │               │        │             │ anti-patterns + health score).                                                                                                │
  ├───────────────┼────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ output_format │ enum   │ no          │ json | json+mermaid (default) | mermaid_only.                                                                                 │
  ├───────────────┼────────┼─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ detail_level  │ enum   │ no          │ minimal (~400 tok) | standard (~1k tok, default) | full (~2.4k tok, includes state_management + constraints).                 │
  └───────────────┴────────┴─────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Example calls

  Auth flow analysis on a remote repo

  {
    "name": "explain_architecture",
    "arguments": {
      "path": "https://github.com/myorg/myapp",
      "focus": "auth",
      "mode": "deep",
      "output_format": "json+mermaid"
    }
  }

  Health audit

  {
    "name": "explain_architecture",
    "arguments": {
      "path": "github:myorg/myapp",
      "mode": "audit",
      "detail_level": "full"
    }
  }

  Example output (abbreviated)

  {
    "stack": { "language": "TypeScript", "framework": "Express" },
    "entry_points": [
      { "file": "src/server.ts", "kind": "http_listener", "line": 12 }
    ],
    "auth_flow": {
      "provider": "Auth0",
      "session_strategy": "httpOnly cookie + refresh token rotation",
      "middleware_chain": ["jwt-verify", "rbac", "rate-limit"]
    },
    "data_flow": [
      { "from": "POST /api/orders", "via": "OrderService", "to": "Postgres orders" }
    ],
    "external_services": [
      { "name": "Stripe", "type": "payments", "client_file": "src/lib/stripe.ts" },
      { "name": "Postgres", "type": "database" }
    ],
    "anti_patterns": [
      { "name": "god object", "file": "src/services/UserService.ts", "severity": "medium" }
    ],
    "complexity_hotspots": [
      { "file": "src/utils/helpers.ts", "cyclomatic": 42 }
    ],
    "health_score": 78,
    "diagrams": {
      "service": "flowchart TD\n  Client --> Express\n  Express --> Auth0\n  Express --> Postgres",
      "sequence": "sequenceDiagram\n  Client->>Express: POST /api/orders\n  Express->>Auth0: verify JWT\n  ..."
    }
  }

  Error states

  1. No entry points found → returns hint suggesting focus:'api' or providing a more specific subdirectory.
  2. Project too large for mode:'deep' → suggests mode:'overview' plus a focus.
  3. Path inaccessible → ACTION_REQUIRED; retry with inline_files.

  Depends on

  Often called after get_project_context so the analyser knows the framework. May be called standalone for a fresh GitHub URL.

  Auth group

  All three.

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

  6. zephex:check_package

  Call when: Before any npm install / pip install / cargo add etc. Verify the package exists, isn't deprecated, isn't typosquatted, doesn't have malicious postinstall
  hooks.

  Input parameters

  ┌───────────┬────────┬──────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter │ Type   │ Required │ Description                                                                                                                   │
  ├───────────┼────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ package   │ string │ yes      │ Package name. For Maven, use 'groupId:artifactId'.                                                                            │
  ├───────────┼────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ version   │ string │ no       │ Installed version. Auto-detected from lockfile when omitted.                                                                  │
  ├───────────┼────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ecosystem │ enum   │ no       │ npm (default) | pypi | cargo | gem | go | maven | nuget | packagist | pub | hex | cocoapods | spm. Auto-detected from naming. │
  ├───────────┼────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ source    │ string │ no       │ 'local' (default) or 'github:owner/repo' to verify from the repo's manifest.                                                  │
  └───────────┴────────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Example calls

  {
    "name": "check_package",
    "arguments": {
      "package": "@stripe/sync-engine",
      "source": "github:stripe/sync-engine-fork"
    }
  }

  {
    "name": "check_package",
    "arguments": {
      "package": "androidx.compose.ui:ui",
      "ecosystem": "maven",
      "version": "1.7.0"
    }
  }

  Example output (real, observed in production)

  {
    "package": "@stripe/sync-engine",
    "exists": true,
    "deprecated": false,
    "deprecated_message": null,
    "yanked": false,
    "latest": "0.2.5",
    "published_at": "2026-04-14T...",
    "weekly_downloads": 12450,
    "license": "MIT",
    "maintainers_count": 18,
    "supply_chain_signals": {
      "has_postinstall": false,
      "has_install_time_network": false,
      "phantom_deps": [],
      "typosquat_risk": "low",
      "recent_maintainer_changes": false
    },
    "installed_version": null,
    "installed_version_source": "unavailable",
    "version_detection": "Pass `version` explicitly, or `source: github:owner/repo`."
  }

  Error states

  1. exists: false → not in registry. Recover: check spelling; flag to user as possible typosquat.
  2. yanked: true or deprecated: true → still returns details; agent should NOT install. Suggest audit_package for migration alternatives.
  3. Ecosystem mismatch (e.g. python name passed as npm) → returns exists: false; recover by passing ecosystem explicitly.

  Depends on

  Nothing. Quick check before install.

  Auth group

  All three.

---

7. zephex:audit_package

  Call when: Upgrading a package, debugging a version conflict, reviewing CVEs, or planning a migration. Deeper than check_package.

  Input parameters

  ┌──────────────┬────────┬──────────┬──────────────────────────────────────────────────────────────────┐
  │ Parameter    │ Type   │ Required │ Description                                                      │
  ├──────────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────┤
  │ package      │ string │ yes      │ Package name. Maven: 'groupId:artifactId'.                       │
  ├──────────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────┤
  │ task         │ enum   │ no       │ upgrade | debug | security | migrate. Pick based on user intent. │
  ├──────────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────┤
  │ from_version │ string │ no       │ Current version. Auto-detected from lockfile when omitted.       │
  ├──────────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────┤
  │ ecosystem    │ enum   │ no       │ Same options as check_package.                                   │
  ├──────────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────┤
  │ source       │ string │ no       │ 'local' (default) or 'github:owner/repo'.                        │
  └──────────────┴────────┴──────────┴──────────────────────────────────────────────────────────────────┘

  Example call

  {
    "name": "audit_package",
    "arguments": {
      "package": "next",
      "from_version": "13.5.4",
      "task": "upgrade"
    }
  }

  Example output (abbreviated)

  {
    "package": "next",
    "from_version": "13.5.4",
    "latest": "16.2.1",
    "task": "upgrade",
    "breaking_changes": [
      {
        "version": "14.0.0",
        "title": "next/font moved to top-level next/font",
        "migration": "Replace `import { Inter } from '@next/font/google'` with `import { Inter } from 'next/font/google'`."
      },
      {
        "version": "15.0.0",
        "title": "Caching defaults changed (fetch no longer cached by default)",
        "migration": "Add `cache: 'force-cache'` to fetch calls that relied on the old default."
      }
    ],
    "cves": [
      {
        "id": "CVE-2025-29927",
        "cvss": 9.1,
        "patched_in": "13.5.7",
        "affected": ">=13.0.0 <13.5.7",
        "summary": "Auth bypass in middleware..."
      }
    ],
    "code_examples": [
      { "before": "import { Inter } from '@next/font/google';",
        "after":  "import { Inter } from 'next/font/google';" }
    ],
    "peer_dependency_conflicts": [
      { "package": "react", "required": ">=19.0.0", "installed": "^18.2.0" }
    ],
    "node_compatibility": "Node >= 18.18",
    "esm_cjs_status": "ESM-only since 14.0"
  }

  Error states

  1. from_version not in registry → recover by calling check_package first to verify the version is real.
  2. No breaking changes / CVEs → returns clean summary; safe to upgrade.
  3. Stale registry data → suggests retrying with task:'security' for live CVE lookup.

  Depends on

  Often called after check_package flags an issue. Almost always followed by find_code (exhaustive) to locate every call site that the breaking change affects.

  Auth group

  All three.

---

8. zephex:audit_headers

  Call when: After every production deploy. Also for compliance reviews (SOC2, PCI, HIPAA), security audits, "is this URL secure", cert-expiry checks, redirect-chain
  audits, CORS / CSP debugging.

  Input parameters

  ┌─────────────────┬─────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter       │ Type    │ Required │ Description                                                                              │
  ├─────────────────┼─────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
  │ url             │ string  │ yes      │ Public HTTPS URL. e.g. https://zephex.dev.                                               │
  ├─────────────────┼─────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
  │ check_redirects │ boolean │ no       │ Default true. Follow + audit the full redirect chain.                                    │
  ├─────────────────┼─────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
  │ check_ssl       │ boolean │ no       │ Default true. Cert validity, expiry, TLS version, cipher.                                │
  ├─────────────────┼─────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
  │ check_headers   │ boolean │ no       │ Default true. CSP / HSTS / X-Frame-Options / COOP / COEP / Permissions-Policy / etc.     │
  ├─────────────────┼─────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
  │ check_cookies   │ boolean │ no       │ Default true. Secure / HttpOnly / SameSite / Partitioned / __Host- / __Secure- prefixes. │
  └─────────────────┴─────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────────────┘

  Example call

  {
    "name": "audit_headers",
    "arguments": {
      "url": "https://zephex.dev",
      "check_headers": true,
      "check_ssl": true,
      "check_cookies": true
    }
  }

  Example output (abbreviated)

  {
    "url": "https://zephex.dev",
    "grade": "A",
    "headers": {
      "csp":               { "present": true, "value": "default-src 'self'...", "issues": ["unsafe-inline in script-src"] },
      "hsts":              { "present": true, "max_age": 31536000, "include_sub_domains": true, "preload_eligible": true },
      "x_frame_options":   "DENY",
      "x_content_type_options": "nosniff",
      "referrer_policy":   "strict-origin-when-cross-origin",
      "permissions_policy": { "camera": "()", "microphone": "()" },
      "coop":              "same-origin",
      "coep":              "require-corp"
    },
    "ssl": {
      "issuer": "Let's Encrypt",
      "subject_cn": "zephex.dev",
      "san": ["zephex.dev", "*.zephex.dev"],
      "valid_until": "2026-08-15T...",
      "tls_version": "1.3",
      "cipher_suite": "TLS_AES_256_GCM_SHA384",
      "ocsp_stapling": true
    },
    "redirects": [
      { "from": "http://zephex.dev", "to": "https://zephex.dev", "status": 301, "ssl_ok": true }
    ],
    "cookies": [
      { "name": "session", "secure": true, "http_only": true, "same_site": "Strict", "partitioned": true }
    ],
    "fix_snippets": [
      { "platform": "Vercel (vercel.json)", "code": "..." },
      { "platform": "Cloudflare (_headers)", "code": "..." },
      { "platform": "Nginx", "code": "add_header Strict-Transport-Security ..." }
    ]
  }

  Error states

  1. DNS / unreachable → returns connection error; recover by checking the URL or DNS.
  2. HTTP-only URL (no HTTPS) → tool requires HTTPS; recover by trying https:// form.
  3. Self-signed / invalid chain → reports as a finding (grade drops), not as an error.

  Depends on

  Nothing. Standalone.

  Auth group

  All three.

---

9. zephex:Zephex_dev_info

  Call when: User asks "how do I do X" with a topic in our knowledge base — Stripe webhooks, Supabase RLS, Convex schemas, CSP/CORS hardening, JWT rotation, AWS ECS deploy
  patterns, Bun runtime, Next.js 16 patterns, Expo / Play Store signing, etc. Two-step lookup: search then get.

  Input parameters

  ┌───────────┬────────┬─────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter │ Type   │ Required    │ Description                                                                             │
  ├───────────┼────────┼─────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ operation │ enum   │ no          │ search (default) | get.                                                                 │
  ├───────────┼────────┼─────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ query     │ string │ conditional │ Required for search. Natural-language question.                                         │
  ├───────────┼────────┼─────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ slug      │ string │ conditional │ Required for get. Exact slug returned by a previous search.                             │
  ├───────────┼────────┼─────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ category  │ enum   │ no          │ Filter for search: databases | security | frontend | backend | auth | mobile | android. │
  └───────────┴────────┴─────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

  Example calls

  Step 1: search

  {
    "name": "Zephex_dev_info",
    "arguments": {
      "operation": "search",
      "query": "Stripe webhook signature verification with raw body",
      "category": "security"
    }
  }

  Step 2: get the full entry

  {
    "name": "Zephex_dev_info",
    "arguments": {
      "operation": "get",
      "slug": "stripe-webhook-signature-verification-raw-body"
    }
  }

  Example output (search)

  {
    "results": [
      {
        "slug": "stripe-webhook-signature-verification-raw-body",
        "title": "Verify Stripe webhook signatures with the raw request body",
        "category": "security",
        "snippet": "Use express.raw({ type: 'application/json' }) BEFORE express.json()..."
      },
      {
        "slug": "stripe-webhook-replay-protection",
        "title": "Stripe webhook replay protection (5-minute window)",
        "category": "security",
        "snippet": "..."
      }
    ]
  }

  Example output (get)

  {
    "slug": "stripe-webhook-signature-verification-raw-body",
    "title": "Verify Stripe webhook signatures with the raw request body",
    "category": "security",
    "content": "## Why\n\nExpress's body-parser consumes the raw bytes...\n\n## How\n\n```ts\napp.post('/webhook', express.raw({ type: 'application/json' }), (req, res) =>\n  {\n  const sig = req.headers['stripe-signature'];\n  let event;\n  try {\n    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);\n  } catch (err) { ... }\n});\n```\n..."
  }

  Error states

  1. No results → results: [] with a hint to widen the query or drop the category filter.
  2. Slug not found → recover by running a search first to get a valid slug.
  3. KB temporarily unavailable → 503 with retry hint.

  Depends on

  Nothing. Quick lookups.

  Auth group

  All three.

---

10. zephex:thinking

  Call when: Hard bugs, multi-system issues, high-risk changes (auth / billing / DB schema / RLS / Stripe webhook refactor / encryption key rotation), planning before
  coding, post-incident root-cause analysis, when you've hit 3+ dead ends.

  Input parameters

  ┌─────────────────────┬──────────┬──────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter           │ Type     │ Required │ Description                                                                                                             │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ thought             │ string   │ yes      │ The reasoning content for this step. 1–2000 chars. Be specific — vague thoughts trip drift detection.                   │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ thoughtNumber       │ integer  │ yes      │ 1-based.                                                                                                                │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ totalThoughts       │ integer  │ yes      │ Estimated total. Can be revised upward.                                                                                 │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ nextThoughtNeeded   │ boolean  │ yes      │ false triggers checkpoint write.                                                                                        │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ confidence          │ number   │ yes      │ 0.0–1.0. Below 0.5 forces revision; above 0.85 is safe to proceed.                                                      │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ thoughtType         │ enum     │ yes      │ hypothesis | observation | plan | revision | conclusion | question | debug.                                             │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ sessionId           │ uuid     │ no       │ Cross-session memory. If supplied at thoughtNumber: 1, server replays the last checkpoint.                              │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ goalAnchor          │ string   │ no       │ One-sentence restatement of the original goal. Strongly recommended from thought 2 onward — two-strike drift detection. │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ iterationLimit      │ integer  │ no       │ Hard cap; exceeding forces nextThoughtNeeded: false.                                                                    │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ isRevision          │ boolean  │ no       │ True if this revises a prior thought.                                                                                   │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ revisesThought      │ integer  │ no       │ Which thought number this revises.                                                                                      │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ branchFromThought   │ integer  │ no       │ Branching point.                                                                                                        │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ branchId            │ string   │ no       │ Label like 'hypothesis-A' for parallel exploration.                                                                     │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ assumptions         │ object[] │ no       │ Up to 5. Each { text, confidence, invalidated }. Mark invalidated:true when a tool result contradicts.                  │
  ├─────────────────────┼──────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ toolOutputRelevance │ enum     │ no       │ Classify the last tool call: critical | supporting | noise | error. 3+ noise/error in last 5 → endless-loop detected.   │
  └─────────────────────┴──────────┴──────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Example calls

  Thought 1 — set up a hypothesis with a goal anchor

  {
    "name": "thinking",
    "arguments": {
      "thought": "EU users double-charged after v4.7 deploy. Suspect Stripe webhook replay without idempotency key.",
      "thoughtNumber": 1,
      "totalThoughts": 6,
      "nextThoughtNeeded": true,
      "confidence": 0.4,
      "thoughtType": "hypothesis",
      "goalAnchor": "find why EU users are double-charged after v4.7"
    }
  }

  Thought 4 — revise after a tool result contradicts

  {
    "name": "thinking",
    "arguments": {
      "thought": "Webhook handler IS idempotent. Real issue is the front-end submitting twice on slow networks.",
      "thoughtNumber": 4,
      "totalThoughts": 6,
      "nextThoughtNeeded": true,
      "confidence": 0.7,
      "thoughtType": "revision",
      "isRevision": true,
      "revisesThought": 1,
      "goalAnchor": "find why EU users are double-charged after v4.7",
      "toolOutputRelevance": "critical"
    }
  }

  Final — write a checkpoint and stop

  {
    "name": "thinking",
    "arguments": {
      "thought": "Root cause: front-end double-submit on retries. Fix: disable submit button + idempotency key in checkout request.",
      "thoughtNumber": 6,
      "totalThoughts": 6,
      "nextThoughtNeeded": false,
      "confidence": 0.9,
      "thoughtType": "conclusion",
      "goalAnchor": "find why EU users are double-charged after v4.7"
    }
  }

  Example output

  {
    "thoughtNumber": 4,
    "totalThoughts": 6,
    "session": {
      "checkpointed": false,
      "compressionApplied": false,
      "compressedThoughtCount": 0
    },
    "endlessLoopDetected": false,
    "driftDetected": false,
    "riskWarnings": [],
    "nextRecommendedTool": "find_code",
    "nextRecommendedReason": "Verify the front-end submit handler is the actual source"
  }

  Error states

  1. Drift detected (two consecutive thoughts off goalAnchor after thought 2) → returns a warning. Recover: re-anchor with the original goal in the next thought.
  2. Endless-loop detected (3+ noise/error toolOutputRelevance in the last 5 thoughts) → forced stop with checkpoint. Recover: change approach entirely.
  3. confidence < 0.5 → server hints to revise before next step.

  Depends on

  Nothing. Open BEFORE you start reading code on a hard problem — that's the whole point.

  Auth group

  All three.
