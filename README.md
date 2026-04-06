# DRPC Agent Skills

Blockchain RPC skills for AI coding agents. 100+ blockchains, 200+ networks, guided recipes, cross-chain workflows.

**Why DRPC?** Decentralized multi-provider gateway with automatic failover and consensus validation. No single point of failure.

## Install

Get your free API key at [drpc.org](https://drpc.org), then install skills for your platform:

### Claude Code
```bash
claude plugins marketplace add drpcorg/drpc-agent-skills
claude plugins install drpc-agent-skills
```

### Gemini CLI
```bash
gemini extensions install https://github.com/drpcorg/drpc-agent-skills
```

### Codex
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc ~/.agents/skills/drpc-rpc
ln -s $(pwd)/drpc-agent-skills/skills/drpc-crosschain ~/.agents/skills/drpc-crosschain
```

### Cursor
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc .cursor/skills/drpc-rpc
ln -s $(pwd)/drpc-agent-skills/skills/drpc-crosschain .cursor/skills/drpc-crosschain
```

### Windsurf
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc .windsurf/skills/drpc-rpc
ln -s $(pwd)/drpc-agent-skills/skills/drpc-crosschain .windsurf/skills/drpc-crosschain
```

### Cline
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc .cline/skills/drpc-rpc
ln -s $(pwd)/drpc-agent-skills/skills/drpc-crosschain .cline/skills/drpc-crosschain
```

## MCP Server (Optional)

Skills include setup recipes that guide the agent through MCP configuration. To add the MCP server directly:

```bash
# Claude Code
claude mcp add drpc https://lb.drpc.org/mcp/YOUR_KEY

# Codex
codex mcp add drpc --url https://lb.drpc.org/mcp/YOUR_KEY

# Gemini CLI
gemini mcp add drpc https://lb.drpc.org/mcp/YOUR_KEY -t http
```

For Cursor, Windsurf, and Cline — add to your MCP config file:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/YOUR_KEY" } } }
```

## What Can You Do?

Once installed, just ask your AI agent:

> "Get the ETH balance of vitalik.eth on Ethereum"

> "Compare gas prices across all L2 networks"

> "Check if transaction 0xabc... is confirmed on Arbitrum"

> "What networks does DRPC support?"

> "Read the totalSupply of USDC contract on Base"

## Skills Included

| Skill | Description |
|-------|-------------|
| `drpc-rpc` | Core blockchain RPC access — setup, 16 tools, recipes for balances, transactions, contracts, gas |
| `drpc-crosschain` | Multi-network recipes — cross-chain balances, L2 gas comparison, bridge tracking |

## Available MCP Tools

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

## License

MIT
