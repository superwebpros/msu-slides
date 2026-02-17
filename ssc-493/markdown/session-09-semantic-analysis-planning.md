## Today's Agenda

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 20px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 1: Debrief</h4>
<ul style="line-height: 1.8;">
<li>Session 8 homework presentations</li>
<li>Baserow → Qdrant: What worked?</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 2: The End State</h4>
<ul style="line-height: 1.8;">
<li>Show completed Baserow tables</li>
<li>Your first real deliverable</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 3: The Plan</h4>
<ul style="line-height: 1.8;">
<li>How we get from here to there</li>
<li>Teams start working</li>
</ul>
</div>

</div>

Note:
Lean deck again. Part 1 is via Zoom — have students screenshare and walk through their Baserow → Qdrant workflow. Part 2 is your demo of the completed 4-table Baserow database. Part 3 is pseudo-code walkthrough of the 3-workflow pipeline, then teams start working on Workflows 1-2.

---

## Session 8 Debrief

Zoom link in D2L

Note:
Same format as Session 8 debrief. Have 2-3 groups screenshare their Baserow → Qdrant workflow. Questions to ask each group:
- "Show me your Baserow table — how many pages did you index?"
- "Walk me through your workflow — what does each node do?"
- "Show me the chat workflow — can you ask it a question about your partner's content?"
- "What was the hardest part?"

Quick show of hands after presentations:
- "Who has all their content indexed in Qdrant?"
- "Who can successfully chat with their data?"
- "Any teams still troubleshooting? We'll help after class."

Bridge: "Good. You built the infrastructure. Now let's use it to generate business insights."

---

## You Built Infrastructure

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**What you have now:**

Partner content → Baserow sitemap → Qdrant vectors

**What we need:**

Actionable insights for your business partner

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>This week's deliverable:</strong> Your first real client output
</div>

Note:
Transition slide. Acknowledge the work they've done — indexing content is real infrastructure. But infrastructure alone isn't valuable to partners. Partners need insights: What topics do we cover? Where are the gaps? What should we create next? That's what this unit is about. Sessions 9-12 build toward a Semantic Content Audit Report — first formal deliverable to business partners.

---

## The End State: Four Tables

<div style="font-size: 22px; margin: 30px 0;">

| Table | What It Holds | How It's Made |
|-------|--------------|---------------|
| `Sitemap` | Your partner's pages | ✅ You have this |
| `Topics` | Topics from each page | Workflow 1 |
| `Content Themes` | Grouped/clustered themes | Workflow 2 |
| `Theme Analysis` | Which pages cover which themes | Workflow 3 |

</div>

Note:
Overview slide before the live demo. Point to each table and explain the progression. Then switch to screenshare and show the actual Baserow database.

---

## Live Demo: Completed Baserow

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

**Screenshare: Walk through all 4 tables**

</div>

Note:
DEMO SEQUENCE — Show each table in Baserow:

TABLE 1 - sitemap (they already have this):
- "This is what you created in Session 8"
- URL, Page Title, Page Description, Page Content
- Point out: ~10-20 rows depending on partner

TABLE 2 - Topics (show the "mess"):
- "This is what Workflow 1 creates"
- Scroll through, point out patterns: "AI, Artificial Intelligence, AI Systems, Machine Learning, ML"
- "All related but granular and repetitive"
- "10 pages × 3 topics = 30+ entries. Messy on purpose — we want ALL topics before we clean."

TABLE 3 - themes (show the "clarity"):
- "This is what Workflow 2 creates"
- 10-15 rows, much cleaner
- "See how it grouped AI, Artificial Intelligence, ML → 'AI & Machine Learning'"
- "Took 30+ raw topics, consolidated into ~10 themes with descriptions"

TABLE 4 - Theme Analysis (show the "insights"):
- "This is what Workflow 3 creates"
- "For each theme, which pages talk about it? How relevant?"
- Key columns: Theme name, Source ID, Relevance Score (0-1)
- "This answers: What do we cover well? Where are the gaps?"

KEY QUESTION: "How do we get from what YOU have (Table 1) to what I'm showing you (Table 4)?"

---

## Working Backwards

<div style="font-size: 20px; margin: 20px 0;">

```
 ┌─────────────────────────────────┐
 │  Theme Analysis                 │
 │  "Which pages cover each theme" │  ← Workflow 3
 └────────────────┬────────────────┘
                  │
 ┌────────────────┴────────────────┐
 │  themes                         │
 │  "What are the main themes?"    │  ← Workflow 2
 └────────────────┬────────────────┘
                  │
 ┌────────────────┴────────────────┐
 │  Topics                         │
 │  "What topics exist?"           │  ← Workflow 1
 └────────────────┬────────────────┘
                  │
 ┌────────────────┴────────────────┐
 │  sitemap + Qdrant               │
 │  ✅ You have this               │
 └─────────────────────────────────┘
```

</div>

Note:
Draw this on whiteboard or use this slide. Work backwards from the end state. "We want theme coverage. To get that, we need themes. To get themes, we need raw topics. To get raw topics, we process what you already have." This is the ETL pattern: Extract → Transform → Load. Industry-standard data engineering. Each stage has one job, and we can inspect the data at each step.

---

## New N8N Tools We Need

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 19px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Control Structures</h4>
<ul style="line-height: 2;">
<li><strong>Loop</strong> (Split In Batches)</li>
<li><strong>Aggregate</strong></li>
<li><strong>Split Out</strong></li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">AI Node</h4>
<ul style="line-height: 2;">
<li><strong>Information Extractor</strong></li>
<li>Your first official AI node</li>
<li>Forces structured JSON output from LLMs</li>
</ul>
</div>

</div>

Note:
Before we walk through the workflows, we need to learn 4 new N8N building blocks. Three are control structures that manage data flow. One is an AI node that talks to LLMs. These are the tools that make multi-stage pipelines possible.

---

## Loop (Split In Batches)

<div style="font-size: 20px; margin: 20px 0;">

**What it does:** Processes items one at a time, then loops back for the next

**When to use it:** When each item needs independent processing

</div>

<div style="font-size: 18px; margin: 20px 0;">

```
[10 pages] → Loop Node → Process page 1 → Store result
                 ↑                              │
                 └──────── next item ────────────┘

             ... repeats for pages 2, 3, 4 ... 10
```

</div>

<div style="background: #e0f2fe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
"I have 10 things. Do the same work on each one, one at a time."
</div>

Note:
This is the Split In Batches node in N8N. Set batch size to 1. It takes an array of items, pulls one out, sends it down the workflow, then loops back to get the next one. Prevents memory overload — can safely process hundreds of items. We use this in Workflows 1 and 3. Key question: "What happens if we don't loop?" Answer: "Only process one item." Show in N8N if time: execution log shows "Processing item 1 of 10" → "Processing item 2 of 10" etc.

---

## Aggregate Node

<div style="font-size: 20px; margin: 20px 0;">

**What it does:** Combines many separate items into one item with an array

**When to use it:** When you need to see ALL items together before processing

</div>

<div style="font-size: 18px; margin: 20px 0;">

```
BEFORE:                          AFTER:
  Item 1: {topic: "AI Ethics"}     Item 1: {topics: [
  Item 2: {topic: "Healthcare"}               "AI Ethics",
  Item 3: {topic: "Privacy"}                  "Healthcare",
  ... (30 separate items)                     "Privacy",
                                              ... (array of 30)
                                            ]}
```

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
"I have 30 separate things. Combine them into one list so I can see the full picture."
</div>

Note:
This is the opposite problem from looping. Sometimes you NEED everything in one place. Clustering is the perfect example — the LLM can't group topics into themes if it only sees 3 at a time. It needs to see all 30 to find patterns. We use this in Workflow 2. Aggregate takes 30 separate N8N items and creates 1 item with an array field containing all 30 values.

---

## Split Out Node

<div style="font-size: 20px; margin: 20px 0;">

**What it does:** Takes one item with an array and creates separate items from it

**When to use it:** When a node returns an array but you need individual items

</div>

<div style="font-size: 18px; margin: 20px 0;">

```
BEFORE:                              AFTER:
  Item 1: {topics: [                   Item 1: {topics: "AI Ethics"}
    "AI Ethics",                       Item 2: {topics: "Healthcare"}
    "Healthcare",                      Item 3: {topics: "Privacy"}
    "Privacy"
  ]}
```

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
"The LLM gave me one response with 3 items inside. Break them apart so each becomes its own row."
</div>

Note:
Split Out is the opposite of Aggregate. We need it because the Information Extractor returns ONE item with an array (e.g., 3 topics). But Baserow's "Create Row" node processes one item at a time. Split Out breaks the array into 3 separate items → 3 separate Baserow rows. Think of it as "unpack the array."

---

## Information Extractor (AI Node)

<div style="font-size: 20px; margin: 20px 0;">

**The problem:** LLMs are chatty — ask for 3 topics, might get a paragraph

**The solution:** Force structured JSON output with a schema

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; font-size: 17px;">

<div>
<h4 style="margin-bottom: 10px;">You define the shape:</h4>

```json
{
  "topics": [
    "Topic 1",
    "Topic 2",
    "Topic 3"
  ]
}
```

</div>

<div>
<h4 style="margin-bottom: 10px;">LLM always returns that shape:</h4>

```json
{
  "topics": [
    "AI Ethics",
    "Healthcare AI",
    "Data Privacy"
  ]
}
```

</div>

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Your first <strong>AI node</strong> — give it a JSON example + system prompt, connect an LLM, get structured data back
</div>

Note:
This is the Information Extractor node — their first official AI node in N8N. Three things to configure:
1. TEXT INPUT: The content to analyze (page content, topic list, etc.)
2. JSON SCHEMA: An example of what you want back — the LLM will match this shape exactly
3. SYSTEM PROMPT: Instructions for the LLM ("Extract 3 topics" or "Group into 10 themes")

Then you connect an LLM model (Haiku for simple extraction, Sonnet for complex reasoning like clustering).

The key insight: "No parsing errors, no surprises. You KNOW you'll get an array of strings back." This is what makes the pipeline reliable — structured output instead of free-form text.

Show in N8N: the node has a "Schema Type" dropdown → choose "From JSON" → paste your example. The system prompt goes in Options. The text input uses an expression like {{ $json.content }}.

---

## When to Use What

<div style="font-size: 20px; margin: 30px 0;">

| Node | Pattern | Use When... |
|------|---------|-------------|
| **Loop** | One at a time | Each item needs independent processing |
| **Aggregate** | Many → one | You need the full picture before processing |
| **Split Out** | One → many | A node returned an array you need to unpack |
| **Info Extractor** | Text → JSON | You need structured data from an LLM |

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
These four tools are all you need to build the entire pipeline
</div>

Note:
Summary slide. These are the building blocks. Everything in Workflows 1-3 is built from these four tools plus Baserow read/write nodes they already know. Ask: "Can someone tell me — in Workflow 1, which of these do we use?" Expected: Loop (process each page), Information Extractor (get topics from LLM), Split Out (unpack the topics array). "And Workflow 2?" Expected: Aggregate (combine all topics), Information Extractor (cluster into themes). Confirming they see how the tools map to the plan.

---

## Workflow 1: Extract Topics

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**For each page in your sitemap:**

1. Get page content from Baserow
2. Ask LLM: "What 3 topics does this page cover?"
3. LLM returns: `["AI Ethics", "Healthcare AI", "Data Privacy"]`
4. Store each topic as a row in `Topics`
5. Move to next page, repeat

</div>

Note:
Pseudo-code walkthrough. Don't show N8N yet — just the logic. "What happens if we don't loop? Only get topics from one page." This is the Split In Batches node — processes items one at a time, loops back. The LLM (Haiku — fast and cheap) returns structured JSON via Information Extractor. Each topic becomes a separate Baserow row using Split Out node. 10 pages × 3 topics = ~30 rows in Topics. Uses: Loop, Information Extractor, Split Out.

---

## Workflow 2: Cluster Themes

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Take ALL raw topics at once:**

1. Get all topics from `Topics` table
2. Aggregate into one list: `["AI Ethics", "Healthcare AI", "Ethics in AI", "Data Privacy", ...]`
3. Ask LLM: "Group these 30 topics into ~10 themes"
4. LLM returns themed clusters with descriptions
5. Store each theme in `Content Themes` table

</div>

Note:
"Why not loop here? Because the LLM needs to see the full picture to find patterns. Can't cluster 3 topics at a time." This is the Aggregate node — combines many items into one array. Then process that array with a stronger model (Sonnet, not Haiku — clustering requires more reasoning). Output: 10-15 clean themes with descriptions. Uses: Aggregate, Information Extractor, Split Out.

---

## Workflow 3: Map Coverage

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**For each theme:**

1. Get theme name + description
2. Convert to embedding (vector)
3. Search Qdrant: "Find pages similar to this theme"
4. Qdrant returns pages with similarity scores (0-1)
5. Store mappings in `Theme Analysis`
6. Move to next theme, repeat

</div>

Note:
"This connects your Session 8 work! You indexed content in Qdrant with embeddings. Now we query it with theme embeddings to find matches." This is where embeddings + vector search become actionable. A score of 0.7+ = strong coverage. 0.4-0.7 = moderate. Below 0.4 = gap. We'll build this one in Session 11. For now, just understand the pattern. Uses: Loop, Embeddings, Qdrant search.

---

## The Pattern: ETL

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 40px 0; font-size: 20px;">

<div style="text-align: center;">
<h4 style="color: #0369a1; margin-bottom: 15px;">Extract</h4>
<p>Pull topics from each page</p>
<p style="color: #666; font-size: 16px;">Workflow 1</p>
<p style="color: #666; font-size: 16px;">Control: Loop</p>
</div>

<div style="text-align: center;">
<h4 style="color: #0369a1; margin-bottom: 15px;">Transform</h4>
<p>Cluster topics into themes</p>
<p style="color: #666; font-size: 16px;">Workflow 2</p>
<p style="color: #666; font-size: 16px;">Control: Aggregate</p>
</div>

<div style="text-align: center;">
<h4 style="color: #0369a1; margin-bottom: 15px;">Load</h4>
<p>Map themes to pages</p>
<p style="color: #666; font-size: 16px;">Workflow 3</p>
<p style="color: #666; font-size: 16px;">Control: Loop</p>
</div>

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>ETL:</strong> Extract → Transform → Load — data engineering 101
</div>

Note:
Synthesis slide. "Notice the pattern? This is ETL — the same pattern used in every data pipeline at every company." Loop when processing items independently. Aggregate when you need the full picture. This is a transferable skill — not just for this class. Students who understand ETL understand how real AI/ML pipelines work.

---

## Your Assignment

<div style="font-size: 22px; line-height: 2; margin: 30px 0;">

**Build Workflows 1 & 2** (Due Thursday)

- **Workflow 1:** Sitemap → Extract topics → `Topics` table
- **Workflow 2:** Topics → Cluster themes → `Content Themes` table

**Success criteria:**
- ✅ `Topics` table populated (~3 × number of pages)
- ✅ `Content Themes` table has 10-15 entries with descriptions
- ✅ Both workflows run without errors

</div>

Note:
Resources will be provided: workflow JSON for reference, sticky notes explaining each node, Baserow table IDs. Test after each step — don't build everything at once. After Workflow 1: open Topics table, verify rows. After Workflow 2: open Content Themes table, verify themes make sense. Use Slack for questions. Start today — don't wait until Wednesday night.

ALSO CRITICAL: Schedule business partner meeting. Email your partner to schedule a content review meeting for week of Feb 23 or March 2. Purpose: present your semantic audit findings. Duration: 30 minutes. This is your deadline — work backwards from it.

---

## Schedule Your Partner Meeting

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**Email your business partner by Thursday**

Propose meeting: Week of Feb 23 or March 2

Purpose: Present semantic audit findings

Duration: 30 minutes

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>This is a real deadline with a real person waiting</strong>
</div>

Note:
This is non-negotiable. Partners are expecting insights. We need 4 sessions to build the pipeline and generate the report. That means the meeting needs to be scheduled now. If students need help drafting the email, offer to help after class or on Slack.

---

## Let's Get Started

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

**Team time: Start Workflows 1-2**

Resources in D2L

Slack channel for questions

</div>

Note:
Circulate and help teams get started. Priority: make sure everyone has their sitemap table populated and Qdrant indexed from Session 8. If not, help them finish that first — can't do Workflows 1-2 without it. Thursday preview: We'll review raw topics and themes together, troubleshoot workflow issues, and introduce Workflow 3.
