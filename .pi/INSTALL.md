# Installing DRPC Agent Skills for Pi Agent

## Install as a Pi package with secure Coinbase wallet support

```bash
pi install npm:pi-mcp-adapter
pi install https://github.com/drpcorg/drpc-agent-skills
```

The Pi package loads:

- generic DRPC skill: `skills/drpc-rpc/`
- Pi-only setup overlay skill: `.pi/skills/drpc-rpc-pi/`
- Pi extension: `extensions/drpc-setup.ts`

Restart Pi or start a new session after installing the packages. Then run once:

```text
/drpc-coinbase-wallet-setup
```

This runs the Pi extension command, installs the Coinbase Payments MCP bundle if missing, and writes `~/.pi/agent/mcp.json` with a lazy Coinbase Payments MCP server:

```json
{
  "mcpServers": {
    "payments-mcp": {
      "command": "node",
      "args": ["/Users/you/.payments-mcp/bundle.js"],
      "lifecycle": "lazy"
    }
  }
}
```

Coinbase Agentic Wallet / Payments MCP keeps wallet custody outside Pi, so Pi does not need `DRPC_X402_PRIVATE_KEY` or any private key in environment variables.

The Pi package also adds `drpc_setup`. After Coinbase x402 obtains a DRPC API key, the agent can call `drpc_setup` and write:

```json
{
  "mcpServers": {
    "drpc": {
      "url": "https://lb.drpc.org/mcp/YOUR_DRPC_API_KEY",
      "lifecycle": "lazy"
    }
  }
}
```

Manual DRPC API-key setup is still available:

```text
/drpc-setup YOUR_DRPC_API_KEY
```

## Manual skill-only install

```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
mkdir -p ~/.pi/agent/skills
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc ~/.pi/agent/skills/drpc-rpc
```

Pi also discovers Agent Skills from `~/.agents/skills/`, so a Codex-style install works too.

Manual skill-only install does not install the Pi extension tools (`/drpc-setup`, `/drpc-coinbase-wallet-setup`, `drpc_setup`). The skill can still execute requests in the current session via direct HTTP calls to DRPC after obtaining an API key.
