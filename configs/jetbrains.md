# JetBrains Setup (IntelliJ, PyCharm, WebStorm, GoLand, Rider)

JetBrains AI Assistant MCP is configured through the IDE settings UI.

## Steps

1. Open **Settings**: `Cmd+,` (Mac) or `Ctrl+Alt+S` (Windows/Linux)
2. Navigate to: **Tools → AI Assistant → MCP Servers**
3. Click **+** to add a new HTTP MCP server entry
4. Enter:
   - **Name**: zephex
   - **URL**: https://zephex.dev/mcp
   - **Authorization header**: Bearer YOUR_API_KEY_HERE
5. Replace YOUR_API_KEY_HERE with your key from zephex.dev/dashboard/api-keys
6. Set **Level**: Global (all projects) or Project (current only)
7. Click **Apply** and **OK**

## Restart
Fully restart the IDE after adding the server.
Open AI Assistant panel → check **Settings → MCP Servers** → status column.
Green = connected. Red = failed (hover for error).

## Import from Claude (shortcut)
If you have a working .mcp.json for Claude Code:
Settings → AI Assistant → MCP → Import from Claude
Note: Claude Code uses stdio transport; you may still need to add the HTTP entry manually.

## Verify
Settings → AI Assistant → MCP Servers → zephex → should show 10 tools.