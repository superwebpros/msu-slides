## Today's Agenda

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 20px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 1: Where We're Going</h4>
<ul style="line-height: 1.8;">
<li>Baserow end-state demo</li>
<li>Medilodge shares progress</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 2: Build Time</h4>
<ul style="line-height: 1.8;">
<li>Finish Workflows 1 & 2</li>
<li>I'm here to help</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 3: Before You Leave</h4>
<ul style="line-height: 1.8;">
<li>Email your business partner</li>
<li>CC me on the email</li>
</ul>
</div>

</div>

Note:
Thin deck today. Most of class is work time. Only one team (Medilodge) got close to topic extraction — the rest need focused build time. Start with the Baserow demo that didn't work Tuesday, then Medilodge presents, then teams work. Non-negotiable before leaving: partner meeting email sent.

---

## Reminder: The Pipeline

<div style="font-size: 20px; margin: 20px 0;">

```
 sitemap (you have this)
       │
       ▼
 ┌─────────────┐
 │ Workflow 1   │  Extract 3 topics per page
 └──────┬──────┘
        ▼
 Topics
        │
        ▼
 ┌─────────────┐
 │ Workflow 2   │  Cluster into ~10 themes
 └──────┬──────┘
        ▼
 Content Themes
        │
        ▼
 ┌─────────────┐
 │ Workflow 3   │  Similarity search (next week)
 └──────┬──────┘
        ▼
 Theme Analysis → Insights for your partner
```

</div>

Note:
Quick refresher from Tuesday. Three workflows, four Baserow tables. Today's focus: Workflows 1 and 2. Workflow 3 comes next week. If anyone finished 1 and 2 early, they can start looking at Workflow 3 — we'll have a contingency deck ready.

---

## Demo: Completed Baserow Tables

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

**Screenshare: The end state you're building toward**

</div>

Note:
THIS IS THE DEMO THAT DIDN'T WORK TUESDAY. It's working now.

Show each table in sequence:

TABLE 1 - sitemap: "You all have this. URLs, titles, content from your partner's site."

TABLE 2 - Topics: "This is what Workflow 1 produces. See the mess? AI, Artificial Intelligence, AI Systems — all related but granular. That's intentional. 10 pages × 3 topics = ~30 rows."

TABLE 3 - themes: "Workflow 2 takes that mess and clusters it. 30+ raw topics become ~10 clean themes with descriptions. 'AI & Machine Learning' instead of 5 separate variations."

TABLE 4 - Theme Analysis: "Workflow 3 maps themes to pages with relevance scores. This is what powers your partner report — 'Here's what you cover well, here are gaps.'"

"Medilodge is closest to this. Let's see where they are."

---

## Medilodge: Show Us Your Work

Zoom link in D2L

Note:
Have Medilodge screenshare via Zoom. Questions to ask:
- "Show us your Baserow tables — what do you have so far?"
- "Walk us through your Workflow 1 — what does each node do?"
- "What's in your Topics table? How many rows?"
- "What worked? What tripped you up?"

After Medilodge presents, ask the class:
- "What's similar to what you're trying to do?"
- "Anyone have questions about what they saw?"

This is peer learning — Medilodge's progress helps everyone see what 'done' looks like.

---

## Build Time

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**Focus: Get Workflows 1 & 2 running**

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 19px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Workflow 1: Extract Topics</h4>
<ul style="line-height: 1.8;">
<li>Loop through sitemap pages</li>
<li>Information Extractor → 3 topics</li>
<li>Split Out → store in Topics</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Workflow 2: Cluster Themes</h4>
<ul style="line-height: 1.8;">
<li>Get all raw topics</li>
<li>Aggregate into one list</li>
<li>Information Extractor → ~10 themes</li>
</ul>
</div>

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 18px; text-align: center;">
Test after every 2-3 nodes. Don't build the whole thing and then run it.
</div>

Note:
Circulate and help. Common issues to watch for:
- Loop not configured (batch size should be 1)
- Information Extractor schema mismatch (JSON example must match what you want back)
- Split Out field name wrong (must match the key in the JSON schema)
- Baserow field mapping errors (field IDs vs field names)
- Expression syntax: {{ $json.fieldName }} for current node, $('Node Name').item.json.field for loop references

If a team is stuck, sit with them and trace data node by node. Click each node after execution, look at the output. "What went in? What came out? Is that what you expected?"

If any team finishes both workflows early, point them to the Workflow 3 contingency slides or have them help other teams.

---

## Before You Leave: Email Your Partner

<div style="font-size: 22px; line-height: 1.8; margin: 30px 0;">

**Send before you close your laptop today:**

- Schedule a Zoom with your business partner
- Target: **end of next week or beginning of the following**
- Purpose: Walk through your theme analysis, get feedback
- **CC me:** jflores@msu.edu

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>This email must go out today.</strong> I'll be checking.
</div>

Note:
This is the hard gate for today. No one leaves without sending this email. The partner meeting is what makes all this technical work meaningful — without it, they're just building workflows into a void. CC me so I can verify every team sent it and follow up if partners don't respond. If students need help with wording, something like: "Hi [name], we've been analyzing your website content using AI tools and have some interesting findings about your content themes and coverage. Could we schedule a 30-minute Zoom call [propose 2-3 times] to walk you through what we found and get your input? Thanks, [team name]"

---

## Thursday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Come to class with Workflows 1 & 2 done**

- `Topics` table populated
- `Content Themes` table with ~10 entries

**Tuesday we'll tackle:**
- Workflow 3 (similarity search)
- Analyzing your coverage data
- Preparing for partner meetings

</div>

Note:
Set clear expectations. If they don't finish today, they need to finish before Tuesday. Tuesday's session depends on having topics and themes to work with. Slack channel is open for questions over the weekend. Encourage them to help each other — if one team figures something out, share it.
