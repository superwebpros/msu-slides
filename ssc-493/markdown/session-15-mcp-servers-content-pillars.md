## Welcome Back

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

How was break?

Who's ready to build stuff?

</div>

Note:
Energy check. Keep it light — 2 minutes max. Then pivot to the semester map.

---

## Where We Are

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 19px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Weeks 1–7: ANALYSIS</h4>
<ul style="line-height: 2;">
<li>Prompts, LLMs, RAG basics</li>
<li>Embeddings, vector DBs</li>
<li>ETL pipelines, Baserow</li>
<li>Semantic audit, partner report</li>
</ul>
<p style="margin-top: 15px; color: #666;">You audited <strong>what they have</strong></p>
</div>

<div>
<h4 style="color: #16a34a; margin-bottom: 15px;">Weeks 8–14: PRODUCTION</h4>
<ul style="line-height: 2;">
<li>MCP servers, function calling</li>
<li>Voice matching, multi-agent</li>
<li>Content generation pipelines</li>
<li>Visual content, video</li>
</ul>
<p style="margin-top: 15px; color: #666;">Now you help them <strong>take it to the next level</strong></p>
</div>

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 20px; text-align: center;">
← <strong>TODAY: The pivot point</strong> →
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

## Today's Periodic Table Focus

<div style="font-size: 20px; margin: 20px 0; text-align: center;">

**New element today:** Function Calling (Fc)

</div>

<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; max-width: 700px; margin: 30px auto; font-size: 14px; text-align: center;">

<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Pr</strong><br>Prompts</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Lg</strong><br>LLMs</div>
<div style="background: #fef3c7; padding: 10px; border-radius: 8px; border: 3px solid #f59e0b;"><strong>Fc</strong><br>Function<br>Calling</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Vx</strong><br>Vector DBs</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Rg</strong><br>RAG</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Fw</strong><br>Frameworks</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Th</strong><br>Themes</div>

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Fc is the bridge — it lets the LLM <strong>take action</strong>, not just generate text
</div>

Note:
Pull up the Miro periodic table. Highlight the elements in play today: Pr (we're still prompting), Lg (LLM is still the brain), Fc (NEW — function calling is the mechanism that makes MCP work), Vx (Qdrant), Rg (RAG pipeline), Fw (N8N framework), Th (content themes from audit). The big addition is Fc — function calling. Until now, the AI could only READ and GENERATE. With function calling, it can DO things — call APIs, write to databases, search external systems. "This is the difference between an assistant that talks and an assistant that acts."

---

## What Are Content Pillars?

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

A **content pillar** is a longform, dense, cornerstone piece of content around a single topic.

- Thoroughly researched with real sources
- Covers the topic in depth — not a quick blog post
- Becomes the **foundation** for everything else you produce

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Think of it as the <strong>master document</strong> — the one piece you research deeply so you never have to start from scratch again
</div>

Note:
Explain the concept before they build anything. A content pillar is NOT a blog post. It's a comprehensive, well-sourced document that covers a topic in depth. The reason we invest time in this is because it becomes the raw material for EVERYTHING else. Without a pillar, every piece of content you create starts from zero. With a pillar, you've already done the research — now you're just reformatting it for different platforms and audiences. "Think about it this way: would you rather research the same topic 12 times for 12 different posts, or research it once and repurpose it 12 ways?"

---

## The Content Pillar Strategy

<div style="text-align: center; margin: 20px 0;">
<img src="assets/pillar-content-spinoffs.svg" alt="Pillar Content breaks into multiple formats" style="max-width: 90%; height: auto;">
</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
This is the production pipeline for the rest of the semester
</div>

Note:
Walk through the diagram. One pillar becomes dozens of pieces across every platform. A 2,000-word pillar on "Assisted Living Activity Programs" becomes: a Reel showing a day in the life, an Instagram carousel with 5 key stats, a LinkedIn post for industry professionals, a podcast episode diving deeper, a blog post summarizing the highlights, a YouTube script for a walkthrough video. The math: if each team produces 30 pillars and each pillar generates even 5 pieces of derivative content, that's 150 pieces of content. THAT is what your partner needs. This is the production pipeline for the rest of the semester — today you build the foundation.

---

## Why Tools Change Everything

<div style="text-align: center; margin: 20px 0;">
<img src="assets/mcp-without-vs-with.svg" alt="Without Tools vs With MCP Tools" style="max-width: 90%; height: auto;">
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>MCP = Model Context Protocol</strong><br>
A standard way for AI to talk to external tools
</div>

Note:
Walk through the diagram. LEFT: Without tools, the AI can only generate text. Ask it to update a database? "I can't do that." It has no hands, no connection to the outside world. RIGHT: With MCP tools, the AI can call functions. It decides "I need to update a database," calls a tool via the MCP server, the tool executes the action, and the AI reports back "Done!" This is function calling (Fc) in action — the AI decides WHEN to call a tool and WHAT to pass it. The key insight: MCP is NOT the same as RAG. RAG retrieves context to help the AI answer better. MCP gives the AI the ability to take actions — read, write, search, create. Today you're giving your LibreChat both: RAG (Qdrant search) AND tool use (Baserow read/write).

---

## The Architecture

<div style="text-align: center; margin: 20px 0;">
<img src="assets/mcp-librechat-connect.svg" alt="LibreChat connected to MCP Servers" style="max-width: 90%; height: auto;">
</div>

Note:
Walk through the diagram. LibreChat connects to two MCP server triggers hosted in n8n. Trigger 1 gives LibreChat access to Baserow — GET Themes, GET Pillars, and CREATE Pillar. Trigger 2 gives it access to Qdrant semantic search. LibreChat also has built-in web search — so three data sources total. The key: LibreChat decides WHEN to call each tool based on your prompt. You don't have to tell it which tool to use — it figures it out.

---

## Full Example

<div style="font-size: 18px; line-height: 1.6; margin: 20px 0;">

**The end-to-end flow:**

1. Build MCP workflow in n8n with two triggers
2. Activate the workflow → copy the production URLs
3. Add both MCP server URLs to LibreChat
4. Ask LibreChat: *"What themes did we find in our audit?"*
5. Ask: *"Search our partner's content about [theme]"*
6. Ask: *"Based on gaps, suggest 5 pillar topics and store them"*

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
LibreChat decides <strong>which tool to call</strong> based on your prompt
</div>

Note:
Walk through the flow top to bottom. Don't demo this live — show the roadmap and let them figure it out. The assignment has step-by-step instructions. Key points: they build the n8n workflow, activate it, copy the production URL, paste it into LibreChat's MCP config. Then they can talk to LibreChat and it will call the right tool automatically. "You don't tell it which tool to use. You just ask a question and it figures out whether it needs Baserow, Qdrant, or the web."

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

Note:
Everyone creates this table in their team Baserow database. The MCP server will write to it — LibreChat will store generated topics directly here. The Approved checkbox is the human QC step — they'll review topics and check the ones they want to keep. Audio URL and Transcript fields are for Thursday's NotebookLM work.

---

## Step 2: Build Your MCP Workflow

<div style="text-align: center; margin: 20px 0;">
<img src="assets/mcp-create-tools.svg" alt="n8n MCP Server Tools" style="max-width: 90%; height: auto;">
</div>

Note:
Students build this in n8n with their own credentials. Two MCP Server Trigger nodes. Trigger 1 connects to three Baserow tool nodes (GET Themes, GET Pillars, CREATE Pillar). Trigger 2 connects to a Qdrant Vector Store tool node with an OpenAI Embedding node. They'll need their Baserow table IDs and Qdrant collection name.

Common issues:
- Can't find table IDs → URL bar in Baserow or API docs page
- MCP tools don't appear in LibreChat → Is the workflow active? May need to refresh LibreChat
- Qdrant search returns nothing → Verify collection name matches exactly

---

## Step 3: Connect LibreChat

<div style="text-align: center; margin: 20px 0;">
<img src="assets/mcp-librechat-connect.svg" alt="Connect LibreChat to MCP Servers" style="max-width: 90%; height: auto;">
</div>

Note:
Copy the production URLs from each n8n MCP trigger and paste them into LibreChat's MCP server configuration. Test both: ask LibreChat about your themes (should call Baserow) and search partner content (should call Qdrant). Both tools must work before they start generating topics.

---

## Step 4: Generate 30+ Pillar Topics

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Use LibreChat with your MCP tools to:

1. Review your themes and audit data
2. Research competitors via web search
3. Identify content gaps
4. Generate and store pillar topics in Baserow

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Review every topic.</strong> Does it match what you and your partner know about the business?<br>
The AI doesn't know your partner — you do.
</div>

Note:
This is where they start working. The AI will use all three data sources — Baserow, Qdrant, and web search. Let it work. May take a few rounds of conversation. If topics feel generic, push it: "These are too broad. Look at my audit data again — what specific gaps did we identify? Give me topics that fill THOSE gaps." They should aim for 30+ topics but the quality matters more than quantity.

---

## Let's Get to Work

<div style="font-size: 22px; line-height: 2; margin: 40px 0; text-align: center;">

**Assignment is in D2L — download it now.**

Minimum for Thursday: **5 approved content pillars** in Baserow

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>Next client deliverable:</strong> Your complete content pillars list, exported from Baserow to a Google Sheet and shared with your partner for review.<br>
<strong>Deadline: Tuesday, March 17.</strong> I'm reaching out to all partners Thursday to update them on what's coming.
</div>

Note:
They should download the assignment from D2L now and start working. Circulate and help with setup issues. The assignment walks through everything step by step. The minimum bar for Thursday is 5 approved content pillars with verified sources. More is better, but 5 solid ones beats 30 garbage ones. The bigger picture: by next Tuesday, the complete list of content pillars needs to be exported from Baserow into a Google Sheet and shared with their partner for review. This is the next client-facing deliverable. "I'm calling all your partners on Thursday to give them a status update and let them know what's coming. By Tuesday, they should have your content pillar list in their inbox. This is the roadmap for everything you'll produce for them the rest of the semester."

---

## Thursday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Thursday: Intro to Multimodal AI**

- Starting with [NotebookLM](https://notebooklm.google.com/)
- Bring at least 5 approved content pillars
- We'll turn your research into audio content

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 19px; text-align: center;">
<strong>Before Thursday:</strong> Make sure you have a Google account set up.<br>
MSU provides free access. Go to <a href="https://notebooklm.google.com/">notebooklm.google.com</a> and verify you can log in.
</div>

Note:
Thursday is the intro to multimodal AI — moving beyond text. NotebookLM is the starting point: it takes source material and generates audio overviews, summaries, and study guides. They'll feed their approved content pillars and sources into NotebookLM. Make sure everyone knows they need a Google account — MSU provides free Google Workspace accounts. They should go to notebooklm.google.com BEFORE Thursday and make sure they can log in. Don't wait until class to discover login issues.
