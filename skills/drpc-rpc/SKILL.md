---
name: drpc-rpc
description: Use when the user needs blockchain data (balances, transactions, blocks, gas prices, contract reads), wants to set up blockchain RPC access, or mentions DRPC, Web3, or Ethereum RPC. Also triggers on specific method names like eth_getBalance, eth_call, eth_getLogs.
---

# DRPC RPC — Blockchain Access for AI Agents

100+ blockchains, 200+ networks via DRPC decentralized RPC gateway.

## Step 1: Detect Transport

Check if DRPC MCP tools are available (look for `list_networks`, `eth_getBalance`, `rpc_call`).

- **MCP tools found** → use them directly. Go to Step 3.
- **MCP tools NOT found** → go to Step 2.

## Step 2: First Session Setup

Ask user for their DRPC API key. If they don't have one, direct them to https://drpc.org (free tier available).

Once you have the key:

1. **Execute the current request now** using direct HTTP calls — no restart needed.
   See [direct-http.md](direct-http.md) for the curl format.
2. **Configure MCP for future sessions.**
   See [setup.md](setup.md) for platform-specific commands.
3. **Tell the user:** "Done. Next session will use native MCP tools (faster)."

## Step 3: Route by Query Type

| User wants... | Reference |
|---------------|-----------|
| Tool parameters, return formats | [tools-reference.md](tools-reference.md) |
| Single-network query (balance, tx, block, gas, contract) | [recipes-simple.md](recipes-simple.md) |
| Multi-network comparison, cross-chain tracking | [recipes-crosschain.md](recipes-crosschain.md) |
| Error handling, billing issue | [errors.md](errors.md) |
| Setup or reconfigure MCP | [setup.md](setup.md) |

## Error Handling

If any call returns an error, check [errors.md](errors.md) before retrying.

Key signals:
- **HTTP 403** → billing/auth error (codes 10, 24, 52, 53, 4, 9)
- **HTTP 429** → rate limited (code 31) — retry after 1-2s
- **HTTP 408** → timeout (codes 40, 46)
- **HTTP 400** → bad request or feature restriction (codes 11, 47, 51)

## Quick Reference

- Addresses: 0x-prefixed, 42-char hex
- Block tags: `"latest"`, `"earliest"`, `"safe"`, `"finalized"`, or hex number
- Values: hex strings in wei. ETH = wei / 10^18, gwei = wei / 10^9
- Use `list_networks` first if unsure about network names
- Use `rpc_batch` for multiple queries on the same network
- Use `rpc_call` for non-EVM chains (Solana, Bitcoin, NEAR, Cosmos)
