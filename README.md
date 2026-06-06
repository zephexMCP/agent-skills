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
- **API key** from https://zephex.dev/signup (free tier), or **`npx zephex setup`**
- **OAuth editors** (OpenCode, Kiro, Gemini CLI, Cline): no key needed

The agent skill is **`skills/zephex/SKILL.md`** (workflow + tool routing). Editor JSON is in **`configs/`** — install with `npx zephex setup` or copy from there.

**Maintainers:** read **[SKILL-MAINTAINER.md](SKILL-MAINTAINER.md)** before editing the skill (structure, mistakes to avoid, ship checklist).

## The 10 Tools

| Tool | Purpose |
|------|---------|
| scope_task | Focus files for the task (default 7, up to 15) — use early on non-trivial work |
| get_project_context | Stack, auth, hosting, key files |
| read_code | Symbol extraction + callers |
| find_code | Repo-wide search |
| explain_architecture | Auth/billing flow tracing |
| check_package | Registry safety before install |
| audit_package | CVEs + breaking changes |
| audit_headers | HTTP/TLS grade A+ to F |
| Zephex_dev_info | Dev KB — search then get by slug |
| keep_thinking | Stateful reasoning (not `thinking`) |

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