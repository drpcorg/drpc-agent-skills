# Installing DRPC Agent Skills for OpenCode

## Install skills

```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc ~/.opencode/skills/drpc-rpc
ln -s $(pwd)/drpc-agent-skills/skills/drpc-crosschain ~/.opencode/skills/drpc-crosschain
```

## Add MCP server

Add to your `opencode.json`:

```json
{
  "mcpServers": {
    "drpc": {
      "url": "https://lb.drpc.org/mcp/YOUR_API_KEY"
    }
  }
}
```
