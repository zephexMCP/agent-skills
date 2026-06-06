# Zephex Agent Skills

Auto-loaded by Claude Code, Gemini CLI, OpenCode, Codex CLI at session start.

Zephex MCP at `https://zephex.dev/mcp` — ten tools for the **user's codebase**.

## Workflow

| Situation | Chain |
|-----------|--------|
| New repo | `get_project_context` → optional `explain_architecture` |
| Feature / fix / refactor | `scope_task` → `read_code` on focus files |
| Unknown location | `find_code` → `read_code` |
| Install or upgrade dep | `check_package` → optional `audit_package` |
| Stuck debugging | `keep_thinking` (not `thinking`) |

Pass `path` on every repo tool. Call `check_package` before install suggestions.

Full routing: `skills/zephex/SKILL.md`. MCP setup: `npx zephex setup` or `configs/` in this repo.