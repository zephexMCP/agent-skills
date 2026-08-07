# Security

## What this skill does

`skills/zephex/SKILL.md` teaches agents how to use **Zephex** — a product the user installs with their own credentials.

## Intentional network surfaces

| Surface | Why it exists | Who controls it |
|---------|----------------|-----------------|
| `https://zephex.dev/mcp` | Official hosted MCP API | Zephex; user authenticates with their key/OAuth |
| `npx -y zephex` (stdio) | Official npm CLI/stdio package | User runs install/setup |
| `audit_headers` / `zephex check url` | Security audit of a **user-provided** public URL | User chooses the URL |

These are not unsolicited third-party content fetches. They are the product the skill documents.

## What we do not ship

- No `inspect_url` tool (removed; older Snyk findings referring to `references/tools.md` are **stale** — that path no longer exists).
- No instruction to scrape arbitrary documentation sites into the agent context.
- No hard-coded secrets (configs use placeholders such as `YOUR_API_KEY_HERE`).

## Audit refresh

Security scans on [skills.sh](https://www.skills.sh/zephexmcp/agent-skills/zephex) may lag GitHub by days/weeks. Source of truth is this repository’s `main` branch and [raw SKILL.md](https://raw.githubusercontent.com/zephexMCP/agent-skills/main/skills/zephex/SKILL.md).

To re-check content yourself:

```bash
curl -sL https://raw.githubusercontent.com/zephexMCP/agent-skills/main/skills/zephex/SKILL.md | head -40
```
