# Installing DRPC Agent Skills for Codex

## Option 1: Symlink (recommended)

```bash
ln -s /path/to/drpc-agent-skills/skills ~/.agents/skills/drpc-agent-skills
```

## Option 2: MCP only (no skills, just tools)

```bash
codex mcp add drpc --transport http https://lb.drpc.org/mcp/YOUR_API_KEY
```
