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

**GitHub `main` is correct** (push worked). [skills.sh](https://www.skills.sh/zephexmcp/agent-skills/zephex) often **caches** Overview / Call Order / Snyk from first index (e.g. May 2026). Known issue: [vercel-labs/skills#919](https://github.com/vercel-labs/skills/issues/919).

| Check | URL |
|-------|-----|
| Live skill body | https://raw.githubusercontent.com/zephexMCP/agent-skills/main/skills/zephex/SKILL.md |
| Per-skill overview for directory | [skills/zephex/README.md](./skills/zephex/README.md) |

Install always pulls **GitHub**, not the skills.sh HTML cache:

```bash
npx skills add zephexMCP/agent-skills --skill zephex -y
# later:
npx skills update zephex -y
```

To nudge re-index: empty commit on `main`, or open/comment on vercel-labs/skills with the repo URL.

## License

See [LICENSE](LICENSE).
