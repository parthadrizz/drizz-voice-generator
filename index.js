#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ── Config ──────────────────────────────────────────────────────────────────

const API_KEY = process.env.ELEVENLABS_API_KEY || "";
const OUTPUT_DIR = process.env.ELEVENLABS_OUTPUT_DIR || path.join(os.homedir(), "Desktop");
const BASE_URL = "https://api.elevenlabs.io/v1";

// ── Default voices (offline fallback) ───────────────────────────────────────

const DEFAULT_VOICES = {
  rachel:  "21m00Tcm4TlvDq8ikWAM",
  drew:    "29vD33N1CtxCmqQRPOHJ",
  clyde:   "2EiwWnXFnvU5JabPnv8n",
  paul:    "5Q0t7uMcjvnagumLfvZi",
  domi:    "AZnzlk1XvdvUeBnXmlld",
  dave:    "CYw3kZ02Hs0563khs1Fj",
  fin:     "D38z5RcWu1voky8WS1ja",
  sarah:   "EXAVITQu4vr4xnSDxMaL",
  antoni:  "ErXwobaYiN019PkySvjV",
  elli:    "MF3mGyEYCl7XYWbV9V6O",
  josh:    "TxGEqnHWrfWFTfGW9XjX",
  arnold:  "VR6AewLTigWG4xSOukaG",
  adam:    "pNInz6obpgDQGcFmaJgB",
  sam:     "yoZ06aMxZJJ28mfd3POQ",
};

// ── Voice cache ─────────────────────────────────────────────────────────────

let cachedVoices = null;

async function fetchVoices() {
  if (cachedVoices) return cachedVoices;

  if (!API_KEY) throw new Error("ELEVENLABS_API_KEY is not set. Run `node setup.js` to configure.");

  const res = await fetch(`${BASE_URL}/voices`, {
    headers: { "xi-api-key": API_KEY },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  cachedVoices = data.voices || [];
  return cachedVoices;
}

// ── Voice Presets ───────────────────────────────────────────────────────────

const PRESETS = {
  natural:        { stability: 0.45, similarity_boost: 0.75, style: 0.15 },
  conversational: { stability: 0.35, similarity_boost: 0.75, style: 0.20 },
  demo:           { stability: 0.50, similarity_boost: 0.80, style: 0.15 },
  narration:      { stability: 0.55, similarity_boost: 0.80, style: 0.10 },
  dramatic:       { stability: 0.30, similarity_boost: 0.70, style: 0.35 },
  audiobook:      { stability: 0.60, similarity_boost: 0.80, style: 0.10 },
};

// ── Text Enhancement (human-like pauses & normalization) ────────────────────

function numberToWords(n) {
  if (n === 0) return "zero";
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  if (n < 0) return "negative " + numberToWords(-n);
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numberToWords(n % 100) : "");
  if (n < 1000000) return numberToWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numberToWords(n % 1000) : "");
  if (n < 1000000000) return numberToWords(Math.floor(n / 1000000)) + " million" + (n % 1000000 ? " " + numberToWords(n % 1000000) : "");
  return String(n);
}

function enhanceText(text) {
  let t = text;

  // Dollar amounts: $100 → one hundred dollars
  t = t.replace(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/g, (_, num) => {
    const n = parseFloat(num.replace(/,/g, ""));
    return numberToWords(Math.floor(n)) + " dollars" + (n % 1 ? " and " + numberToWords(Math.round((n % 1) * 100)) + " cents" : "");
  });

  // Percentages: 50% → fifty percent
  t = t.replace(/(\d+(?:\.\d+)?)%/g, (_, num) => numberToWords(Math.floor(parseFloat(num))) + " percent");

  // Standalone numbers
  t = t.replace(/\b(\d{1,9})\b/g, (_, num) => numberToWords(parseInt(num, 10)));

  // Symbol expansion
  t = t.replace(/\s&\s/g, " and ");
  t = t.replace(/@/g, "at");
  t = t.replace(/\s\+\s/g, " plus ");
  t = t.replace(/#(\w)/g, "number $1");

  // Ellipsis → hesitation pause
  t = t.replace(/\.{3}/g, '<break time="0.5s"/>');

  // Em-dash → breath pause
  t = t.replace(/—/g, '<break time="0.35s"/>');

  // Comma pauses (after comma + space, before next word)
  t = t.replace(/,\s+/g, ', <break time="0.25s"/>');

  // Sentence-ending pauses (after . ! ? followed by space and uppercase letter)
  t = t.replace(/([.!?])\s+(?=[A-Z])/g, '$1 <break time="0.6s"/>');

  return t;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveVoiceId(nameOrId) {
  if (!nameOrId) return DEFAULT_VOICES.rachel;

  // If it looks like an ElevenLabs ID (20+ alphanumeric chars), use directly
  if (/^[a-zA-Z0-9]{20,}$/.test(nameOrId)) return nameOrId;

  // Check default voices (case-insensitive)
  const lower = nameOrId.toLowerCase();
  if (DEFAULT_VOICES[lower]) return DEFAULT_VOICES[lower];

  // Check cached API voices
  if (cachedVoices) {
    const match = cachedVoices.find((v) => v.name.toLowerCase() === lower);
    if (match) return match.voice_id;
  }

  // Fall back to Rachel
  console.error(`Voice "${nameOrId}" not found, falling back to Rachel`);
  return DEFAULT_VOICES.rachel;
}

function resolveOutputPath(filename) {
  if (!filename) filename = `speech_${Date.now()}`;
  if (!filename.endsWith(".mp3")) filename += ".mp3";

  // If absolute path, use as-is
  if (path.isAbsolute(filename)) return filename;

  // Otherwise, put in output dir
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  return path.join(OUTPUT_DIR, filename);
}

async function textToSpeechRequest(text, voiceId, outputPath, { modelId, stability, similarityBoost, style, preset, enhanceTextFlag = true } = {}) {
  if (!API_KEY) throw new Error("ELEVENLABS_API_KEY is not set. Run `node setup.js` to configure.");

  // Apply text enhancement for natural pauses
  const processedText = enhanceTextFlag ? enhanceText(text) : text;

  // Resolve voice settings: preset defaults → explicit overrides
  const presetSettings = PRESETS[preset] || PRESETS.natural;
  const voiceSettings = {
    stability: stability ?? presetSettings.stability,
    similarity_boost: similarityBoost ?? presetSettings.similarity_boost,
    style: style ?? presetSettings.style,
  };

  const body = {
    text: processedText,
    model_id: modelId || "eleven_multilingual_v2",
    voice_settings: voiceSettings,
  };

  const res = await fetch(`${BASE_URL}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`ElevenLabs TTS error ${res.status}: ${errBody}`);
  }

  const arrayBuf = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);

  // Ensure parent directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);

  return { path: outputPath, bytes: buffer.length };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "drizz-voice-generator",
  version: "1.0.0",
});

// Tool 1: text_to_speech
server.tool(
  "text_to_speech",
  "Convert text to speech using ElevenLabs and save as MP3. Automatically enhances text with natural pauses and breathing room. Use presets for quick voice tuning: natural (default), conversational (YouTube/demos), narration (tutorials), dramatic (trailers).",
  {
    text: z.string().describe("The text to convert to speech"),
    voice: z.string().optional().describe("Voice name (e.g. Rachel, Drew, George) or ElevenLabs voice ID. Defaults to Rachel"),
    filename: z.string().optional().describe("Output filename (e.g. intro.mp3). Saved to the configured output directory"),
    model_id: z.string().optional().describe("ElevenLabs model ID. Defaults to eleven_multilingual_v2"),
    preset: z.enum(["natural", "conversational", "demo", "narration", "dramatic", "audiobook"]).optional().describe("Voice preset: natural (default), conversational (YouTube/demos), narration (tutorials), dramatic (trailers)"),
    stability: z.number().min(0).max(1).optional().describe("Voice stability (0-1). Overrides preset value"),
    similarity_boost: z.number().min(0).max(1).optional().describe("Voice similarity boost (0-1). Overrides preset value"),
    enhance_text: z.boolean().optional().describe("Auto-enhance text with natural pauses and number expansion. Defaults to true"),
  },
  async ({ text, voice, filename, model_id, preset, stability, similarity_boost, enhance_text }) => {
    try {
      try { await fetchVoices(); } catch { /* use defaults */ }

      const voiceId = resolveVoiceId(voice);
      const outputPath = resolveOutputPath(filename);
      const result = await textToSpeechRequest(text, voiceId, outputPath, {
        modelId: model_id,
        stability,
        similarityBoost: similarity_boost,
        preset,
        enhanceTextFlag: enhance_text !== false,
      });

      return {
        content: [{
          type: "text",
          text: `Saved MP3 to ${result.path} (${formatBytes(result.bytes)})\nVoice: ${voice || "Rachel"}\nPreset: ${preset || "natural"}\nText enhancement: ${enhance_text !== false ? "on" : "off"}\nText length: ${text.length} chars`,
        }],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool 2: batch_text_to_speech
server.tool(
  "batch_text_to_speech",
  "Convert multiple texts to speech in parallel. Each item can have a different voice and filename. Supports presets and auto text enhancement.",
  {
    items: z.array(z.object({
      text: z.string().describe("The text to convert"),
      voice: z.string().optional().describe("Voice name or ID for this item"),
      filename: z.string().optional().describe("Output filename for this item"),
      model_id: z.string().optional().describe("ElevenLabs model ID"),
      preset: z.enum(["natural", "conversational", "demo", "narration", "dramatic", "audiobook"]).optional().describe("Voice preset for this item"),
      stability: z.number().min(0).max(1).optional(),
      similarity_boost: z.number().min(0).max(1).optional(),
      enhance_text: z.boolean().optional().describe("Auto-enhance text with natural pauses. Defaults to true"),
    })).describe("Array of text-to-speech items to process in parallel"),
  },
  async ({ items }) => {
    try {
      try { await fetchVoices(); } catch { /* use defaults */ }

      const promises = items.map((item, i) => {
        const voiceId = resolveVoiceId(item.voice);
        const outputPath = resolveOutputPath(item.filename || `batch_${i + 1}_${Date.now()}`);
        return textToSpeechRequest(item.text, voiceId, outputPath, {
          modelId: item.model_id,
          stability: item.stability,
          similarityBoost: item.similarity_boost,
          preset: item.preset,
          enhanceTextFlag: item.enhance_text !== false,
        })
          .then((result) => ({ success: true, index: i + 1, voice: item.voice || "Rachel", ...result }))
          .catch((err) => ({ success: false, index: i + 1, voice: item.voice || "Rachel", error: err.message }));
      });

      const results = await Promise.allSettled(promises);
      const settled = results.map((r) => r.status === "fulfilled" ? r.value : { success: false, error: r.reason?.message || "Unknown error" });

      const succeeded = settled.filter((r) => r.success);
      const failed = settled.filter((r) => !r.success);

      let output = `Batch complete!\n`;
      for (const r of settled) {
        if (r.success) {
          output += `  [${r.index}] ${path.basename(r.path)} - ${r.path} (${formatBytes(r.bytes)}) voice: ${r.voice}\n`;
        } else {
          output += `  [${r.index}] FAILED - ${r.error}\n`;
        }
      }
      output += `\n${succeeded.length} succeeded, ${failed.length} failed`;

      return { content: [{ type: "text", text: output }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool 3: list_voices
server.tool(
  "list_voices",
  "List all available ElevenLabs voices",
  {},
  async () => {
    try {
      const voices = await fetchVoices();
      let output = `Available voices (${voices.length}):\n\n`;
      for (const v of voices) {
        const labels = v.labels ? Object.values(v.labels).join(", ") : "";
        output += `  ${v.name} (${v.voice_id})${labels ? ` - ${labels}` : ""}\n`;
      }
      return { content: [{ type: "text", text: output }] };
    } catch (err) {
      // Fallback to default voices
      let output = "Could not fetch voices from API. Default voices:\n\n";
      for (const [name, id] of Object.entries(DEFAULT_VOICES)) {
        output += `  ${name.charAt(0).toUpperCase() + name.slice(1)} (${id})\n`;
      }
      output += `\nError: ${err.message}`;
      return { content: [{ type: "text", text: output }] };
    }
  }
);

// Tool 4: get_voice_id
server.tool(
  "get_voice_id",
  "Look up an ElevenLabs voice ID by name",
  {
    name: z.string().describe("The voice name to look up (e.g. Rachel, Drew, George)"),
  },
  async ({ name }) => {
    try {
      const voices = await fetchVoices();
      const match = voices.find((v) => v.name.toLowerCase() === name.toLowerCase());
      if (match) {
        return { content: [{ type: "text", text: `${match.name}: ${match.voice_id}` }] };
      }

      // Check defaults
      const lower = name.toLowerCase();
      if (DEFAULT_VOICES[lower]) {
        return { content: [{ type: "text", text: `${name}: ${DEFAULT_VOICES[lower]} (from defaults)` }] };
      }

      return { content: [{ type: "text", text: `Voice "${name}" not found. Use list_voices to see available voices.` }] };
    } catch (err) {
      // Fallback to defaults
      const lower = name.toLowerCase();
      if (DEFAULT_VOICES[lower]) {
        return { content: [{ type: "text", text: `${name}: ${DEFAULT_VOICES[lower]} (from defaults, API unavailable: ${err.message})` }] };
      }
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool 5: preview_text_enhancement
server.tool(
  "preview_text_enhancement",
  "Preview how text will be enhanced with SSML pauses and number expansion before sending to ElevenLabs. Use this to check and tweak scripts without burning API credits.",
  {
    text: z.string().describe("The text to preview enhancement for"),
  },
  async ({ text }) => {
    const enhanced = enhanceText(text);
    return {
      content: [{
        type: "text",
        text: `Original:\n${text}\n\nEnhanced:\n${enhanced}`,
      }],
    };
  }
);

// ── Start ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("drizz-voice-generator MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
