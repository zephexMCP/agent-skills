# Zephex Tools — Quick Reference

## zephex:scope_task

Returns ≤7 files relevant to a task, plus utilities to reuse and callers at risk.

- Call FIRST on every non-trivial task
- Call when starting a new coding task
- Call when you don't know which files to touch
`zephex:scope_task("add rate limiting to the auth middleware")`
Output: array of 3-7 file paths + existing utilities + callers at risk
- NOT for trivial one-line edits (rename variable, add comment)

---

## zephex:get_project_context

Full stack brief: framework, language, auth, hosting, database, billing, queues, key files.

- Call once at session start on an unfamiliar repo
- Call when you need architectural context
`zephex:get_project_context()`
Output: { framework, language, auth, hosting, database, billing, queues, key_files }
- NOT more than once per session (result doesn't change)

---

## zephex:read_code

Extracts a symbol's implementation, imports, and callers from a specific file.

- Call instead of reading whole files
- Call when you need to understand one function
`zephex:read_code("src/auth/login.ts", "verifyPassword")`
Output: { implementation, imports: [...], callers: [...], line_range: [45, 62] }
- NOT when you need the full file (read whole files directly)

---

## zephex:find_code

Repo-wide regex search with file:line results.

- Call before implementing anything new
- Call to find existing utilities
`zephex:find_code("rateLimiter", path="src/")`
Output: { matches: [{ file, line, content }, ...], total_count }
- NOT when you already have the exact file+symbol (use read_code)

---

## zephex:explain_architecture

Traces end-to-end request/auth/billing flow through middleware and data paths.

- Call before touching auth, billing, or database code
- Call to understand integration points
`zephex:explain_architecture("auth")`
Output: { request_flow, middleware_chain, auth_layers, data_paths, integration_points }
- NOT for isolated changes that don't touch system boundaries

---

## zephex:check_package

Checks npm package exists, latest version, installed vs latest, postinstall risk.

- Call BEFORE any npm install or npm update
- Call to detect typosquatting attempts
`zephex:check_package("zod")`
Output: { exists, latest_version, installed_version, postinstall_scripts, risk_level }
- NOT after you've already installed (too late)

---

## zephex:audit_package

Deep audit: CVEs, breaking changes, migration steps for npm packages.

- Call before major package upgrades
- Call when check_package flags risk
`zephex:audit_package("next", "upgrade", from_version="13.4.0")`
Output: { breaking_changes, migration_steps, target_version, effort_estimate }
- NOT for initial package discovery (use check_package first)

---

## zephex:audit_headers

Makes raw HTTP/TLS connection, grades security headers A+ to F.

- Call after every production deployment
- Call to check CSP, HSTS, cookie flags
`zephex:audit_headers("https://myapp.com")`
Output: { grade, headers: { ... }, cookies: [...], tls: { ... } }
- NOT on localhost (no production headers to audit)

---

## zephex:inspect_url

Fetches and cleans content from any public URL — docs, APIs, pages.

- Call when reading external documentation
- Call when you need live docs not training data
`zephex:inspect_url("https://stripe.com/docs/webhooks")`
Output: { content, metadata, format }
- NOT for security checks (use audit_headers)

---

## zephex:thinking

Stateful reasoning session that tracks hypotheses, checked paths, and next steps.

- Call when stuck after 3+ dead ends in debugging
- Call for complex bugs with multiple potential causes
`zephex:thinking("generate", "auth tokens expire but refresh fails silently")`
Output: { session_id, hypotheses, next_steps, checked, ruled_out }
- NOT as first step (exhaust scope_task, read_code, find_code first)