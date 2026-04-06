# Installing DRPC Agent Skills for OpenCode

Add a DRPC MCP server to your `opencode.json`:

```json
{
  "mcpServers": {
    "drpc": {
      "url": "https://lb.drpc.org/mcp/YOUR_API_KEY"
    }
  }
}
```

For skills (guided recipes), clone the repo and symlink:

```bash
git clone https://github.com/drpcorg/drpc-agent-skills.git
ln -s $(pwd)/drpc-agent-skills/skills ~/.opencode/skills/drpc-agent-skills
```
