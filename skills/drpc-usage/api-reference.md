# DRPC Statistics API Reference

Read-only HTTP endpoints under `https://drpc.org/api/metrics/*`. Both endpoints enforce a rate limit of **10 requests per minute** and use the Statistics API Bearer token (`Dashboard → Settings → API Tokens → NodeCloud Statistics API`).

## 1. Statistics API (JSON)

Returns account balance (in CU) and fine-grained usage rows for the requested rolling window.

- **Endpoint:** `GET https://drpc.org/api/metrics/json?range={hour|day|week|month}`
- **Auth:** `Authorization: Bearer $DRPC_STATS_TOKEN`
- **Window semantics:** Rolling window (`hour`, `day` = last 24h, `week`, `month`).

### Response Schema

```json
{
  "balance": 36634460,
  "data": [
    {
      "request_count": 24,
      "cu": 480,
      "client_key": "2e2eb6e0-e8e6-11f1-b518-8238ee79a22c",
      "network": "base",
      "connection": "http",
      "provider_id": "kukisglobal",
      "method": "eth_call"
    }
  ]
}
```

Field notes:
- `balance`: Account balance in **Compute Units (CU)**. At DRPC's standard CU rate (`$0.30 / 1M CU`, shared across PAYG, Pro, and Scale), `36,634,460 CU` ≈ `$10.99` (Free tier is `$0`; Enterprise rates may differ).
- `data[]`: Grouped by `(client_key, network, connection, provider_id, method)`. May include cache hits (`"provider_id": "Cache provider"`) and `0` CU failed calls.
- `client_key`: UUID of the RPC key (never the raw RPC API key).

### Recipe A: Balance & 24h Summary (`range=day`)

Captures the HTTP response before parsing so `curl` failures (e.g. HTTP 401/403/429) are never masked by a pipeline exit code, and validates that `balance` is numeric and `data` is an array before aggregating.

> Note: `payg_balance_days_at_24h_rate` reflects prepaid balance divided by rolling 24h CU usage. Report it as estimated days remaining **only** when the user is confirmed to be on Pay-As-You-Go (PAYG). On subscription plans (or when plan tier is unknown), check **Billing → Usage & Savings** at https://drpc.org/billing for plan CU pool and reset date.

```bash
RESP=$(curl -fsS "https://drpc.org/api/metrics/json?range=day" \
  -H "Authorization: Bearer ${DRPC_STATS_TOKEN}") && \
printf '%s\n' "$RESP" | jq -e '
  if ((.balance | type) != "number") or ((.data | type) != "array") then
    error("unexpected DRPC metrics response: expected numeric balance and array data")
  else
    .data as $rows
    | ($rows | map(.cu // 0) | add // 0) as $cu_24h
    | ($rows | map(.request_count // 0) | add // 0) as $req_24h
    | {
        balance_cu: .balance,
        est_balance_usd: (((.balance / 1000000 * 0.30) * 100) | round / 100),
        rolling_24h_requests: $req_24h,
        rolling_24h_cu: $cu_24h,
        est_24h_usd: ((($cu_24h / 1000000 * 0.30) * 100) | round / 100),
        payg_balance_days_at_24h_rate: (if $cu_24h > 0 then (((.balance / $cu_24h) * 10) | round / 10) else null end),
        by_network: ($rows | group_by(.network) | map({network: .[0].network, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu)),
        top_methods: ($rows | group_by(.method) | map({method: .[0].method, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu) | .[0:10]),
        by_key: ($rows | group_by(.client_key) | map({client_key: .[0].client_key, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu)),
        by_provider: ($rows | group_by(.provider_id) | map({provider_id: .[0].provider_id, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu))
      }
  end
'
```

### Recipe B: Usage Breakdown for Any Window (`hour` | `day` | `week` | `month`)

Replace `RANGE` with `hour`, `day`, `week`, or `month`:

```bash
RANGE="week"
RESP=$(curl -fsS "https://drpc.org/api/metrics/json?range=${RANGE}" \
  -H "Authorization: Bearer ${DRPC_STATS_TOKEN}") && \
printf '%s\n' "$RESP" | jq -e --arg range "$RANGE" '
  if ((.balance | type) != "number") or ((.data | type) != "array") then
    error("unexpected DRPC metrics response: expected numeric balance and array data")
  else
    .data as $rows
    | ($rows | map(.cu // 0) | add // 0) as $total_cu
    | ($rows | map(.request_count // 0) | add // 0) as $total_req
    | {
        range: $range,
        balance_cu: .balance,
        window_requests: $total_req,
        window_cu: $total_cu,
        est_window_usd: ((($total_cu / 1000000 * 0.30) * 100) | round / 100),
        by_network: ($rows | group_by(.network) | map({network: .[0].network, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu)),
        top_methods: ($rows | group_by(.method) | map({method: .[0].method, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu) | .[0:10]),
        by_key: ($rows | group_by(.client_key) | map({client_key: .[0].client_key, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu)),
        by_provider: ($rows | group_by(.provider_id) | map({provider_id: .[0].provider_id, requests: (map(.request_count // 0) | add // 0), cu: (map(.cu // 0) | add // 0)}) | sort_by(-.cu))
      }
  end
'
```

---

## 2. Statistics API (Prometheus)

Useful for quick balance-only checks or Prometheus scraping (fixed to the last 24 hours).

- **Endpoint:** `GET https://drpc.org/api/metrics/prom`
- **Auth:** `Authorization: Bearer $DRPC_STATS_TOKEN`

### Exposed Metrics

- `drpc_client_balance` (gauge) — current client balance in CU
- `drpc_client_requests_count` (counter) — request count over the last 24h
- `drpc_client_cu_count` (counter) — compute units spent over the last 24h

### Quick Balance-Only Check

```bash
RESP=$(curl -fsS "https://drpc.org/api/metrics/prom" \
  -H "Authorization: Bearer ${DRPC_STATS_TOKEN}") && \
printf '%s\n' "$RESP" | grep -E '^drpc_client_balance'
```

---

## Troubleshooting Failed Requests

If `curl -fsS` fails, inspect only the HTTP status code without printing the token:

```bash
curl -sS -o /dev/null -w "HTTP %{http_code}\n" \
  "https://drpc.org/api/metrics/json?range=day" \
  -H "Authorization: Bearer ${DRPC_STATS_TOKEN}"
```
