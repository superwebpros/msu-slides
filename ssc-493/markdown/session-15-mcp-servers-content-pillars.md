## Welcome Back

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

How was break?

Who's ready to build stuff?

</div>

Note:
Energy check. Keep it light — 2 minutes max. Then pivot to the semester map.

---

## Where We Are

<div style="font-size: 18px; margin: 20px 0;">

```
 Weeks 1-7: ANALYSIS             Weeks 8-14: PRODUCTION

 Prompts, LLMs, RAG basics       MCP servers, function calling
 Embeddings, vector DBs          Voice matching, multi-agent
 ETL pipelines, Baserow          Content generation pipelines
 Semantic audit, partner report   Visual content, video

 You figured out WHAT to say      Now you figure out HOW to say it

                    TODAY ← You are here
```

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
15 of 28 sessions done. Everything you built is your foundation. Now we <strong>use</strong> it.
</div>

Note:
Draw this on the whiteboard. "You're at the halfway point. Everything you built — Baserow tables, Qdrant collections, audit data — that's your foundation. Starting today, we USE all of that to actually produce content." This is the pivot from analysis to production. The rest of the semester is about filling the gaps you identified.

---

## Team Status Check

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

Quick round-robin: where is your team?

- Baserow tables populated?
- Partner meeting happened?
- Audit report delivered?

</div>

Note:
Go team by team. Quick — no more than 60 seconds each:
- "MediLodge — Duke, where are you? Tables populated? Partner meeting happened?"
- "GLCF — Michael, Dr. Schaefer?"
- "HTSA — Christian?"
- "Weathervane — Chris, did you hit the Monday deadline?"
- "Orange Insoles — Marcia, Owen, same question?"

Don't dwell on problems. Note who needs help, move on. If Weathervane or Orange Insoles are behind: "OK, you'll build the MCP server today alongside everyone else, and we'll get your data caught up this week."

---

## Today's Agenda

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 20px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 1: MCP Servers</h4>
<ul style="line-height: 1.8;">
<li>What they are</li>
<li>Why they change everything</li>
<li>Live demo</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 2: Build It</h4>
<ul style="line-height: 1.8;">
<li>Create your MCP workflow</li>
<li>Connect LibreChat to your data</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 3: Generate Topics</h4>
<ul style="line-height: 1.8;">
<li>30 content pillar topics</li>
<li>Grounded in YOUR data</li>
</ul>
</div>

</div>

Note:
Frame the session: "Here's what's happening today. You're going to build something that will change how you think about AI. Right now, when you use LibreChat, you type a question and it answers from its training data. After today, your LibreChat will be able to READ your Baserow tables and SEARCH your partner's indexed content. It becomes your research assistant with access to everything you've built."

---

## What's an MCP Server?

<div style="font-size: 19px; margin: 20px 0;">

```
WITHOUT MCP:
  You → LibreChat → "I don't know about your business"

WITH MCP:
  You → LibreChat → [calls MCP server] → Baserow (your audit data)
                                        → Qdrant (partner content)
                                        → Web search (competitor research)
                   ← [returns grounded answer]
```

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>MCP = Model Context Protocol</strong><br>
A standard way for AI to talk to external tools
</div>

Note:
Draw this on the whiteboard. Key points:

- MCP = Model Context Protocol. Standard way for AI to call external tools.
- FUNCTION CALLING is the mechanism. The AI decides "I need data from Baserow" and calls a function to get it. This is the Fc element on the periodic table — first new element since Session 9.
- Why this matters: AI without data access = generic advice. AI with data access = grounded, specific, actionable. "This is the difference between an AI that gives you blog post ideas from the internet and an AI that gives you blog post ideas based on YOUR partner's actual content gaps."
- N8N is the host. N8N runs the MCP server. LibreChat connects to it. When LibreChat needs data, it calls the N8N workflow.
- You've already done the hard part. Baserow tables exist. Qdrant collection exists. Today you're just wiring them up.

---

## The Architecture

<div style="font-size: 18px; margin: 20px 0;">

```
┌─────────────┐
│  LibreChat   │  ← You talk to this
└──────┬──────┘
       │ MCP calls
       ▼
┌─────────────┐
│   N8N        │  ← Hosts the MCP server
│  (workflow)  │
└──┬───────┬──┘
   │       │
   ▼       ▼
┌──────┐ ┌──────┐
│Baserow│ │Qdrant│  ← Your data sources
└──────┘ └──────┘
```

</div>

<div style="font-size: 20px; margin: 20px 0; text-align: center;">

**Two triggers in one workflow:**

1. "Search Baserow" — read your audit tables, write to content pillars
2. "Search Customer Content" — semantic search over partner content

</div>

Note:
This is the technical architecture. N8N hosts a workflow with two MCP trigger nodes. Each trigger exposes different tools to LibreChat. Trigger 1 gives LibreChat the ability to read Baserow (themes, sitemap, theme analysis) and write to a new content_pillars table. Trigger 2 gives LibreChat the ability to search Qdrant with embeddings. LibreChat also has built-in web search — so three data sources total.

---

## Live Demo: Building the MCP Workflow

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

**Screenshare: N8N → LibreChat**

</div>

Note:
BUILD THIS LIVE. Go node by node:

TRIGGER 1 — "Search Baserow":
1. Add MCP Server Trigger node → name it "Search Baserow"
2. Connect "Get many rows in Baserow" tool node → configure with your demo table IDs
3. Connect "Create a row in Baserow" tool node → configure for content_pillars table
4. "This trigger gives LibreChat two abilities: READ your audit tables and WRITE to content pillars."

TRIGGER 2 — "Search Customer Content":
1. Add second MCP Server Trigger node → name it "Search Customer Content"
2. Connect "Qdrant Vector Store" tool node (retrieve mode) → your demo collection name
3. Connect "Embeddings OpenAI" node → text-embedding-3-small
4. "This trigger lets LibreChat search your partner's content semantically."

Activate the workflow.

THEN SWITCH TO LIBRECHAT:
1. "What are the main themes from my Baserow audit data?" → Watch it call Baserow
2. "Search my partner's content for anything about [topic]" → Watch it call Qdrant
3. "Based on gaps in my audit and what my partner covers, suggest 5 pillar topics" → Watch it use BOTH

THE AHA MOMENT: "See that? It just read your Baserow data, searched your partner's content, and synthesized both into recommendations. This is function calling in action."

---

## Step 1: Create `Content Pillars` Table

<div style="font-size: 19px; margin: 20px 0;">

| Field | Type | Purpose |
|-------|------|---------|
| **Pillar** | Short text | Topic name |
| **Description** | Long text | What this pillar covers |
| **Resources** | Long text | URLs and sources that rank for this topic |
| **Source Analysis** | Long text | AI analysis of what the sources cover |
| **Audio URL** | URL | NotebookLM audio link (filled later) |
| **Transcript** | Long text | Audio transcription (filled Thursday) |
| **Approved** | Boolean | Human QC flag — default unchecked |

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
5 minutes. Create this table now.
</div>

Note:
Everyone creates this table in their team Baserow database. The MCP server will write to it — LibreChat will store generated topics directly here. The Approved checkbox is the human QC step — they'll review topics and check the ones they want to keep. Audio URL and Transcript fields are for Thursday's NotebookLM work.

---

## Step 2: Build Your MCP Workflow

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 18px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 10px;">Trigger 1: Search Baserow</h4>
<ul style="line-height: 1.8;">
<li>MCP Server Trigger</li>
<li>"Get many rows" → your table IDs</li>
<li>"Create a row" → Content Pillars table</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 10px;">Trigger 2: Search Customer Content</h4>
<ul style="line-height: 1.8;">
<li>MCP Server Trigger</li>
<li>Qdrant Vector Store (retrieve)</li>
<li>Embeddings OpenAI</li>
</ul>
</div>

</div>

<div style="background: #fee2e2; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Activate the workflow!</strong> It won't appear in LibreChat until it's active.
</div>

Note:
15 minutes. Students replicate the demo with their own credentials. You'll need to know your Baserow table IDs (themes, theme analysis, sitemap, and the new content_pillars) and your Qdrant collection name.

Common issues:
- Can't find table IDs → URL bar in Baserow or API docs page
- MCP tools don't appear in LibreChat → Is the workflow active? May need to refresh LibreChat
- Qdrant search returns nothing → Verify collection name matches exactly

Circulate and ask: "What table IDs are you using? Did you double-check them?" "Is your Qdrant collection name correct?" "Did you activate the workflow?"

---

## Step 3: Test It

<div style="font-size: 22px; line-height: 2; margin: 30px 0; text-align: center;">

**Open LibreChat. Verify both tools work:**

1. "What themes did we identify in our audit?"
2. "Search our partner's content about [your strongest theme]"

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>Don't move on until both tools work.</strong> Flag me if you're stuck.
</div>

Note:
10 minutes. Hard gate — both tools must work before they start generating topics. If Baserow returns data and Qdrant returns content, they're good. If not, troubleshoot now.

---

## Step 4: Generate 30 Pillar Topics

<div style="font-size: 18px; line-height: 1.6; margin: 20px 0;">

**Start with this prompt in LibreChat:**

> "I'm building a content strategy for [partner name]. Use my Baserow audit data to see our themes and gaps. Search my partner's content to understand what they cover. Search the web for what competitors publish. Generate 30 content pillar topics with a name, description, and 3-5 source URLs. Store each in my Content Pillars table."

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
If the first batch feels generic: <strong>"Look at my audit data again — what specific gaps did we identify?"</strong>
</div>

Note:
10 minutes in class, finish as homework. The AI will use all three data sources — Baserow, Qdrant, and web search. Let it work. May take a few rounds of conversation. If topics feel generic, push it: "These are too broad. Look at my audit data again — what specific gaps did we identify? Give me topics that fill THOSE gaps." Students may not get all 30 during class — that's expected. Get the workflow working and first batch generated, finish the rest tonight.

---

## Homework: Due Thursday

<div style="font-size: 19px; line-height: 1.6; margin: 20px 0;">

1. **Finish generating 30 pillar topics** in Content Pillars table
2. **Review for relevance** — check the "Approved" box for keepers
3. **Verify 3-5 sources per topic** — AI sometimes hallucinates URLs
4. **Ingest approved sources into NotebookLM** — group related pillars into notebooks
5. **Generate audio overviews** in NotebookLM for each notebook
6. **Come Thursday ready to download audio files**

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 19px; text-align: center;">
<strong>The human QC step is critical.</strong> Don't just accept whatever the AI generated.<br>
YOU know your business partner. The AI doesn't.
</div>

Note:
Walk through each item. The Approved checkbox is the key human-in-the-loop step. They need to actually read each topic and decide: "Does this matter for my partner?" URL verification is also critical — LLMs hallucinate URLs. Click them. If they're dead, replace them or remove the topic.

NotebookLM: group 3-5 related pillars into one notebook. Upload the source URLs. Generate the audio overview. Thursday we'll work with those audio files — downloading, transcribing, and using the transcripts in the content pipeline.

---

## Thursday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Thursday: Voice matching with few-shot prompting**

- Use your RAG-powered LibreChat to pull partner content
- Extract your partner's writing voice and style
- Generate content that sounds like them, not ChatGPT

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Come with 30 approved topics, verified sources, and NotebookLM audio ready
</div>

Note:
Thursday builds directly on today. The MCP connection they just built powers voice matching — LibreChat searches partner content via Qdrant, extracts writing style, and generates content that matches. By Thursday's end, they'll have content that sounds like their partner. The progression: today = what to write about, Thursday = how to write it.
