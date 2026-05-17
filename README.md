# Zephex Agent Skills

[![Install on skills.sh](https://skills.sh/b/zephexMCP/agent-skills)](https://skills.sh/zephexMCP/agent-skills)

> Teach your AI coding agent to use Zephex's 10 MCP tools correctly.

## Install

```bash
npx skills add zephexMCP/agent-skills
```

> Auto-detects Claude Code, Cursor, VS Code, Windsurf,
> Cline, OpenCode, Codex, Gemini CLI, Goose, Kiro, Roo,
> JetBrains, Factory AI, and 40+ more editors automatically.

## Prerequisites

- **Node.js v18+** (for npx-based editors)
- **API key** from https://zephex.dev/signup (free tier)
- **OAuth editors** (OpenCode, Kiro, Gemini CLI, Cline): no key needed

## The 10 Tools

| Tool | Purpose |
|------|---------|
| zephex:scope_task | Min files to read (max 7) — ALWAYS FIRST |
| zephex:get_project_context | Stack, auth, hosting, key files |
| zephex:read_code | Symbol extraction + callers |
| zephex:find_code | Repo-wide search |
| zephex:explain_architecture | Auth/billing flow tracing |
| zephex:check_package | npm version + postinstall risk |
| zephex:audit_package | CVEs + breaking changes |
| zephex:audit_headers | HTTP/TLS grade A+ to F |
| zephex:Zephex_dev_info | Search the Zephex dev knowledge base (Stripe, Supabase, JWT, CSP, AWS, Bun, Expo). Use operation:search first, then operation:get with the returned slug. |
| zephex:thinking | Stateful reasoning |

## Supported Editors

Works with 55+ AI coding agents. Key supported editors:

| Editor | Transport | Config |
|---|---|---|
| Claude Code | stdio | .mcp.json |
| Cursor | HTTP Bearer | .cursor/mcp.json |
| VS Code | HTTP Bearer | .vscode/mcp.json |
| Windsurf | HTTP Bearer | mcp_config.json |
| Cline | streamableHttp | Remote Servers |
| OpenCode | OAuth | opencode.json |
| Codex CLI | TOML | ~/.codex/config.toml |
| Gemini CLI | OAuth | .gemini/settings.json |
| Goose | stdio | via goose configure |
| Kiro CLI | OAuth | .kiro/settings/mcp.json |
| Roo Code | HTTP | Settings panel |
| JetBrains (Junie) | HTTP | IDE Settings UI |
| Factory AI (Droid) | stdio | .factory/mcp.json |

> Zed does not currently support the skills CLI.
> For Zed, copy configs/zed.json manually into your
> Zed context_servers settings.

## Common Mistakes

- VS Code: "mcpServers" → must be "servers"
- Windsurf: "url" → must be "serverUrl"
- Cline: "sse" → must be "streamableHttp"
- OpenCode: Authorization header → remove it
- Codex CLI: missing enabled=true

## License

MIT