# Security

## What this skill does

`skills/zephex/SKILL.md` teaches agents how to use **Zephex** — a product the user installs with their own credentials. The published skill folder contains only:

- `skills/zephex/SKILL.md`
- `skills/zephex/README.md`

No `references/` tree, no embedded install scripts, no hard-coded secrets.

## Intentional network surfaces

| Surface | Why it exists | Who controls it |
|---------|----------------|-----------------|
| `https://zephex.dev/mcp` | Official hosted MCP API (same class as any SaaS MCP skill) | Zephex; user authenticates with their key/OAuth via `npx zephex setup` |
| Terminal CLI installer | Optional Mode 2 shell client | User opts in: `curl -fsSL https://zephex.dev/cli/install.sh \| bash` |
| `audit_headers` / `zephex check url` | Security audit of a **user-provided** public URL | User chooses the URL; not used to pull arbitrary docs |

These are the product the skill documents — not unsolicited third-party content fetches.

## Mapping to stale Snyk findings (May 2026 snapshot)

| ID | Stale claim | Current truth |
|----|-------------|---------------|
| **W011** | `zephex:inspect_url` / `references/tools.md` fetch arbitrary URLs | **Removed.** No `inspect_url` tool; no `references/` files in the skill package. |
| **W012** | Runtime URL `https://zephex.dev/mcp` + `npx -y zephex` controls agent | **Intentional product surface.** User connects with their key via setup. Official host only. Same pattern as other vendor MCP skills. |

If [skills.sh](https://www.skills.sh/zephexmcp/agent-skills/zephex/security/snyk) still shows W011, the **catalog snapshot is stale** — not the GitHub source. Compare:

```bash
# Catalog (may lag)
curl -sS https://skills.sh/api/download/zephexmcp/agent-skills/zephex | head -c 200

# Source of truth
curl -sL https://raw.githubusercontent.com/zephexMCP/agent-skills/main/skills/zephex/SKILL.md | head -40
```

## What we do not ship

- No `inspect_url` (or any “read arbitrary web page into the prompt” tool)
- No `scope_task`, `audit_package`, or bare `thinking` tool names
- No instruction to scrape third-party documentation sites
- No hard-coded API keys (configs use placeholders such as `YOUR_API_KEY_HERE`)

## How skills.sh indexing works (maintainers)

skills.sh is **not** an npm publish target. Listing + Overview + Snyk come from:

1. Someone runs `npx skills add zephexMCP/agent-skills` (anonymous install telemetry)
2. Platform clones GitHub and **snapshots** the skill folder
3. Partners (Snyk, Socket, Gen) audit that **snapshot**

CLI install always pulls **live GitHub**. The HTML/API catalog can lag days/weeks ([vercel-labs/skills#919](https://github.com/vercel-labs/skills/issues/919), [#1273](https://github.com/vercel-labs/skills/issues/1273)). After a large content rewrite, open a reindex request on `vercel-labs/skills` if `https://skills.sh/api/download/zephexmcp/agent-skills/zephex` still contains `scope_task` or `references/tools.md`.
