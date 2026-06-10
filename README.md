# AI Daily Dashboard

A local web dashboard that uses Claude to generate your daily dev briefing: coding tasks, AI project ideas, and workflow tips. Content is generated once per day and cached — no repeat API calls.

## Requirements

- Node.js 18+
- An Anthropic API key

## Setup

1. Set your API key as an environment variable:
   ```
   set ANTHROPIC_API_KEY=sk-ant-...
   ```
2. Run `setup.bat` (as Administrator to register startup task)

## Usage

- Run `start.bat` to launch the server and open the browser
- Visit `http://localhost:3000`
- Content regenerates automatically each new day

## Files

| File | Purpose |
|------|---------|
| `server.js` | Express server + Claude API integration |
| `public/index.html` | Dark-themed Tailwind CSS dashboard UI |
| `data/today.json` | Daily content cache (auto-created, git-ignored) |
| `start.bat` | Launch server and open browser |
| `setup.bat` | Install deps + register Windows startup task |
