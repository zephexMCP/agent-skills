---
name: zephex
description: >-
  Teaches agents to use Zephex's 10 hosted MCP tools at zephex.dev/mcp for
  codebase intelligence, package safety, and security auditing. Use when
  starting a coding task, reading code, searching a repo, installing or
  upgrading packages, auditing HTTP headers, fetching external docs, or
  debugging complex issues. Requires ZEPHEX_API_KEY.
license: MIT
metadata:
  homepage: https://zephex.dev
  docs: https://zephex.dev/docs
---

## Overview

Zephex is a hosted MCP gateway that prevents wasted file reads, catches breaking changes before they ship, and grounds every code decision in what actually exists — not what training data guesses. One endpoint at zephex.dev/mcp. Requires ZEPHEX_API_KEY in your environment.

## Call Order

1. zephex:scope_task — call FIRST. Pass the task in plain English.
2. zephex:get_project_context — once per session on a new repo.
3. zephex:read_code — for each file scope_task returned. Pass the symbol name.
4. zephex:find_code — before implementing anything new. Pass the pattern.
5. zephex:thinking — when stuck after 3+ investigated paths.

```
scope_task → get_project_context → read_code → find_code → [implement]
                                                              ↑
                                              thinking (if stuck)
```

## All 10 Tools

| Tool | What it does | Call when | Token cost |
|---|---|---|---|
| zephex:scope_task | Returns ≤7 files + utilities + callers at risk | FIRST, always | ~300 vs 18k manual |
| zephex:get_project_context | Stack, auth, hosting, queues, key files | New repo/session | ~500 vs 40k manual |
| zephex:read_code | Symbol extraction + imports + call sites | Instead of full file reads | ~400 vs 8k manual |
| zephex:find_code | Repo-wide ripgrep | Before implementing anything new | ~150 vs 20k manual |
| zephex:explain_architecture | End-to-end request/auth/billing flow | Before touching auth or DB | ~600 vs 30k manual |
| zephex:check_package | npm exists + version + postinstall risk | Before any npm install | ~200 vs 6k manual |
| zephex:audit_package | CVEs + breaking changes + migration | Before upgrading packages | ~400 vs 8k manual |
| zephex:audit_headers | HTTP/TLS grade A+ to F | After every production deploy | ~400 vs 8k manual |
| zephex:inspect_url | Clean content from any public URL | Reading external docs | ~300 vs browser paste |
| zephex:thinking | Stateful session — tracks what you checked | Complex bugs, risky changes | ~200 per update |

## Hard Rules

- Never open a file before calling zephex:scope_task
- Never read a full file — use zephex:read_code with the symbol name
- Never implement a new function before calling zephex:find_code
- Never run npm install without calling zephex:check_package first
- Always call zephex:audit_headers after any production deploy
- Open zephex:thinking when you've hit 3+ dead ends in debugging

## Setup

Get your API key at zephex.dev/signup. See references/setup.md.
For full editor configs, see references/configs.md.