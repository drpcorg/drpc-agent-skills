---
name: drpc-rpc
description: Use when the user needs blockchain data (balances, transactions, blocks, gas prices, contract reads), wants to set up blockchain RPC access, or mentions DRPC, Web3, or Ethereum RPC. Also triggers on specific method names like eth_getBalance, eth_call, eth_getLogs.
---

# DRPC RPC — Blockchain Access for AI Agents

Connect to 100+ blockchains and 200+ networks through DRPC's decentralized RPC gateway via MCP.

## Setup

Check if DRPC MCP tools are already available (look for tools named `list_networks`, `eth_getBalance`, `rpc_call`). If yes, skip setup entirely.

If not configured, ask the user for their DRPC API key. If they don't have one, direct them to https://drpc.org to sign up (free tier available).

Once you have the key, configure MCP for the current platform:

**Claude Code:**
```bash
claude mcp add drpc https://lb.drpc.org/mcp/API_KEY
```

**Codex:**
```bash
codex mcp add drpc --url https://lb.drpc.org/mcp/API_KEY
```

**Gemini CLI:**
```bash
gemini mcp add drpc https://lb.drpc.org/mcp/API_KEY -t http
```

**Cursor:**
Add to `.cursor/mcp.json`:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/API_KEY" } } }
```

**Windsurf:**
Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{ "mcpServers": { "drpc": { "serverUrl": "https://lb.drpc.org/mcp/API_KEY" } } }
```

**Cline:**
Add to MCP settings:
```json
{ "mcpServers": { "drpc": { "url": "https://lb.drpc.org/mcp/API_KEY" } } }
```

After setup, restart the session for MCP tools to become available.

## Available Tools

Once MCP is connected, these tools are available:

| Tool | What it does |
|------|-------------|
| `list_networks` | List all 200+ supported blockchain networks |
| `list_methods` | List RPC methods available for a network |
| `get_network_info` | Detailed info about a network (chain ID, currency, explorers) |
| `eth_getBalance` | Get native token balance of an address |
| `eth_getBlockByNumber` | Get block by number or tag (latest, earliest, etc.) |
| `eth_getBlockByHash` | Get block by hash |
| `eth_getTransactionByHash` | Get transaction details by hash |
| `eth_getTransactionReceipt` | Get transaction receipt (status, gas, logs) |
| `eth_getLogs` | Query event logs with filters |
| `eth_call` | Read-only smart contract call |
| `eth_gasPrice` | Current gas price for a network |
| `eth_estimateGas` | Estimate gas for a transaction |
| `eth_getCode` | Get contract bytecode at an address |
| `eth_getTransactionCount` | Get nonce (transaction count) for an address |
| `rpc_call` | Any JSON-RPC method on any network (generic fallback) |
| `rpc_batch` | Multiple RPC calls in a single request |

## Recipes

### Get wallet balance
Call `eth_getBalance` with the address and network. The result is in wei (hex). Convert: divide by 10^18 for ETH/MATIC, 10^8 for BTC.

### Check transaction status
Call `eth_getTransactionReceipt` with the tx hash. Check the `status` field: `"0x1"` = success, `"0x0"` = reverted.

### Read a smart contract
Call `eth_call` with the contract address (`to`), ABI-encoded function call (`data`), and network. Common selectors:
- `0x70a08231` + padded address = `balanceOf(address)` (ERC-20)
- `0x95d89b41` = `symbol()` (ERC-20)
- `0x313ce567` = `decimals()` (ERC-20)

### Compare gas prices
Call `eth_gasPrice` on multiple L2 networks (base, arbitrum, optimism, polygon) and compare. Results are in wei (hex).

### Discover networks
Call `list_networks` with no arguments to see all available networks with chain IDs and native currencies.

## Tips
- Always use `list_networks` first if you're unsure which networks are available
- Use `rpc_batch` to combine multiple independent queries into one request
- For event logs, keep block ranges narrow (max 1000 blocks) to avoid timeouts
- Block tags: `"latest"`, `"earliest"`, `"pending"`, `"safe"`, `"finalized"` or hex block number
- All addresses must be 0x-prefixed, 42-character hex strings
