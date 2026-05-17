# Zephex Agent Skills

> Teach your AI coding agent to use Zephex's 10 MCP tools correctly.

## Install

```bash
# Auto-detect installed agents
npx skills add zephex/agent-skills

# Target specific agents
npx skills add zephex/agent-skills -a claude-code
npx skills add zephex/agent-skills -a cursor
npx skills add zephex/agent-skills -a vscode
npx skills add zephex/agent-skills -a windsurf
npx skills add zephex/agent-skills -a cline
npx skills add zephex/agent-skills -a opencode
npx skills add zephex/agent-skills -a codex-cli
npx skills add zephex/agent-skills -a zed
```

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
| zephex:inspect_url | Clean content from any URL |
| zephex:thinking | Stateful reasoning |

## Supported Editors

| Editor | Transport | Config |
|--------|-----------|--------|
| Claude Code | stdio | .mcp.json |
| Cursor | HTTP | .cursor/mcp.json |
| VS Code | HTTP (inputs) | .vscode/mcp.json |
| Windsurf | HTTP | mcp_config.json |
| Cline | streamableHttp | Remote Servers |
| OpenCode | remote/OAuth | opencode.json |
| Codex CLI | HTTP/TOML | config.toml |
| Zed | stdio | settings.json |

## Common Mistakes

- VS Code: "mcpServers" → must be "servers"
- Windsurf: "url" → must be "serverUrl"
- Cline: "sse" → must be "streamableHttp"
- OpenCode: Authorization header → remove it
- Codex CLI: missing enabled=true

## License

MIT