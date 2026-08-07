# Zephex skills.sh skill — maintainer handoff

**Repo:** [zephexMCP/agent-skills](https://github.com/zephexMCP/agent-skills)  
**Install:** `npx skills add zephexMCP/agent-skills --skill zephex -y`  
**Shipped skill:** `skills/zephex/SKILL.md` (name in YAML: `zephex`)

This document is for **people editing the distribution skill**, not for end-user agents. End users get workflow routing from `SKILL.md` only.

---

## Three skills — do not confuse them

| Copy | Path | Audience | Install |
|------|------|----------|---------|
| **skills.sh (this repo)** | `agent-skills/skills/zephex/SKILL.md` | Any agent on **user's repo** via MCP | `npx skills add zephexMCP/agent-skills` |
| **Grok work skill** | `Zephex/.grok/skills/zephex/SKILL.md` | Developing agent-skills + mcp-server workspace in Zephex folder | Grok only |
| **mcpHub CLI embed** | `mcpHub/mcp-proxy/skills/find-code/SKILL.md` | `npx zephex setup --with-skill` (YAML name: `find-code`) | Bundled in npm package |

**Ground truth for tool behavior:** mcpHub proxy (`mcp-proxy/src/tools/`, dashboard `available-tools.ts`).  
**Ground truth for MCP JSON:** `agent-skills/configs/` + `npx zephex setup` — never duplicate in `references/`.

Semantic alignment: same 10 tools, `keep_thinking` not `thinking`, `Zephex_dev_info` casing. Copies **will drift** unless you sync on product releases.

---

## What this skill is (and is not)

**Is:**

- Routing + workflow for Zephex MCP on the **user's codebase**
- Compact table + 3 steps + JSON examples (Context7 *shape*, not meta commentary)
- Strong YAML `description` for trigger eval (agentskills.io / skills.sh discovery)
- `compatibility` one-liner → `https://zephex.dev/mcp`, `npx zephex setup`

**Is not:**

- mcp-proxy / dashboard / VS Code extension maintainer docs
- Full per-tool manuals (that lives in mcpHub `find-code` embed and proxy schemas)
- Editor setup prose duplicating `configs/*.json`
- Token-burn `references/tools.md` (~955 lines) or `references/configs.md`

---

## File map

```
agent-skills/
├── skills/zephex/SKILL.md      # ONLY body agents should load for routing
├── configs/*.json              # Editor MCP templates (copy or zephex setup)
├── AGENTS.md                   # Short gate — pairs with SKILL (session start)
├── CLAUDE.md                   # Claude-specific: tool names, prefer MCP when fit
├── README.md                   # Human install + maintainer links
├── SKILL-MAINTAINER.md         # This file
├── TRIGGER-EVAL.md             # Description tuning + live eval protocol
├── scripts/
│   ├── eval-queries.json       # 20 prompts (10 trigger / 10 skip)
│   └── eval-description.mjs    # Heuristic linter — must pass 20/20 before ship
└── (no references/ folder)     # Removed on purpose
```

**Paired docs:** `AGENTS.md` = 6-row workflow cheat sheet. `SKILL.md` = full routing. Do not let them diverge on tool names or chains.

---

## Target shape of `SKILL.md`

| Section | Purpose | Size budget |
|---------|---------|-------------|
| YAML `description` | Triggers, MUST use, explicit **Do not use**, exact 10 tool names + ban dead tools | ≤1024 chars (skills.sh) |
| YAML `compatibility` | MCP URL + setup + optional CLI install | 1–2 lines |
| Workflow table | Situation → MCP **and** CLI | ~12 rows |
| Power orientation | overview / structure / architecture / deep | Short |
| Steps 1–3 | Orient, find/read, package/arch/test/URL/memory | Real JSON examples |
| Tool table | **Only** the 10 live tools from dashboard | 10 rows |
| CLI Mode 2 | High-signal commands + cwd rules | Compact |
| Examples | Realistic feature/auth/onboard | 2–3 |
| Errors + Mistakes | Operational + ban list | Tables |

**Canonical 10 tools (dashboard card / `available-tools.ts`):**  
`get_project_context` · `find_code` · `read_code` · `explain_architecture` · `check_package` · `check_test` · `audit_headers` · `project_memory` · `keep_thinking` · `Zephex_dev_info`

**User-facing skill (SKILL.md / AGENTS.md):** only list tools that exist. Do not teach agents ghost names (old aliases) in ban-lists — that still primes them to call ghosts. Keep alias history in this maintainer file only if needed.

**CLI install URLs (same installer):** `https://zephex.dev/cli/install.sh` and `https://zephex.dev/install.sh`.

**Avoid in body:** proxy-server narrative, dumping full `configs/*.json`, personal machine paths.

---

## Research sources (35+ consulted for v2 rebuild)

Use these when re-validating structure — not to paste into `SKILL.md`.

### Specs & distribution

1. [agentskills.io](https://agentskills.io) — SKILL.md frontmatter, description limits  
2. [skills.sh](https://skills.sh) — discovery, install UX  
3. [skills.sh zephexMCP/agent-skills](https://skills.sh/zephexMCP/agent-skills) — listing health  
4. Anthropic agent skills docs (workflow + description as trigger)  
5. Cursor rules vs skills separation  
6. OpenAI Codex skills CLI behavior  
7. `npx skills add` local path validation  

### Reference skills (workflow shape)

8. Context7 MCP skill — table + numbered steps + examples (`mcpHub/mcp-proxy/info-from-context7-skill.md`)  
9. `~/.agents/skills/find-code/SKILL.md` — installed consumer copy  
10. supertools / timeless-skills patterns — minimal body, strong description  
11. PostHog / Sentry agent skills — negative triggers in description  
12. mcpHub `mcp-proxy/skills/SKILLS-AND-RULES-MAINTAINER.md`  
13. mcpHub `mcp-proxy/skills/find-code/SKILL.md` — deep tool reference (embed only)  
14. mcpHub `DEVELOPING.md` / `AGENTS.md` — product boundaries  

### Product ground truth

15–24. Ten tool handlers under `mcp-proxy/src/tools/`  
25. Dashboard tool catalog / docs search  
26. `npx zephex setup` + `editor-stdio-registry`  
27. `zephex.dev/mcp` OpenAPI / MCP manifest  
28. CLI `doctor`, `repair`, `disconnect` error strings (for Errors table)  
29. Rate limit 429 + Retry-After behavior  
30. `github:owner/repo` + `GITHUB_PAT` docs  
31. `inline_files` transport note (Cursor remote, etc.)  
32. `keep_thinking` vs deprecated `thinking` naming  
33. Package tools: `check_package` / `audit_package` split  
34. `Zephex_dev_info` search → get slug flow  
35. Playwright marketing tests mentioning CLI/MCP (sanity on public messaging)  
36+. Editor-specific config quirks in `configs/` + README Common Mistakes  

---

## Sync checklist vs mcpHub

Run before a **product release** that changes tools, args, or setup:

```bash
# From machine with both repos
diff -u \
  /path/to/mcpHub/mcp-proxy/skills/find-code/SKILL.md \
  /path/to/Zephex/agent-skills/skills/zephex/SKILL.md
```

| Check | mcpHub source | agent-skills target |
|-------|---------------|---------------------|
| Tool count & names | `find-code/SKILL.md`, `available-tools.ts` | Workflow + reference table |
| `keep_thinking` not `thinking` | proxy registration | SKILL + AGENTS + README |
| New tool or arg | tool handler + schema | Add workflow row + 1 example max |
| Setup URL / OAuth editors | `editor-setup-truth.ts`, CLI | `compatibility`, README table |
| MCP JSON shape | CLI templates | `configs/*.json` only |
| Trigger phrases | embed description | YAML `description` + eval script |

**Rule:** agent-skills stays **shorter**. Port *routing* changes, not full per-tool essays. Deep reference stays in mcpHub embed until users complain about skills.sh copy.

**configs diff (spot check):**

```bash
# Example: Cursor
diff -u mcpHub/.../cursor-template.json agent-skills/configs/cursor.json
```

Known editor footguns (keep in README, not SKILL): VS Code `servers` not `mcpServers`, Windsurf `serverUrl`, Cline `streamableHttp`, OpenCode no static Authorization header.

---

## Release workflow

1. Edit `skills/zephex/SKILL.md` (and `AGENTS.md` if workflow rows change).
2. `node scripts/eval-description.mjs` → **20/20**.
3. `cd agent-skills && npx skills add . --skill zephex --list` → exactly **1** skill, name `zephex`.
4. Optional: live agent spot-check ([TRIGGER-EVAL.md](TRIGGER-EVAL.md)).
5. Update `TRIGGER-EVAL.md` results section if description changed materially.
6. Commit + push `zephexMCP/agent-skills`.
7. Tell users: `npx skills add zephexMCP/agent-skills --skill zephex -y` to refresh.
8. If tools/setup changed in product: open mcpHub PR for `find-code` embed + CLI templates; then mirror routing here.

---

## Pre-ship checklist

- [ ] `description` ≤1024 chars, lists triggers + **Do not use** cases
- [ ] `node scripts/eval-description.mjs` → 20/20
- [ ] `npx skills add . --skill zephex --list` → 1 skill
- [ ] No `references/` folder resurrected
- [ ] `configs/` unchanged OR README Common Mistakes updated
- [ ] `CLAUDE.md` uses `check_package` not `zephex:check_package`
- [ ] README tool table matches SKILL (`keep_thinking`)
- [ ] AGENTS.md workflow rows ⊆ SKILL.md workflow table
- [ ] Commits pushed; skills.sh badge repo still `zephexMCP/agent-skills`

---

## Mistakes made in prior sessions (read before editing)

| Mistake | Fix |
|---------|-----|
| Edited `.grok/skills/zephex` instead of `skills/zephex/SKILL.md` | Confirm path in Explorer / user screenshot |
| Pasted mcp-proxy maintainer narrative into distribution skill | Keep product internals in mcpHub only |
| Added `references/configs.md` duplicating JSON | Delete; point to `configs/` + setup |
| Meta lines ("Context7-style", "don't load references") | Delete; just *be* that shape |
| Claimed ship without `npx skills add --list` or eval | Run both every time |
| `thinking` tool name | Always `keep_thinking` |
| Balloon SKILL to 500+ lines | Move depth to mcpHub embed; keep ~150 lines here |

---

## Example: good `description` delta

When trigger eval fails on **skip** cases (e.g. "deploy to Vercel"), add negatives to YAML only:

```yaml
description: >-
  ...
  Do not use for general knowledge, creative writing, git/deploy chores,
  editing agent skill files, single-line typo fixes, or third-party
  library API docs (unless Zephex_dev_info fits).
```

When **trigger** cases fail (e.g. bare "use zephex"), ensure explicit:

```yaml
  ... including when they only say "use Zephex," "use MCP," or a wrong tool name.
```

Re-run `eval-description.mjs`; update heuristic in script if you add new eval queries.

---

## Example: adding a new workflow row

If mcpHub ships tool `foo_bar`:

1. Add row to Workflow table: situation → chain.
2. One JSON example in the closest Step (1–3).
3. One line in tool reference table.
4. Append tool name to YAML `description` Triggers list.
5. Sync mcpHub `find-code` embed (full tool section there).
6. Re-run eval (add query to `eval-queries.json` if non-obvious).

Do **not** add a `references/foo_bar.md`.

---

## FAQ (maintainers)

**Q: User wants more detail in the installed skill.**  
A: Point them to docs on zephex.dev or tighten examples in Steps 1–3. Resist `references/` — it defeats skills.sh token budget.

**Q: find-code embed and zephex skill disagree.**  
A: mcpHub embed is authoritative for tool semantics; agent-skills is authoritative for skills.sh install path. Fix routing in both; depth only in embed.

**Q: Should `package` tools stay in workflow table?**  
A: Yes — high-value triggers ("safe to npm install?"). No separate package manual in body.

**Q: Zed / unsupported skills CLI?**  
A: Document in README only; manual `configs/zed.json`.

**Q: OAuth vs API key in skill body?**  
A: One line in `compatibility`; details in README Supported Editors.

---

## Links

- Production MCP: https://zephex.dev/mcp  
- Setup: `npx zephex setup`  
- mcpHub monorepo: `mcpHub/mcp-proxy/`  
- Trigger eval: [TRIGGER-EVAL.md](TRIGGER-EVAL.md)  
- Zephex workspace: `Zephex/DEVELOPING.md`

---

*Last expanded: 2026-06-06 — post v2 rebuild, commits `33cf40e` + `ffa7e31` on agent-skills.*