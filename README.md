# DRPC Agent Skills

Blockchain RPC access for AI coding agents. Connect to 100+ blockchains and 200+ networks from any AI agent in 30 seconds.

**Why DRPC?** Decentralized multi-provider gateway with automatic failover and consensus validation. No single point of failure.

## Quick Start

Get your free API key at [drpc.org](https://drpc.org), then run the setup command for your platform:

### Claude Code
```bash
claude mcp add --transport sse drpc https://lb.drpc.org/mcp/YOUR_KEY
```

### Codex
Add to `~/.codex/config.toml`:
```toml
[mcp_servers.drpc]
url = "https://lb.drpc.org/mcp/YOUR_KEY"
```

### Cursor
Add to `.cursor/mcp.json`:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/YOUR_KEY" } } }
```

### Gemini CLI
Add to `~/.gemini/settings.json`:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/YOUR_KEY" } } }
```

### Windsurf
Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{ "mcpServers": { "drpc": { "serverUrl": "https://lb.drpc.org/mcp/YOUR_KEY" } } }
```

### Cline
Add to MCP settings:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/YOUR_KEY" } } }
```

### OpenClaw
```bash
openclaw mcp set drpc '{"url":"https://lb.drpc.org/mcp/YOUR_KEY"}'
```

## What Can You Do?

Once connected, just ask your AI agent:

> "Get the ETH balance of vitalik.eth on Ethereum"

> "Compare gas prices across all L2 networks"

> "Check if transaction 0xabc... is confirmed on Arbitrum"

> "What networks does DRPC support?"

> "Read the totalSupply of USDC contract on Base"

## Available Tools

| Tool | Description |
|------|-------------|
| `list_networks` | All 200+ supported networks |
| `list_methods` | RPC methods available for a network |
| `get_network_info` | Network details (chain ID, currency, explorers) |
| `eth_getBalance` | Native token balance |
| `eth_getBlockByNumber` | Block data by number or tag |
| `eth_getBlockByHash` | Block data by hash |
| `eth_getTransactionByHash` | Transaction details |
| `eth_getTransactionReceipt` | Receipt with status and logs |
| `eth_getLogs` | Event log queries |
| `eth_call` | Read smart contracts |
| `eth_gasPrice` | Current gas price |
| `eth_estimateGas` | Estimate gas for a transaction |
| `eth_getCode` | Contract bytecode at address |
| `eth_getTransactionCount` | Nonce for an address |
| `rpc_call` | Any JSON-RPC method |
| `rpc_batch` | Batch multiple calls |

## Supported Networks

Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche, zkSync, Linea, Scroll, Mantle, Fantom, Gnosis, Celo, Moonbeam, Harmony, Aurora, Metis, Boba, Cronos, Klaytn, Solana, Bitcoin, NEAR, Cosmos, Starknet, and [many more](https://drpc.org/chainlist).

## Installing Skills (Optional)

The MCP connection above gives you all the tools. For guided recipes and cross-chain workflows, install the skills:

**Claude Code:**
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
claude plugins install ./drpc-agent-skills
```

**Codex:**
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills ~/.agents/skills/drpc-agent-skills
```

## License

MIT
