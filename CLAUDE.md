@AGENTS.md

## Claude Code Rules

Always use zephex MCP tools instead of reading files
directly. If a zephex tool call fails, invoke
zephex:thinking to trace the error before retrying.
Never run npm install, pip install, or cargo add without
calling zephex:check_package first.
