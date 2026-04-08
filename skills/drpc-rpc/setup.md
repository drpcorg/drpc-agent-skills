# DRPC MCP Setup

## Get API Key

1. Go to https://drpc.org
2. Sign up (free tier: 1M compute units/month)
3. Copy API key from dashboard

## Configure MCP

After obtaining the key, run the command for your platform:

**Claude Code:**
```bash
claude mcp add --transport http drpc https://lb.drpc.org/mcp/API_KEY
```

**Codex:**
```bash
codex mcp add drpc --url https://lb.drpc.org/mcp/API_KEY
```

**Gemini CLI:**
```bash
gemini mcp add drpc https://lb.drpc.org/mcp/API_KEY -t http
```

**Cursor** — add to `.cursor/mcp.json`:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/API_KEY" } } }
```

**Windsurf** — add to `~/.codeium/windsurf/mcp_config.json`:
```json
{ "mcpServers": { "drpc": { "serverUrl": "https://lb.drpc.org/mcp/API_KEY" } } }
```

**Cline** — add to MCP settings:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/API_KEY" } } }
```

**OpenClaw:**
```bash
openclaw mcp set drpc '{"url":"https://lb.drpc.org/mcp/API_KEY"}'
```

## After Setup

Restart the session for MCP tools to become available.

In the **current session**, use direct HTTP calls to execute requests without restarting — see [direct-http.md](direct-http.md).

## x402 Auto-Payment (Coming Soon)

Future: the agent will be able to auto-register and pay for access via the x402 protocol (HTTP 402 Payment Required). No manual API key will be needed.

This feature is not yet available. Do not attempt to use x402.
