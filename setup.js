#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { createInterface } from "node:readline";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Step 0: Auto-install dependencies ───────────────────────────────────────

if (!existsSync(path.join(__dirname, "node_modules"))) {
  console.log("\n  Installing dependencies...\n");
  execSync("npm install", { cwd: __dirname, stdio: "inherit" });
  console.log("");
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function promptSecret(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    let input = "";

    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (ch) => {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(wasRaw || false);
        stdin.removeListener("data", onData);
        stdin.pause();
        process.stdout.write("\n");
        resolve(input);
      } else if (ch === "\u0003") {
        // Ctrl+C
        stdin.setRawMode(wasRaw || false);
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        process.exit(0);
      } else if (ch === "\u007F" || ch === "\b") {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        input += ch;
        process.stdout.write("*");
      }
    };

    stdin.on("data", onData);
  });
}

async function validateApiKey(apiKey) {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey },
    });
    if (res.ok) {
      const data = await res.json();
      return { valid: true, voiceCount: (data.voices || []).length };
    }
    return { valid: false, error: `API returned ${res.status}` };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

function getConfigPath() {
  const platform = os.platform();
  if (platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  } else if (platform === "win32") {
    return path.join(process.env.APPDATA || "", "Claude", "claude_desktop_config.json");
  } else {
    // Linux
    const p1 = path.join(os.homedir(), ".config", "Claude", "claude_desktop_config.json");
    const p2 = path.join(os.homedir(), ".config", "claude-desktop", "claude_desktop_config.json");
    if (existsSync(p1)) return p1;
    if (existsSync(p2)) return p2;
    return p1;
  }
}

function expandHome(p) {
  if (p.startsWith("~/") || p === "~") {
    return path.join(os.homedir(), p.slice(1));
  }
  return p;
}

// ── Main setup flow ─────────────────────────────────────────────────────────

async function main() {
  console.log("\n  ╔══════════════════════════════════════════╗");
  console.log("  ║   Drizz Voice Generator - Setup Wizard   ║");
  console.log("  ╚══════════════════════════════════════════╝\n");

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  // ── 1. API Key ──────────────────────────────────────────────────────────
  let apiKey = "";
  let validated = false;

  while (!validated) {
    rl.pause();
    apiKey = await promptSecret("  ElevenLabs API Key: ");
    rl.resume();

    if (!apiKey.trim()) {
      console.log("  API key cannot be empty. Try again.\n");
      continue;
    }

    process.stdout.write("  Validating key...");
    const result = await validateApiKey(apiKey.trim());

    if (result.valid) {
      console.log(` Valid! (${result.voiceCount} voices available)\n`);
      validated = true;
    } else {
      console.log(` Invalid: ${result.error}`);
      const retry = await prompt(rl, "  Try again? (Y/n): ");
      if (retry.toLowerCase() === "n") {
        console.log("\n  Setup cancelled.\n");
        rl.close();
        process.exit(0);
      }
      console.log("");
    }
  }

  apiKey = apiKey.trim();

  // ── 2. Output Directory ─────────────────────────────────────────────────
  const defaultDir = path.join("~", "Desktop");
  const dirAnswer = await prompt(rl, `  Output directory for MP3 files [${defaultDir}]: `);
  const outputDir = expandHome(dirAnswer.trim() || defaultDir);

  if (!existsSync(outputDir)) {
    const create = await prompt(rl, `  Directory doesn't exist. Create it? (Y/n): `);
    if (create.toLowerCase() !== "n") {
      mkdirSync(outputDir, { recursive: true });
      console.log(`  Created ${outputDir}\n`);
    }
  } else {
    console.log("");
  }

  // ── 3. Write Claude Desktop config ──────────────────────────────────────
  const configPath = getConfigPath();
  console.log(`  Claude config: ${configPath}`);

  let config = { mcpServers: {} };
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, "utf8"));
      if (!config.mcpServers) config.mcpServers = {};
    } catch {
      console.log("  Warning: Could not parse existing config. Creating fresh.\n");
      config = { mcpServers: {} };
    }
  }

  const serverEntry = {
    command: "node",
    args: [path.join(__dirname, "index.js")],
    env: {
      ELEVENLABS_API_KEY: apiKey,
      ELEVENLABS_OUTPUT_DIR: outputDir,
    },
  };

  config.mcpServers["drizz-voice-generator"] = serverEntry;

  // Ensure config directory exists
  mkdirSync(path.dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("  Config written successfully!\n");

  // ── 4. Done ─────────────────────────────────────────────────────────────
  console.log("  ╔══════════════════════════════════════════╗");
  console.log("  ║           Setup Complete!                ║");
  console.log("  ╚══════════════════════════════════════════╝\n");
  console.log("  Next steps:");
  console.log("  1. Restart Claude Desktop");
  console.log("  2. Try: \"Generate speech saying 'Hello world' with Rachel's voice\"\n");
  console.log("  Example prompts:");
  console.log("  - \"List available ElevenLabs voices\"");
  console.log("  - \"Convert this intro script to speech using George's voice, save as fathom_intro\"");
  console.log("  - \"Generate intro and outro MP3s with different voices\"\n");

  rl.close();
}

main().catch((err) => {
  console.error("\n  Setup failed:", err.message);
  process.exit(1);
});
