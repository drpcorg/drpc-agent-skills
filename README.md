# DRPC Agent Skills

[![GitHub stars](https://img.shields.io/github/stars/drpcorg/drpc-agent-skills?style=social)](https://github.com/drpcorg/drpc-agent-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Blockchains](https://img.shields.io/badge/blockchains-100%2B-blue)](https://drpc.org/chainlist)
[![Networks](https://img.shields.io/badge/networks-200%2B-purple)](https://drpc.org/chainlist)
[![Platforms](https://img.shields.io/badge/platforms-7-green)](#install)
[![MCP Tools](https://img.shields.io/badge/MCP_tools-16-orange)](#mcp-tools)

Give your AI coding agent access to 100+ blockchains over RPC. Works on first ask -- no restart, no config file editing. Agents with a wallet get an API key automatically via x402 -- no signup needed. Guided recipes, error handling, 200+ networks.

**Why DRPC?** Your requests go through a decentralized gateway that routes across multiple providers. If one is down, another picks up. Responses are consensus-validated, so you don't get bad data from a single node.

## What Can You Do?

Type a plain English prompt. The agent figures out which RPC calls to make.

| Use Case | Example Prompt |
|----------|---------------|
| **DeFi Portfolio** | "Get my wallet balance across Ethereum, Arbitrum, and Base" |
| **Gas Optimization** | "Compare gas prices across all L2 networks right now" |
| **Transaction Tracking** | "Check if transaction 0xabc... is confirmed on Optimism" |
| **Smart Contract Reading** | "Read the totalSupply of USDC contract on Base" |
| **Whale Watching** | "Get the last 10 transactions for this address on Ethereum" |
| **Cross-Chain Analysis** | "Compare TVL-related contract data across Arbitrum, Base and Optimism" |

## Install

**Works with:** Claude Code · Gemini CLI · Cursor · Codex · Windsurf · Cline · OpenClaw

If your agent has a wallet, it gets an API key automatically via [x402](skills/drpc-rpc/x402-auto-key.md) -- no signup. Otherwise, get a free key at [drpc.org](https://drpc.org). Then install the skill for your platform:

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

Ask something like:

> "Get the ETH balance of vitalik.eth on Ethereum"

> "Compare gas prices across all L2 networks"

The agent reads the skill file, picks the right RPC method, calls DRPC, and gives you back the result. No boilerplate on your end.

```text
You ask → Agent reads skill → Calls DRPC API → Returns blockchain data
```

Three modes, picked automatically:
1. **First session:** acquires API key via x402 wallet signing (or asks you for one), executes request via direct HTTP (no restart needed), configures MCP for future sessions
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
| [x402-auto-key.md](skills/drpc-rpc/x402-auto-key.md) | Auto-acquire API key via x402 (SIWE + EIP-3009) |
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

## Contributing

Found a bug? Missing a chain? Open an issue or send a PR.

Stars help with discoverability -- if this saved you time, consider leaving one.

## License

MIT
