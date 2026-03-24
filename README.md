# Drizz Voice Generator

ElevenLabs text-to-speech MCP server for Claude Desktop and Claude Code. Generate voice audio directly from Claude conversations.

## Quick Start

```bash
git clone <repo-url>
cd drizz-voice-generator
node setup.js
```

The setup wizard will:
1. Install dependencies automatically
2. Ask for your ElevenLabs API key (validated live)
3. Ask where to save MP3 files
4. Configure Claude Desktop automatically

Then restart Claude Desktop — done.

## Tools

| Tool | Description |
|------|-------------|
| `text_to_speech` | Convert text to an MP3 file |
| `batch_text_to_speech` | Convert multiple texts to MP3s in parallel |
| `list_voices` | List all available ElevenLabs voices |
| `get_voice_id` | Look up a voice ID by name |

## Example Prompts

- "Generate speech saying 'Hello world' with Rachel's voice, save as hello"
- "List available ElevenLabs voices"
- "Generate the Fathom intro using George's voice saved as fathom_intro, and the outro using Rachel saved as fathom_outro"

## Manual Setup

If you prefer to configure manually:

```bash
npm install
```

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "drizz-voice-generator": {
      "command": "node",
      "args": ["/absolute/path/to/index.js"],
      "env": {
        "ELEVENLABS_API_KEY": "your_key_here",
        "ELEVENLABS_OUTPUT_DIR": "/Users/you/Desktop"
      }
    }
  }
}
```

Config paths by OS:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ELEVENLABS_API_KEY` | Yes | — | Your ElevenLabs API key |
| `ELEVENLABS_OUTPUT_DIR` | No | `~/Desktop` | Where MP3 files are saved |

## Troubleshooting

**Server not showing in Claude Desktop**
- Make sure you restarted Claude Desktop completely (quit + reopen)
- Check that the path to `index.js` in the config is absolute and correct

**API key invalid**
- Get a key at [elevenlabs.io](https://elevenlabs.io) → Profile → API Keys

**Rate limit errors on batch requests**
- ElevenLabs free tier has tight rate limits. Try fewer items per batch or upgrade your plan.

## License

MIT
