# Zephex Agent Skills

[![Install on skills.sh](https://skills.sh/b/zephexMCP/agent-skills)](https://skills.sh/zephexMCP/agent-skills)

Teach Claude Code, Cursor, and other agents how to use **Zephex MCP** and the **zephex terminal CLI** on the user's own repository.

## Install the skill

```bash
npx skills add zephexMCP/agent-skills
# or
npx skills add https://github.com/zephexmcp/agent-skills --skill zephex
```

## Prerequisites

| Need | How |
|------|-----|
| MCP in editor | `npx zephex setup` (or copy from `configs/`) |
| API key | [zephex.dev/dashboard/api-keys](https://zephex.dev/dashboard/api-keys) |
| Terminal CLI (optional) | `curl -fsSL https://zephex.dev/cli/install.sh \| bash` |

`https://zephex.dev/cli/install.sh` and `https://zephex.dev/install.sh` are the **same** installer. Windows: `irm https://zephex.dev/install.ps1 | iex`.

## What ships for agents

| File | Role |
|------|------|
| [`skills/zephex/SKILL.md`](./skills/zephex/SKILL.md) | Full routing: 10 tools + CLI commands |
| [`AGENTS.md`](./AGENTS.md) | Short session gate |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code preferences |
| `configs/*` | Optional manual MCP templates |

## Ten MCP tools

| Tool | Purpose |
|------|---------|
| `get_project_context` | Framework, scripts, env, monorepo (topic slices) |
| `find_code` | BM25 + ripgrep search |
| `read_code` | AST symbol / file / outline |
| `explain_architecture` | Wiring map + Mermaid-capable deep mode |
| `check_package` | Registry safety, CVEs, upgrades (12 ecosystems) |
| `check_test` | Test Pulse — run suite + failure health |
| `audit_headers` | Live HTTPS URL audit |
| `project_memory` | Remember / recall project facts |
| `keep_thinking` | Multi-step reasoning + loop detection |
| `Zephex_dev_info` | Expert implementation playbooks |

## CLI highlights (Mode 2)

```bash
curl -fsSL https://zephex.dev/cli/install.sh | bash
cd your-project && zephex login
zephex deep --json                 # orientation packet for agents
zephex structure --agent           # free folder map
zephex architecture --focus auth
zephex overview
zephex find "auth middleware"
zephex test                        # run suite
zephex check test failures         # after test
zephex check test fix-prompt --copy
zephex safe lodash
zephex learn                       # free catalog
```

## Maintainers

- [SKILL-MAINTAINER.md](./SKILL-MAINTAINER.md) — sync with mcpHub product tools  
- [TRIGGER-EVAL.md](./TRIGGER-EVAL.md) — description eval  
- [SECURITY.md](./SECURITY.md) — intentional MCP/CLI surfaces (for auditors)  
- Before push: `node scripts/eval-description.mjs` (20/20)

Ground truth: mcpHub `available-tools.ts` + proxy tool schemas.

### skills.sh page looks stale?

**There is no “publish” button.** skills.sh indexes via install telemetry + cached snapshots. GitHub `main` is the source of truth; the catalog Overview/Snyk can lag for weeks ([#919](https://github.com/vercel-labs/skills/issues/919), [#1273](https://github.com/vercel-labs/skills/issues/1273)).

| Check | Expected (current product) |
|-------|----------------------------|
| [raw SKILL.md](https://raw.githubusercontent.com/zephexMCP/agent-skills/main/skills/zephex/SKILL.md) | Call order starts with `get_project_context` → `find_code`; no `scope_task` / `inspect_url` |
| [download API](https://skills.sh/api/download/zephexmcp/agent-skills/zephex) | Should match GitHub after reindex (stale if it still lists `references/tools.md`) |
| [Snyk page](https://www.skills.sh/zephexmcp/agent-skills/zephex/security/snyk) | May still show May 2026 W011 until re-audit |

Install always clones **GitHub**, not the skills.sh HTML cache:

```bash
npx skills add zephexMCP/agent-skills --skill zephex -y
npx skills update zephex -y
```

Nudge reindex: reinstall via CLI, then if download API stays stale, open an issue on [vercel-labs/skills](https://github.com/vercel-labs/skills/issues).

## License

See [LICENSE](LICENSE).
