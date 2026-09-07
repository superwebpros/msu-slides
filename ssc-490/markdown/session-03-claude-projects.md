## Check-In & Housekeeping

<div style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: center; max-width: 950px; margin: 30px auto;">
<div style="text-align: left; font-size: 19px; line-height: 1.7;">

<h3>Welcome to Session 3</h3>
<p>Grab a seat with a partner and get your laptop ready.</p>

<div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 14px 18px; border-radius: 6px; margin: 15px 0;">
<strong style="color: #9d174d;">Important Housekeeping:</strong>
<ul style="margin: 6px 0 0 18px; font-size: 16px; line-height: 1.6;">
<li><strong>Next Week (Sep 15 & 17):</strong> Jesse is out at a conference in Atlanta.</li>
<li><strong>Tue Sep 15:</strong> Guest lecture with <strong>Maya Craft</strong> (MSU Career Services) + hands-on build time.</li>
<li><strong>Thu Sep 17:</strong> Structured group collaboration using <strong>Breakout Learning</strong> — compare individual approaches, what you tracked vs. cut, and debug your system.</li>
<li><strong>Mon Sep 21:</strong> Milestone 1 (M1) due in D2L.</li>
</ul>
</div>

</div>
<div style="text-align: center;">
<img src="assets/slido-s01.png" alt="Slido QR Code" style="width: 240px; height: 240px;">
<div style="font-size: 15px; color: #6b7280; margin-top: 8px;">slido.com <strong style="color: #7c3aed;">#4017 568</strong></div>
</div>
</div>

Note:
Welcome everyone back to the room. Give them the roadmap for the next two weeks immediately. Note that today (Tuesday) and Thursday are the ONLY two instructor-present sessions before Milestone 1 is due on September 21, so today's job is to ensure every single person is unblocked and building.

---

## Session 2 Diagnostic: What Did You Learn?

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

Because last week got pushed virtual by the storm, today starts with a **diagnostic check** on your take-home lab notebooks:

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px;">
<h4 style="color: #0f172a; margin-top: 0;">1. Small vs. Large Models</h4>
<p style="font-size: 16px; color: #334155;">
Did you observe any instance where a <strong>Small Model with a steered prompt</strong> produced a better result than a <strong>Large Model with a lazy prompt</strong>?
</p>
</div>

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px;">
<h4 style="color: #0f172a; margin-top: 0;">2. Provider "Personality"</h4>
<p style="font-size: 16px; color: #334155;">
Did you notice any <strong>"personality" differences</strong> across providers (Anthropic, OpenAI, Google, Groq)?
</p>
</div>

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px;">
<h4 style="color: #0f172a; margin-top: 0;">3. Fixing Broken Sessions</h4>
<p style="font-size: 16px; color: #334155;">
What is the proper "fix" once a conversational session starts to <strong>break or drift</strong>?
</p>
</div>

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px;">
<h4 style="color: #0f172a; margin-top: 0;">4. Business Economics</h4>
<p style="font-size: 16px; color: #334155;">
If you were running a business on a budget, what kinds of tasks would you <strong>delegate to a small model</strong>? What requires a <strong>large model</strong>?
</p>
</div>

</div>

</div>

Note:
Run this as a real diagnostic. Cold-call 2-3 tables to share specific findings from their Google Doc lab notebooks. Make sure the room converges on the key pedagogical truth: small models with disciplined, bounded prompts often outperform expensive frontier models with sloppy prompts, and context pollution ruins long conversations.

;;;

### The Diagnostic Takeaway: Steering is the Bedrock

<div style="max-width: 900px; margin: 30px auto; font-size: 20px; line-height: 1.8; text-align: left;">

<div style="background: #ede9fe; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
<strong style="font-size: 22px; color: #5b21b6;">The Golden Finding from the Lab:</strong><br>
The model is just raw probability. <strong>Your prompt is the steering wheel.</strong>
</div>

Everything we build today — **Claude Projects** and **Skills** — depends directly on that foundation:

- A **Project** is how you steer an entire workspace permanently.
- A **Skill** is how you turn a one-time steering success into a repeatable, automated procedure.

</div>

---

## BLOCKING CHECKPOINT: Join Claude.ai

<div style="display: grid; grid-template-columns: 1fr 280px; gap: 30px; align-items: center; max-width: 960px; margin: 25px auto; text-align: left;">

<div>
<div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
<h3 style="color: #b91c1c; margin-top: 0; font-size: 22px;">🛑 Mandatory Gate: Join the Team Seat</h3>
<p style="font-size: 17px; line-height: 1.6; color: #7f1d1d; margin-bottom: 12px;">
We are building inside <strong>Claude.ai Team seats</strong>. If you are not in the workspace right now, you cannot build your project or complete today's lab.
</p>
<div style="background: white; padding: 12px 16px; border-radius: 6px; font-size: 16px; border: 1px solid #fca5a5;">
👉 <strong>Direct Join Link:</strong><br>
<a href="https://claude.ai/join/org#VRLoRVygKE9rHi5lwikaxg" target="_blank" style="color: #2563eb; word-break: break-all; font-family: monospace; font-size: 14px;">claude.ai/join/org#VRLoRVygKE9rHi5lwikaxg</a>
</div>
</div>

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; font-size: 16px; line-height: 1.6;">
<strong>Verify Success:</strong> When you log in, look at the top-left selector. It must show: <code>SSC 490 - Fall 2026</code>.<br>
<em>Raise your hand right now if you see an error!</em>
</div>
</div>

<div style="text-align: center;">
<img src="assets/claude-join-qr.png" alt="Join Claude.ai QR Code" style="width: 250px; height: 250px; border: 2px solid #cbd5e1; border-radius: 10px; padding: 8px; background: white;">
<div style="font-size: 14px; color: #6b7280; margin-top: 8px;">Scan to Join Claude.ai Team</div>
</div>

</div>

Note:
Do NOT proceed past this slide until every student has confirmed they are in the workspace. Have TAs/instructor walk the room. This is a hard gate because today and Thursday are the only in-class build days before Milestone 1 is due.

---

## Introducing Milestone 1 (M1)

### "Build Your Career Coach"

<div style="display: grid; grid-template-columns: 1fr 260px; gap: 24px; align-items: center; max-width: 960px; margin: 20px auto; text-align: left;">

<div style="font-size: 18px; line-height: 1.7;">
<p style="margin-top: 0;">
You are going to build a working AI system that runs your personal job search:
</p>
<ul style="margin: 8px 0 14px 18px; font-size: 16px;">
<li><strong>Not a one-off chatbot:</strong> A persistent container holding <strong>who you are</strong>, <strong>reusable skills you engineered</strong>, and <strong>live data</strong> it reads/writes.</li>
<li><strong>Your Single-Player Rehearsal:</strong> In October, your team automates a real process for a community partner (Samaritas, CAMW, LEAP). This job-search system is the rehearsal with you as the client.</li>
</ul>

<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 6px; font-size: 15px;">
👉 <strong>Clone Assignment Template:</strong><br>
<a href="https://docs.google.com/document/d/1w6h6nHIZpsJr1aOfg_ZWCXDWW70bUc7A0TcQ6OSVn6M/copy" target="_blank" style="color: #1d4ed8; word-break: break-all; font-family: monospace; font-size: 13px;">docs.google.com/.../copy</a>
</div>
</div>

<div style="text-align: center;">
<img src="assets/m1-assignment-qr.png" alt="M1 Assignment Doc QR Code" style="width: 220px; height: 220px; border: 2px solid #cbd5e1; border-radius: 8px; padding: 6px; background: white;">
<div style="font-size: 13px; color: #6b7280; margin-top: 6px;">Scan for Google Doc Template</div>
</div>

</div>

Note:
Frame M1 clearly. This is not busywork; this is their own professional career engine. They are the domain experts on themselves, so the only variable they have to master is the technology.

;;;

### Milestone 1: The Deliverable & Grading

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

**Due Date:** Monday, September 21 (Submitted on D2L)

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 20px 24px; border-radius: 8px; margin: 15px 0;">
<h4 style="color: #5b21b6; margin-top: 0;">The Graded Artifact: 3–5 Minute Loom Walkthrough</h4>
<p style="font-size: 16px; color: #334155; margin-bottom: 12px;">
<em>No separate links, exports, or written reflections required — I evaluate your thinking and system directly from the Loom walkthrough.</em>
</p>

<strong>What Your Loom Must Demonstrate:</strong>
<ol style="font-size: 16px; line-height: 1.6; margin-top: 8px;">
<li><strong>A Conversational Turn with a Skill:</strong> Run a real input through your custom skill (e.g., tailoring resume bullets to a posting using the WHO rubric).</li>
<li><strong>A Conversational Turn with Your Data Store:</strong> Show Claude reading from or logging a row directly into your Google Sheets tracker.</li>
<li><strong>Explanation of Decisions:</strong> Walk through <em>why</em> you chose your skills, which tasks you decided <em>not</em> to automate, and what your Google Sheets tracker tracks.</li>
</ol>
</div>

<div style="background: #fefce8; border-left: 4px solid #eab308; padding: 12px 18px; border-radius: 6px; font-size: 15px; color: #854d0e;">
🔒 <strong>Privacy Protected:</strong> We grade the Loom video and whatever you choose to show on camera — NOT the internal contents of your private Claude Project.
</div>

</div>

---

## The System Architecture: 3 Core Pieces

<div style="max-width: 980px; margin: 30px auto;">

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: left;">

<div style="background: #f8fafc; border-top: 5px solid #7c3aed; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
<span style="font-size: 13px; font-weight: bold; color: #7c3aed; text-transform: uppercase;">1. Container</span>
<h3 style="margin: 10px 0 12px 0; color: #1e293b;">Project</h3>
<p style="font-size: 15px; color: #475569; line-height: 1.6;">
<strong>Who you are:</strong> Persistent background, target industries, voice, and rules.
</p>
<div style="background: #ede9fe; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #5b21b6; margin-top: 15px;">
Inherited by every conversation in the workspace.
</div>
</div>

<div style="background: #f8fafc; border-top: 5px solid #2563eb; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
<span style="font-size: 13px; font-weight: bold; color: #2563eb; text-transform: uppercase;">2. Procedural SOP</span>
<h3 style="margin: 10px 0 12px 0; color: #1e293b;">Skills</h3>
<p style="font-size: 15px; color: #475569; line-height: 1.6;">
<strong>What you do repeatedly:</strong> Reusable procedures with your judgment baked in.
</p>
<div style="background: #dbeafe; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #1e40af; margin-top: 15px;">
Transforms raw input into structured, predictable output.
</div>
</div>

<div style="background: #f8fafc; border-top: 5px solid #059669; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
<span style="font-size: 13px; font-weight: bold; color: #059669; text-transform: uppercase;">3. External APIs</span>
<h3 style="margin: 10px 0 12px 0; color: #1e293b;">Connectors</h3>
<p style="font-size: 15px; color: #475569; line-height: 1.6;">
<strong>What you can't hold in context:</strong> Live databases, state trackers, and external docs.
</p>
<div style="background: #d1fae5; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #065f46; margin-top: 15px;">
Solves context limits & creates a queryable system of record.
</div>
</div>

</div>

</div>

Note:
Walk through the triad: Project = who you are (always true). Skills = what you do repeatedly (the SOP). Connectors = what you cannot hold in your head (state, reference, artifacts).

;;;

### Why Connectors Matter: Systems of Record

<div style="max-width: 900px; margin: 30px auto; font-size: 19px; line-height: 1.8; text-align: left;">

Context windows are finite, and chats are temporary:

- **Skills Manage Runtime Context:** You don't have to remember an SOP and neither does the agent. It gets invoked on-demand at runtime without polluting your active context window.
- **Connectors Provide Systems of Record:** A chat interface will never give you a queryable database you can sort, filter, or audit.
- **Real Workflows Need Structured Storage:**
  - **Google Sheets:** Live application pipeline (State · Read/Write)
  - **Baserow:** Curated, licensed MSU Career Services resources (Reference · Read)
  - **Google Docs:** Exported resumes and cover letters (Artifacts · Write)

*(We'll wire these connectors up on Thursday!)*

</div>

---

## Hands-On Part 1: Configure Your Claude Project

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

### Step 1: Create Your Project

1. In **Claude.ai**, click **Projects** on the left navigation bar.
2. Click **+ New Project** and name it: `[Your Name] - Career Coach`.
3. Open the **Project Instructions** panel.

<div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 18px 22px; border-radius: 6px; margin: 20px 0;">
<strong>The Steering Rule Applied:</strong><br>
Project instructions steer <em>every single conversation</em> created inside this container. If you leave it empty or vague, Claude defaults to bland, generic career advice.
</div>

</div>

;;;

### Writing Real Project Instructions

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 16px; line-height: 1.6;">

Structure your project instructions using these 4 clear categories:

```markdown
# Identity & Background
I am a senior at Michigan State University majoring in [Major] with a minor in [Minor].
My core technical and analytical strengths include [Skill A, Skill B, Tool C].

# Target Roles & Objective
I am targeting [Role Title, e.g., Junior People Analytics Specialist / Policy Analyst] roles
in [Geographies, e.g., Michigan / Chicago / Remote] across [Sectors, e.g., State Gov / Tech].

# Constraints & Boundaries (Negative Bounds)
- Never invent experiences or exaggerate metrics not provided in my inputs.
- Do not use corporate cliches ("passionate synergy", "results-driven rockstar").
- Tone should be crisp, empirical, and grounded in social science methodology.

# Operating Rules
When assisting me with materials, ask clarifying questions if key context is missing.
Format dates consistently as [YYYY-MM] and follow the MSU WHO rubric.
```

;;;

### Anatomy of a Project Prompt: Why It's Built This Way

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 960px; margin: 15px auto; text-align: left; font-size: 15px; line-height: 1.6;">

<div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 14px 18px; border-radius: 6px;">
<strong style="color: #5b21b6; font-size: 16px;">1. Identity & Target Roles</strong><br>
<strong>Session 2 Concept:</strong> <em>Steering the Probability Landscape</em><br>
Seeds the model's active working memory with high-dimensional domain vectors (social science, MSU, specific roles). Prevents wandering into the generic statistical average.
</div>

<div style="background: #f8fafc; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px;">
<strong style="color: #991b1b; font-size: 16px;">2. Negative Bounds & Constraints</strong><br>
<strong>Session 2 Concept:</strong> <em>"Don't Prompt Like Peter"</em><br>
Defines boundary walls upfront. Explicitly bans hallucinated metrics and corporate jargon ("synergy") before generation starts, avoiding context pollution.
</div>

<div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 6px;">
<strong style="color: #1e40af; font-size: 16px;">3. Operating Rules & Co-Pilot Mode</strong><br>
<strong>Session 2 Concept:</strong> <em>Principle 3: Invite Participation</em><br>
Forces Claude to act like a collaborative interviewer rather than an unguided monologue generator. Mandates the MSU WHO rubric.
</div>

<div style="background: #fdf4ff; border-left: 4px solid #a855f7; padding: 14px 18px; border-radius: 6px;">
<strong style="color: #7e22ce; font-size: 16px;">💡 Challenge Exercise (Take-Home)</strong><br>
<strong>Can AI write your project instructions?</strong><br>
Try prompting a fresh Claude chat: <em>"Interview me step-by-step about my career goals, strengths, and writing preferences, then format the answers into a Project Instructions system prompt."</em>
</div>

</div>

---

## Interactive Discussion: The Job Search Process

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

Before we build a skill, let's look at the real workflow:

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 22px; border-radius: 10px; margin: 20px 0; text-align: center;">
<h3 style="color: #5b21b6; margin-top: 0;">Slido / Live Brainstorm</h3>
<p style="font-size: 22px; color: #1e293b; margin-bottom: 0;">
<strong>"What are all the distinct tasks involved in finding a job and getting hired?"</strong>
</p>
</div>

<p style="color: #6b7280; font-size: 18px; text-align: center;">
Post your answers on Slido or call them out in the room. Let's map the messy reality.
</p>

</div>

Note:
Give the room 2-3 minutes. Collect 8-12 common tasks: finding job postings, evaluating if a job is worth applying for, writing cover letters, tailoring a resume, logging who you applied to, tracking deadlines, following up on email, preparing for interview questions, networking with alumni, capturing semester accomplishments.

;;;

### The Job Search Task Inventory

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 17px; line-height: 1.7;">

Here is the inventory of what a job search actually demands:

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">

<div style="background: #f8fafc; padding: 14px 18px; border-radius: 6px; border: 1px solid #e2e8f0;">
• Finding & filtering open postings<br>
• Deciding if a role is worth applying to<br>
• Tailoring bullet points on your résumé<br>
• Drafting custom cover letters
</div>

<div style="background: #f8fafc; padding: 14px 18px; border-radius: 6px; border: 1px solid #e2e8f0;">
• Tracking application status & dates<br>
• Writing cold outreach to alumni<br>
• Prepping interview stories & evidence<br>
• Capturing semester accomplishments
</div>

</div>

<div style="margin-top: 25px; background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px; font-size: 18px; color: #991b1b;">
<strong>The Critical Mistake:</strong> Trying to automate *everything* with generative AI.<br>
Some of these are terrible candidates for automation. How do we tell the difference?
</div>

</div>

---

## When Does a Task Deserve to Be a Skill?

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

To avoid building bloated, useless bots, apply the **3-Part Test**:

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 25px 0;">

<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 18px;">
<strong style="font-size: 18px; color: #15803d;">1. Repeated</strong>
<p style="font-size: 15px; color: #166534; margin-top: 8px; line-height: 1.5;">
You will perform this task more than a handful of times during the process.
</p>
</div>

<div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 18px;">
<strong style="font-size: 18px; color: #1e40af;">2. Encoded Judgment</strong>
<p style="font-size: 15px; color: #1e3a8a; margin-top: 8px; line-height: 1.5;">
Requires specific decisions you'd otherwise have to re-explain every single time.
</p>
</div>

<div style="background: #fdf4ff; border: 2px solid #a855f7; border-radius: 8px; padding: 18px;">
<strong style="font-size: 18px; color: #7e22ce;">3. Consistent Shape</strong>
<p style="font-size: 15px; color: #6b21a8; margin-top: 8px; line-height: 1.5;">
The output produces a recognizable, predictable, structured artifact.
</p>
</div>

</div>

<div style="background: #ede9fe; padding: 14px 20px; border-radius: 6px; text-align: center; font-size: 18px; color: #5b21b6;">
<strong>The Rule:</strong> If it fails all three, it is <strong>just a prompt</strong>. Write it in the chat and move on!
</div>

</div>

;;;

### Filtering Our Inventory: Prompt vs. Skill

<div style="max-width: 960px; margin: 20px auto; font-size: 16px;">

| Job Search Task | Repeated? | Judgment? | Consistent Shape? | Verdict |
| :--- | :---: | :---: | :---: | :--- |
| *"Find me tech companies in Lansing"* | ❌ | ❌ | ❌ | **Just a Prompt** (Search once) |
| *"Draft a quick reply to this recruiter"* | ⚠️ | ❌ | ❌ | **Just a Prompt** (Context varies) |
| **Tailor Résumé to a Job Posting** | ✅ | ✅ *(WHO rubric)* | ✅ *(Formatted bullets)* | **⭐ Real Skill** |
| **Capture Accomplishments into WHO** | ✅ | ✅ *(Extract metrics)* | ✅ *(STAR/WHO format)* | **⭐ Real Skill** |
| **Job Posting Teardown (Requirements)** | ✅ | ✅ *(O\*NET mapping)* | ✅ *(Scorecard table)* | **⭐ Real Skill** |

</div>

<p style="font-size: 18px; color: #6b7280; text-align: center; margin-top: 20px;">
Let's build that first real skill right now!
</p>

---

## Live Build: Build Your First Skill Live

### Using AI to Create Your Skill Prompt

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 17px; line-height: 1.7;">

Rather than writing static prompt code from scratch, we use **collaborative dialogue** to generate our skill instructions in real-time.

<div style="background: #f8fafc; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 15px 0;">
<strong style="color: #5b21b6; font-size: 18px;">Paste this Meta-Prompt into a Claude Chat:</strong>

```text
"I'd like to create a skill that helps me tailor my resume to a job posting using the MSU Career Services WHO method (Who you worked with, How/What you did, Outcome achieved).

Before writing the skill, ask me clarifying questions about my target roles, preferred bullet structure, and how you should handle experiences that need to be de-emphasized.

Then generate the skill instructions for my project."
```
</div>

<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 18px; border-radius: 6px; font-size: 15px; color: #1e40af;">
Notice how this prompt enforces <strong>Principle 3 (Invite Participation)</strong>: it directs Claude to interview you before writing the procedure.
</div>

</div>

;;;

### Hands-On Test: Run Your Skill on Real Data

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 18px; line-height: 1.7;">

Now that Claude has generated your skill prompt, test it live in your project:

<ol style="font-size: 17px; line-height: 1.8; margin-left: 20px;">
<li><strong>Upload Your Resume:</strong> In your Project, click <strong>Add Content ➔ Upload Files</strong> and attach your current résumé.</li>
<li><strong>Add the Skill:</strong> Paste the generated instructions into your project's <strong>Skills</strong> (or keep as a reusable prompt).</li>
<li><strong>Start a Test Chat:</strong> Open a new conversation and paste a real job posting of your choosing.</li>
<li><strong>Audit the Output:</strong>
  <ul style="font-size: 15px; line-height: 1.6; margin-top: 6px;">
  <li>Did it rewrite your bullets into the <strong>WHO format</strong> (Who / How / Outcome)?</li>
  <li>Did it include an <strong>"Editorial Tradeoff"</strong> section explaining which experiences were de-emphasized and why?</li>
  </ul>
</li>
</ol>

</div>

---

## Troubleshooting: The 5-Question Diagnostic

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

When Claude's output isn't right, don't just re-roll or argue. Use this diagnostic:

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-top: 15px;">
<ol style="margin-left: 20px;">
<li style="margin-bottom: 10px;"><strong>What's the outcome?</strong> Was the prompt specific about structure and format?</li>
<li style="margin-bottom: 10px;"><strong>What does it need?</strong> What missing context or example did you assume it knew?</li>
<li style="margin-bottom: 10px;"><strong>Where does the data live?</strong> In project instructions, in the prompt, or nowhere?</li>
<li style="margin-bottom: 10px;"><strong>What could break?</strong> Is it drifting into clichés or exaggerating numbers?</li>
<li><strong>What lever do I tweak?</strong> Project instructions, skill constraints, or few-shot examples?</li>
</ol>
</div>

<div style="font-size: 16px; color: #6b7280; text-align: center; margin-top: 20px;">
Fix the <em>instructions</em>, not just the single chat message.
</div>

</div>

---

## The 5-Skill Catalog for Your Career Coach

<div style="max-width: 940px; margin: 25px auto; font-size: 16px; text-align: left;">

For **Milestone 1**, you must build **at least two skills**. Here are the 5 top candidates:

1. **Tailor Résumé to Posting** *(Built today!)* — WHO-formatted bullets + tradeoff notes.
2. **Accomplishment Capture** — Rough notes in ➔ STAR/WHO bullet out, prompting you where metrics are missing.
3. **Job Posting Teardown** — Deconstructs real requirements vs wish lists using O*NET competency categories.
4. **Outreach & Follow-Up Generator** — Adapts to networking stage (cold outreach, informational interview, post-interview thank you).
5. **Major-to-Career Pathway Explorer** — Cross-references your major with Michigan employer ecosystems and alumni networks.

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 18px; border-radius: 6px; margin-top: 15px; font-size: 15px;">
💡 <strong>System Composition Bonus:</strong> Skill #2 (Accomplishment Log) produces the exact source material that Skill #1 (Resume Tailoring) consumes! Connecting skills makes it a true system.
</div>

</div>

---

## Preview: Session 4 (Thursday)

### Connecting Live Data to Your System

<div style="max-width: 900px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

Today we configured **Who you are** (Project) and built **What you do** (Skills).

On Thursday, we wire up **Connectors** (APIs without the jargon):

- **Google Sheets Application Tracker:** Your skill will read and write pipeline state (Company, Role, Date, Stage, Next Action).
- **MSU Career Services Database (Baserow):** Live access to 400+ curated Michigan career resources, professional associations, and O*NET descriptors.

<div style="background: #ede9fe; padding: 18px 24px; border-radius: 8px; margin-top: 25px; font-size: 18px; color: #5b21b6; text-align: center;">
Come to class Thursday with your Google Workspace logged in and ready to build!
</div>

</div>

---

## What to Do Before Thursday

<div style="max-width: 880px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px;">

1. **Finish Your Project Instructions:** Fill in your real background, goals, and constraints in Claude.ai.
2. **Test Your First Skill:** Run at least one real job posting through your Resume Tailor skill. Check the "Editorial Tradeoff" section.
3. **Draft a 2nd Skill Idea:** Review the 5 candidates and decide which secondary skill you want to build.

</div>

<p style="text-align: center; color: #7c3aed; font-size: 22px; margin-top: 30px; font-weight: bold;">
See you in the room Thursday at 2:10 PM!
</p>

</div>
