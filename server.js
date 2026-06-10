const express = require('express');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'today.json');

const client = new Anthropic();

app.use(express.static(path.join(__dirname, 'public')));

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

async function generateDailyContent() {
  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 2000,
    thinking: { type: 'adaptive' },
    messages: [
      {
        role: 'user',
        content: `Generate a daily developer briefing in valid JSON format only — no markdown, no code fences, just raw JSON.

Return an object with exactly these keys:
{
  "tasks": [ 5 strings — concrete coding/AI tasks to practice today ],
  "projects": [ 3 to 5 strings — AI project ideas to build ],
  "tips": [ 2 to 3 strings — dev workflow productivity tips ]
}

Keep each item concise (1-2 sentences). Make them practical, actionable, and relevant to modern AI-assisted development.`
      }
    ]
  });

  const message = await stream.finalMessage();

  // Extract text from content blocks (skip thinking blocks)
  let text = '';
  for (const block of message.content) {
    if (block.type === 'text') {
      text = block.text.trim();
      break;
    }
  }

  // Strip any accidental markdown fences
  text = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  return JSON.parse(text);
}

async function getDailyContent() {
  const today = getTodayDate();

  try {
    if (fs.existsSync(DATA_FILE)) {
      const cached = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (cached.date === today) {
        return cached.content;
      }
    }
  } catch {
    // fall through to regenerate
  }

  console.log(`[${today}] Generating new daily content from Claude...`);
  const content = await generateDailyContent();

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ date: today, content }, null, 2));
  console.log(`[${today}] Content cached to ${DATA_FILE}`);

  return content;
}

app.get('/api/content', async (req, res) => {
  try {
    const content = await getDailyContent();
    res.json({ success: true, date: getTodayDate(), content });
  } catch (err) {
    console.error('Error generating content:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`AI Daily Dashboard running at http://localhost:${PORT}`);
});
