# Zephex

Auto-loaded session gate for Claude Code, Gemini CLI, OpenCode, Codex, and similar agents.

Zephex MCP at `https://zephex.dev/mcp` — **ten tools** for the **user's codebase** (not training data).

## Tools

| Tool | One line |
|------|----------|
| `get_project_context` | Stack, scripts, auth, monorepo (topic slices) |
| `find_code` | BM25 + ripgrep search |
| `read_code` | AST symbol / file / outline |
| `explain_architecture` | Wiring map (entry, auth, integrations) |
| `check_package` | Registry safety + upgrade/CVE tasks |
| `check_test` | Test Pulse — run suite + failure health |
| `audit_headers` | Live HTTPS URL security audit |
| `project_memory` | Remember / recall project facts |
| `keep_thinking` | Multi-step reasoning with loop detection |
| `Zephex_dev_info` | Expert playbooks (not their private repo) |

## Workflow

| Situation | Chain |
|-----------|--------|
| New repo | `get_project_context` (topic `identity` / `run`) → optional `explain_architecture` |
| Feature / fix | `find_code` → `read_code` → `check_test` after edits |
| How it wires | `explain_architecture` |
| Before install | `check_package` (`task=check`, then `upgrade` / `security` if needed) |
| Live URL | `audit_headers` |
| Remember facts | `project_memory` |
| Stuck | `keep_thinking` with `lastActions` |
| Terminal / free layout | CLI: `zephex deep --json` · `structure --agent` · `overview` · `test` / `check test failures` |

Pass absolute `path` (or `github:owner/repo`) on every repo tool. Prefer MCP when connected. Call `check_package` before install suggestions. If they named Zephex, call a tool (or CLI command) before answering about their code.

Full routing: `skills/zephex/SKILL.md`. Connect: `npx zephex setup`. CLI install: `curl -fsSL https://zephex.dev/cli/install.sh | bash`.
