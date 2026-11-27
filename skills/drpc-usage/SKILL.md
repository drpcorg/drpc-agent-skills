---
name: drpc-usage
description: Use when the user asks about their DRPC account balance, remaining Compute Units (CU), estimated runway/days left, RPC consumption, spend estimates, or top CU-consuming networks, methods, keys, or providers. Do NOT use for on-chain wallet token balances (use drpc-rpc instead).
---

# DRPC Usage — Account Balance & CU Metrics

Inspect DRPC account balance, Compute Unit (CU) consumption, and usage breakdowns via DRPC's read-only Statistics API.

> Scope boundary: This skill queries **DRPC platform account metrics** (`drpc.org/api/metrics/*`). For **on-chain wallet balances** (`eth_getBalance`, ERC-20, DeFi), use `drpc-rpc`.

## Step 1: Check Statistics API Token

DRPC's Statistics API uses a dedicated Bearer token — a regular RPC API key (including x402 keys) **cannot** authenticate against `/api/metrics/*`.

- **Env var (convention):** `DRPC_STATS_TOKEN`
- **Where to generate:** DRPC Dashboard → **Settings → API Tokens → NodeCloud Statistics API**
- **Scope:** Read-only metrics (returns key UUIDs as `client_key`; never exposes plaintext RPC API keys)

1. Check if `DRPC_STATS_TOKEN` is set in the environment.
2. If missing, ask the user to export `DRPC_STATS_TOKEN` (from Dashboard → Settings → API Tokens → NodeCloud Statistics API). Remind them not to pass a regular RPC key.

## Step 2: Security & Rate-Limit Rules

1. **Never echo secrets:** Never print `DRPC_STATS_TOKEN` or raw `Authorization` headers in output or logs.
2. **Read-only:** These endpoints only read account metrics. Never attempt to mutate billing or keys.
3. **Respect the 10 req/min rate limit:** Fetch once and aggregate locally with `jq` — do not poll in a loop.

## Step 3: Route by Query Type

See [api-reference.md](api-reference.md) for exact `curl` + `jq` commands and response schemas.

| User wants... | Endpoint |
|---------------|----------|
| Account balance & 24h burn rate (plus PAYG-only runway estimate) | `GET /api/metrics/json?range=day` |
| Usage breakdown by network, method, key UUID, or provider (`hour` / `day` / `week` / `month`) | `GET /api/metrics/json?range={range}` |
| Quick balance-only check or Prometheus metrics (last 24h) | `GET /api/metrics/prom` |

## Step 4: Present Results Clearly

`/api/metrics/json` returns fine-grained rows per `(client_key, network, connection, provider_id, method)` — often hundreds of rows. Always aggregate locally before replying.

Follow these metric conventions so numbers align with the DRPC Dashboard:

- **Report Compute Units (CU) first:** `balance` is denominated in **CU**, not USD.
- **USD conversion is a standard-rate estimate:** DRPC's standard CU rate is `$0.30 / 1M CU` across PAYG, Pro (`$49/mo`, 163M CU pool), and Scale (`$199/mo`, 664M CU pool) — Pro and Scale lower the per-request CU cost (16 / 14 / 13 CU) rather than the `$/CU` rate. Label USD values as **estimates at `$0.30 / 1M CU`**; note that Free tier usage is `$0` and Enterprise plans may have custom rates.
- **Plan / subscription pool caveat:** The Statistics API returns a single `balance` value and does **not** expose the account's plan tier, monthly subscription CU pool allowance, or renewal status. A Pro or Scale account can continue serving requests from its monthly CU pool even when prepaid `balance` is `0`.
- **Estimated days remaining (PAYG only):** Report `balance / rolling_24h_cu` as estimated days remaining **only when the account is confirmed to be Pay-As-You-Go (PAYG)** (computed from `range=day`; Dashboard rounds down to whole days; if 24h usage is `0`, report N/A). For subscription accounts or when the plan tier is unknown, do **not** report a days-remaining countdown — report `balance` (CU) and 24h CU usage, and direct the user to **Dashboard → Billing → Usage & Savings** (https://drpc.org/billing) for remaining plan quota and the monthly reset date.
- **Rolling windows:** `range=hour|day|week|month` are rolling windows (`day` = last 24 hours, not UTC midnight-to-now).

## Error Handling

| HTTP Status | Likely Cause | Action |
|-------------|--------------|--------|
| `401` / `403` | Missing, expired, or wrong token type (e.g. regular RPC key instead of Statistics API token) | Ask user to verify token at Dashboard → Settings → API Tokens → NodeCloud Statistics API |
| `400` | Invalid or missing `range` parameter | Use one of `hour`, `day`, `week`, `month` |
| `429` | Exceeded 10 req/min Statistics API limit | Stop retrying; wait ~60s before re-querying |
| Empty `data: []` | No RPC traffic in the selected window | Still report `balance` and note `0` requests in the window |

If the user is hitting RPC `403` billing errors (codes `10`, `52`, `53`), use this skill to inspect remaining CU balance and recent CU spikes, then direct them to https://drpc.org/billing to top up or adjust their plan.
