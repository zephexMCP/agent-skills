@AGENTS.md

## Claude Code-Specific Rules

- Always use zephex MCP tools instead of raw file reads.
- If a zephex tool call fails, invoke zephex:thinking
  before retrying.
- Never run npm install, pip install, or cargo add without
  calling zephex:check_package first.
