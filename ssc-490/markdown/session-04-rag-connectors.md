## Check-In & Housekeeping

<div style="display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: center; max-width: 960px; margin: 25px auto;">
<div style="text-align: left; font-size: 19px; line-height: 1.7;">

<h3>Session 4: RAG &amp; Connectors</h3>
<p>Grab a seat with a partner. Open your laptop, Claude.ai, and your Google Workspace.</p>

<div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 14px 18px; border-radius: 6px; margin: 15px 0;">
<strong style="color: #9d174d;">The Runway to Milestone 1:</strong>
<ul style="margin: 6px 0 0 18px; font-size: 16px; line-height: 1.6;">
<li><strong>Today is the LAST in-person build session before M1 is due.</strong></li>
<li><strong>Next Week:</strong> Jesse is at a conference in Atlanta.</li>
<li><strong>Tue Sep 15:</strong> Guest lecture on AI Ethics + in-class build time.</li>
<li><strong>Thu Sep 17:</strong> Breakout Module 1 (collaborative design debrief).</li>
<li><strong>Mon Sep 21:</strong> Milestone 1 (Career Coach) due in D2L.</li>
</ul>
</div>

</div>
<div style="text-align: center;">
<img src="assets/poll-s05-qr.png" alt="Live Poll QR Code" style="width: 220px; height: 220px; border: 2px solid #cbd5e1; border-radius: 8px; padding: 6px; background: white;">
<div style="font-size: 13px; color: #6b7280; margin-top: 8px;">Live Poll: <strong style="color: #7c3aed;">msu-slides-poll.jesse-41b.workers.dev/s05</strong></div>
</div>
</div>

Note:
Welcome everyone to Session 4. Set the stakes immediately: today is the LAST instructor-present build session before Milestone 1 is due on September 21. Next week has a guest lecture on Tuesday and a Breakout module on Thursday with Jesse away. Today is about giving their system eyes and hands so they are completely unblocked.

---

## The Warm-Up: A Question of Memory

<div style="max-width: 920px; margin: 35px auto; text-align: left; font-size: 22px; line-height: 1.8;">

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<h3 style="color: #5b21b6; margin-top: 0;">Would you rather take a final exam:</h3>
<p style="margin-bottom: 0;">
<strong>Option A:</strong> Purely from memory?<br>
<strong>Option B:</strong> Open-book — where the textbook is 1,000 pages long, but you have an index card with page numbers pointing straight to the answers?
</p>
</div>

<p style="font-size: 19px; color: #6b7280;">
Every student chooses Option B. And that choice is the entire concept of today's class.
</p>

</div>

Note:
Ask this question to the room. Every hand goes up for Option B. Connect it immediately: Standard AI prompting is Option A (taking an exam from fuzzy training memory). Today we give the AI Option B (an open book on its desk with an index card).

;;;

### Connecting the Metaphor to AI

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">

<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 18px; border-radius: 6px;">
<h4 style="color: #991b1b; margin-top: 0;">Closed-Book (Prompting Alone)</h4>
<ul style="font-size: 16px; line-height: 1.6;">
<li>The model answers from its frozen training memory.</li>
<li>Prone to fuzzy guesses, hallucinated facts, and stale data.</li>
<li><strong>Zero provenance:</strong> It cannot point to where the answer came from.</li>
</ul>
</div>

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 18px; border-radius: 6px;">
<h4 style="color: #15803d; margin-top: 0;">Open-Book (RAG / Retrieval)</h4>
<ul style="font-size: 16px; line-height: 1.6;">
<li>The model is given verified documents <em>before</em> answering.</li>
<li>Answers are grounded in facts you chose and control.</li>
<li><strong>100% Provenance:</strong> You can click the exact row or page it cited.</li>
</ul>
</div>

</div>

<div style="background: #eff6ff; padding: 14px 20px; border-radius: 6px; font-size: 17px; color: #1e40af; text-align: center;">
The difference between basic prompting and RAG isn't intelligence — <strong>it is provenance.</strong>
</div>

</div>

;;;

### Quick Skill Check from Tuesday

<div style="max-width: 900px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

On Tuesday, everyone set up a Claude Project and built their first skill (**Resume Tailoring** using the WHO method):

- Who ran their skill against a real job posting after class?
- **What did it get wrong?**

<div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 16px 20px; border-radius: 6px; margin-top: 20px; font-size: 17px;">
<em>The failures are the most interesting answers.</em> If your skill produced something bland, it's a steering constraint issue. If it lacked facts about MSU or your industry, it's a retrieval issue.
</div>

<div style="margin-top: 20px; text-align: center; font-size: 20px; color: #7c3aed; font-weight: bold;">
Right now, your AI knows only what you typed. Today, we give it reach.
</div>

</div>

---

## What RAG Actually Is

### Retrieval-Augmented Generation

<div style="max-width: 960px; margin: 25px auto; text-align: left;">

RAG is a simple 3-step pattern:

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 25px 0;">

<div style="background: #f8fafc; border-top: 4px solid #7c3aed; border-radius: 8px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<strong style="color: #5b21b6; font-size: 18px;">1. You Ask</strong>
<p style="font-size: 15px; color: #334155; margin-top: 8px; line-height: 1.5;">
A specific question enters the system (e.g., <em>"What certifications match an economics major?"</em>).
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #2563eb; border-radius: 8px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<strong style="color: #1e40af; font-size: 18px;">2. System Retrieves</strong>
<p style="font-size: 15px; color: #334155; margin-top: 8px; line-height: 1.5;">
The system searches a trusted external store and pulls out the exact relevant records.
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #16a34a; border-radius: 8px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<strong style="color: #15803d; font-size: 18px;">3. Model Generates</strong>
<p style="font-size: 15px; color: #334155; margin-top: 8px; line-height: 1.5;">
The model answers the question <strong>grounded directly in those retrieved records</strong>.
</p>
</div>

</div>

<div style="background: #ede9fe; padding: 16px 20px; border-radius: 8px; font-size: 18px; color: #5b21b6; text-align: center;">
<strong>RAG is a pattern, not a product.</strong> It is simply fetching the right page before answering.
</div>

</div>

Note:
Walk through the 3 steps. Emphasize that RAG is a pattern. Demystify it: people think RAG requires vector math and embeddings. Clarify on the next slide that a simple database query is 100% RAG.

;;;

### The Big Myth: "RAG Requires Vector Databases"

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

Most people on the internet believe RAG *means* vector databases and mathematical embeddings. That belief is expensive.

- In class today, our retrieval store is a plain **Baserow database table**.
- The retrieval step is a simple filtered query (`WHERE major = 'Economics'`).
- **This is 100% a complete, working RAG system.**

<div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 6px; margin-top: 20px; font-size: 18px;">
💡 <strong>What embeddings buy you later:</strong> Vector search lets you match on <em>conceptual meaning</em> rather than exact keywords (e.g. searching "helping people organize" finds records without those words). That is an <strong>upgrade to the retrieval step</strong>, but the RAG pattern remains identical.
</div>

</div>

;;;

### Connectors = Information (Eyes) vs. Action (Hands)

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

A connector is simply how your AI connects to an external service. Connectors split into two fundamental jobs:

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">

<div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px;">
<h4 style="color: #1e40af; margin-top: 0;">👀 Information (Eyes · Read / RAG)</h4>
<p style="font-size: 15px; color: #1e3a8a; line-height: 1.6;">
Reaching outside to pull verified knowledge <strong>IN</strong>.
</p>
<ul style="font-size: 15px; color: #1e3a8a; margin-top: 8px;">
<li>Baserow (MSU Career Services data)</li>
<li>Archie MCP (Course docs &amp; transcripts)</li>
<li>Google Drive file search</li>
</ul>
</div>

<div style="background: #fdf4ff; border: 2px solid #a855f7; border-radius: 8px; padding: 20px;">
<h4 style="color: #7e22ce; margin-top: 0;">🛠️ Action (Hands · Write / Tools)</h4>
<p style="font-size: 15px; color: #6b21a8; line-height: 1.6;">
Reaching outside to push changes <strong>OUT</strong> into the world.
</p>
<ul style="font-size: 15px; color: #6b21a8; margin-top: 8px;">
<li>Creating a new spreadsheet file</li>
<li>Sending a message in Discord</li>
<li>Writing an application tracker row</li>
</ul>
</div>

</div>

<div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 18px; border-radius: 6px; font-size: 16px; color: #475569; text-align: center;">
Keep this distinction in mind: <strong>RAG is the AI's eyes. Tools are the AI's hands.</strong>
</div>

</div>

---

## RAG #1: The MSU Career Services Database

### Your First Live Worked Example

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

MSU Career Services maintains a curated database of career paths, professional associations, O*NET assessments, and employer resources.

<div style="background: #f8fafc; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 20px 0;">
<strong style="color: #5b21b6; font-size: 18px;">Hands-On Test: Cold vs. Connected</strong>
<ol style="margin: 10px 0 0 20px; font-size: 17px; line-height: 1.7;">
<li><strong>Cold Query (Connector Off):</strong> In a regular chat, ask:  
    <em>"What professional associations serve criminal justice majors in Michigan?"</em></li>
<li><strong>Connected Query (Connector On):</strong> Ask the exact same question with your Career Services connector enabled.</li>
</ol>
</div>

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; font-size: 16px;">
<strong>The Difference:</strong> The cold answer isn't necessarily terrible, but the connected answer cites <strong>specific, vetted resources that MSU licenses for you</strong>.
</div>

</div>

Note:
Have students run this comparison live. Emphasize that MSU pays for proprietary institutional subscriptions (like What Can I Do With This Major) that are accessible to enrolled students. The connector brings that vetted intelligence directly into Claude.

;;;

### Turning Exploration into a Skill

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 18px; line-height: 1.7;">

Running one-off queries in chat is just exploration. To make it part of a real system, we **memorialize the exploration into a reusable skill**:

<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 18px 22px; border-radius: 6px; margin: 15px 0;">
<h4 style="color: #1e40af; margin-top: 0;">The Strategy vs. Execution Boundary</h4>
<p style="font-size: 16px; margin-bottom: 8px;">
When should Claude use the Career Services connector?
</p>
<ul style="font-size: 15px; line-height: 1.6;">
<li><strong>Strategy / Exploration Mode (USE CONNECTOR):</strong> Asking "What roles fit me?", "What certifications am I missing?", "What associations exist for my major?" ➔ <strong>Pull from connector!</strong></li>
<li><strong>Execution Mode (DO NOT USE CONNECTOR):</strong> Tailoring a resume bullet, drafting a cover letter ➔ <strong>Do not touch connector!</strong> (Handled by <code>resume-tailor-who</code> and your own background).</li>
</ul>
</div>

<div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 12px 18px; border-radius: 6px; font-size: 15px; color: #9d174d;">
<strong>Hard Output Rule:</strong> The skill must synthesize across tables and <strong>always return direct clickable URLs inline</strong> — never say "go look in Baserow."
</div>

</div>

;;;

### Live Build: Create `msu-career-strategist`

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 15px; line-height: 1.6;">

In your Career Coach Project, paste this meta-prompt into a chat to build your second skill:

```markdown
"I want to create a skill called 'msu-career-strategist' that uses my MSU Career Services connector.

Rules for this skill:
1. Trigger only when I am exploring career strategy, direction, certifications, or professional associations.
2. Boundary: Do NOT trigger for resume tailoring, cover letter writing, or specific job application drafting.
3. Synthesis: Cross-reference my major and target roles across the available tables rather than dumping raw rows.
4. Hard requirement: Always return the verified resource URLs inline next to each recommendation. Never tell me to check Baserow myself.

Generate the skill instructions for my project."
```

</div>

<div style="font-size: 17px; color: #7c3aed; text-align: center; margin-top: 15px;">
Once Claude generates the skill, paste it into your Project's <strong>Skills</strong> tab!
</div>

;;;

### Hands-On Test: Run Your New Skill Live!

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

Now let's test whether your new skill properly commands the connector:

<div style="background: #f8fafc; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
<strong style="color: #15803d; font-size: 18px;">Open a New Chat in Your Project and Ask:</strong>
<p style="font-size: 18px; font-family: monospace; color: #0f172a; margin: 12px 0 0 0;">
"If I'm majoring in [Your Major], what assessments, certifications, and professional associations should I look into this semester?"
</p>
</div>

**Audit the Output:**
- Did Claude invoke your `msu-career-strategist` skill?
- Did it reach out to the connector?
- Did it give you **clickable links** next to each recommendation?

</div>

---

## RAG #2: Archie (Course Transcripts & Docs)

### The Big Reveal

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

Here is the secret: **you have been using a RAG system all semester without realizing it.**

- **Archie** is an MCP server that retrieves over our course syllabus, slide decks, assignment specs, and **live class transcripts**.
- When you ask Archie a question in Discord, it runs the exact same 3 steps:  
  *Your question ➔ Archie queries transcript store ➔ Answers grounded in what happened in class.*

<div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 18px; margin-top: 20px;">
<strong style="color: #1e40af;">Connect Archie to Claude.ai via Remote MCP:</strong><br>
<div style="font-family: monospace; font-size: 14px; word-break: break-all; margin-top: 8px; color: #1e293b;">
https://archie.jesse-41b.workers.dev/mcp/5208a43589497b3cb8196765db711ebd4659841962ae15fb
</div>
</div>

</div>

Note:
Show students that their career coach has the exact same architecture as Archie. Archie uses MCP to query vector/transcript stores; their project uses MCP to query Baserow. Archie is also their primary lifeline while Jesse is away in Atlanta.

;;;

### Testing Archie Live

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

Once Archie is connected, try asking something that only exists in our room:

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 25px 0;">
<strong>Ask Claude (via Archie):</strong><br>
<em>"What did Jesse say in class on Tuesday about the three tests for a skill?"</em>
</div>

- Watch Claude query the Archie MCP tool.
- Notice how it answers citing the exact discussion from Tuesday's lecture.
- **Archie is your 24/7 TA:** When working on Milestone 1 while Jesse is in Atlanta, ask Archie in Discord or Claude!

</div>

---

## Demo: The Daily Discord Digest in n8n

### First Look at the "Automated" World

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<em>(Watch the live demo — you do not need to build this today)</em>

Here is how our daily course Discord announcement actually works behind the scenes in **n8n**:

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin: 20px 0;">
<div style="font-family: monospace; font-size: 16px; line-height: 1.8;">
1. <strong>Trigger:</strong> Schedule (Runs every morning at 8:00 AM — no human typing)<br>
2. <strong>Retrieve:</strong> Queries course calendar &amp; unread Discord questions<br>
3. <strong>Generate:</strong> Claude writes the daily brief<br>
4. <strong>Deliver:</strong> Posts message directly into the Discord channel
</div>
</div>

<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px; font-size: 17px; color: #991b1b;">
<strong>The Critical Difference:</strong> Notice step 4. <strong>This workflow WRITES.</strong><br>
It can post to Discord because the Discord integration exposes a "send message" action tool. Keep that in mind for what comes next!
</div>

</div>

Note:
10-minute visual walk of the n8n canvas. Show that automation is just RAG on a timer instead of a prompt. And point out that the Discord node has a WRITE tool (send message). This sets up the wall they are about to hit with Google Sheets.

---

## Build the Tracker — And Hit the Wall

### Part 1: Schema Design by Prompting

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 18px; line-height: 1.7;">

Don't guess columns from scratch. Ask Claude to design your job application tracker:

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 16px 20px; border-radius: 8px; margin: 15px 0;">
<strong>Prompt:</strong><br>
<em>"I am applying to 30–50 jobs over the next six months. Design a clean spreadsheet schema for my job application tracker so I know what's live, when to follow up, and what materials I sent."</em>
</div>

<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 6px; margin-top: 15px;">
<strong style="color: #1e40af;">Cross-Table Comparison Beat (5 min):</strong><br>
Compare your columns with your table partner:
<ul style="margin: 6px 0 0 16px; font-size: 15px;">
<li>Which columns did you both include? Which did only one of you include?</li>
<li><strong>Test:</strong> <em>Will you actually fill this in?</em> (A column that takes 10 minutes of manual effort will be abandoned by week 3).</li>
<li><strong>Fixed Stages vs. Free Text:</strong> Why "Interview Round 1" beats messy paragraph notes (you can't filter on prose!).</li>
</ul>
</div>

</div>

;;;

### Part 2: Claude Creates the Sheet

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 19px; line-height: 1.8;">

Now, ask Claude to create the tracker in your Google Drive:

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 20px 0;">
<strong>Prompt:</strong><br>
<em>"Create a new Google Sheet in my Google Drive called 'Job Application Tracker' with these exact columns."</em>
</div>

- Claude calls the Google Drive tool.
- It generates a CSV and uploads it to your Drive.
- Open your Google Drive: **There it is! A working spreadsheet.**

<p style="text-align: center; color: #16a34a; font-weight: bold; font-size: 22px;">
Everything feels magical... until the next prompt.
</p>

</div>

;;;

### Part 3: The Wall

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

Now ask Claude the obvious next question:

<div style="background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
<strong>Prompt:</strong><br>
<em>"Great! Now add this job I found this morning as a new row in my tracker."</em>
</div>

<h3 style="color: #b91c1c; text-align: center; margin: 25px 0;">🛑 It Cannot Do It.</h3>

<p style="font-size: 18px; color: #334155;">
Claude will apologize and tell you it cannot append a row to an existing Google Sheet. Why?
</p>

</div>

;;;

### The Lesson: Tool Surfaces

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

The wrong diagnosis: *"Spreadsheets aren't databases"* or *"AI is broken."*  
(Claude just wrote a whole spreadsheet 2 minutes ago!)

<div style="background: #fdf4ff; border-left: 4px solid #a855f7; padding: 18px 22px; border-radius: 8px; margin: 20px 0;">
<strong style="font-size: 22px; color: #7e22ce;">The Real Diagnosis:</strong><br>
<strong>A connector is only as capable as the specific tools it exposes.</strong>
</div>

The Google Drive connector exposes exactly 4 tools:
1. `create_file` ✅
2. `copy_file` ✅
3. `read_file` ✅
4. `trash_file` ✅
❌ `append_row` **does not exist.**

<div style="font-size: 17px; color: #6b7280; text-align: center; margin-top: 15px;">
When you hit a wall in AI, ask: <em>"Did the model fail, or does the connector lack the tool?"</em>
</div>

</div>

;;;

### The Workaround Today: "Paste-a-Row"

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

For **Milestone 1**, we don't need complicated API servers to record a row. We use **Paste-a-Row**:

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 15px 0;">
<strong>Prompt Claude:</strong><br>
<em>"Parse this job posting, extract the company, role, salary, stage ('Applied'), and next follow-up date (10 days from today). Output this as a <strong>single tab-separated line</strong> ready for my tracker."</em>
</div>

1. Claude outputs one formatted line.
2. Click **Copy**.
3. Click cell `A2` (or the next empty row) in your Google Sheet and press **Ctrl+V / Cmd+V**.
4. It instantly spreads perfectly across all columns!

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 18px; border-radius: 6px; font-size: 15px; margin-top: 15px;">
💡 <strong>Reality Check:</strong> Copy-pasting a row takes 2 seconds. The bottleneck in a job search was never data entry — it's forgetting to follow up on Day 10.
</div>

</div>

;;;

### Challenge Exercise: Automated Reminders

<div style="max-width: 900px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

<div style="background: #fefce8; border: 2px solid #eab308; border-radius: 8px; padding: 24px;">
<h4 style="color: #854d0e; margin-top: 0;">💡 Take-Home Challenge</h4>
<p>
If data entry isn't the bottleneck, what is? <strong>Follow-up momentum.</strong>
</p>
<p style="margin-bottom: 0;">
How could a system alert you when a row's <code>Next Action Date</code> is today?  
Could a scheduled task (like our n8n Discord digest) check your spreadsheet every morning and send you a notification?
</p>
</div>

<p style="text-align: center; color: #7c3aed; font-size: 18px; margin-top: 20px;">
<em>When Jesse returns from Atlanta in Session 7, we'll build tools that actually write!</em>
</p>

</div>

---

## Milestone 1 Clarification & Wrap-Up

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

### What We Expect for Milestone 1 (Due Mon Sep 21):

<div style="background: #f8fafc; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 15px 0;">
<ul style="font-size: 16px; line-height: 1.7;">
<li><strong>Loom Walkthrough Only (3–5 min):</strong> Run through your system live on camera.</li>
<li><strong>No Magic Auto-Writing Required:</strong> We do NOT expect Claude to magically auto-populate your Google Sheet. Demonstrating <em>Paste-a-Row</em> or showing your schema is 100% sufficient!</li>
<li><strong>One Working Connector:</strong> Connecting <strong>MSU Career Services</strong> or <strong>Archie</strong> completely fulfills the connector requirement!</li>
</ul>
</div>

**What I'm Grading:** Evidence of comprehension. Did you configure a Project? Did you build working Skills? Can you explain the difference between a prompt and a skill?

</div>

;;;

### What to Do Before Next Week

<div style="max-width: 900px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.8;">

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 22px;">
<ol style="margin-left: 20px;">
<li><strong>Keep Both Connectors Live:</strong> Make sure Career Services and Archie are active in your Claude workspace.</li>
<li><strong>Test Your 2 Skills:</strong> Run real postings through <code>resume-tailor-who</code> and <code>msu-career-strategist</code>.</li>
<li><strong>Log at Least 3 Real Rows:</strong> Add 3 real jobs you'd actually apply for into your Google Sheet tracker.</li>
<li><strong>Stuck? Ask Archie in Discord!</strong> Archie has our transcripts and course docs loaded.</li>
</ol>
</div>

<p style="text-align: center; font-size: 20px; color: #7c3aed; margin-top: 25px; font-weight: bold;">
Have a great session with Maya on Tuesday — I'll see you when I'm back from Atlanta!
</p>

</div>
