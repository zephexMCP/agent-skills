# Zephex Agent Skills

[![Install on skills.sh](https://skills.sh/b/zephexMCP/agent-skills)](https://skills.sh/zephexMCP/agent-skills)

> Teach your AI coding agent to use Zephex's 10 MCP tools correctly.

## Install

```bash
npx skills add zephexMCP/agent-skills
```

> Auto-detects your installed agents (Claude Code, Cursor,
> VS Code, Windsurf, Cline, OpenCode, Codex, Gemini CLI,
> Goose, Kiro, Roo, JetBrains, Factory AI, and 40+ more).

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

Zephex Agent Skills works with 55+ AI coding agents via
the skills CLI. Key supported editors include:

Claude Code · Cursor · VS Code · Windsurf · Cline ·
OpenCode · Codex CLI · Gemini CLI · Goose · Kiro CLI ·
Roo Code · JetBrains (Junie) · Factory AI (Droid) ·
GitHub Copilot · and 40+ more.

To install for a specific editor only:
```bash
npx skills add zephexMCP/agent-skills -a claude-code
npx skills add zephexMCP/agent-skills -a cursor
npx skills add zephexMCP/agent-skills -a codex
npx skills add zephexMCP/agent-skills -a gemini-cli
npx skills add zephexMCP/agent-skills -a github-copilot
npx skills add zephexMCP/agent-skills -a goose
npx skills add zephexMCP/agent-skills -a kiro-cli
npx skills add zephexMCP/agent-skills -a junie
npx skills add zephexMCP/agent-skills -a droid
npx skills add zephexMCP/agent-skills -a roo
```

Note: Zed does not currently support the skills CLI format.
For Zed, copy configs/zed.json manually.

## Common Mistakes

- VS Code: "mcpServers" → must be "servers"
- Windsurf: "url" → must be "serverUrl"
- Cline: "sse" → must be "streamableHttp"
- OpenCode: Authorization header → remove it
- Codex CLI: missing enabled=true

## License

MIT