# First-Time Setup

## 1. Get API Key

Go to https://zephex.dev/signup — free tier available.
Generate a key (starts with `mcp_sk_`). Copy it immediately.

**OAuth editors** (OpenCode, Kiro, Gemini CLI, Cline): Create account, no key needed. Browser auth on first connect.

**Bearer/stdio editors** (all others): Need key in config or env.

## 2. Set ZEPHEX_API_KEY

**zsh** (macOS):
```bash
echo 'export ZEPHEX_API_KEY="mcp_sk_your_key"' >> ~/.zshrc && source ~/.zshrc
```

**bash**:
```bash
echo 'export ZEPHEX_API_KEY="mcp_sk_your_key"' >> ~/.bashrc && source ~/.bashrc
```

Verify: `echo $ZEPHEX_API_KEY`

## 3. Verify Connection

- **Claude Code**: `/mcp` → shows zephex with 10 tools
- **Cursor**: Settings → Tools & MCPs → zephex with 10 tools
- **VS Code**: MCP panel → zephex expands to 10 tool names
- **Zed**: Assistant → context servers → zephex listed
- **Codex CLI**: `codex mcp list` → zephex (10 tools)

## 4. Test It

In your editor's chat:
> "Use zephex:scope_task to tell me what files I'd need to add a health check endpoint"

Should return 1-5 relevant files, no errors.