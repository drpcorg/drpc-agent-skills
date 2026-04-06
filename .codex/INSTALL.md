# Installing DRPC Agent Skills for Codex

## Option 1: Symlink (recommended)

```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills ~/.agents/skills/drpc-agent-skills
```

## Option 2: MCP only (no skills, just tools)

```bash
codex mcp add drpc --url https://lb.drpc.org/mcp/YOUR_API_KEY
```
