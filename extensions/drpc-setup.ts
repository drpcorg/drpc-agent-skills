import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

type McpConfig = {
  mcpServers?: Record<string, Record<string, unknown>>;
  [key: string]: unknown;
};

function piAgentDir(): string {
  return process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
}

function redactUrl(url: string): string {
  return url.replace(/\/mcp\/[^/\s"]+/u, "/mcp/****");
}

function loadConfig(path: string): McpConfig {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as McpConfig;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return {};
    throw new Error(`Failed to read ${path}: ${err.message}`);
  }
}

function saveConfig(path: string, config: McpConfig): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function normalizeApiKey(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/https:\/\/lb\.drpc\.org\/mcp\/([^/\s"]+)/u);
  return match ? match[1] : trimmed;
}

function configureDrpc(apiKeyOrUrl: string): { configPath: string; url: string; overwritten: boolean } {
  const apiKey = normalizeApiKey(apiKeyOrUrl);
  if (!apiKey) throw new Error("DRPC API key is required");

  const configPath = join(piAgentDir(), "mcp.json");
  const config = loadConfig(configPath);
  const overwritten = Boolean(config.mcpServers?.drpc);
  const url = `https://lb.drpc.org/mcp/${apiKey}`;

  config.mcpServers = {
    ...(config.mcpServers || {}),
    drpc: {
      url,
      lifecycle: "lazy",
    },
  };

  saveConfig(configPath, config);
  return { configPath, url, overwritten };
}

function ensureCoinbasePaymentsBundle(): string {
  const bundlePath = join(homedir(), ".payments-mcp", "bundle.js");
  if (existsSync(bundlePath)) return bundlePath;

  try {
    execFileSync("npx", ["@coinbase/payments-mcp", "--client", "other", "--no-auto-config"], {
      stdio: "pipe",
      timeout: 120_000,
    });
  } catch (error) {
    const err = error as Error & { stderr?: Buffer };
    const stderr = err.stderr?.toString("utf8").trim();
    throw new Error(
      `Coinbase Payments MCP bundle not found at ${bundlePath}, and automatic install failed. Run manually: npx @coinbase/payments-mcp --client other --no-auto-config${stderr ? `. Error: ${stderr}` : ""}`,
    );
  }

  if (!existsSync(bundlePath)) {
    throw new Error(
      `Coinbase Payments MCP bundle was not created at ${bundlePath}. Run manually: npx @coinbase/payments-mcp --client other --no-auto-config`,
    );
  }

  return bundlePath;
}

function configureCoinbasePaymentsMcp(): { configPath: string; bundlePath: string; overwritten: boolean } {
  const configPath = join(piAgentDir(), "mcp.json");
  const bundlePath = ensureCoinbasePaymentsBundle();

  const config = loadConfig(configPath);
  const overwritten = Boolean(config.mcpServers?.["payments-mcp"]);
  config.mcpServers = {
    ...(config.mcpServers || {}),
    "payments-mcp": {
      command: "node",
      args: [bundlePath],
      lifecycle: "lazy",
    },
  };
  saveConfig(configPath, config);
  return { configPath, bundlePath, overwritten };
}

export default function drpcSetup(pi: ExtensionAPI) {
  pi.registerTool({
    name: "drpc_setup",
    label: "Configure DRPC MCP",
    description: "Bootstrap DRPC access for Pi. With apiKey, configure DRPC MCP. Without apiKey, install/configure Coinbase Payments MCP so the agent can acquire a DRPC key via secure x402 without private keys in Pi.",
    parameters: Type.Object({
      apiKey: Type.Optional(Type.String({ description: "Optional DRPC API key, or full https://lb.drpc.org/mcp/... URL. Omit to bootstrap Coinbase Payments MCP for x402." })),
    }),
    async execute(_toolCallId, params) {
      const apiKey = normalizeApiKey(params.apiKey || "");

      if (!apiKey) {
        const result = configureCoinbasePaymentsMcp();
        const status = result.overwritten ? "updated" : "created";
        return {
          content: [
            {
              type: "text",
              text: `No DRPC API key provided. Coinbase Payments MCP ${status} in ${result.configPath}. Use the mcp gateway to connect to payments-mcp and acquire the DRPC API key via x402, then call drpc_setup again with that key. If payments-mcp is not visible yet, reload/restart the Pi/MCP session. Bundle: ${result.bundlePath}`,
            },
          ],
          details: { mode: "coinbase-x402-bootstrap", ...result },
        };
      }

      const result = configureDrpc(apiKey);
      const status = result.overwritten ? "updated" : "created";
      return {
        content: [
          {
            type: "text",
            text: `DRPC MCP ${status} in ${result.configPath}. Reload/restart the Pi/MCP session if pi-mcp-adapter does not pick it up immediately. URL: ${redactUrl(result.url)}`,
          },
        ],
        details: {
          mode: "drpc-mcp-config",
          configPath: result.configPath,
          url: redactUrl(result.url),
          overwritten: result.overwritten,
        },
      };
    },
  });

  pi.registerCommand("drpc-setup", {
    description: "Configure DRPC MCP server for Pi via pi-mcp-adapter",
    handler: async (args, ctx) => {
      let apiKey = normalizeApiKey(args || "");

      if (!apiKey) {
        apiKey = normalizeApiKey(
          (await ctx.ui.input("DRPC API key", "Paste API key or https://lb.drpc.org/mcp/...")) || "",
        );
      }

      if (!apiKey) {
        ctx.ui.notify("DRPC setup cancelled", "info");
        return;
      }

      const configPath = join(piAgentDir(), "mcp.json");
      if (loadConfig(configPath).mcpServers?.drpc) {
        const ok = await ctx.ui.confirm(
          "DRPC MCP already exists",
          `Overwrite existing drpc server in ${configPath}?`,
        );
        if (!ok) {
          ctx.ui.notify("DRPC setup cancelled", "info");
          return;
        }
      }

      try {
        const result = configureDrpc(apiKey);
        ctx.ui.notify(
          `DRPC MCP configured in ${result.configPath}. Reload/restart the Pi/MCP session if needed. URL: ${redactUrl(result.url)}`,
          "info",
        );
      } catch (error) {
        ctx.ui.notify(`DRPC setup failed: ${(error as Error).message}`, "error");
      }
    },
  });

  pi.registerTool({
    name: "drpc_coinbase_wallet_setup",
    label: "Configure Coinbase Payments MCP",
    description: "Install/configure Coinbase Agentic Wallet / Payments MCP in ~/.pi/agent/mcp.json for pi-mcp-adapter. Creates ~/.payments-mcp/bundle.js via npx @coinbase/payments-mcp when missing.",
    parameters: Type.Object({}),
    async execute() {
      const result = configureCoinbasePaymentsMcp();
      const status = result.overwritten ? "updated" : "created";
      return {
        content: [
          {
            type: "text",
            text: `Coinbase Payments MCP ${status} in ${result.configPath}. Reload/restart the Pi/MCP session if pi-mcp-adapter does not pick it up immediately. Bundle: ${result.bundlePath}`,
          },
        ],
        details: result,
      };
    },
  });

  pi.registerCommand("drpc-coinbase-wallet-setup", {
    description: "Configure Coinbase Agentic Wallet / Payments MCP for Pi via pi-mcp-adapter",
    handler: async (_args, ctx) => {
      try {
        const result = configureCoinbasePaymentsMcp();
        ctx.ui.notify(
          `Coinbase Payments MCP configured in ${result.configPath}. Reload/restart the Pi/MCP session if needed.`,
          "info",
        );
      } catch (error) {
        ctx.ui.notify(`Coinbase wallet setup failed: ${(error as Error).message}`, "error");
      }
    },
  });
}
