# MSU Slides Live Polling Engine

A zero-latency, self-hosted audience engagement tool powered by **Cloudflare Workers** + **Durable Objects (SQLite)**. Built as a Slido replacement with complete data sovereignty and zero subscription paywalls.

## Key Features

- **Decoupled from Slides**: You keep Reveal.js as your slide engine; this runs alongside it.
- **Multiple Polls per Session**: Pre-configure as many questions as you want per class (warm-up, checks, brainstorms).
- **Live Response Streaming**: Presenter screen and student mobile screens update in real time via WebSockets.
- **Zero Paywalls on Data**: Instant CSV download or JSON export with a single link or `curl`.
- **Zero Database Provisioning**: Every session is an isolated Durable Object with built-in SQLite storage. Runs completely on Cloudflare's free tier.

---

## Quick Start & Deployment

1. Inside `poll-worker/`, authenticate Wrangler (one-time setup):
   ```bash
   npx wrangler login
   ```
2. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```
   *(Or test locally anytime with `npm run dev`)*

---

## Workflow Guide

### 1. Pre-Class: Setup Questions for a Session
Run this curl command (or have an AI agent do it for you):

```bash
curl -X POST https://msu-slides-poll.YOUR_SUBDOMAIN.workers.dev/api/session/s05/setup \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Session 05: Business Partner Discovery",
    "questions": [
      "Warm-up: What AI tool have you used most this week?",
      "Brainstorm: What tasks are part of this job process?",
      "Brainstorm: What data and records need to be tracked?"
    ]
  }'
```

### 2. In Class: Students Join
Put the URL or QR code in your Reveal.js header or slide:
- **Student URL**: `https://msu-slides-poll.YOUR_SUBDOMAIN.workers.dev/s05`
- Mobile-optimized, instant load, no student accounts or logins.
- When they type an answer and hit **Submit**, it immediately streams into the class feed.

### 3. In Class: Presenter View
Open the presenter view on your projector, second display, or embed it right inside Reveal.js:
- **Presenter URL**: `https://msu-slides-poll.YOUR_SUBDOMAIN.workers.dev/present/s05`
- **Keyboard navigation**:
  - `Right Arrow` (`→`) or `Next →` button: Advances to the next question.
  - `Left Arrow` (`←`) or `← Prev` button: Returns to the previous question.
  - *When you advance the question, all student phones immediately update to the new question without reloading.*

### 4. Post-Class: Instant Data Export
Download the complete session data anytime:
- **CSV Download**: Open in your browser or curl:
  ```bash
  curl https://msu-slides-poll.YOUR_SUBDOMAIN.workers.dev/api/session/s05/export_csv > s05-responses.csv
  ```
- **JSON Download**:
  ```bash
  curl https://msu-slides-poll.YOUR_SUBDOMAIN.workers.dev/api/session/s05/export_json > s05-responses.json
  ```

---

## Reveal.js Integration Example

In your slide markdown or HTML:

```html
<!-- Live Poll Header Banner -->
<header class="slido-banner">
  Join the live brainstorm • <strong>poll.msu-ai.com/s05</strong>
</header>

<!-- Or embed the presenter screen directly in a slide -->
<section data-background-iframe="https://msu-slides-poll.YOUR_SUBDOMAIN.workers.dev/present/s05">
</section>
```
