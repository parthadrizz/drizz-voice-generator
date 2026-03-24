<h1 align="center">
  <img src="https://img.shields.io/badge/Drizz-Voice_Generator-blueviolet?style=for-the-badge&logo=soundcloud&logoColor=white" alt="Drizz Voice Generator" />
  <br/>
  <img src="https://img.shields.io/badge/Powered_by-ElevenLabs-00C9A7?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI3IiB5PSIzIiB3aWR0aD0iMyIgaGVpZ2h0PSIxOCIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxNCIgeT0iMyIgd2lkdGg9IjMiIGhlaWdodD0iMTgiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+" alt="ElevenLabs" />
  <img src="https://img.shields.io/badge/MCP-Server-blue?style=flat-square" alt="MCP" />
  <img src="https://img.shields.io/badge/Claude-Compatible-orange?style=flat-square" alt="Claude" />
</h1>

---

## 🎬 Generating Your First Voiceover

Just tell Claude what you want in natural language. The MCP server handles the rest.

<table>
<tr>
<td>

### 🎤 Single file

</td>
</tr>
<tr>
<td>

```
Generate a voiceover using George voice, demo preset, save as fathom_intro:

"Hey everyone! In this video, I'm excited to introduce Fathom, a new capability
in Drizz that allows you to run tests simply by describing your test intent.
Fathom can automatically execute the flow, handle conditional logic, perform
validations, and generate a reusable test script at the end. Let's take a quick
look at how it works."
```

</td>
</tr>
</table>

<table>
<tr>
<td>

### 🎧 Intro + outro in one shot

</td>
</tr>
<tr>
<td>

```
Generate two voiceover MP3s using George voice and demo preset:

1. Filename fathom_intro: "Hey everyone! In this video, I'm excited to introduce
   Fathom, a new capability in Drizz..."

2. Filename fathom_outro: "Stop wasting time on manual scripts. Let Fathom handle
   the heavy lifting and start testing at the speed of thought. Visit drizz.dev today."
```

</td>
</tr>
</table>

<table>
<tr>
<td>

### 🔍 Preview text enhancement first

</td>
</tr>
<tr>
<td>

```
Preview the text enhancement for: "Hey everyone! In this video, I'm excited
to introduce Fathom..."
```

Shows exactly what SSML tags get inserted **before** generating audio — no API credits used.

</td>
</tr>
</table>

---

## 🎛️ Voice Presets

Presets give you tuned voice settings in one word. Just say `demo preset` or `conversational preset` in your prompt.

<table>
<tr>
<th>Preset</th>
<th>Best for</th>
<th>Feel</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/natural-4A90D9?style=for-the-badge" alt="natural" /></td>
<td>General voiceovers <em>(default)</em></td>
<td>Balanced, clean</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/conversational-43B581?style=for-the-badge" alt="conversational" /></td>
<td>YouTube intros, casual content</td>
<td>Loose, energetic</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/demo-F5A623?style=for-the-badge" alt="demo" /></td>
<td>Product demos, walkthroughs</td>
<td>Measured, confident, professional</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/narration-9B59B6?style=for-the-badge" alt="narration" /></td>
<td>Tutorials, documentation</td>
<td>Steady, neutral, explainer</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/dramatic-E74C3C?style=for-the-badge" alt="dramatic" /></td>
<td>Trailers, hype reels</td>
<td>Intense, expressive</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/audiobook-1ABC9C?style=for-the-badge" alt="audiobook" /></td>
<td>Long-form reading</td>
<td>Consistent, smooth</td>
</tr>
</table>

<details>
<summary><strong>📊 Technical values behind each preset</strong></summary>
<br/>

| Preset | Stability | Similarity | Style |
|--------|-----------|------------|-------|
| `natural` | 0.45 | 0.75 | 0.15 |
| `conversational` | 0.35 | 0.75 | 0.20 |
| `demo` | 0.50 | 0.80 | 0.15 |
| `narration` | 0.55 | 0.80 | 0.10 |
| `dramatic` | 0.30 | 0.70 | 0.35 |
| `audiobook` | 0.60 | 0.80 | 0.10 |

You can override any value: `"use demo preset but with stability 0.4"`

</details>

---

## 📋 Example Prompts by Preset

<table>
<tr>
<td>
<img src="https://img.shields.io/badge/natural-4A90D9?style=for-the-badge" alt="natural" />
</td>
</tr>
<tr>
<td>

```
Generate a voiceover using Rachel voice, natural preset, save as welcome_message:

"Welcome to our platform. We're glad you're here. Let's walk through
the basics so you can get started quickly."
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<img src="https://img.shields.io/badge/conversational-43B581?style=for-the-badge" alt="conversational" />
</td>
</tr>
<tr>
<td>

```
Generate a voiceover using Drew voice, conversational preset, save as youtube_intro:

"What's up everyone! So I've been playing around with this new tool
and honestly, it's kind of blowing my mind. Let me show you what I mean."
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<img src="https://img.shields.io/badge/demo-F5A623?style=for-the-badge" alt="demo" />
</td>
</tr>
<tr>
<td>

```
Generate a voiceover using George voice, demo preset, save as product_demo:

"Let me show you how Fathom works. Simply describe what you want to test,
and Fathom will automatically execute the flow, handle conditional logic,
and generate a reusable script. No manual scripting required."
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<img src="https://img.shields.io/badge/narration-9B59B6?style=for-the-badge" alt="narration" />
</td>
</tr>
<tr>
<td>

```
Generate a voiceover using Rachel voice, narration preset, save as tutorial_step1:

"Step one. Open your terminal and navigate to the project directory.
You'll see a file called config.json. Open it in your preferred editor
and locate the authentication section."
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<img src="https://img.shields.io/badge/dramatic-E74C3C?style=for-the-badge" alt="dramatic" />
</td>
</tr>
<tr>
<td>

```
Generate a voiceover using Paul voice, dramatic preset, save as launch_trailer:

"Testing was never meant to be this slow. Your team deserves better.
Introducing Fathom. Test at the speed of thought."
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<img src="https://img.shields.io/badge/audiobook-1ABC9C?style=for-the-badge" alt="audiobook" />
</td>
</tr>
<tr>
<td>

```
Generate a voiceover using Paul voice, audiobook preset, save as chapter1:

"In the early days of software testing, everything was manual. Teams would
spend weeks writing test cases by hand, clicking through every flow, and
documenting results in sprawling spreadsheets. It was tedious, error-prone,
and unsustainable."
```

</td>
</tr>
</table>

### Modifier examples

<table>
<tr>
<td>

**Skip auto pauses:**
```
Generate a voiceover using George voice, demo preset, with enhance_text off, save as test_raw:
"Your raw text goes here exactly as you want it spoken."
```

**Override a preset value:**
```
Generate a voiceover using George voice, demo preset, stability 0.3, save as test_override:
"This will use demo settings but with lower stability for more expression."
```

**Preview before generating (no API cost):**
```
Preview the text enhancement for: "Hey everyone! $100 worth of testing in 50% less time... sounds good, right?"
```

</td>
</tr>
</table>

### Voice discovery

<table>
<tr>
<td>

**List all available voices:**
```
List all available ElevenLabs voices
```

**Look up a specific voice ID:**
```
What is the voice ID for George?
```

</td>
</tr>
</table>

---

## ✨ Text Enhancement

> Enabled by default. Automatically makes speech sound more human by inserting SSML pauses and expanding numbers/symbols.

<table>
<tr>
<th>Pattern</th>
<th>Becomes</th>
<th>Purpose</th>
</tr>
<tr>
<td><code>.</code> <code>!</code> <code>?</code></td>
<td><code>&lt;break time="0.6s"/&gt;</code></td>
<td>🫁 Breathing room between sentences</td>
</tr>
<tr>
<td><code>,</code></td>
<td><code>&lt;break time="0.25s"/&gt;</code></td>
<td>🎵 Natural cadence at commas</td>
</tr>
<tr>
<td><code>—</code> (em-dash)</td>
<td><code>&lt;break time="0.35s"/&gt;</code></td>
<td>💨 Breath pause</td>
</tr>
<tr>
<td><code>...</code> (ellipsis)</td>
<td><code>&lt;break time="0.5s"/&gt;</code></td>
<td>🤔 Hesitation pause</td>
</tr>
<tr>
<td><code>$100</code></td>
<td><code>one hundred dollars</code></td>
<td>🗣️ Natural speech</td>
</tr>
<tr>
<td><code>50%</code></td>
<td><code>fifty percent</code></td>
<td>🗣️ Natural speech</td>
</tr>
<tr>
<td><code>&amp;</code> <code>@</code> <code>+</code> <code>#</code></td>
<td><code>and</code> <code>at</code> <code>plus</code> <code>number</code></td>
<td>🗣️ Natural speech</td>
</tr>
</table>

### Before & After

<table>
<tr>
<td width="50%">

**Your original text** 📝

```
...a new capability in Drizz that allows you
to run tests simply by describing your test
intent. Fathom can automatically execute the
flow, handle conditional logic, perform
validations, and generate a reusable test
script at the end. Let's take a quick look
at how it works.
```

</td>
<td width="50%">

**Sent to ElevenLabs** 🔊

```
...a new capability in Drizz that allows you
to run tests simply by describing your test
intent. ⟨break 0.6s⟩ Fathom can automatically
execute the flow, ⟨break 0.25s⟩ handle
conditional logic, ⟨break 0.25s⟩ perform
validations, ⟨break 0.25s⟩ and generate a
reusable test script at the end. ⟨break 0.6s⟩
Let's take a quick look at how it works.
```

</td>
</tr>
</table>

> 💡 To disable: add `with enhance_text off` to your prompt.

---

## 🎙️ Available Voices

Say `"list available voices"` to Claude for the full list. Popular picks:

<table>
<tr>
<th>Voice</th>
<th>Style</th>
<th>Good for</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/George-2C3E50?style=flat-square" alt="George" /> <strong>George</strong></td>
<td>Warm, authoritative</td>
<td>Product demos, intros</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Rachel-8E44AD?style=flat-square" alt="Rachel" /> <strong>Rachel</strong></td>
<td>Clear, professional</td>
<td>Narration, tutorials</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Drew-2980B9?style=flat-square" alt="Drew" /> <strong>Drew</strong></td>
<td>Friendly, casual</td>
<td>YouTube, conversational</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Paul-27AE60?style=flat-square" alt="Paul" /> <strong>Paul</strong></td>
<td>Deep, steady</td>
<td>Audiobooks, explainers</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Sarah-E74C3C?style=flat-square" alt="Sarah" /> <strong>Sarah</strong></td>
<td>Bright, energetic</td>
<td>Marketing, CTAs</td>
</tr>
</table>

---

## ⚙️ Advanced Options

Override any setting directly in your prompt:

```
Generate speech with George voice, demo preset, stability 0.4,
similarity_boost 0.9, model eleven_turbo_v2: "Your text here"
```

| Parameter | Range | What it does |
|-----------|-------|--------------|
| `stability` | 0–1 | Lower = more expressive, higher = more consistent |
| `similarity_boost` | 0–1 | Higher = closer to original voice, crisper pronunciation |
| `model_id` | string | `eleven_multilingual_v2` (quality) or `eleven_turbo_v2` (speed) |
| `enhance_text` | on/off | Toggle auto SSML pauses and number expansion |

---

## 🔧 Troubleshooting

> **Audio sounds robotic or rushed** — Try a lower stability (0.30–0.40) for more expression. Make sure `enhance_text` is on (default) for natural pauses.

> **Audio sounds unstable or glitchy** — Raise stability above 0.50. Use `narration` or `audiobook` preset.

> **Product names mispronounced** — Spell them phonetically: "Drizzz" instead of "Drizz". Or use `enhance_text off` and manually add SSML.

> **Rate limit errors on batch** — ElevenLabs free tier has tight limits. Try fewer items per batch or upgrade your plan.
