# Editor Configs — All 13 Editors

## Contents

- [Group 1: stdio + API key in env](#group-1-stdio-api-key-in-env)
- [Group 2: HTTP + Bearer header](#group-2-http-bearer-header)
- [Group 3: HTTP + OAuth (no API key)](#group-3-http-oauth-no-api-key)
- [Group 4: streamableHttp](#group-4-streamablehttp)
- [Group 5: VS Code inputs prompt](#group-5-vs-code-inputs-prompt)
- [Group 6: TOML](#group-6-toml)
- [Common Mistakes](#common-mistakes)

## Group 1: stdio + API key in env

**Claude Code** — `.mcp.json` (project root)
```json
{ "mcpServers": { "zephex": { "type": "stdio", "command": "npx", "args": ["-y", "zephex"], "env": { "ZEPHEX_API_KEY": "mcp_sk_your_key" } } } }
```
Verify: `/mcp` → shows zephex with 10 tools
Gotcha: HTTP configs don't work — must use stdio

**Zed** — `~/.config/zed/settings.json`
```json
{ "context_servers": { "zephex": { "source": "custom", "command": "npx", "args": ["-y", "zephex"], "env": { "ZEPHEX_API_KEY": "mcp_sk_your_key" } } } }
```
Verify: Assistant panel → context servers → zephex listed
Gotcha: Uses context_servers key, NOT mcpServers

**Goose** — `goose configure` CLI
ID: zephex | Name: zephex | Command: npx -y zephex | Timeout: 300 | Env: ZEPHEX_API_KEY=mcp_sk_your_key
Verify: `goose info -v` → zephex listed
Gotcha: Name must be lowercase "zephex"

**Factory AI** — `.factory/mcp.json`
```json
{ "mcpServers": { "zephex": { "type": "stdio", "command": "npx", "args": ["-y", "zephex"], "env": { "ZEPHEX_API_KEY": "mcp_sk_your_key" } } } }
```
Verify: Session start → tool list includes zephex
Gotcha: Must include "type": "stdio" explicitly

---

## Group 2: HTTP + Bearer header

**Cursor** — `.cursor/mcp.json`
```json
{ "mcpServers": { "zephex": { "url": "https://zephex.dev/mcp", "headers": { "Authorization": "Bearer YOUR_KEY" } } } }
```
Verify: Settings → Tools & MCPs → zephex shows 10 tools
Gotcha: Don't forget "Bearer " prefix

**Windsurf** — `~/.codeium/windsurf/mcp_config.json`
```json
{ "mcpServers": { "zephex": { "serverUrl": "https://zephex.dev/mcp", "headers": { "Authorization": "Bearer YOUR_KEY" } } } }
```
Verify: Settings → MCP → zephex shows Connected
Gotcha: Uses "serverUrl" NOT "url" — silent failure if wrong

**JetBrains** — Settings → AI Assistant → MCP Servers
URL: https://zephex.dev/mcp | Header: Authorization: Bearer YOUR_KEY
Verify: Status column shows green/connected
Gotcha: Must click Apply after adding

---

## Group 3: HTTP + OAuth (no API key)

**OpenCode** — `~/.config/opencode/opencode.json`
```json
{ "$schema": "https://opencode.ai/config.json", "mcp": { "zephex": { "type": "remote", "url": "https://zephex.dev/mcp" } } }
```
Verify: Session start shows zephex connected (10 tools)
Gotcha: Uses "mcp" key NOT "mcpServers" + needs $schema

**Kiro CLI** — `~/.kiro/settings/mcp.json`
```json
{ "mcpServers": { "zephex": { "url": "https://zephex.dev/mcp" } } }
```
Verify: `/mcp` → zephex listed with 10 tools
Gotcha: URL only — no headers, no API key needed

**Gemini CLI** — `~/.gemini/settings.json`
```json
{ "mcpServers": { "zephex": { "url": "https://zephex.dev/mcp", "type": "http" } } }
```
Verify: `/mcp` → zephex connected
Gotcha: Must include "type": "http" — NOT "httpUrl"

---

## Group 4: streamableHttp

**Cline** — Cline panel → MCP Servers → Remote Servers
```json
{ "mcpServers": { "zephex": { "url": "https://zephex.dev/mcp", "type": "streamableHttp", "disabled": false, "timeout": 60 } } }
```
Verify: MCP Servers panel → green status + 10 tools
Gotcha: type: "streamableHttp" NOT "sse" — OAuth won't trigger otherwise

---

## Group 5: VS Code inputs prompt

**VS Code** — `.vscode/mcp.json`
```json
{ "inputs": [{ "type": "promptString", "id": "zephex-api-key", "description": "Zephex API Key", "password": true }], "servers": { "zephex": { "type": "http", "url": "https://zephex.dev/mcp", "headers": { "Authorization": "Bearer ${input:zephex-api-key}" } } } }
```
Verify: MCP panel → zephex expands to 10 tool names
Gotcha: "servers" NOT "mcpServers" + inputs BEFORE servers + id has DASH not underscore

---

## Group 6: TOML

**Codex CLI** — `~/.codex/config.toml`
```toml
[mcp_servers.zephex]
url = "https://zephex.dev/mcp"
bearer_token_env_var = "ZEPHEX_API_KEY"
enabled = true
tool_timeout_sec = 60
```
Verify: Session start shows MCP: zephex (10 tools)
Gotcha: Must have enabled=true + tool_timeout_sec=60

---

## Common Mistakes

| Editor | Mistake | Fix |
|--------|---------|-----|
| Claude Code | HTTP config | Must use stdio |
| VS Code | "mcpServers" key | Use "servers" |
| VS Code | underscore in id | Use "zephex-api-key" |
| VS Code | servers before inputs | inputs FIRST |
| Windsurf | "url" instead of "serverUrl" | Use serverUrl |
| Cline | "type": "sse" | Use "streamableHttp" |
| OpenCode | Authorization header | Remove it — OAuth only |
| Codex CLI | missing enabled=true | Add it to config |