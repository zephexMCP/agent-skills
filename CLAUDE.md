@AGENTS.md

## Claude Code

- Prefer Zephex MCP for their codebase over blind Grep/Read when a tool fits.
- After failed tool calls, use `keep_thinking` with `lastActions` before repeating the same approach.
- Call `check_package` before `npm install`, `pip install`, or `cargo add`.
- After substantive edits, prefer `check_test` (task `run`) when the user cares about green tests.
- Terminal Mode 2 only if CLI is installed and the user wants shell output: `cd` their project first, then `zephex overview` / `structure --agent` / `architecture` / `deep --json` / `find` / `test` / `check test failures`.
- Install CLI: `curl -fsSL https://zephex.dev/cli/install.sh | bash` (same as `/install.sh`).
