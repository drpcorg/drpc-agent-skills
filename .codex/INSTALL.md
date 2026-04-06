# Installing DRPC Agent Skills for Codex

## Install skills

```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills/drpc-rpc ~/.agents/skills/drpc-rpc
ln -s $(pwd)/drpc-agent-skills/skills/drpc-crosschain ~/.agents/skills/drpc-crosschain
```

Skills are detected automatically from `~/.agents/skills/`. Restart Codex if they don't appear.

## Add MCP server (optional)

```bash
codex mcp add drpc --url https://lb.drpc.org/mcp/YOUR_API_KEY
```
