# DRPC Agent Skills

Blockchain RPC skills for AI coding agents. 100+ blockchains, 200+ networks, guided recipes, error handling, zero-restart first session.

**Why DRPC?** Decentralized multi-provider gateway with automatic failover and consensus validation. No single point of failure.

## Install

Get your free API key at [drpc.org](https://drpc.org), then install the skill for your platform:

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
```

### Cursor
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc .cursor/skills/drpc-rpc
```

### Windsurf
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc .windsurf/skills/drpc-rpc
```

### Cline
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc .cline/skills/drpc-rpc
```

### OpenClaw
```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc ~/.openclaw/skills/drpc-rpc
```

## How It Works

Once installed, just ask your AI agent:

> "Get the ETH balance of vitalik.eth on Ethereum"

> "Compare gas prices across all L2 networks"

> "Check if transaction 0xabc... is confirmed on Arbitrum"

> "Read the totalSupply of USDC contract on Base"

The skill guides the agent through:
1. **First session:** asks for API key, executes request via direct HTTP (no restart needed), configures MCP for future sessions
2. **Subsequent sessions:** uses native MCP tools (faster, integrated)
3. **Error handling:** recognizes billing limits, rate limiting, and guides recovery

## Skill Contents

| File | Purpose |
|------|---------|
| [SKILL.md](skills/drpc-rpc/SKILL.md) | Entry point — detects transport, routes by query type |
| [setup.md](skills/drpc-rpc/setup.md) | MCP configuration per platform |
| [direct-http.md](skills/drpc-rpc/direct-http.md) | Direct HTTP calls for first session (no MCP needed) |
| [tools-reference.md](skills/drpc-rpc/tools-reference.md) | All 16 MCP tools with parameters |
| [recipes-simple.md](skills/drpc-rpc/recipes-simple.md) | Single-network recipes |
| [recipes-crosschain.md](skills/drpc-rpc/recipes-crosschain.md) | Cross-chain recipes |
| [errors.md](skills/drpc-rpc/errors.md) | Error codes, billing errors, recovery patterns |

## MCP Tools

| Tool | Description |
|------|-------------|
| `list_networks` | All 200+ supported networks |
| `list_methods` | RPC methods for a network |
| `get_network_info` | Network details (chain ID, currency, explorers) |
| `eth_getBalance` | Native token balance |
| `eth_getBlockByNumber` | Block by number or tag |
| `eth_getBlockByHash` | Block by hash |
| `eth_getTransactionByHash` | Transaction details |
| `eth_getTransactionReceipt` | Receipt with status and logs |
| `eth_getLogs` | Event log queries |
| `eth_call` | Read smart contracts |
| `eth_gasPrice` | Current gas price |
| `eth_estimateGas` | Gas estimation |
| `eth_getCode` | Contract bytecode |
| `eth_getTransactionCount` | Nonce for address |
| `rpc_call` | Any JSON-RPC method |
| `rpc_batch` | Batch multiple calls |

## Supported Networks

Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche, zkSync, Linea, Scroll, Mantle, Fantom, Gnosis, Celo, Moonbeam, Harmony, Aurora, Metis, Boba, Cronos, Klaytn, Solana, Bitcoin, NEAR, Cosmos, Starknet, and [many more](https://drpc.org/chainlist).

## License

MIT
