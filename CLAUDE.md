@AGENTS.md

## Claude Code Rules

Prefer Zephex MCP tools for their codebase over blind grep/read when a tool fits the task.

If a tool call fails, use `keep_thinking` to trace the error before retrying the same approach.

Call `check_package` before `npm install`, `pip install`, or `cargo add`.