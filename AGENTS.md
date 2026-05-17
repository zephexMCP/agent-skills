# Zephex Agent Skills

Auto-loaded by Claude Code, Gemini CLI, OpenCode, Codex CLI at session start.

## What Zephex Is

Zephex is a hosted MCP gateway at zephex.dev/mcp providing 10 tools that give AI agents real codebase intelligence — actual repo scanning, live npm registry data, and live HTTP auditing — instead of guessing from training data.

## Call Order

1. zephex:scope_task — call FIRST. Pass the task in plain English.
2. zephex:get_project_context — once per session on a new repo.
3. zephex:read_code — for each file scope_task returned. Pass the symbol name.
4. zephex:find_code — before implementing anything new. Pass the pattern.
5. zephex:thinking — when stuck after 3+ investigated paths.

## All 10 Tools

| Tool | What it does | Call when | Token cost |
|---|---|---|---|
| zephex:scope_task | Returns ≤7 files + utilities + callers at risk | FIRST, always | ~300 vs 18k manual |
| zephex:get_project_context | Stack, auth, hosting, queues, key files | New repo/session | ~500 vs 40k manual |
| zephex:read_code | Symbol extraction + imports + call sites | Instead of full file reads | ~400 vs 8k manual |
| zephex:find_code | Repo-wide ripgrep | Before implementing anything new | ~150 vs 20k manual |
| zephex:explain_architecture | End-to-end request/auth/billing flow | Before touching auth or DB | ~600 vs 30k manual |
| zephex:check_package | npm exists + version + postinstall risk | Before any npm install | ~200 vs 6k manual |
| zephex:audit_package | CVEs + breaking changes + migration | Before upgrading packages | ~400 vs 8k manual |
| zephex:audit_headers | HTTP/TLS grade A+ to F | After every production deploy | ~400 vs 8k manual |
| zephex:Zephex_dev_info | Search a curated dev knowledge base (Stripe / Supabase / CSP / JWT / AWS / Bun / Expo) | Recipes for setup, security, deployment | ~150 per lookup |
| zephex:thinking | Stateful session — tracks what you checked | Complex bugs, risky changes | ~200 per update |

## Hard Rules

- Never open a file before calling zephex:scope_task
- Never read a full file — use zephex:read_code with the symbol name
- Never implement a new function before calling zephex:find_code
- Never run npm install without calling zephex:check_package first
- Always call zephex:audit_headers after any production deploy
- Open zephex:thinking when you've hit 3+ dead ends in debugging
- Pass `path` directly when the user mentions a GitHub URL or repo name (`github:owner/repo` or full URL). Don't dump source into `inline_files` if a remote URL works.
- For private GitHub repos, the server uses `GITHUB_PAT`. If a private-repo call returns ACTION_REQUIRED, retry with `inline_files`.

## Quick Connect

**Group 1: stdio + API key**
Claude Code, Zed, Goose, Factory AI
```json
{ "mcpServers": { "zephex": { "type": "stdio", "command": "npx", "args": ["-y", "zephex"], "env": { "ZEPHEX_API_KEY": "mcp_sk_xxx" } } } }
```
(Claude Code: .mcp.json, Zed: context_servers in settings.json)

**Group 2: HTTP + Bearer**
Cursor, Windsurf, JetBrains
Cursor: { "mcpServers": { "zephex": { "url": "https://zephex.dev/mcp", "headers": { "Authorization": "Bearer XXX" } } } }
Windsurf: serverUrl NOT url

**Group 3: OAuth (no API key)**
OpenCode, Kiro, Gemini CLI, Cline
OpenCode: $schema + mcp key (not mcpServers)
Cline: type: streamableHttp (NOT "sse")
Gemini: url + type: "http"

**VS Code**: inputs BEFORE servers, id: zephex-api-key (dash)

**Codex CLI**: TOML with enabled=true + tool_timeout_sec=60

Full configs: see skills/zephex/references/configs.md

## Get API Key

https://zephex.dev/signup — free tier available.