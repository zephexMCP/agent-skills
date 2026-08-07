# zephex

Agent skill for **[Zephex](https://zephex.dev)** — hosted MCP + terminal CLI for the **user's own codebase**.

## Install skill

```bash
npx skills add zephexMCP/agent-skills --skill zephex
```

## Connect MCP (editor)

```bash
npx zephex setup
# API key: https://zephex.dev/dashboard/api-keys
```

Official MCP host (user authenticates with **their** key): `https://zephex.dev/mcp`

## Install terminal CLI (optional)

```bash
curl -fsSL https://zephex.dev/cli/install.sh | bash
# same installer: https://zephex.dev/install.sh
# Windows: irm https://zephex.dev/install.ps1 | iex
```

## Call order (current product)

1. **Orient** — `get_project_context` (topic `identity` / `run`) or CLI `zephex deep --json`
2. **Layout (free, CLI)** — `zephex structure --agent` when you only need folders
3. **Wiring** — `explain_architecture` when the change spans modules
4. **Find → read** — `find_code` then `read_code` on hits
5. **Before install** — `check_package`
6. **After edits** — `check_test` (CLI: `zephex test` then `check test failures`)
7. **Stuck** — `keep_thinking` (not a separate “thinking” tool)
8. **Live URL** — `audit_headers` only for the URL the **user** provided

```text
get_project_context → find_code → read_code → [implement] → check_test
         ↘ explain_architecture (cross-cutting)
```

## The only 10 MCP tools

| Tool | What it does | Call when |
|------|----------------|-----------|
| `get_project_context` | Framework, scripts, env, monorepo topics | New repo / stack questions |
| `find_code` | BM25 + ripgrep search | Location unknown |
| `read_code` | AST symbol / file / outline | Known path or symbol |
| `explain_architecture` | Wiring, auth, integrations, Mermaid | Cross-cutting change |
| `check_package` | Registry safety, CVEs, upgrades | Before install/bump |
| `check_test` | Run tests + structured failures | After edits |
| `audit_headers` | Live HTTPS security/tech grade | User pastes production URL |
| `project_memory` | Remember/recall project facts | Across sessions |
| `keep_thinking` | Multi-step reasoning + loops | Stuck / high blast radius |
| `Zephex_dev_info` | Expert playbooks (not private repo) | Standard patterns |

Full instructions, args, CLI commands: **[SKILL.md](./SKILL.md)**.

## Security notes (for auditors)

- This skill package ships only `SKILL.md` + this README (no `references/tools.md`, no embedded stdio scripts).
- MCP: user runs `npx zephex setup` once and connects to the **official** host with **their** API key. The skill does not scrape arbitrary third-party sites into agent context.
- `audit_headers` / CLI `check url` run only on a **user-supplied** public HTTPS URL (security audit of their site). Not a general “fetch any webpage into the prompt” tool.
- Removed / never present in current product: `scope_task`, `inspect_url`, `audit_package`, bare `thinking` (use `keep_thinking`).

## Repo

https://github.com/zephexMCP/agent-skills
