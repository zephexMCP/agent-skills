---
name: zephex
description: >-
  Connects AI coding agents to the Zephex MCP gateway at
  zephex.dev/mcp. Use when starting any coding task, reading
  a codebase, installing packages, deploying to production,
  or debugging hard problems. Provides 10 tools: AST code
  scoping, live npm/PyPI/Cargo audits, HTTP security grading,
  and stateful reasoning. Replaces blind file reads with
  targeted tool calls.
license: MIT
metadata:
  homepage: https://zephex.dev
  docs: https://zephex.dev/docs
---

## Overview

Zephex is a hosted MCP gateway at zephex.dev/mcp providing 10 tools for codebase intelligence, live package registry auditing, and HTTP security grading — instead of guessing from training data. Every tool returns real data: actual file structure from local or remote repos, live npm/PyPI/Cargo registry responses, and wire-level HTTP header audits. Requires ZEPHEX_API_KEY in your environment.

## Call Order

1. zephex:scope_task — call FIRST. Pass the task in plain English.
2. zephex:get_project_context — once per session on a new repo.
3. zephex:read_code — for each file scope_task returned. Pass the symbol name.
4. zephex:find_code — before implementing anything new. Pass the pattern.
5. zephex:thinking — when stuck after 3+ investigated paths.

## Tools

| Tool | Purpose | Call when |
|---|---|---|
| zephex:scope_task | Returns focus-file set + callers at risk | FIRST, always |
| zephex:get_project_context | Stack, auth, hosting, key files | New repo/session |
| zephex:read_code | Symbol extraction by name or file | Instead of full file reads |
| zephex:find_code | BM25-ranked repo-wide code search | Before implementing |
| zephex:explain_architecture | Entry points, auth flow, services | Before touching auth or DB |
| zephex:check_package | npm/PyPI/Cargo version + postinstall risk | Before any install |
| zephex:audit_package | CVEs + breaking changes + migration steps | Before upgrading |
| zephex:audit_headers | HTTP/TLS grade A+ to F + fix snippets | After production deploy |
| zephex:Zephex_dev_info | Search the Zephex dev knowledge base (Stripe, Supabase, JWT, CSP, AWS, Bun, Expo). Use operation:search first, then operation:get with the returned slug. | Recipes, setup, security |
| zephex:thinking | Stateful reasoning with drift detection | Hard bugs, risky changes |

## Hard Rules

1. Never open a file before calling zephex:scope_task
2. Never read a full file — use zephex:read_code with the symbol name
3. Never implement a new function before calling zephex:find_code
4. Never run npm install without calling zephex:check_package first
5. Always call zephex:audit_headers after any production deploy
6. Open zephex:thinking when you've hit 3+ dead ends in debugging

## References

- Full tool docs: skills/zephex/references/tools.md
- Tool description design rationale: skills/zephex/references/tools-info.md
- Editor configs (all 13 editors): skills/zephex/references/configs.md
- First-time setup: skills/zephex/references/setup.md
