# Installing DRPC Agent Skills for Codex

## Option 1: MCP only (recommended)

```bash
codex mcp add drpc --url https://lb.drpc.org/mcp/YOUR_API_KEY
```

## Option 2: Skills + MCP

```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills ~/.agents/skills/drpc-agent-skills
codex mcp add drpc --url https://lb.drpc.org/mcp/YOUR_API_KEY
```
