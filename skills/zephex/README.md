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

## Call order (current product · v2.1.0)

```text
get_project_context → find_code → read_code → [implement] → check_test
         ↘ explain_architecture (cross-cutting)
              keep_thinking (if stuck)
```

**Dead names (never call):** `scope_task` · `inspect_url` · `audit_package` · bare `thinking`

## The only 10 MCP tools

| Tool | What it does | Call when | Credits |
|------|----------------|-----------|---------|
| `get_project_context` | Framework, scripts, env, monorepo topics | New repo / stack questions | ~7 |
| `find_code` | BM25 + ripgrep search | Location unknown | ~5 |
| `read_code` | AST symbol / file / outline | Known path or symbol | ~5 |
| `explain_architecture` | Wiring, auth, integrations, Mermaid | Cross-cutting change | ~7 |
| `check_package` | Registry safety, CVEs, upgrades | Before install/bump | ~5 |
| `check_test` | Run tests + structured failures | After edits | ~1 |
| `audit_headers` | Live HTTPS security/tech grade | User pastes production URL | ~5 |
| `project_memory` | Remember/recall project facts | Across sessions | ~1–3 |
| `keep_thinking` | Multi-step reasoning + loops | Stuck / high blast radius | ~1–3 |
| `Zephex_dev_info` | Expert playbooks (not private repo) | Standard patterns | ~3–5 |

Full instructions, args, CLI commands: **[SKILL.md](./SKILL.md)**.

## Security notes (for auditors)

- This skill package ships only `SKILL.md` + this README (no `references/tools.md`, no embedded stdio scripts).
- MCP: user runs `npx zephex setup` once and connects to the **official** host with **their** API key. The skill does not scrape arbitrary third-party sites into agent context.
- `audit_headers` / CLI `check url` run only on a **user-supplied** public HTTPS URL (security audit of their site). Not a general “fetch any webpage into the prompt” tool.
- Removed / never present in current product: `scope_task`, `inspect_url`, `audit_package`, bare `thinking` (use `keep_thinking`).

## Repo

https://github.com/zephexMCP/agent-skills
