## Today's Agenda

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 20px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 1: Build the Report</h4>
<ul style="line-height: 1.8;">
<li>Export Baserow data</li>
<li>Use AI to analyze + draft</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 2: Practice + Eval</h4>
<ul style="line-height: 1.8;">
<li>Mock interview with Inez</li>
<li>Self & team evals with Eve</li>
</ul>
</div>

</div>

Note:
Four things happening today: (1) Export data and use AI to draft the partner report, (2) Practice the partner conversation with the Inez mock interview agent, (3) Complete self and team evaluations with Eve, (4) Logistics — report due EOD Friday, invite me to partner meetings. This is an AI class — they should be using AI to analyze data and draft the report, not writing everything by hand.

---

## WF3 Status Check

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**Show of hands:**

Who has their `Theme Analysis` table populated?

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
If not: import the WF3 solution from D2L and run it now.<br>
<strong>Can't build a report without data.</strong>
</div>

Note:
5 minutes max on this. If anyone doesn't have data, help them import and run the solution immediately. We cannot spend today building workflows — today is about interpreting results and building the deliverable. Non-negotiable: everyone needs all 4 tables populated before we move on.

---

## Quick Fix: Check Your Embeddings

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Some of you embedded **only the theme name** when searching Qdrant.

You should be embedding **theme name + description**.

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 17px;">

<div style="background: #fee2e2; padding: 15px; border-radius: 10px;">
<strong>Too vague:</strong><br>
<code>"AI Ethics"</code><br>
<span style="color: #666;">2 words → blurry vector → weak matches</span>
</div>

<div style="background: #dcfce7; padding: 15px; border-radius: 10px;">
<strong>Much better:</strong><br>
<code>"AI Ethics & Governance. Ethical considerations and responsible AI practices including bias, fairness, and transparency"</code><br>
<span style="color: #666;">Rich text → precise vector → accurate matches</span>
</div>

</div>

Note:
Same principle as chunking: more specific text = more accurate embedding = better search results. "AI Ethics" as 2 words gives the embedding model almost nothing to work with — the vector points in a vague direction. Adding the description gives it real semantic content to encode. If your scores seem off or everything looks the same, this might be why. Check your Edit Fields node in WF3 — it should combine theme name AND description before sending to OpenAI. If you only used the name, re-run with both and compare the difference.

---

## This Is an AI Class

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

You built an AI pipeline to analyze content.

Now **use AI** to interpret the results and write the report.

</div>

<div style="font-size: 18px; margin: 20px 0;">

```
Baserow data (export)
       ↓
LibreChat (Claude or Groq)
       ↓
Upload data + analysis prompts
       ↓
AI drafts report sections
       ↓
You review, edit, add context
       ↓
Professional report
```

</div>

Note:
Frame this clearly: "The skill here isn't writing — it's directing AI to produce something useful." What AI does well: calculating metrics, categorizing themes, drafting summaries, suggesting discussion questions. What YOU still need to do: add business context (you know the partner, AI doesn't), verify accuracy against your data, craft questions that matter for YOUR partner, make it sound like your team. This is the workflow for the rest of the semester — AI as a drafting partner, not a replacement.

---

## Step 1: Export Your Data

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

Export three tables from Baserow (CSV or copy/paste):

1. **Theme Analysis** — scores and mappings
2. **Content Themes** — theme names + descriptions
3. **Sitemap** — page titles + URLs

Upload all three to a LibreChat conversation

</div>

Note:
Demo this on screen. Open Baserow, select all rows in Theme Analysis, export as CSV (or just copy the table). Repeat for Content Themes and Sitemap. Open LibreChat, start a new conversation, paste the data. The AI needs all three tables: Theme Analysis has the scores, Content Themes has the descriptions, Sitemap has the page info. Show them how to do this — it takes 2 minutes.

---

## Step 2: Run the Analysis Prompt

<div style="font-size: 17px; margin: 20px 0;">

Paste this into LibreChat with your data:

</div>

<div style="font-size: 15px; margin: 10px 0;">

```
I have data from a semantic content analysis. Three tables:
1. THEMES - content themes we identified
2. THEME_COVERAGE - similarity scores (0-1, higher = more relevant)
3. SITEMAP - the pages we analyzed

Please:
- Calculate avg relevance score per theme
- Count pages scoring above 0.5 per theme
- Categorize each theme as Strong/Moderate/Weak/Gap
- Identify top 3 strongest and top 3 weakest themes
```

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 10px 0; font-size: 18px; text-align: center;">
Full prompt list is on the handout
</div>

Note:
Run this live on screen with your own data. Show the AI response: "See how fast that was? Metrics calculated, themes categorized." Then: "But does this match what YOU see in Baserow? Verify it." The thresholds (0.55 strong, 0.40 moderate, etc.) are starting points — adjust based on their data. The handout has follow-up prompts for each report section: executive summary, coverage analysis, top themes deep dive, content opportunities, discussion questions.

---

## The Report Sections

<div style="font-size: 19px; margin: 20px 0;">

| Section | What It Covers |
|---------|---------------|
| **Executive Summary** | 3-4 sentences: what we analyzed, what we found, what we want to discuss |
| **Coverage Analysis** | Strong/Moderate/Weak/Gap themes with metrics |
| **Top 5 Themes** | Strongest themes with page examples |
| **Content Opportunities** | Gaps and weak areas worth discussing |
| **Discussion Questions** | Open-ended questions for the partner meeting |

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Use the follow-up prompts on the handout to draft each section
</div>

Note:
Walk through quickly. The handout has specific prompts for each section. Key framing for the discussion questions: "We noticed..." not "You should..." — "What do you think?" not "Our recommendation is..." — "Help us understand..." not "The data shows you're wrong..." This report is a conversation starter, not a prescription. The partner meeting is where the real value happens.

---

## Team Time: Draft Your Report

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**25 minutes**

Export data → upload to LibreChat → run prompts → review output → assemble into Google Doc

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; font-size: 18px;">

<div>
<h4 style="color: #16a34a;">Do:</h4>
<ul style="line-height: 1.8;">
<li>Use AI to draft every section</li>
<li>Verify output against your actual data</li>
<li>Add partner-specific context</li>
</ul>
</div>

<div>
<h4 style="color: #dc2626;">Don't:</h4>
<ul style="line-height: 1.8;">
<li>Write everything from scratch manually</li>
<li>Copy-paste AI output without reviewing</li>
<li>Use generic discussion questions</li>
</ul>
</div>

</div>

Note:
Circulate and coach. Watch for: Are teams actually using AI, or trying to write everything manually? Push them to use it. Are they verifying AI output against their data? Is the language collaborative, not prescriptive? Are discussion questions specific to their partner (not generic)? If a team is struggling with prompts, sit with them and run one together.

---

## Meet Inez: Your Mock Interview Partner

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Inez** is a shared agent in LibreChat that simulates your business partner.

1. Open the **Inez** agent in LibreChat
2. Paste your report (or key findings)
3. Present your findings like it's the real meeting
4. Inez will push back, ask questions, throw curveballs

</div>

<div style="background: #f3e8ff; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
The report is the easy part. The <strong>conversation</strong> is where the value happens.
</div>

Note:
"Inez will challenge you. She might say 'That's exactly right, we've been meaning to create more content on that.' Or she might say 'Actually, we intentionally don't cover that topic.' Or 'I'm surprised — I thought we had more content on that.' Or 'What do you mean by relevance score?' The goal is to practice before the real meeting so you're not caught off guard." Each team gets 15 minutes with Inez. After the mock interview: copy the share link and submit it to me. I'll review and give coaching feedback on how you handled the interaction.

---

## Team Time: Mock Interview

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**15 minutes with Inez**

Practice presenting one finding + asking a discussion question

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
When done: <strong>copy the share link</strong> and submit to me
</div>

Note:
Walk around and listen. Are they presenting findings clearly without jargon? Are they asking open-ended questions? How do they handle pushback? After this, debrief briefly: "Notice how the conversation goes differently based on their response? That's why this is a discussion, not a presentation. Your report sets the table. The meeting is where the real value happens."

---

## Meet Eve: Self & Team Evaluations

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Eve** walks you through structured evaluations in LibreChat.

**Two separate conversations:**

1. **Self-evaluation** — your contributions, what you learned, what you'd do differently
2. **Team evaluation** — rate each teammate on contribution, collaboration, communication

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; font-size: 18px;">

<div style="background: #dbeafe; padding: 15px; border-radius: 10px;">
<strong>Self-eval:</strong> Share link with me
</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px;">
<strong>Team eval:</strong> Confidential — only I see it
</div>

</div>

Note:
Per syllabus, peer evaluations happen at weeks 5, 10, and 14. This is the first checkpoint. The team evaluation is confidential — be honest. This helps me identify issues early and coach teams. If there's a problem, I'd rather know now than at the end of the semester. Start these in class — they take ~5 minutes each. If you don't finish, complete them by EOD Friday along with the report.

---

## Before You Leave: Deadlines

<div style="font-size: 20px; line-height: 1.6; margin: 20px 0;">

| What | When | How |
|------|------|-----|
| Mock interview (Inez) | Today | Share LibreChat link |
| Self-eval (Eve) | EOD Friday | Share LibreChat link |
| Team eval (Eve) | EOD Friday | Share LibreChat link |
| **Report to Jesse** | **EOD Friday** | Google Doc or PDF |
| Report to partner | 24hrs before meeting | Email |
| Partner meeting | Next week or following | **Invite me (CC on calendar)** |

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 19px; text-align: center;">
<strong>I review reports over the weekend. Feedback back to you Monday.</strong><br>
Finalize based on my feedback BEFORE sending to your partner.
</div>

Note:
Three critical reminders:

1. INVITE ME TO EVERY PARTNER MEETING. "I want to be on every call. CC me on the calendar invite. I won't run the meeting — that's your job. But I want to observe and be available if needed."

2. REPORT DUE EOD FRIDAY. I review over the weekend, return feedback Monday. Finalize based on my feedback BEFORE sending to partner. Send to partner at least 24 hours before the meeting so they come prepared.

3. DON'T SEND THE REPORT COLD. "Don't walk into a meeting and surprise them. Send the report ahead of time. This makes the conversation more productive — they come prepared with reactions."

Also: if you haven't booked your team retrospective with me yet (Calendly link from Tuesday), do it now.

---

## Reggie: Pre-Retrospective Reflection

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Before your team retro with me, complete a **Starfish reflection** with **Reggie** in LibreChat:

- **Keep Doing** — what's working well
- **More Of** — what you want to increase
- **Less Of** — what to dial back
- **Stop Doing** — what isn't helping
- **Start Doing** — what's missing

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Complete before your scheduled retro. Share link with me so I can review before we meet.
</div>

Note:
This is individual, not team. Each person reflects on their own before the group retro. I review the Reggie conversations before the retro so I can identify common themes and have a more productive conversation. The Starfish format keeps it structured and forward-looking. Don't need to do this today — just before their scheduled retro meeting.

---

## What Comes Next

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

1. Partner meeting happens
2. You synthesize their feedback
3. That synthesis becomes your content calendar
4. **Unit 3 starts:** Building actual content based on what you and your partner agreed on

</div>

<div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
Everything you've built leads here — infrastructure → analysis → insights → action
</div>

Note:
Big picture. The semantic analysis pipeline was the foundation. The partner meeting is the turning point. After the meeting, students synthesize what the partner agreed with, pushed back on, and prioritized. That synthesis drives Unit 3: content creation. They'll use the identified themes as pillar content topics, gaps inform what to create, and coverage analysis prioritizes the content calendar. This same pattern repeats: identify need → build system → deliver insights → iterate. That's the course.
