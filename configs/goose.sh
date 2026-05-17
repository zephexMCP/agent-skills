#!/bin/bash
# Configure Zephex in Goose — run this script to open the config flow.
# When prompted, enter EXACTLY these values:
#
#   Type:    Command-line Extension
#   ID:      zephex
#   Name:    zephex
#   Command: npx -y zephex
#   Timeout: 300
#   Env var: ZEPHEX_API_KEY=mcp_sk_your_key_here
#
# After setup, verify with: goose info -v (should list "zephex")
# Then test: goose session → ask "what tools do you have?"

echo "Opening Goose configuration..."
echo "Select: Add Extension → Command-line Extension"
echo ""
echo "Enter these values:"
echo "  ID:      zephex"
echo "  Name:    zephex"
echo "  Command: npx -y zephex"
echo "  Timeout: 300"
echo "  Env var: ZEPHEX_API_KEY=<your-key-from-zephex.dev/signup>"
echo ""
goose configure