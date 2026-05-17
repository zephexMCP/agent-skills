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

## Tools

| Tool | Purpose | Call when |
|---|---|---|
| zephex:scope_task | Returns focus-file set + callers at risk | FIRST, always |
| zephex:get_project_context | Stack, auth, hosting, key files | New repo/session |
| zephex:read_code | Symbol extraction by name or file | Instead of full file reads |
| zephex:find_code | BM25-ranked repo-wide code search | Before implementing |
| zephex:explain_architecture | Entry points, auth flow, services | Before touching auth or DB |
| zephex:check_package | npm/PyPI/Cargo version + postinstall risk | Before any install |
| zephex:audit_package | CVEs + breaking changes + migration steps | Before upgrading |
| zephex:audit_headers | HTTP/TLS grade A+ to F + fix snippets | After production deploy |
| zephex:Zephex_dev_info | Search the Zephex dev knowledge base (Stripe, Supabase, JWT, CSP, AWS, Bun, Expo). Use operation:search first, then operation:get with the returned slug. | Recipes, setup, security |
| zephex:thinking | Stateful reasoning with drift detection | Hard bugs, risky changes |

## Hard Rules

1. Never open a file before calling zephex:scope_task
2. Never read a full file — use zephex:read_code with the symbol name
3. Never implement a new function before calling zephex:find_code
4. Never run npm install without calling zephex:check_package first
4b. Never run pip install or cargo add without calling zephex:check_package first (rule 4 applies to all package managers, not just npm)
5. Always call zephex:audit_headers after any production deploy
6. Open zephex:thinking when you've hit 3+ dead ends in debugging

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